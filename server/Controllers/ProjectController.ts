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
     model: "gemini-3-flash-preview",
      messages: [
        {
          role: "system",
          content:`Act as a Lead Product Designer and Senior Frontend Engineer. Your goal is to transform a raw website modification request into a comprehensive, implementation-ready technical blueprint.

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

Return ONLY the enhanced prompt, nothing else. Make it detailed but concise (15-20 paragraphs max).`
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