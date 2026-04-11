import React, { useEffect, useRef, useState } from "react";
import type { Message, Project } from "@/types";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

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


//   rollback to version
    const handleRollback = (versionId: string) => {


        
    }
    const handleRevisions = async (e: React.FormEvent) => {
        e.preventDefault();
        setisGenerating(true);
        setTimeout(() => {
            setisGenerating(false);

        },1000)


        }
  // 🔹 Send Message
  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };

    setProject({
      ...project,
      conversation: [...project.conversation, newMessage],
    });

    setInput("");
    setisGenerating(true);

    // simulate AI response
    setTimeout(() => {
      setisGenerating(false);
    }, 1500);
  };

  return (
    <aside className={`w-full lg:w-80 border-r border-[var(--border)] bg-[var(--card)]/30 p-4 flex flex-col gap-4 overflow-hidden ${isMenuOpen ? "mx-sm:w-0 overflow-hidden" : "w-full"} `} >

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

        <p className="text-xs text-[var(--muted-foreground)] leading-relaxed italic border-l-2 border-[var(--primary)]/30 pl-3">
          "{project?.initial_prompt || "Defining the future of digital interfaces..."}"
        </p>
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
                    className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed shadow-sm
                    ${isUser
                        ? "bg-[var(--primary)] text-white"
                        : "bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)]"
                      }`}
                  >
                    {!isUser && (
                      <div className="flex items-center gap-1 mb-1 text-[10px] text-[var(--muted-foreground)] uppercase tracking-widest font-mono">
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
          <div className="flex items-center gap-2 text-[10px] text-[var(--muted-foreground)] font-mono animate-pulse">
            <Sparkles size={12} />
            Generating changes...
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