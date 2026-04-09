import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "Do I need to write code to build an app?",
    a: "No. Just describe what you want, and YantraAI builds your app for you — frontend, backend, and logic included. You can edit code if you want, but it’s never required.",
  },
  {
    q: "What can I build with YantraAI?",
    a: "Anything from landing pages to full SaaS products. Dashboards, e-commerce stores, portfolios, admin panels — if you can describe it, you can build it.",
  },
  {
    q: "How fast can I launch my app?",
    a: "In seconds. Your app is generated instantly and can be deployed with one click — no setup, no configuration needed.",
  },
  {
    q: "Can I edit or customize what AI builds?",
    a: "Yes. You can modify your app using simple prompts or directly edit the UI and code. You’re always in full control.",
  },
  {
    q: "Is the generated app production-ready?",
    a: "Yes. YantraAI creates scalable, clean, and structured code — ready for real users, not just demos.",
  },
  {
    q: "Can I connect APIs, databases, or payments?",
    a: "Absolutely. You can integrate APIs, databases, authentication, and payments like Stripe — all within your generated app.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes. You can start building for free with no credit card required. Upgrade only when you’re ready to scale.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

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

  {/* Ambient glow */}
  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[var(--primary)]/5 blur-[130px] rounded-full pointer-events-none" />

  <div className="relative z-10 max-w-[900px] mx-auto">
    
    {/* Badge */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="flex justify-center mb-6"
    >
      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/5 text-[11px] font-bold tracking-[0.25em] text-[var(--primary)] uppercase">
        Everything You Need
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
      Before{" "}
      <span className="italic text-[var(--primary)] drop-shadow-[0_0_30px_oklch(0.68_0.19_45_/_0.4)]">
        you build.
      </span>
    </motion.h2>

    {/* Subheading */}
    <motion.p
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="text-center text-[var(--muted-foreground)] text-lg md:text-xl max-w-xl mx-auto mb-16 leading-relaxed"
    >
      Everything you need to know before you launch your first product.
    </motion.p>

    {/* FAQ Accordion */}
    <div className="flex flex-col gap-3">
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.45 }}
            className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
              isOpen
                ? "border-[var(--primary)]/40 bg-[var(--primary)]/[0.04] shadow-[0_0_30px_-10px_oklch(0.68_0.19_45_/_0.12)]"
                : "border-[var(--border)]/30 bg-[var(--primary)]/[0.01] hover:border-[var(--border)]/50"
            }`}
          >
            {/* Question */}
            <button
              onClick={() => toggle(i)}
              className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left group"
            >
              <span
                className={`font-body  md:text-lg font-semibold  transition-colors duration-200 ${
                  isOpen
                    ? "text-[var(--primary)]"
                    : "text-[var(--foreground)] group-hover:text-[var(--primary)]"
                }`}
              >
                {faq.q}
              </span>

              <span
                className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-300 ${
                  isOpen
                    ? "bg-[var(--primary)] border-[var(--primary)] text-black"
                    : "border-[var(--border)]/40 text-[var(--muted-foreground)] group-hover:border-[var(--primary)]/40 group-hover:text-[var(--primary)]"
                }`}
              >
                {isOpen ? (
                  <Minus size={14} strokeWidth={2.5} />
                ) : (
                  <Plus size={14} strokeWidth={2.5} />
                )}
              </span>
            </button>

            {/* Answer */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="answer"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <div className="px-6 pb-6">
                    <div className="h-px w-full bg-[var(--primary)]/10 mb-4" />
                    <p className="text-[var(--muted-foreground)] text-sm md:text-base leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>

    {/* Bottom Note */}
    <motion.p
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="text-center text-sm text-[var(--muted-foreground)] mt-12"
    >
      Still unsure?{" "}
      <a
        href="#"
        className="text-[var(--primary)] hover:underline underline-offset-4 transition"
      >
        Let’s build something together →
      </a>
    </motion.p>
  </div>
</section>
  );
};

export default FAQSection;
