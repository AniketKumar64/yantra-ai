import express from "express";
import { getUserProject, getUserProjects,  purchaseCredits, toggleProjectPublish } from "../Controllers/UserController.js";
import { protect } from "../Middleware/auth.js";


const userRouter = express.Router();

userRouter.get("/credits", protect, purchaseCredits);
userRouter.get("/projects/:projectId", protect, getUserProject);
userRouter.get("/projects", protect, getUserProjects);
userRouter.get("/project", protect, getUserProject);
userRouter.get("/publish-toggle/:projectId", protect, toggleProjectPublish);
userRouter.get("/purchase-credits", protect, purchaseCredits);


export default userRouter;