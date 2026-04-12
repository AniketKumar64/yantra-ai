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
    if(user.credits < 5){
      return res.status(400).json({ message: "Insufficient credits" });
    }

    if(!message || message.trim() === ""){
      return res.status(400).json({ message: "Message is required" });
    }

    const currentProject = await prisma.websiteProject.findUnique({
      where: { id: projectId as string, userId: userId as string },
      include: {
       versions: true
      }
    });

    if (!currentProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    await prisma.conversation.create({
        data: {
            role: "user",
            content: message,
            projectId
    }})

    await prisma.user.update({
        where: { id: userId },
        data: { credits: { decrement: 5 } }
    });

    // enchance prompt
    const promptEnhanceRespone = await openai.chat.completions.create({
        model: "z-ai/glm-4.5-air:free",
       messages:[
        {
            role: "system",
            content:`You are a senior UI/UX engineer and frontend developer. The user wants to modify an existing website. Transform their request into a clear, precise, and implementation-ready instruction for a developer.

Enhance the request by:
- Clearly identifying the exact components or sections to modify (e.g., navbar, hero section, buttons, cards, footer)
- Specifying visual changes using concrete design details (colors, spacing, typography, sizing, alignment, shadows, borders, etc.)
- Defining interaction or behavior changes if applicable (hover states, animations, transitions)
- Clarifying the intended outcome and user experience improvement

Output Rules:
- Return ONLY the enhanced request
- Keep it concise (1 to 2 sentences)
- Use clear, technical, and actionable language
- Do NOT include explanations or extra text
            `
        },{
            role: "user",
            content: `user request: ${message}`
        }
       ]
    });

        const enhancedPrompt = promptEnhanceRespone.choices[0].message.content || "";

        await prisma.conversation.create({
            data: {
                role: "assistant",
                content: enhancedPrompt ,
                projectId
        }})

        await prisma.conversation.create({
            data: {
                role: "assistant",
                content: ' now making changes to project...',
                projectId
        }})


        // generate code using enhanced prompt
        const codeGenerationResponse = await openai.chat.completions.create({
           model: "z-ai/glm-4.5-air:free",
           messages:[
            {
                role: "system",
                content:`You are a senior UI/UX engineer and frontend developer. The user wants to modify an existing website. Transform their request into a clear, precise, and implementation-ready instruction for a developer.
Enhance the request by:You are an expert web developer.

CRITICAL REQUIREMENTS:

- Return ONLY the complete updated HTML code with the requested changes
- Use Tailwind CSS for ALL styling (NO custom CSS)
- Use Tailwind utility classes for all styling changes
- Include all JavaScript inside <script> tags before closing </body>
- Ensure the output is a complete, standalone HTML document with Tailwind CSS
- Return ONLY the HTML code, nothing else

Apply the requested changes while maintaining the Tailwind CSS styling approach.

Additionally, enhance the overall UI by:
- Improving spacing using consistent Tailwind padding and margin utilities
- Refining typography with clear hierarchy (larger headings, readable body text)
- Using a cohesive and high-contrast color palette
- Upgrading components (buttons, cards, sections) with rounded corners (rounded-lg/2xl), shadows, and hover/transition effects
- Ensuring the design is fully responsive and visually polished across all screen sizes`
            },
            {
                role: "user",
                content: `user request: ${message}`
            }
           ]
        });


        const generatedCode = codeGenerationResponse.choices[0].message?.content || "";
const version = await prisma.version.create(    {
      data: {
        code: generatedCode
          .replace(/```[a-z]*\n/g, "")
          .replace(/```/g, "")
          .replace(/```$/g, "")
          .trim(),
        description: "Generated code based on user request",
        projectId,
      },
    }
        );


        await prisma.conversation.create({
            data: {
                role: "assistant",
                content: 'Code generation completed and project updated.',
                projectId
        }})


        await prisma.websiteProject.update({
            where: { id: projectId },
                  data: {
        current_code: generatedCode
          .replace(/```[a-z]*\n/g, "")
          .replace(/```/g, "")
          .replace(/```$/g, "")
          .trim(),
          current_version_index: version.id
       
      },


        });

res.json({ message: "Revision created successfully", versionId: version.id });

  } catch (error : any) {
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

export const getProjectById = async (req: Request, res: Response) => {
  try{
    const { projectId } = req.params as { projectId: string };
    const project = await prisma.websiteProject.findUnique({
      where: { id: projectId },
     
    });
    if (!project || project.isPublished === false || !project?.current_code) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json({ code : project.current_code });

  } catch (error : any) {
    console.error("Error getting project by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

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