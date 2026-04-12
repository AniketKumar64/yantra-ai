import "dotenv/config";
import express, { Request, Response } from 'express';
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/Auth.js";
import userRouter from "./routes/userRoutes.js";
import ProjectRouter from "./routes/ProjectRoutes.js";

const app = express();
const corsOptions = {
    origin: process.env.TRUSTED_ORIGINS?.split(",") || [],
    credentials: true,
};  


// Middleware
app.use(cors(corsOptions))
app.use(express.json());


const port = process.env.PORT || 3000;

app.use(express.json({limit: '50mb'}));

app.all('/api/auth/{*any}', toNodeHandler(auth));

app.get('/', (req: Request, res: Response) => {
    res.send('Server is Live!');
});
app.use("/api/user", userRouter);
app.use("/api/project", ProjectRouter);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});