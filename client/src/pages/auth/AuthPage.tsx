import { useParams } from "react-router-dom";
import { AuthView } from "@daveyplate/better-auth-ui";
import { Layers, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../../Context/ThemeContext";

export default function AuthPage() {
  const { pathname } = useParams();
  const { isDark } = useTheme();

  return (
    <main className="relative min-h-screen flex overflow-hidden bg-background">

      {/* ================= LEFT PANEL ================= */}
   <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 border-r border-border/60 overflow-hidden">

  {/* Background Glow */}
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] bg-emerald-500/10 blur-[140px] rounded-full" />
    <div className="absolute bottom-[-20%] right-[-20%] w-[70%] h-[70%] bg-sky-500/10 blur-[140px] rounded-full" />
  </div>

  {/* Top Branding */}
  <div className="relative z-10 flex items-center gap-2 text-sm text-muted-foreground">
   </div>

  {/* Center Content */}
  <div className="relative z-10 max-w-md space-y-6">

    {/* Badge */}
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/50 bg-background/40 backdrop-blur text-xs text-muted-foreground">
      <Sparkles size={14} className="text-primary" />
      AI-first Development Platform
    </div>

    {/* Heading */}
    <motion.h1
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="font-display text-5xl leading-tight"
    >
      Build{" "}
      <span className= " bg-[var(--primary)]  bg-clip-text text-transparent">
        smarter
      </span>{" "}
      apps with AI
    </motion.h1>

    {/* Subtext */}
    <p className="text-muted-foreground text-base leading-relaxed">
      Design, develop, and deploy full-stack applications faster than ever.
      YantraAI gives you intelligent automation, modern UI, and scalable workflows —
      all in one seamless experience.
    </p>

    {/* Feature Points */}
    <div className="space-y-3 pt-2">
      {[
        "AI-powered code generation",
        "Instant deployment workflows",
        "Beautiful UI out of the box",
      ].map((text, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.2 }}
          className="flex items-center gap-3 text-sm text-foreground/80"
        >
          <div className="p-1.5 rounded-md bg-primary/10">
            <Sparkles size={14} className="text-primary" />
          </div>
          {text}
        </motion.div>
      ))}
    </div>
  </div>

  {/* Bottom Note */}
  <div className="relative z-10 text-xs text-muted-foreground opacity-70 flex justify-between items-center">
    <span>© {new Date().getFullYear()} YantraAI</span>
    <span className="italic">Crafted for builders</span>
  </div>
</div>
      {/* ================= RIGHT PANEL ================= */}
      <div className="flex-1 flex items-center justify-center px-6 relative">

        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[20%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
        </div>

        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 90, damping: 20 }}
          className="relative w-full max-w-[420px]"
        >
          <div className="bg-card/70 backdrop-blur-2xl border border-border/70 rounded-xl md:rounded-[2.5rem] shadow-xl pt-2 md:p-10">

            {/* Header */}
            <div className="flex flex-col items-center mb-8">
              <h2 className="font-display text-3xl text-foreground">
                Welcome back
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Continue to YantraAI
              </p>
            </div>

            {/* Auth */}
            <AuthView
              pathname={pathname}
              classNames={{
                base: "bg-transparent shadow-none border-none",
                header: "hidden",
                content: "grid gap-4",
                footer:
                  "text-xs text-muted-foreground mt-6 text-center",
              }}
            />
          </div>

          {/* Security Footer */}
          <div className="flex items-center justify-center gap-2 mt-6 opacity-60">
            <ShieldCheck size={14} className="text-primary" />
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-bold">
              End-to-End Secured
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}