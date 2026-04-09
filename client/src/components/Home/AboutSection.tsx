
import { motion } from "framer-motion";
import { Brain, Cpu, Globe, Shield } from "lucide-react";

const stats = [
  { value: "1M+", label: "Apps Generated" },
  { value: "5s", label: "Time to First Build" },
  { value: "99.9%", label: "Deployment Success" },
  { value: "0 Code", label: "Required" },
];

const pillars = [
  {
    icon: Brain,
    title: "AI That Builds",
    desc: "Describe your idea in plain language — YantraAI turns it into a complete product with frontend, backend, and logic.",
  },
  {
    icon: Cpu,
    title: "Full-Stack Instantly",
    desc: "From UI to APIs to database — everything is generated and connected automatically in seconds.",
  },
  {
    icon: Globe,
    title: "Deploy Anywhere",
    desc: "Launch your app instantly with built-in hosting, custom domains, and global performance out of the box.",
  },
  {
    icon: Shield,
    title: "Production Ready",
    desc: "Clean code, scalable architecture, and secure defaults — built for real users, not just demos.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

const AboutSection = () => {
  return (
    <section className="relative py-32 px-4 md:px-12 overflow-hidden bg-[var(--background)]">
      {/* Dot grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage: `radial-gradient(var(--primary) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[var(--primary)]/5 blur-[140px] rounded-full pointer-events-none" />

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
            About the Platform
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
          Built for the{" "}
          <span className="italic text-[var(--primary)] drop-shadow-[0_0_30px_oklch(0.68_0.19_45_/_0.4)]">
            future
          </span>{" "}
          of work.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-center text-[var(--muted-foreground)] text-lg md:text-xl max-w-2xl mx-auto mb-20 leading-relaxed"
        >
          We're not just another automation tool. We're the operating system for
          the next generation of intelligent, adaptive software systems.
        </motion.p>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px border border-[var(--border)]/30 rounded-2xl overflow-hidden mb-20">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center py-10 px-6 bg-[var(--primary)]/[0.02] hover:bg-[var(--primary)]/[0.06] transition-colors border-r border-b border-[var(--border)]/20 last:border-r-0"
            >
              <span className="font-display text-4xl md:text-5xl font-bold text-[var(--primary)] tracking-tighter mb-1">
                {stat.value}
              </span>
              <span className="text-[11px] uppercase tracking-widest text-[var(--muted-foreground)] font-semibold">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Four pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {pillars.map((p, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="group relative rounded-2xl border border-[var(--border)]/30 bg-[var(--primary)]/[0.02] hover:bg-[var(--primary)]/[0.06] hover:border-[var(--primary)]/30 p-6 transition-all duration-300 overflow-hidden"
            >
              {/* Corner glow */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-[var(--primary)]/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center mb-4 border border-[var(--primary)]/20">
                  <p.icon size={18} className="text-[var(--primary)]" />
                </div>
                <h3 className="font-display text-lg font-semibold text-[var(--foreground)] mb-2 tracking-tight">
                  {p.title}
                </h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                  {p.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
