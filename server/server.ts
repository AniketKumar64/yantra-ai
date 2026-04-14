// 



import "dotenv/config";
import express, { Request, Response } from 'express';
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/Auth.js";
import userRouter from "./routes/userRoutes.js";
import ProjectRouter from "./routes/ProjectRoutes.js";

const app = express();
const port = process.env.PORT ;

const corsOptions = {
  origin: process.env.TRUSTED_ORIGINS?.split(",") || [],
  credentials: true,
};

// ✅ CORS first
app.use(cors(corsOptions));

// ✅ Body parser once
app.use(express.json({ limit: '50mb' }));

// ✅ better-auth BEFORE your routes
app.all('/api/auth/{*any}', toNodeHandler(auth));

app.get('/', (req: Request, res: Response) => {
  res.send('Server is Live!');
});

// ✅ Your routes
app.use("/me", userRouter);
app.use("/api/project", ProjectRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});