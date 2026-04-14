// get user credits
import { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import openai from "../config/openai.js";

// controller to get user credits

export const getUserCredits = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID not found in request" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    res.json({ credits: user?.credits });
  } catch (error) {
    console.error("Error fetching user credits:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// controller to create new project

export const createUserProject = async (req: Request, res: Response) => {
  const userId = req.userId;
  let responseSent = false;

  const callWithRetry = async (fn: () => Promise<any>, retries = 3, delay = 2000): Promise<any> => {
    try {
      return await fn();
    } catch (error: any) {
      if (error?.status === 429 && retries > 0) {
        await new Promise((res) => setTimeout(res, delay));
        return callWithRetry(fn, retries - 1, delay * 2);
      }
      throw error;
    }
  };

  try {
    const { initial_prompt } = req.body;
    

    if (!userId) {
      return res.status(400).json({ message: "User ID not found in request" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user && user.credits < 5) {
      return res.status(400).json({ message: "Not enough credits" });
    }

    const project = await prisma.websiteProject.create({
      data: {
        name:
          initial_prompt.length > 50
            ? initial_prompt.substring(0, 47) + "..."
            : initial_prompt,
        initial_prompt,
        userId,
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: {
        totalCreation: { increment: 1 },
      },
    });

    await prisma.conversation.create({
      data: {
        role: "user",
        content: initial_prompt,
        projectId: project.id,
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: {
        credits: { decrement: 5 },
      },
    });

    // Send response AFTER all DB setup is done, before heavy async work
    res.json({ projectId: project.id });
    responseSent = true;

    // Enhance prompt (with retry)
    const promptEnchanceResponse = await callWithRetry(() =>
      openai.chat.completions.create({
        model: "deepseek/deepseek-chat-v3-0324",
        messages: [
          {
            role: "system",
        content: `
You are an expert frontend developer.

Your task is to transform the user's request into a clear, precise, and implementation-ready instruction.

CRITICAL RULES:

- Return ONLY the enhanced prompt
- Do NOT include explanations, comments, or extra text
- Keep the output concise (maximum 2 paragraphs)

ENHANCEMENT RULES:

- Clearly identify which sections or components need to be modified or created
- Specify exact visual changes (colors, spacing, typography, layout, alignment)
- Mention interaction or behavior changes if relevant (hover, animations, transitions)
- Keep instructions technical, direct, and actionable

RESTRICTIONS:

- Do NOT redesign the entire website unless explicitly requested
- Do NOT add unnecessary features or sections
- Focus only on what the user asked

FINAL OUTPUT:

- Only the improved prompt
- No extra text
`
          },
          {
            role: "user",
            content: initial_prompt,
          },
        ],
      })
    );

    const enhancedPrompt = promptEnchanceResponse.choices[0].message.content;

   

    await prisma.conversation.create({
      data: {
        role: "assistant",
        content: `Enhanced Prompt: ${enhancedPrompt}`,
        projectId: project.id,
      },
    });

    await prisma.conversation.create({
      data: {
        role: "assistant",
        content: `now generating your website...`,
        projectId: project.id,
      },
    });

    // Generate code (with retry)
    const codeGenerationResponse = await callWithRetry(() =>
      openai.chat.completions.create({
        model: "deepseek/deepseek-chat-v3-0324",
        messages: [
          {
            role: "system",
          content: `
You are an expert frontend developer.

Your task is to generate a complete HTML website based on the user request.

CRITICAL RULES:

- Return ONLY the complete HTML code
- Do NOT include explanations, comments, or extra text
- Do NOT use markdown (no \`\`\`html)
- Output must always be a full standalone HTML document

INPUT:
"${enhancedPrompt}"

STRUCTURE RULES:

- Use semantic HTML: <header>, <main>, <section>, <footer>
- Keep structure clean and minimal
- Do NOT add unnecessary sections unless clearly required

STYLING RULES:

- Use Tailwind CSS via CDN
- Include this EXACT script inside <head>:
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
- Use only Tailwind utility classes
- Do NOT add custom CSS

RESPONSIVENESS:

- Ensure mobile-first responsive layout
- Use Tailwind breakpoints (sm, md, lg, xl) only where necessary

JAVASCRIPT RULES:

- Include all JavaScript inside <script> before </body>
- Only add minimal required interactivity (e.g., menu toggle)

FINAL OUTPUT:

- Pure HTML code only
- No extra text
`
          },
          {
            role: "user",
            content: enhancedPrompt || "",
          },
        ],
      })
    );

    const code = codeGenerationResponse.choices[0].message.content || "";


    if(!code){
      await prisma.conversation.create({
        data: {
          role: "assistant",
          content: `Sorry, there was an issue generating your website. Please try again.`,
          projectId: project.id,
        },
      });
      await prisma.user.update({
        where: { id: userId },
        data: {
          credits: { increment: 5 },
        },
      });
      return;

    }

    const cleanCode = code
      .replace(/```[a-z]*\n/g, "")
      .replace(/```/g, "")
      .replace(/```$/g, "")
      .trim();

    const version = await prisma.version.create({
      data: {
        code: cleanCode,
        description: "Initial version",
        projectId: project.id,
      },
    });

    await prisma.conversation.create({
      data: {
        role: "assistant",
        content: `Your website is ready! Version ID: ${version.id}`,
        projectId: project.id,
      },
    });

    await prisma.websiteProject.update({
      where: { id: project.id },
      data: {
        current_code: cleanCode,
        current_version_index: version.id,
      },
    });





  } catch (error: any) {
    console.error("Error creating project:", error);

    // Only refund credits and send error response if response hasn't been sent yet
    if (!responseSent) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          credits: { increment: 5 },
        },
      });
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      // Response already sent — log silently, optionally mark project as failed in DB
      console.error("Background generation failed after response was sent for userId:", userId);
    }
  }
};

// export const createUserProject = async (req: Request, res: Response) => {
//   const userId = req.userId;
//   try {
//     const { initial_prompt } = req.body;

//     if (!userId) {
//       return res.status(400).json({ message: "User ID not found in request" });
//     }

//     const user = await prisma.user.findUnique({ where: { id: userId } });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     if (user.credits < 5) {
//       return res.status(400).json({ message: "Not enough credits" });
//     }

//     const project = await prisma.websiteProject.create({
//       data: {
//         name:
//           initial_prompt.length > 50
//             ? initial_prompt.substring(0, 47) + "..."
//             : initial_prompt,
//         initial_prompt,
//         userId,
//       },
//     });

//     await prisma.user.update({
//       where: { id: userId },
//       data: { totalCreation: { increment: 1 } },
//     });

//     await prisma.conversation.create({
//       data: {
//         role: "user",
//         content: initial_prompt,
//         projectId: project.id,
//       },
//     });

//     await prisma.user.update({
//       where: { id: userId },
//       data: { credits: { decrement: 5 } },
//     });

//     // ✅ Send response FIRST, then run background work
//     res.json({ projectId: project.id });

//     // ✅ Everything below runs in background — errors won't crash the response
//     runBackgroundGeneration(project.id, initial_prompt, userId).catch((err) => {
//       console.error("Background generation failed:", err);
//     });

//   } catch (error: any) {
//     console.error("Error creating project:", error);

//     // Only refund if userId exists and credits were already deducted
//     if (userId) {
//       await prisma.user
//         .update({
//           where: { id: userId },
//           data: { credits: { increment: 5 } },
//         })
//         .catch(console.error);
//     }

//     // ✅ Guard: only send error if response hasn't been sent yet
//     if (!res.headersSent) {
//       res.status(500).json({ message: "Internal Server Error" });
//     }
//   }
// };

// // ✅ Separated background function — clean and isolated
// async function runBackgroundGeneration(
//   projectId: string,
//   initial_prompt: string,
//   userId: string
// ) {
//   // Enhance prompt
//   const promptEnhanceResponse = await openai.chat.completions.create({
//      model: "deepseek/deepseek-chat-v3-0324",
//     messages: [
//       {
//         role: "system",
//         content: `You are a master UI/UX Architect...`, // your existing system prompt
//       },
//       { role: "user", content: initial_prompt },
//     ],
//   });

//   const enhancedPrompt = promptEnhanceResponse.choices[0].message.content;

//   await prisma.conversation.create({
//     data: {
//       role: "assistant",
//       content: `Enhanced Prompt: ${enhancedPrompt}`,
//       projectId,
//     },
//   });

//   await prisma.conversation.create({
//     data: {
//       role: "assistant",
//       content: `now generating your website...`,
//       projectId,
//     },
//   });

//   // Generate code
//   const codeGenerationResponse = await openai.chat.completions.create({
//      model: "deepseek/deepseek-chat-v3-0324",
//     messages: [
//       {
//         role: "system",
//         content: `You are an expert frontend developer...`, // your existing system prompt
//       },
//       { role: "user", content: enhancedPrompt || "" },
//     ],
//   });

//   const rawCode = codeGenerationResponse.choices[0].message.content || "";
//   const cleanCode = rawCode
//     .replace(/```[a-z]*\n/g, "")
//     .replace(/```/g, "")
//     .trim();

//   const version = await prisma.version.create({
//     data: {
//       code: cleanCode,
//       description: "Initial version",
//       projectId,
//     },
//   });

//   await prisma.conversation.create({
//     data: {
//       role: "assistant",
//       content: `Your website is ready! Version ID: ${version.id}`,
//       projectId,
//     },
//   });

//   await prisma.websiteProject.update({
//     where: { id: projectId },
//     data: {
//       current_code: cleanCode,
//       current_version_index: version.id,
//     },
//   });
// }

// controller to get a projects of single  user projects




export const getUserProject = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
   

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }

    const projectId = req.params.projectId as string;
    // if (Array.isArray(projectId)) {
    //   return res.status(400).json({ message: "Invalid project ID" });
    // }
  

    const project = await prisma.websiteProject.findUnique({
        where: { id: projectId, userId: userId as string },
        include: {
            conversation:{
                orderBy: {
                    timestamp: 'asc'
                }
            },
            versions: {
                orderBy: {
                    timestamp: 'asc'
                }
            }
        }
     
    });

    res.json({ project });

  } catch (error) {
   
    console.error(`[GET_USER_PROJECT_ERROR]: ${error instanceof Error ? error.message : error}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



// controller to get all projects of single user
export const getUserProjects = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }

    const projects = await prisma.websiteProject.findMany({
      where: { userId },
      orderBy: {
        updatedAt: "desc",
      },
    });

    res.json({ projects });
  } catch (error) {
    console.error(`[GET_USER_PROJECTS_ERROR]: ${error instanceof Error ? error.message : error}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// controller funtion to toggle project pubish
export const toggleProjectPublish = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }

    const projectId = req.params.projectId as string;
    // if (Array.isArray(projectId)) {
    //   return res.status(400).json({ message: "Invalid project ID" });
    // }

   
    const project = await prisma.websiteProject.findUnique({
      where: { id: projectId, userId: userId as string },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const updatedProject = await prisma.websiteProject.update({
      where: { id: projectId },
      data: { isPublished: !project.isPublished },
    });

    res.json({
      message: project.isPublished ? 'project unpublished' : '',
    
    })
  } catch (error) {
    console.error(`[TOGGLE_PROJECT_PUBLISH_ERROR]: ${error instanceof Error ? error.message : error}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }

};

// funtion to purchase credits
export const purchaseCredits = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }
  } catch (error) {
    console.error(`[PURCHASE_CREDITS_ERROR]: ${error instanceof Error ? error.message : error}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};