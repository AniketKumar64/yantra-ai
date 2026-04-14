import React, { useEffect, useRef, useState } from "react";
import type { Message, Project } from "@/types";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import api from "@/Context/axios";
import { toast } from "sonner";
import { motion } from "framer-motion";

type Props = {
  isMenuOpen: boolean;
  project: Project;
  setProject: (project: Project) => void;
  isGenerating: boolean;
  setisGenerating: (generating: boolean) => void;
};
const Leftside = ({
  isMenuOpen,
  setProject,
  project,
  isGenerating,
  setisGenerating,
}: Props) => {

  // 🔹 Local State
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // 🔹 Auto Scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [project.conversation, project.versions, isGenerating]);

  const fetchProject = async () => {
    try {
      const { data } = await api.get(`/me/project/${project.id}`);
      setProject(data.project);
      console.log("Project updated:", data.project);
    } catch (error: any) {
      toast.error("Failed to fetch project updates. Please refresh.");
      console.error("Error fetching project:", error);
    }
  };

  const handleRollback = async (versionId: string) => {
    try {
      const confirm = window.confirm(
        "Are you sure you want to switch back to this version? This will discard any unsaved changes."
      );
      if (!confirm) return;

      setisGenerating(true);

      await api.get(`/api/project/rollback/${project.id}/${versionId}`);

      const { data } = await api.get(`/me/project/${project.id}`);

      toast.success("Switched to selected version successfully!");
      setProject(data.project);
    } catch (err) {
      toast.error("Failed to switch versions. Please try again.");
      console.error("Rollback error:", err);
    } finally {
      setisGenerating(false);
    }
  };

// const handleRevisions = async (e: React.FormEvent) => {
//   e.preventDefault();

//   let interval: ReturnType<typeof setInterval> | undefined;

//   try {
//     if (!input.trim()) return;

//     setisGenerating(true);

//     interval = setInterval(() => {
//       fetchProject();
//     }, 2000);

//     await api.post(`/api/project/revision/${project.id}`, {
//       prompt: input, // ✅ FIXED
//     });

//     toast.success("Revision applied successfully!");
//     setInput("");

//     await fetchProject();
//   } catch (err: any) {
//     console.error("Revision error:", err.response?.data || err.message);
//     console.error("Full error object:", err);
//     toast.error(err.response?.data?.error || "Failed to apply revision.");
//   } finally {
//     if (interval) clearInterval(interval); // ✅ safe cleanup
//     setisGenerating(false);
//   }
// };

const handleRevisions = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!input.trim() || isGenerating) return; // guard against concurrent calls

  let interval: ReturnType<typeof setInterval> | undefined;

  try {
    setisGenerating(true);

    // Start polling only after confirming the request is in-flight
    await api.post(`/api/project/revision/${project.id}`, { message: input });

    // Poll for updates only after the POST succeeds
    interval = setInterval(fetchProject, 2000);

    toast.success("Revision applied successfully!");
    setInput("");

    await fetchProject(); // immediate refresh
  } catch (err: any) {
    console.error("Revision error:", err.response?.data ?? err.message);
    toast.error(err.response?.data?.error ?? "Failed to apply revision.");
  } finally {
    clearInterval(interval); // safe even if undefined
    setisGenerating(false);
  }
};
  const handleSend = () => {
  if (!input.trim()) return;
  const syntheticEvent = { preventDefault: () => {} } as React.FormEvent;
  handleRevisions(syntheticEvent);
  setInput(""); // Clear input immediately for better UX
};
return (
    <aside className={`w-full  border-r  border-[var(--border)] bg-[var(--card)]/30 p-4 flex flex-col gap-4 overflow-hidden ${isMenuOpen ? "mx-sm:w-0 overflow-hidden" : "w-full"} `} >

      {/* 🔹 STATUS CARD */}
      <div className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
            System Status
          </span>

          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">
            <div className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" />
            Synchronized
          </span>
        </div>

        {/* <p className="text-xs text-[var(--muted-foreground)] leading-relaxed italic border-l-2 border-[var(--primary)]/30 pl-3">
          "{project?.initial_prompt.trim(50) || "Defining the future of digital interfaces..."}"
        </p> */}
      </div>

      {/* 🔹 CHAT AREA */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">

        {[...project.conversation, ...project.versions]
          .sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
          .map((message: any) => {

            const isMessage = "content" in message;

            // 🔹 CHAT MESSAGE
            if (isMessage) {
              const msg = message as Message;
              const isUser = msg.role === "user";

              return (
                <div key={msg.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] px-3 py-2 overflow-hidden rounded-xl text-xs leading-relaxed shadow-sm
                    ${isUser
                        ? "bg-[var(--primary)] text-white"
                        : "bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)]"
                      }`}
                  >
                    {!isUser && (
                      <div className="flex overflow-hidden items-center gap-1 mb-1 text-[10px] text-[var(--muted-foreground)] uppercase tracking-widest font-mono">
                        <Sparkles className="text-emerald-500 animate-pulse" size={10} />
                        YantraAi.
                      </div>
                    )}

                    {msg.content}
                  </div>
                </div>
              );
            }

            // 🔹 VERSION BLOCK (UI only)
            const version = message;

return (
  <div
    key={version.id}
    className="w-full rounded-2xl border border-[var(--border)] bg-[#0d0d0d] overflow-hidden"
  >

    {/* 🔹 HEADER */}
    <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 bg-white/5">
      
      <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono">
        Version Update
      </span>

      <span className="text-[10px] text-white/30 font-mono">
        {new Date(version.timestamp).toLocaleString()}
      </span>
    </div>

    {/* 🔹 CODE BLOCK */}
    <div className="p-3">
      <pre className="whitespace-pre-wrap text-[11px] font-mono text-emerald-400 leading-relaxed max-h-[200px] overflow-auto custom-scrollbar">
        {version.code || "// No code in this version..."}
      </pre>
    </div>

    {/* 🔹 ACTION BAR */}
    <div className="flex items-center justify-between px-3 py-2 border-t border-white/5 bg-white/[0.02]">

      {/* LEFT: STATUS */}
      {project.current_version_index === version.id ? (
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold">
          Current
        </span>
      ) : (
        <button onClick={()=>handleRollback(version.id)}
          className="text-[10px] px-2 py-1 rounded-lg border border-[var(--border)] hover:bg-white/5 text-white transition"
        >
          Switch Back
        </button>
      )}

      {/* RIGHT: VIEW */}
      <Link
        target="_blank"
        to={`/preview/${project.id}/${version.id}`}
        className="text-[10px] text-emerald-400 hover:underline"
      >
        View 
      </Link>

    </div>
  </div>
);
            })}

        {/* 🔹 GENERATING */}
  {isGenerating && (
  <div className="flex flex-col items-center justify-center gap-6 p-10">
    <div className="flex items-end gap-3 h-12">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-4 h-4 rounded-sm bg-primary"
          initial={{ height: "1rem", opacity: 0.2 }}
          animate={{ 
            height: ["1rem", "3rem", "1rem"],
            opacity: [0.2, 1, 0.2],
            boxShadow: [
              "0 0 0px var(--primary)",
              "0 0 20px var(--primary)",
              "0 0 0px var(--primary)"
            ]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
    
    <div className="flex flex-col items-center gap-1">
      <motion.span 
        className="text-xs font-mono uppercase tracking-[0.5em] text-primary font-bold"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Processing_Data
      </motion.span>
      <div className="h-px w-24 bg-gradient-to-r from-transparent via-border to-transparent" />
    </div>
  </div>
)}
        {/* 🔹 AUTO SCROLL TARGET */}
        <div ref={bottomRef} />
      </div>

      {/* 🔹 INPUT AREA */}
      <form onSubmit={
        handleRevisions
      }>
        <div className="border border-[var(--border)] bg-[var(--card)] rounded-xl p-2 flex items-end gap-2">

    
            <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe changes... (e.g., add navbar, improve UI)"
          className="flex-1 bg-transparent text-xs resize-none outline-none px-2 py-1 placeholder:text-[var(--muted-foreground)]"
          rows={2}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
   
        <button
          onClick={handleSend}
          disabled={!input.trim() || isGenerating}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[var(--primary)] text-white disabled:opacity-30 hover:opacity-90 transition"
        >
          {isGenerating ? "Generating..." : "Generate"}
        </button>
      </div>
       </form>

    </aside>
  );
};

export default Leftside;