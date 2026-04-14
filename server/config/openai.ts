// import OpenAI from 'openai';

// const openai = new OpenAI({
//   baseURL: "https://openrouter.ai/api/v1",
//   apiKey: process.env.AI_API_KEY,
 
// });

// // export default openai;




import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  apiKey: process.env.GOOGLE_AI_STUDIO_KEY,
});

export default openai;