// import { betterAuth } from "better-auth";
// import { prismaAdapter } from "better-auth/adapters/prisma";
// import prisma from "./prisma.js";


// const trustedOrigins = process.env.TRUSTED_ORIGINS?.split(",") || [];

// export const auth = betterAuth({
//     database: prismaAdapter(prisma, {
//         provider: "postgresql",
//     }),
//     emailAndPassword: {
//         enabled: true,
//     },
//     user:{
//         deleteUser: {enabled:true}
//     },

//     // todo add goggle provider




//     trustedOrigins,
//     baseURL: process.env.BETTER_AUTH_URL!,
//     secret: process.env.BETTER_AUTH_SECRET!,

//     advanced:{
//         cookies:{
//             session_token:{
//                 name:"auth_session",
//                 attributes:{
//                     httpOnly:true,
//                     secure:process.env.NODE_ENV === "production",
//                     sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
//                     path:'/'    
                   
//                 }
//             }
//         }

//     }



// });


import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma.js";

const trustedOrigins =
  process.env.TRUSTED_ORIGINS?.split(",").map(o => o.trim()) || [];

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
  },

  user: {
    deleteUser: { enabled: true },
  },

  trustedOrigins,

  baseURL: process.env.BETTER_AUTH_URL!,
  secret: process.env.BETTER_AUTH_SECRET!,

  // ✅ FIXED COOKIE CONFIG (CRITICAL)
  advanced: {
    cookies: {
      session_token: {
        name: "auth_session",
        attributes: {
          httpOnly: true,
          secure: true,        // 🔥 ALWAYS TRUE
          sameSite: "none",    // 🔥 ALWAYS NONE
          path: "/",
        },
      },
    },
  },
});