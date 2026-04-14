import { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import openai from "../config/openai.js";
import { version } from "node:os";

// controller to make revsion of project

export const makeRevision = async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    const projectId = req.params.projectId as string;
    const { message } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userId || !user) {
      return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }
    if (user.credits < 5) {
      return res.status(400).json({ message: "Insufficient credits" });
    }

    if (!message || message.trim() === "") {
      return res.status(400).json({ message: "Message is required" });
    }

    const currentProject = await prisma.websiteProject.findUnique({
      where: { id: projectId as string, userId: userId as string },
      include: {
        versions: true,
      },
    });

    if (!currentProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    await prisma.conversation.create({
      data: {
        role: "user",
        content: message,
        projectId,
      },
    });

    // enhance prompt
    const promptEnhanceResponse = await openai.chat.completions.create({
      model: "deepseek/deepseek-chat-v3-0324",
      messages: [
        {
          role: "system",
          content: `You are an expert developer.

Your task is to convert the user's request into a clear, precise, and implementation-ready instruction.

CRITICAL RULES:

- Return ONLY the enhanced request
- Do NOT include explanations, comments, or extra text
- Keep the output concise (1–2 sentences)
- Use clear, technical, and actionable language

ENHANCEMENT RULES:

- Identify the exact component(s) or section(s) to modify
- Specify precise changes (colors, spacing, typography, layout, alignment, etc.)
- Include interaction details only if explicitly implied (hover, transitions)

RESTRICTIONS:

- Do NOT redesign the entire website unless explicitly requested
- Do NOT add new features or sections unless asked
- Focus strictly on the user's request

FINAL OUTPUT:

- Only the improved instruction
- No extra text
- Must be implementation-ready for a developer
- only contain HTML file
`,
        },
        {
          role: "user",
          content: `user request: ${message}`,
        },
      ],
    });

    const enhancedPrompt =
      promptEnhanceResponse.choices[0].message.content || "";

    await prisma.conversation.create({
      data: {
        role: "assistant",
        content: enhancedPrompt,
        projectId,
      },
    });

    await prisma.conversation.create({
      data: {
        role: "assistant",
        content: " now making changes to project...",
        projectId,
      },
    });

    // ✅ FIX 1: Pass existing code + use enhancedPrompt instead of message
    const codeGenerationResponse = await openai.chat.completions.create({
      model: "deepseek/deepseek-chat-v3-0324",
      messages: [
        {
          role: "system",
          content: `You are an expert developer.

You will receive either:
1. An existing HTML document + a user request (MODIFY MODE)
2. Only a user request (CREATE MODE)

IMPORTANT:
The mode will be explicitly indicated in the user message.

CRITICAL RULES:

- Return ONLY the complete HTML code
- Do NOT include explanations, comments, or extra text
- Do NOT use markdown (no \`\`\`html)
- Output must always be a full standalone HTML document
- Preserve formatting and structure as much as possible

MODIFY MODE RULES:
- ONLY change what the user explicitly requests
- Keep ALL other code EXACTLY the same (no reformatting, no reordering)
- Do NOT rename classes, ids, or variables unless required
- Do NOT redesign, enhance, or improve UI unless explicitly asked
- Do NOT change text/content unless requested
- If no changes are required, return the original HTML unchanged

CREATE MODE RULES:
- Follow user requirements strictly
- Keep design simple, clean, and functional
- Do NOT add unnecessary features or sections

STYLING RULES:
- Use Tailwind CSS via CDN
- Use only Tailwind utility classes
- Do NOT add custom CSS unless already present

JAVASCRIPT RULES:
- Include all JavaScript inside <script> before </body>

FINAL OUTPUT:
- Pure HTML code only
- No extra text or explanations
- Must be a complete HTML document
`,
        },
        {
          role: "user",
          // ✅ FIX 1: MODIFY vs CREATE mode + existing HTML context + enhancedPrompt
          content: currentProject.current_code
            ? `MODE: MODIFY\n\nEXISTING HTML:\n${currentProject.current_code}\n\nUSER REQUEST: ${enhancedPrompt}`
            : `MODE: CREATE\n\nUSER REQUEST: ${enhancedPrompt}`,
        },
      ],
    });

    const generatedCode =
      codeGenerationResponse.choices[0].message?.content || "";

    if (!generatedCode) {
      await prisma.conversation.create({
        data: {
          role: "assistant",
          content: `Sorry, there was an issue generating your website. Please try again.`,
          projectId,
        },
      });
      // ✅ FIX 2: No credits were decremented yet at this point, so no refund needed
      return;
    }

    // ✅ FIX 2: Decrement credits only after code is confirmed
    await prisma.user.update({
      where: { id: userId },
      data: { credits: { decrement: 5 } },
    });

    const cleanedCode = generatedCode
      .replace(/```[a-z]*\n/g, "")
      .replace(/```/g, "")
      .replace(/```$/g, "")
      .trim();

    const version = await prisma.version.create({
      data: {
        code: cleanedCode,
        description: "Generated code based on user request",
        projectId,
      },
    });

    await prisma.conversation.create({
      data: {
        role: "assistant",
        content: "Code generation completed and project updated.",
        projectId,
      },
    });

    await prisma.websiteProject.update({
      where: { id: projectId },
      data: {
        current_code: cleanedCode,
        current_version_index: version.id,
      },
    });

    res.json({ message: "Revision created successfully", versionId: version.id });
  } catch (error: any) {
    console.error("Error making revision:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// function to rollback to a specific version

export const rollbackVersion = async (req: Request, res: Response) => {
  try{
    const userId = req.userId;

    if(!userId){
      return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }

    const { projectId, versionId } = req.params as { projectId: string, versionId: string };

    const project = await prisma.websiteProject.findUnique({
      where: { id: projectId, userId },
      include: { versions: true }
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const version = project.versions.find((version) => version.id === versionId);
    if (!version) {
      return res.status(404).json({ message: "Version not found" });
    }

    await prisma.websiteProject.update({
      where: { id: projectId },
      data: {
        current_code: version.code,
        current_version_index: version.id
      },
    });

    await prisma.conversation.create({
        data: {
            role: "assistant",
            content: `Rolled back to version ${version.id}`,
            projectId
    }})
    res.json({ message: "Rollback successful", versionId: version.id });  












  } catch (error : any) {
    console.error("Error rolling back version:", error);
    res.status(500).json({ message: "Internal server error" });
  }


}

// controller to delete a project and all its versions
export const deleteProject = async (req: Request, res: Response) => {
  try{
    const userId = req.userId;
    if(!userId){
      return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }
    const { projectId } = req.params as { projectId: string };
     await prisma.websiteProject.delete({
      where: { id: projectId, userId },
    });

    res.json({ message: "Project and all its versions deleted successfully" });
  } catch (error : any) {

    console.error("Error deleting project:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// getting project code for preview

export const getProjectPreview = async (req: Request, res: Response) => {

  try{
    const userId = req.userId;
    if(!userId){
      return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }
    const { projectId } = req.params as { projectId: string };

    const project = await prisma.websiteProject.findFirst({
      where: { id: projectId, userId },
      include: { versions: true }
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json({ project });

  } catch (error : any) {
    console.error("Error getting project preview:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// contoller publish project 

export const publishProject = async (req: Request, res: Response) => {
  try{
  
    const projects = await prisma.websiteProject.findMany({
      where: { isPublished: true},
        include: { versions: true}

    });
  res.json({ projects });

  } catch (error : any) {
    console.error("Error publishing project:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


// single project BY ID

// export const getProjectById = async (req: Request, res: Response) => {
//   try{
//     const { projectId } = req.params as { projectId: string };
//     const project = await prisma.websiteProject.findUnique({
//       where: { id: projectId },
     
//     });
//     if (!project || project.isPublished === false || !project?.current_code) {
//       return res.status(404).json({ message: "Project not found" });
//     }
//     res.json({ code : project.current_code });

//   } catch (error : any) {
//     console.error("Error getting project by ID:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// }
export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params as { projectId: string };

    // 1. Validate projectId
    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required" });
    }

    // 2. Fetch only required fields
    const project = await prisma.websiteProject.findUnique({
      where: { id: projectId },
      select: {
        current_code: true,
        isPublished: true,
      },
    });

    // 3. Handle not found
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // 4. Check published status
    if (!project.isPublished) {
      return res.status(403).json({ message: "Project is not published" });
    }

    // 5. Check code existence safely
    if (project.current_code === null) {
      return res.status(404).json({ message: "No code available" });
    }

    // 6. Success response
    return res.status(200).json({ code: project.current_code });

  } catch (error: any) {
    console.error("[GET_PROJECT_BY_ID_ERROR]:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// controller to save project 
export const saveProject = async (req: Request, res: Response) => {
  try{
    const userId = req.userId;
    const { projectId } = req.params as { projectId: string };
    const { code } = req.body as { code: string };



    if(!userId){
      return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }

    if(!code){
      return res.status(400).json({ message: "Code is required" });
    }

    const project = await prisma.websiteProject.findUnique({
      where: { id: projectId, userId },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });

    }

    await prisma.websiteProject.update({
      where: { id: projectId },
      data: {
        current_code: code,
        current_version_index: ''
      },
    });

    res.json({ message: "Project saved successfully" });

  } catch (error : any) {
    console.error("Error saving project:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// 