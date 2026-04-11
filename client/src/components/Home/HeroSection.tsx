
import { motion } from "framer-motion";
import { Plus, Zap, BotMessageSquare } from "lucide-react";



const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-20 px-4 md:px-12 overflow-hidden ">
      

      {/* Main Container - Adjusted for wider text flow */}
      <div className="relative z-10 max-w-[1300px] w-full text-center flex flex-col items-center">
        
        {/* Top Conversational Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/5 mb-10"
        >
          <BotMessageSquare size={16} className="text-[var(--primary)]" />
          <span className="text-[11px] font-bold tracking-[0.25em] text-[var(--primary)] uppercase">
            Initialize Neural Protocol
          </span>
        </motion.div>

        {/* --- Conversational Supersized Title --- */}
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 1 }}
          className="font-display text-[60px] md:text-[100px] lg:text-[130px] xl:text-[160px] leading-[0.95] tracking-tight text-[var(--foreground)] mb-10 max-w-[1200px]"
        >
          What can we
          <span className="italic text-[var(--primary)] drop-shadow-[0_0_35px_oklch(0.68_0.19_45_/_0.5)]">
            Automate
          </span>
          <br />
          <span className="font-semibold text-[var(--foreground)]">for you today?</span>
        </motion.h1>

        {/* --- The "Big Texting" Input Field --- */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.4 }}
  className="max-w-3xl w-full mb-12"
>
  {/* Container */}
  <div className="rounded-2xl border-2 border-border/60 
    bg-background/60 backdrop-blur-md 
    px-4 py-4 transition-all focus-within:border-primary"
  >
    {/* Top Row */}
    <div className="flex items-start gap-3">
      
      {/* Icon */}
      <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 mt-1">
        <Plus size={18} className="text-primary" />
      </div>

      {/* Textarea */}
      <textarea
        rows={3}
        placeholder="Build me a SaaS with auth, payments, dashboard, and modern UI..."
        className="w-full bg-transparent outline-none border-none resize-none
        text-foreground placeholder:text-muted-foreground/50 
        text-base md:text-lg leading-relaxed"
      />
    </div>

    {/* Bottom Row (actions) */}
    <div className="flex items-center justify-between mt-4 pl-12">
      
      {/* Status */}
      <span className="text-xs text-primary font-medium">
        AI Active • Ready to Build
      </span>

      {/* CTA */}
      <button className="px-5 py-2 rounded-xl bg-primary/80 text-white 
        text-sm font-semibold hover:scale-105 active:scale-95 transition-all">
        Build Now
      </button>
    </div>
  </div>

  {/* Suggestions */}
  <div className="flex flex-wrap gap-2 mt-4 px-1">
    {[
      "SaaS dashboard + Stripe",
      "Startup landing page",
      "E-commerce store",
    ].map((s, i) => (
      <span
        key={i}
        className="text-xs px-3 py-1 rounded-full border border-border/50 
        hover:bg-white/5 cursor-pointer transition"
      >
        {s}
      </span>
    ))}
  </div>
</motion.div>
        {/* Feature Highlights (Small conversational hints) */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex gap-x-12 gap-y-4 flex-wrap justify-center text-[var(--muted-foreground)]/80 text-sm font-medium"
        >
            <div className="flex items-center gap-2"><Zap size={14} className="text-[var(--primary)]"/> No Code Deploy</div>
            <div className="flex items-center gap-2"><Zap size={14} className="text-[var(--primary)]"/> API Generation</div>
            <div className="flex items-center gap-2"><Zap size={14} className="text-[var(--primary)]"/> Data Scaling</div>
        </motion.div>

      </div>

    </section>
  );
};

export default HeroSection;