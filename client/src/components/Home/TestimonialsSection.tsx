import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Aria Chen",
    role: "CTO @ NovaSpark",
    avatar: "AC",
    rating: 5,
    quote:
      "We replaced an entire team's worth of glue-code with a single workflow. What used to take 3 engineers and 2 weeks now takes one prompt and 4 minutes. Genuinely insane.",
  },
  {
    name: "Marcus Webb",
    role: "Lead Engineer @ Fluxion",
    avatar: "MW",
    rating: 5,
    quote:
      "The edge deployment story is unreal. Our latency went from 800ms to sub-100ms overnight. The AI actually understood our architecture from the description alone.",
  },
  {
    name: "Priya Nataraj",
    role: "Founder @ DataPulse",
    avatar: "PN",
    rating: 5,
    quote:
      "I've tried every automation tool on the market. This is the first one where I felt like the tool was working *with* me, not against me. The prompt-to-workflow translation is uncanny.",
  },
  {
    name: "Leo Strauss",
    role: "DevOps Architect @ Helios",
    avatar: "LS",
    rating: 5,
    quote:
      "Security was our biggest concern. Zero-trust by default, SOC 2 certified, and granular credential scoping out of the box. Decision was easy once we saw the compliance docs.",
  },
  {
    name: "Sofia Ito",
    role: "Product Lead @ Tessera",
    avatar: "SI",
    rating: 5,
    quote:
      "Our non-technical PMs are now shipping automations themselves. The natural language interface isn't a gimmick — it genuinely bridges the gap between idea and implementation.",
  },
];

const TestimonialsSection = () => {
  const [active, setActive] = useState(0);

  const prev = () => setActive((a) => (a - 1 + testimonials.length) % testimonials.length);
  const next = () => setActive((a) => (a + 1) % testimonials.length);

  const visible = [
    testimonials[(active - 1 + testimonials.length) % testimonials.length],
    testimonials[active],
    testimonials[(active + 1) % testimonials.length],
  ];

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
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[var(--primary)]/5 blur-[150px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2" />

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
            Testimonials
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
          Trusted by{" "}
          <span className="italic text-[var(--primary)] drop-shadow-[0_0_30px_oklch(0.68_0.19_45_/_0.4)]">
            builders.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-center text-[var(--muted-foreground)] text-lg md:text-xl max-w-2xl mx-auto mb-20 leading-relaxed"
        >
          From solo founders to enterprise engineering teams — here's what they say.
        </motion.p>

        {/* Carousel */}
        <div className="relative flex items-center justify-center gap-4 md:gap-6">
          {/* Prev button */}
          <button
            onClick={prev}
            className="flex-shrink-0 w-10 h-10 rounded-full border border-[var(--border)]/40 bg-[var(--primary)]/5 hover:bg-[var(--primary)]/15 hover:border-[var(--primary)]/40 flex items-center justify-center transition-all"
          >
            <ChevronLeft size={18} className="text-[var(--foreground)]" />
          </button>

          {/* Cards */}
          <div className="flex gap-4 md:gap-6 w-full max-w-5xl overflow-hidden">
            <AnimatePresence mode="popLayout">
              {visible.map((t, idx) => {
                const isCenter = idx === 1;
                return (
                  <motion.div
                    key={t.name}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{
                      opacity: isCenter ? 1 : 0.4,
                      scale: isCenter ? 1 : 0.93,
                    }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className={`flex-1 min-w-0 rounded-2xl border p-6 md:p-8 flex flex-col gap-5 transition-all duration-300 ${
                      isCenter
                        ? "border-[var(--primary)]/30 bg-[var(--primary)]/[0.05] shadow-[0_0_60px_-20px_oklch(0.68_0.19_45_/_0.25)]"
                        : "border-[var(--border)]/20 bg-[var(--primary)]/[0.01] hidden md:flex"
                    }`}
                  >
                    {/* Quote icon */}
                    <Quote size={24} className="text-[var(--primary)]/40" />

                    {/* Stars */}
                    <div className="flex gap-1">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className="text-[var(--primary)] fill-[var(--primary)]"
                        />
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="text-[var(--foreground)]/80 text-sm md:text-base leading-relaxed flex-1 italic">
                      "{t.quote}"
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-3 pt-2 border-t border-[var(--border)]/20">
                      <div className="w-9 h-9 rounded-full bg-[var(--primary)]/20 border border-[var(--primary)]/30 flex items-center justify-center text-[var(--primary)] font-display text-xs font-bold">
                        {t.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--foreground)]">
                          {t.name}
                        </p>
                        <p className="text-[11px] text-[var(--muted-foreground)]">
                          {t.role}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Next button */}
          <button
            onClick={next}
            className="flex-shrink-0 w-10 h-10 rounded-full border border-[var(--border)]/40 bg-[var(--primary)]/5 hover:bg-[var(--primary)]/15 hover:border-[var(--primary)]/40 flex items-center justify-center transition-all"
          >
            <ChevronRight size={18} className="text-[var(--foreground)]" />
          </button>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active
                  ? "w-6 bg-[var(--primary)]"
                  : "w-1.5 bg-[var(--border)]/40 hover:bg-[var(--border)]"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
