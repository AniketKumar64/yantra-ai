import express from "express";
import { createUserProject,  getUserCredits, getUserProject, getUserProjects,  purchaseCredits, toggleProjectPublish } from "../Controllers/UserController.js";
import { protect } from "../Middleware/auth.js";


const userRouter = express.Router();

userRouter.get("/credits", protect, getUserCredits);

userRouter.get("/project/:projectId", protect, getUserProject);
userRouter.get("/projects", protect, getUserProjects);
userRouter.post("/project", protect, createUserProject);
userRouter.get("/publish-toggle/:projectId", protect, toggleProjectPublish);
userRouter.get("/purchase-credits", protect, purchaseCredits);


export default userRouter;