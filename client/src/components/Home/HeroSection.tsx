// import api from "@/Context/axios";
// import { authClient } from "@/lib/auth-client";
// import { motion, AnimatePresence } from "framer-motion";
// import { Plus, Zap, BotMessageSquare, Loader2 } from "lucide-react";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";

// const HeroSection = () => {
//   const { data: session } = authClient.useSession();
//   const navigate = useNavigate();
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [focused, setFocused] = useState(false);

// const onSubmitHandler = async (e?: React.FormEvent) => {
//   e?.preventDefault();

//   if (!session?.user) {
//     toast.error("Please sign in to create a project");
//     return;
//   }

//   if (!input.trim()) {
//     toast.error("Please enter a prompt to get started");
//     return;
//   }

//   try {
//     setLoading(true);
//     const { data } = await api.post("/api/user/project", { initial_prompt: input });

//     if (!data.projectId) {
//       console.error("No project ID returned from server:", data);
//       toast.error(data.message || "Failed to initialize builder");
//       return;
//     }

//     navigate(`/project/${data.projectId}`);
//     toast.success("Neural protocols initialized. Building...");
//   } catch (error: any) {
//     console.error("Error during project creation:", error);
//     toast.error(error.response?.data?.message || "Failed to initialize builder");
//   } finally {
//     setLoading(false);
//   }
// };

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       onSubmitHandler();
//     }
//   };

//   const suggestions = [
//     "SaaS dashboard with Stripe & Auth",
//     "Modern Startup landing page",
//     "AI Portfolio with Bento grid",
//     "E-commerce store using Next.js",
//   ];

//   return (
//     <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-20 px-4 md:px-12 overflow-hidden bg-background">
      
//       {/* --- Ambient Background Glow --- */}
//       <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none -z-10" />

//       <div className="relative z-10 max-w-[1300px] w-full text-center flex flex-col items-center">
        
//         {/* --- Top Conversational Badge --- */}
//         <motion.div 
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-10"
//         >
//           <BotMessageSquare size={16} className="text-primary" />
//           <span className="text-[11px] font-bold tracking-[0.25em] text-primary uppercase">
//             Initialize Neural Protocol
//           </span>
//         </motion.div>

//         {/* --- Conversational Supersized Title --- */}
//         <motion.h1 
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2, duration: 0.8 }}
//           className="font-display text-[55px] md:text-[100px] lg:text-[130px] xl:text-[150px] leading-[0.9] tracking-tighter text-foreground mb-12 max-w-[1200px]"
//         >
//           Just imagine it.
//           <br />
//           <span className="italic text-primary drop-shadow-[0_0_35px_oklch(0.68_0.19_45_/_0.4)]">
//             AI builds it
//           </span>
//           {" "}
//           <span className="font-semibold">for you.</span>
//         </motion.h1>

//         {/* --- Input Field Section --- */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.4 }}
//           className="max-w-3xl w-full mb-12 relative"
//         >
//           <div className={`rounded-2xl border-2 transition-all duration-300 ${
//             focused ? 'border-primary bg-background/90 shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)]' : 'border-border/60 bg-background/60'
//           } backdrop-blur-xl px-4 py-4`}
//           >
//             <div className="flex items-start gap-4">
//               {/* Icon / Status Indicator */}
//               <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 mt-1 shrink-0">
//                 {loading ? (
//                   <Loader2 size={20} className="text-primary animate-spin" />
//                 ) : (
//                   <Plus size={20} className="text-primary" />
//                 )}
//               </div>

//               {/* Input Area */}
//               <div className="w-full">
//                 <textarea
                  
//                   onChange={e => setInput(e.target.value)}
//                   onFocus={() => setFocused(true)}
//                   onBlur={() => setFocused(false)}
//                   onKeyDown={handleKeyDown}
//                   rows={3}
//                   placeholder="Describe the website you want to build..."
//                   className="w-full bg-transparent outline-none border-none resize-none
//                   text-foreground placeholder:text-muted-foreground/40 
//                   text-base md:text-lg leading-relaxed font-medium pt-2"
//                 />
//               </div>
//             </div>

