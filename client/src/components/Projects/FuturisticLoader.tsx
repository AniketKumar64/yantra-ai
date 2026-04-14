"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Zap, Monitor, Code2, Flame, Terminal, Cpu } from "lucide-react";

const BUILD_STEPS = [
  "> initializing_thermal_core...",
  "> authenticating_neural_link...",
  "> compiling_ember_engine...",
  "> weaving_interface_mesh...",
  "> stabilizing_liquid_layout...",
  "> optimizing_payload_density...",
  "> deploying_to_sector_7...",
  "> system_online ✓",
];

const CHECKLIST = [
  { id: "seo", label: "Global_indexing", icon: Zap, threshold: 25 },
  { id: "resp", label: "Fluid_geometry", icon: Monitor, threshold: 50 },
  { id: "code", label: "Clean_syntax_tree", icon: Code2, threshold: 75 },
];

export default function EmberLoader() {
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [cursor, setCursor] = useState(true);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const t1 = setInterval(() => {
      setStepIndex((i) => (i < BUILD_STEPS.length - 1 ? i + 1 : i));
      setCursor((c) => !c);
    }, 1200);

    const t2 = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(p + Math.random() * 2 + 0.5, 98);
        return next;
      });
    }, 450);

    return () => {
      clearInterval(t1);
      clearInterval(t2);
    };
  }, []);

  useEffect(() => {
    const next: Record<string, boolean> = {};
    CHECKLIST.forEach(({ id, threshold }) => {
      if (progress > threshold) next[id] = true;
    });
    setChecked(next);
  }, [progress]);

  const statusText = BUILD_STEPS[stepIndex] + (cursor ? "_" : " ");

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background text-foreground transition-colors duration-700">
      {/* Background Decorative Layer */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none dark:opacity-[0.07]" 
           style={{ backgroundImage: `radial-gradient(var(--primary) 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />

      <div className="relative z-10 w-full max-w-4xl px-8 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        
        {/* LEFT: The "Construction" Visual (5 cols) */}
        <motion.div 
          className="md:col-span-5 space-y-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="relative rounded-2xl border border-border bg-card p-6 shadow-sm overflow-hidden">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-destructive/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-muted" />
                <div className="w-2.5 h-2.5 rounded-full bg-primary/20" />
              </div>
              <div className="px-2 py-0.5 rounded border border-border bg-secondary text-[10px] font-mono text-muted-foreground">
                v2.0.4-stable
              </div>
            </div>

            {/* Skeleton Content */}
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4 bg-primary/10" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
                <Skeleton className="h-3 w-4/6" />
              </div>
              <div className="pt-4 grid grid-cols-3 gap-3">
                <Skeleton className="h-16 rounded-xl" />
                <Skeleton className="h-16 rounded-xl bg-secondary" />
                <Skeleton className="h-16 rounded-xl bg-primary/5" />
              </div>
            </div>

            {/* Heat Map Overlay (Dark Mode Only) */}
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full pointer-events-none hidden dark:block" />
          </div>
        </motion.div>

        {/* RIGHT: The "Control" Center (7 cols) */}
        <div className="md:col-span-7 space-y-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Flame size={20} className={progress < 100 ? "animate-pulse" : ""} />
              </div>
              <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-muted-foreground">
                Core System Build
              </h2>
            </div>
            <h1 className="text-4xl font-light tracking-tight italic">
              Forging <span className="text-primary font-medium">Digital</span> Assets
            </h1>
          </div>

          {/* Terminal Box */}
          <div className="rounded-xl border border-border bg-secondary/50 p-4 font-mono text-[11px] leading-relaxed shadow-inner">
            <div className="text-primary mb-1">system@ember:~$ status_report</div>
            <div className="text-foreground/70 min-h-[1.5rem]">{statusText}</div>
          </div>

          {/* Progress Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Efficiency Rate</p>
                <p className="text-2xl font-mono">{Math.round(progress)}%</p>
              </div>
              <div className="flex gap-2 mb-1">
                {CHECKLIST.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={false}
                    animate={{ 
                      scale: checked[item.id] ? 1 : 0.8,
                      opacity: checked[item.id] ? 1 : 0.3 
                    }}
                    className={`p-1.5 rounded-md border ${checked[item.id] ? 'border-primary/50 bg-primary/10 text-primary' : 'border-border bg-transparent text-muted-foreground'}`}
                  >
                    <item.icon size={14} />
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Custom Bar */}
            <div className="relative h-1.5 w-full bg-secondary rounded-full overflow-hidden border border-border">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-primary shadow-[0_0_15px_var(--primary)]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", bounce: 0, duration: 0.6 }}
              />
            </div>
          </div>

          {/* Footer Metrics */}
          <div className="grid grid-cols-3 gap-6 pt-4 border-t border-border">
            {[
              { label: "Stability", val: "High", icon: ShieldCheck },
              { label: "Latency", val: "12ms", icon: Cpu },
              { label: "Node", val: "Ember-01", icon: Terminal }
            ].map((stat, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <stat.icon size={10} />
                  <span className="text-[9px] uppercase font-bold tracking-tighter">{stat.label}</span>
                </div>
                <p className="text-sm font-medium">{stat.val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-md bg-muted/20 ${className}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent"
        animate={{ x: ["-100%", "100%"] }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
      />
    </div>
  );
}

function ShieldCheck({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}