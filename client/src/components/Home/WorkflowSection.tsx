import { motion } from "framer-motion";
import { MessageSquare, Cpu, Rocket, Zap } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Describe your idea",
    desc: "Tell YantraAI what you want to build — a SaaS, landing page, or full product. No coding, no setup, just plain language.",
    tag: "Prompt Input",
  },
  {
    number: "02",
    icon: Cpu,
    title: "AI builds your app",
    desc: "We generate everything — UI, backend, APIs, and database — fully connected and ready to use.",
    tag: "Full-Stack Generation",
  },
  {
    number: "03",
    icon: Zap,
    title: "Edit & customize",
    desc: "Refine your app with simple prompts or visual editing. Change design, features, or logic instantly.",
    tag: "Live Editing",
  },
  {
    number: "04",
    icon: Rocket,
    title: "Launch instantly",
    desc: "Deploy your product in one click. Your app is live, scalable, and ready for real users.",
    tag: "Instant Deploy",
  },
];
const WorkflowSection = () => {
  return (
    <section className="relative py-32 px-4 md:px-12 overflow-hidden ">
      {/* Dot grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage: `radial-gradient(var(--primary) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 max-w-[1200px] mx-auto">
        {/* Section badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/5 text-[11px] font-bold tracking-[0.25em] text-[var(--primary)] uppercase">
            How it Works
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-center font-display text-5xl md:text-7xl lg:text-8xl tracking-tighter leading-[0.9] text-[var(--foreground)] mb-6"
        >
          From{" "}
          <span className="italic text-[var(--primary)] drop-shadow-[0_0_30px_oklch(0.68_0.19_45_/_0.4)]">
            prompt
          </span>{" "}
          to production.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-center text-[var(--muted-foreground)] text-lg md:text-xl max-w-2xl mx-auto mb-24 leading-relaxed"
        >
          Four steps. Minutes, not months. No DevOps degree required.
        </motion.p>

        {/* Steps */}
        <div className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-[52px] left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-[var(--primary)]/30 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
                className="group relative flex flex-col"
              >
                {/* Step number + icon node */}
                <div className="relative flex items-center gap-4 mb-6">
                  <div className="relative flex items-center justify-center w-[52px] h-[52px] rounded-full border border-[var(--primary)]/40 bg-[var(--background)] z-10 group-hover:border-[var(--primary)] transition-colors duration-300">
                    {/* Pulse */}
                    <span className="absolute inset-0 rounded-full border border-[var(--primary)]/20 animate-ping opacity-30 group-hover:opacity-60" />
                    <step.icon size={20} className="text-[var(--primary)]" />
                  </div>
                  <span className="font-display text-xs font-bold tracking-[0.25em] text-[var(--muted-foreground)]/50 uppercase">
                    Step {step.number}
                  </span>
                </div>

                {/* Card */}
                <div className="flex-1 rounded-2xl border border-[var(--border)]/30 bg-[var(--primary)]/[0.02] hover:bg-[var(--primary)]/[0.05] hover:border-[var(--primary)]/25 p-6 transition-all duration-300 overflow-hidden relative">
                  {/* Inner glow */}
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[var(--primary)]/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <span className="inline-block text-[9px] font-bold tracking-[0.2em] uppercase text-[var(--primary)] bg-[var(--primary)]/10 px-2.5 py-1 rounded-full mb-3">
                    {step.tag}
                  </span>

                  <h3 className="font-display text-xl font-semibold text-[var(--foreground)] mb-3 tracking-tight leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-16 flex justify-center"
        >
          <div className="inline-flex items-center gap-6 px-8 py-4 rounded-2xl border border-[var(--primary)]/20 bg-[var(--primary)]/5">
            <span className="text-sm text-[var(--muted-foreground)]">
              Average setup time:
            </span>
            <span className="font-display text-2xl font-bold text-[var(--primary)] tracking-tighter">
              &lt; 3 minutes
            </span>
            <Rocket size={18} className="text-[var(--primary)]" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WorkflowSection;
