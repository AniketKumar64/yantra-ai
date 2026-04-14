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
    console.log("Received create project request with prompt:", initial_prompt);
    

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
        model: "gemini-3-flash-preview",
        messages: [
         {
  role: "system",
  content: `Act as a Lead Product Designer and Senior Frontend Engineer. Your goal is to transform a raw website modification request into a comprehensive, implementation-ready technical blueprint.

1. Architectural Framework & Layout:

Visual Hierarchy: Reconstruct the layout using a strict 8px spacing system. Apply a clear focal point using scale, weight, and negative space.

Modern Structures: Where appropriate, utilize modern layouts like Bento-grid structures or high-end Glassmorphism (backdrop-blur, subtle borders, and low-opacity fills).

Grid & Flex: Define precise CSS Grid (e.g., 12-column) or Flexbox behaviors for every section (Navbar, Hero, Cards, Footer).

2. Design Tokens & Typography:

Typography: Establish a responsive type scale. Specify font-weights, tracking (letter-spacing), and leading (line-height) for optimal readability.

Color & Contrast: Use a cohesive color palette that ensures WCAG AA accessibility. Define states for interactive elements (Hover, Active, Focus).

Refined Details: Specify border-radius values, soft elevation (box-shadows), and 0.5px border-strokes for a premium feel.

3. Content & UX Writing:

Meaningful Copy: Replace all placeholder text with high-conversion, contextually relevant microcopy. Ensure the tone is consistent and professional.

4. Motion & Interactivity:

State Transitions: Describe micro-interactions (e.g., button scale-down on click) and transition durations (e.g., 200ms cubic-bezier).

Entrance Animations: Suggest Framer Motion or CSS keyframes for component entry (e.g., fade-in-up, staggered children).

5. Responsive & Technical Logic:

Breakpoints: Detail exactly how components collapse or stack across mobile, tablet, and ultra-wide screens.

Implementation Checklist: Provide a step-by-step technical breakdown of which components to update first to maintain a global theme.
Return ONLY the enhanced prompt, nothing else. Make it detailed but concise (2-3 paragraphs max).`,
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
        model: "gemini-3-flash-preview",
        messages: [
          {
  role: "system",
  content: `You are an elite Frontend Architect and UI/UX Designer. Your task is to generate high-end, production-ready HTML websites with a focus on sophisticated color theory and modern aesthetics.

### CRITICAL OUTPUT PROTOCOL
- Return ONLY the complete HTML code.
- DO NOT use markdown formatting (NO \`\`\`html blocks).
- DO NOT include explanations, comments, or introductory text.
- Output must be a full, standalone HTML document starting with <!DOCTYPE html> and ending with </html>.

### COLOR & DESIGN SYSTEM (ELITE STANDARD)
- PALETTE SELECTION: Automatically choose a cohesive, professional color palette based on the context, purpose, and industry of the website.
- CONSISTENCY: Use a single unified color system throughout the entire UI. Avoid random or inconsistent color usage.
- VISUAL HIERARCHY: Use a dominant base tone for most of the layout and a minimal number of supporting accent tones for emphasis and interaction elements.
- CONTRAST: Ensure strong readability and accessibility with clear contrast between text, backgrounds, and interactive elements.
- MODERN UI: Maintain a clean, premium look using balanced tones, subtle depth, and polished visual layering.

### STYLING & STRUCTURE
- FRAMEWORK: You MUST include this EXACT script inside the <head>:
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
- Use ONLY Tailwind utility classes. No custom CSS blocks.
- STRUCTURE: Use semantic HTML5 (<header>, <main>, <section>, <footer>) with mobile-first responsive design.

### UI QUALITY RULES
- Maintain consistent spacing, alignment, and layout rhythm.
- Use clear typography hierarchy and balanced visual weight.
- Apply modern UI patterns such as soft shadows, smooth spacing, and refined component structure.
- Ensure the design feels premium, minimal, and production-ready.

### INTERACTIVITY & ASSETS
- JAVASCRIPT: Place all logic (e.g., smooth scroll, mobile menus, or intersection observers) inside a <script> tag immediately before the closing </body>.
- IMAGES: Use descriptive, high-resolution Unsplash URLs (e.g., https://images.unsplash.com/photo-[ID]?auto=format&fit=crop&q=80).

### FINAL DIRECTIVE
Your output must be 100% valid code. Any conversational filler or formatting outside the HTML tags is strictly forbidden.`,
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