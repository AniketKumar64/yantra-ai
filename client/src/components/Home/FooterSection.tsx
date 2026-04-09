import { motion } from "framer-motion";
import { Zap, Mail, ArrowRight, Layers } from "lucide-react";

// Inline SVG for brand icons removed from lucide-react v1.x
const LinkedinIcon = ({ size = 14, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const XIcon = ({ size = 14, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.261 5.636zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const navLinks = [
  {
    heading: "Product",
    links: ["Features", "Workflow Engine", "Integrations", "Security", "Changelog"],
  },
  {
    heading: "Company",
    links: ["About", "Blog", "Careers", "Press", "Contact"],
  },
  {
    heading: "Developers",
    links: ["Documentation", "API Reference", "SDK", "Open Source", "Status"],
  },
  {
    heading: "Legal",
    links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR", "SLA"],
  },
];

const socials = [
 
  { icon: XIcon, label: "X (Twitter)", href: "#" },
  { icon: LinkedinIcon, label: "LinkedIn", href: "#" },
  { icon: Mail, label: "Email", href: "#" },
];

const FooterSection = () => {
  return (
    <footer className="relative overflow-hidden bg-[var(--background)] border-t border-[var(--border)]/20">
      {/* Dot grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025] z-0"
        style={{
          backgroundImage: `radial-gradient(var(--primary) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Top ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-[var(--primary)]/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 md:px-12">

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl border border-[var(--primary)]/20 bg-[var(--primary)]/[0.04] overflow-hidden px-8 md:px-16 py-14 my-20 text-center"
        >
          {/* Inner glow */}
          <div className="absolute inset-0 bg-[conic-gradient(from_180deg_at_50%_0%,oklch(0.68_0.19_45_/_0.08),transparent_50%)] pointer-events-none" />

          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/5 text-[11px] font-bold tracking-[0.25em] text-[var(--primary)] uppercase mb-6"
          >
            <Zap size={12} className="text-[var(--primary)]" />
            Start Free Today
          </motion.span>

          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl tracking-tighter leading-[0.9] text-[var(--foreground)] mb-6">
            Ready to automate the{" "}
            <span className="italic text-[var(--primary)] drop-shadow-[0_0_30px_oklch(0.68_0.19_45_/_0.4)]">
              impossible?
            </span>
          </h2>

          <p className="text-[var(--muted-foreground)] text-lg max-w-lg mx-auto mb-10 leading-relaxed">
            Join 50,000+ engineers who ship automations in minutes, not months.
            No credit card. No DevOps degree required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="relative overflow-hidden group flex items-center gap-2.5 bg-[var(--primary)]/95 text-white px-8 py-4 rounded-2xl font-bold text-sm hover:scale-[1.04] active:scale-95 transition-all shadow-[0_0_30px_oklch(0.68_0.19_45_/_0.3)]">
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition duration-700" />
              <span className="relative z-10 flex items-center gap-2">
                Get Started Free
                <ArrowRight size={16} strokeWidth={2.5} />
              </span>
            </button>
            <button className="flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-sm border border-[var(--border)]/40 text-[var(--foreground)] hover:border-[var(--primary)]/40 hover:bg-[var(--primary)]/5 transition-all">
              View Documentation
            </button>
          </div>
        </motion.div>

        {/* Main footer grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 pb-14 border-b border-[var(--border)]/20">
          {/* Brand column */}
          <div className="col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-4"
            >
              <div className="inline-flex items-center gap-2.5 mb-5">
                <div className="w-7 h-7 rounded-lg bg-[var(--primary)] flex items-center justify-center">
                  <Layers size={14} className="text-black" strokeWidth={3} />
                </div>
                <span className="font-display text-lg font-bold tracking-tighter text-[var(--foreground)]">
                  Yantra<span className="text-[var(--primary)]">Ai.</span>
                </span>
              </div>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed max-w-[220px]">
                The neural automation platform for the next generation of engineers.
              </p>
            </motion.div>

            {/* Socials */}
            <div className="flex gap-2 mt-6">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg border border-[var(--border)]/30 bg-[var(--primary)]/5 hover:bg-[var(--primary)]/15 hover:border-[var(--primary)]/40 flex items-center justify-center transition-all"
                >
                  <s.icon size={14} className="text-[var(--muted-foreground)] hover:text-[var(--primary)]" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {navLinks.map((col, i) => (
            <motion.div
              key={col.heading}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--muted-foreground)]/60 mb-4">
                {col.heading}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-8 text-[11px] text-[var(--muted-foreground)]/50 font-medium tracking-wide">
          <span>© {new Date().getFullYear()} Builder Inc. All rights reserved.</span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
            <span className="text-[var(--primary)] font-bold tracking-[0.15em] uppercase text-[10px]">
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
