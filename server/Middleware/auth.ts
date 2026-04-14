// import { NextFunction, Request, Response } from 'express';
// import { auth } from '../lib/Auth.js';
// import { fromNodeHeaders } from 'better-auth/node';


// export const protect = async (req: Request, res: Response, next: NextFunction) => {


//     try{
//         const session = await auth.api.getSession({headers: fromNodeHeaders(req.headers)});

//         if(!session || !session.user) {
//             return res.status(401).json({ message: 'Unauthorized' });
//         }
//         req.userId = session.user.id;
       
//         next();
   
   
//     } catch (error) {
//         console.error('Authentication error:', error);
//         res.status(401).json({ message: 'Unauthorized' });
//     }
// // 
// }



// // export const protect = async (req: Request, res: Response, next: NextFunction) => {
// //   console.log("MIDDLEWARE START");

// //   try {
// //     console.log("COOKIE:", req.headers.cookie);

// //     console.log("Before getSession");

// //     const session = await auth.api.getSession({
// //       headers: req.headers as any,
// //     });

// //     console.log("After getSession");
// //     console.log("SESSION:", session);

// //     if (!session || !session.user) {
// //       console.log("NO SESSION");
// //       return res.status(401).json({ message: "Unauthorized" });
// //     }

// //     req.userId = session.user.id;

// //     console.log("MIDDLEWARE END");

// //     return next();
// //   } catch (error) {
// //     console.error("MIDDLEWARE ERROR:", error);
// //     return res.status(401).json({ message: "Unauthorized" });
// //   }
// // };


import { Request, Response, NextFunction } from "express";
import { auth } from "../lib/Auth.js";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers as any,
    });
  

    if (!session?.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.userId = session.user.id;

    return next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};