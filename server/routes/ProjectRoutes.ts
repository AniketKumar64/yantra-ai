// creating router
import { Router } from "express";
import { deleteProject, getProjectById, getProjectPreview, makeRevision, publishProject, rollbackVersion, saveProject } from "../Controllers/ProjectController.js";
import { protect } from "../Middleware/auth.js";

const ProjectRouter = Router();

ProjectRouter.post("/revision/:projectId",protect, makeRevision);
ProjectRouter.put("/save/:projectId",protect, saveProject);
ProjectRouter.get("/rollback/:projectId/:versionId",protect, rollbackVersion);
ProjectRouter.delete("/:projectId",protect, deleteProject);
ProjectRouter.get("/preview/:projectId",protect, getProjectPreview);
ProjectRouter.get("/published/:projectId",protect, getProjectById);
ProjectRouter.get("/published", protect, publishProject);



export default ProjectRouter;