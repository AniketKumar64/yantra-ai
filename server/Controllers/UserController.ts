// get user credits
import { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import openai from "../config/openai.js";

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
        totalCreations: { increment: 1 },
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

    res.json({ projectId: project.id });

    // enchance prompt

    const promptEnchanceResponse = await openai.chat.completions.create({
      model: "z-ai/glm-4.5-air:free",
      messages: [
        {
          role: "system",
          content: `
You are a master UI/UX Architect specializing in high-end Glassmorphism, Bento-grid layouts, and sophisticated modern aesthetics. Your task is to transform the user's basic website request into a comprehensive, professional-grade technical design prompt.

To enhance the prompt, you must:

Visual Language: Define a "Premium Glassmorphism" style using translucent layers, high-chroma blur backgrounds, soft-glow borders, and layered depth. Instead of fixed colors, intelligently generate a cohesive color palette based on the user's intent, industry, or product type (e.g., dark futuristic tones for tech, soft neutrals for corporate, bold gradients for creative brands). Ensure high contrast, visual harmony, and consistent theming across all components with refined typography hierarchy.

Structural Integrity: Design a modern layout utilizing Bento-style grids, parallax scrolling, or layered stack containers. Clearly define key sections such as an immersive Hero with strong CTA, feature showcases, content grids, testimonials or trust signals, and a well-structured interactive footer. Maintain consistent spacing, alignment, and visual rhythm.

Dynamic Interactions: Describe fluid Framer Motion animations including scroll-based reveals, hover-triggered glass reflections, magnetic button effects, subtle scaling, and smooth transitions that enhance usability without overwhelming performance.

Modern Standards: Enforce strict responsive design (mobile-first), accessibility (WCAG compliance, readable contrast), optimized asset loading, and clean, modular component architecture suitable for modern frameworks like React and Tailwind CSS.

Output Protocol: Return ONLY the enhanced prompt. The output must be a detailed, exactly 2-paragraph "Master Brief" with dense, implementation-ready design and interaction details for building a world-class web experience.
`,
        },
        {
          role: "user",
          content: initial_prompt,
        },
      ],
    });

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

    const codeGenerationResponse = await openai.chat.completions.create({
      model: "z-ai/glm-4.5-air:free",
      messages: [
        {
          role: "system",
          content: `
You are an expert frontend developer and UI engineer. Generate a complete, production-ready, single-page website based on the following design brief:

"${enhancedPrompt}"

REQUIREMENTS:

• Output MUST be valid, clean HTML only
• Use Tailwind CSS for ALL styling (no custom CSS files)
• Include this EXACT script inside <head>:
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>

• Use modern semantic HTML structure:
  <header>, <main>, <section>, <footer>

• Ensure the website includes:
  - Responsive navigation bar
  - Hero section with strong CTA
  - Features / services section (cards or grid)
  - Content or showcase section
  - Optional testimonials or stats
  - Footer with useful links

• Design rules:
  - Use Tailwind utility classes extensively
  - Use gradients, glassmorphism, shadows, and spacing for premium UI
  - Maintain consistent padding, margins, and alignment
  - Use proper typography hierarchy (headings, subtext, body)
  - Ensure strong visual contrast and readability

• Responsiveness:
  - Fully responsive using sm:, md:, lg:, xl:
  - Mobile-first layout
  - Proper stacking and spacing on smaller screens

• Interactivity:
  - Add JavaScript inside a <script> tag before </body>
  - Include simple interactions like:
    - mobile menu toggle
    - button hover effects
    - smooth scrolling

• Assets:
  - Use placeholder images from https://placehold.co/600x400
  - Use Google Fonts if needed

• Meta:
  - Include charset, viewport, and title
  - Ensure fast-loading and minimal structure

STRICT OUTPUT RULES:

1. Output ONLY raw HTML
2. Do NOT include markdown or code blocks
3. Do NOT include explanations or comments
4. Do NOT include anything outside the HTML document
5. The result must be directly renderable in a browser

Build a clean, modern, visually impressive website that reflects the design brief.`,
        },
        {
          role: "user",
          content: enhancedPrompt || "",
        },
      ],
    });

    const code = codeGenerationResponse.choices[0].message.content || "";

    const version = await prisma.version.create({
      data: {
        code: code
          .replace(/```[a-z]*\n/g, "")
          .replace(/```/g, "")
          .replace(/```$/g, "")
          .trim(),
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
        current_code: code
          .replace(/```[a-z]*\n/g, "")
          .replace(/```/g, "")
          .replace(/```$/g, "")
          .trim(),
        current_version_index: version.id,
      },
    });
  } catch (error: any) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        credits: { increment: 5 },
      },
    });

    console.error("Error creating project:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// controller to get a projects of single  user projects


export const getUserProject = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
   

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }

    const { projectId } = req.params;
    // if (Array.isArray(projectId)) {
    //   return res.status(400).json({ message: "Invalid project ID" });
    // }
  

    const project = await prisma.websiteProject.findUnique({
        where: { id: projectId, userId },
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

    const { projectId } = req.params;
    // if (Array.isArray(projectId)) {
    //   return res.status(400).json({ message: "Invalid project ID" });
    // }

    const project = await prisma.websiteProject.findUnique({
      where: { id: projectId, userId },
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