//             {/* Bottom Row Actions */}
//             <form onSubmit={onSubmitHandler} className="flex items-center justify-between mt-4 pl-14">
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
//                 <span className="text-[11px] text-primary font-bold uppercase tracking-wider">
//                   System Ready
//                 </span>
//               </div>

//               <button 
//                 className="group relative px-6 py-2.5 rounded-xl bg-primary text-primary-foreground 
//                 text-sm font-bold overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
//               >
//                 <div className="relative z-10 flex items-center gap-2">
//                   {loading ? "Processing..." : "Build Now"}
//                   {!loading && <Zap size={14} className="fill-current" />}
//                 </div>
//               </button>
//             </form>
//           </div>

//           {/* Functional Suggestions */}
//           <div className="flex flex-wrap gap-2 mt-5 px-1 justify-center">
//             {suggestions.map((s, i) => (
//               <button
//                 key={i}
//                 onClick={() => setInput(s)}
//                 className="text-[11px] font-medium px-4 py-1.5 rounded-full border border-border/40 
//                 bg-secondary/20 hover:bg-primary/10 hover:border-primary/40 hover:text-primary 
//                 transition-all duration-200 active:scale-95"
//               >
//                 {s}
//               </button>
//             ))}
//           </div>
//         </motion.div>

//         {/* --- Feature Highlights --- */}
//         <motion.div 
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.8 }}
//           className="flex gap-x-10 gap-y-4 flex-wrap justify-center text-muted-foreground/60 text-[12px] font-bold uppercase tracking-widest"
//         >
//             <div className="flex items-center gap-2 hover:text-primary transition-colors cursor-default">
//               <Zap size={14} className="text-primary"/> No Code Deploy
//             </div>
//             <div className="flex items-center gap-2 hover:text-primary transition-colors cursor-default">
//               <Zap size={14} className="text-primary"/> AI Architect
//             </div>
//             <div className="flex items-center gap-2 hover:text-primary transition-colors cursor-default">
//               <Zap size={14} className="text-primary"/> Instant Sync
//             </div>
//         </motion.div>

//       </div>
//     </section>
//   );
// };

// export default HeroSection;



import api from "@/Context/axios";
import { authClient } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { Plus, Zap, BotMessageSquare, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const HeroSection = () => {
  const { data: session } = authClient.useSession();
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  const onSubmitHandler = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!session?.user) {
      toast.error("Please sign in to create a project");
      return;
    }

    if (!input.trim()) {
      toast.error("Please enter a prompt to get started");
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post("/me/project", {
        initial_prompt: input,
      });

      if (!data.projectId) {
        console.error("No project ID returned from server:", data);
        toast.error(data.message || "Failed to initialize builder");
        return;
      }

      navigate(`/project/${data.projectId}`);
      toast.success("Neural protocols initialized. Building...");
    } catch (error: any) {
      console.error("Error during project creation:", error);
      toast.error(
        error.response?.data?.message || "Failed to initialize builder"
      );
    } finally {
      setLoading(false);
    }
  };


//   const onSubmitHandler = async (e?: React.FormEvent) => {
//   e?.preventDefault();

//   if (!session?.user) {
//     toast.error("Please sign in to create a project");
//     return;
//   }

//   if (!input.trim()) {
//     toast.error("Please enter a prompt to get started");
//     return;
//   }

//   try {
//     setLoading(true);

//     const response = await fetch("http://localhost:5000/me/project", {
//       method: "POST",
//       credentials: "include",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ initial_prompt: input }),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       toast.error(data.message || "Failed to initialize builder");
//       return;
//     }

//     if (!data.projectId) {
//       console.error("No project ID returned from server:", data);
//       toast.error(data.message || "Failed to initialize builder");
//       return;
//     }

//     navigate(`/project/${data.projectId}`);
//     toast.success("Neural protocols initialized. Building...");
//   } catch (error: any) {
//     console.error("Error during project creation:", error);
//     toast.error(error.message || "Failed to initialize builder");
//   } finally {
//     setLoading(false);
//   }
// };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmitHandler();
    }
  };

  const suggestions = [
    "SaaS dashboard with Stripe & Auth",
    "Modern Startup landing page",
    "AI Portfolio with Bento grid",
    "E-commerce store using Next.js",
  ];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-20 px-4 md:px-12 overflow-hidden bg-background">

      {/* --- Ambient Background Glow --- */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="relative z-10 max-w-[1300px] w-full text-center flex flex-col items-center">

        {/* --- Top Conversational Badge --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-10"
        >
          <BotMessageSquare size={16} className="text-primary" />
          <span className="text-[11px] font-bold tracking-[0.25em] text-primary uppercase">
            Initialize Neural Protocol
          </span>
        </motion.div>

        {/* --- Conversational Supersized Title --- */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="font-display text-[55px] md:text-[100px] lg:text-[130px] xl:text-[150px] leading-[0.9] tracking-tighter text-foreground mb-12 max-w-[1200px]"
        >
          Just imagine it.
          <br />
          <span className="italic text-primary drop-shadow-[0_0_35px_oklch(0.68_0.19_45_/_0.4)]">
            AI builds it
          </span>{" "}
          <span className="font-semibold">for you.</span>
        </motion.h1>

        {/* --- Input Field Section --- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-3xl w-full mb-12 relative"
        >
          {/* ✅ FIX: form now wraps everything including the textarea */}
          <form
            onSubmit={onSubmitHandler}
            className={`rounded-2xl border-2 transition-all duration-300 ${
              focused
                ? "border-primary bg-background/90 shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)]"
                : "border-border/60 bg-background/60"
            } backdrop-blur-xl px-4 py-4`}
          >
            <div className="flex items-start gap-4">
              {/* Icon / Status Indicator */}
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 mt-1 shrink-0">
                {loading ? (
                  <Loader2 size={20} className="text-primary animate-spin" />
                ) : (
                  <Plus size={20} className="text-primary" />
                )}
              </div>

              {/* ✅ FIX: added value={input} to make it controlled */}
              <div className="w-full">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  onKeyDown={handleKeyDown}
                  rows={3}
                  disabled={loading}
                  placeholder="Describe the website you want to build..."
                  className="w-full bg-transparent outline-none border-none resize-none
                  text-foreground placeholder:text-muted-foreground/40
                  text-base md:text-lg leading-relaxed font-medium pt-2 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Bottom Row Actions */}
            <div className="flex items-center justify-between mt-4 pl-14">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[11px] text-primary font-bold uppercase tracking-wider">
                  System Ready
                </span>
              </div>

              {/* ✅ FIX: type="submit" explicitly set, button is inside the form */}
              <button
                type="submit"
                disabled={loading}
                className="group relative px-6 py-2.5 rounded-xl bg-primary text-primary-foreground
                text-sm font-bold overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
              >
                <div className="relative z-10 flex items-center gap-2">
                  {loading ? "Processing..." : "Build Now"}
                  {!loading && <Zap size={14} className="fill-current" />}
                </div>
              </button>
            </div>
          </form>

          {/* Functional Suggestions */}
          <div className="flex flex-wrap gap-2 mt-5 px-1 justify-center">
            {suggestions.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setInput(s)}
                disabled={loading}
                className="text-[11px] font-medium px-4 py-1.5 rounded-full border border-border/40
                bg-secondary/20 hover:bg-primary/10 hover:border-primary/40 hover:text-primary
                transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {s}
              </button>
            ))}
          </div>
        </motion.div>

        {/* --- Feature Highlights --- */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex gap-x-10 gap-y-4 flex-wrap justify-center text-muted-foreground/60 text-[12px] font-bold uppercase tracking-widest"
        >
          <div className="flex items-center gap-2 hover:text-primary transition-colors cursor-default">
            <Zap size={14} className="text-primary" /> No Code Deploy
          </div>
          <div className="flex items-center gap-2 hover:text-primary transition-colors cursor-default">
            <Zap size={14} className="text-primary" /> AI Architect
          </div>
          <div className="flex items-center gap-2 hover:text-primary transition-colors cursor-default">
            <Zap size={14} className="text-primary" /> Instant Sync
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;