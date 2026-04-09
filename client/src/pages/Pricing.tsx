import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Zap, ArrowRight, Sparkles, Building2, Rocket } from "lucide-react";

/* ─── Data ─────────────────────────────────────────── */

const plans = [
  {
    id: "starter",
    icon: Rocket,
    name: "Starter",
    tagline: "For individuals & side projects",
    monthlyPrice: 0,
    yearlyPrice: 0,
    cta: "Start for free",
    ctaVariant: "outline" as const,
    badge: null,
    features: [
      "3 app generations / month",
      "1 active project",
      "Community templates",
      "Basic AI edits",
      "Subdomain hosting",
      "Community support",
    ],
    missing: [
      "Custom domains",
      "Priority AI model",
      "Team collaboration",
      "CI/CD integration",
      "SLA guarantee",
    ],
  },
  {
    id: "pro",
    icon: Zap,
    name: "Pro",
    tagline: "For builders shipping products",
    monthlyPrice: 29,
    yearlyPrice: 19,
    cta: "Start building",
    ctaVariant: "primary" as const,
    badge: "Most Popular",
    features: [
      "Unlimited app generations",
      "10 active projects",
      "All templates + AI layouts",
      "Advanced AI edits & refactors",
      "Custom domains (3 included)",
      "1-click deploy + CI/CD",
      "Priority AI model (Gemini Pro)",
      "Email support",
    ],
    missing: [
      "Team collaboration",
      "SLA guarantee",
    ],
  },
  {
    id: "teams",
    icon: Building2,
    name: "Teams",
    tagline: "For startups & growing companies",
    monthlyPrice: 79,
    yearlyPrice: 59,
    cta: "Talk to sales",
    ctaVariant: "outline" as const,
    badge: "Best Value",
    features: [
      "Everything in Pro",
      "Unlimited active projects",
      "Team collaboration (up to 20)",
      "Custom domains (unlimited)",
      "SSO / SAML auth",
      "Priority support + SLA",
      "Advanced analytics",
      "White-label option",
      "Dedicated AI compute",
      "Enterprise security",
    ],
    missing: [],
  },
];

const comparisonRows = [
  { label: "App generations / month", starter: "3", pro: "Unlimited", teams: "Unlimited" },
  { label: "Active projects", starter: "1", pro: "10", teams: "Unlimited" },
  { label: "Custom domains", starter: "—", pro: "3", teams: "Unlimited" },
  { label: "AI model tier", starter: "Standard", pro: "Pro (Gemini)", teams: "Dedicated" },
  { label: "Team members", starter: "1", pro: "1", teams: "Up to 20" },
  { label: "CI/CD deploy", starter: false, pro: true, teams: true },
  { label: "SSO / SAML", starter: false, pro: false, teams: true },
  { label: "White-label", starter: false, pro: false, teams: true },
  { label: "SLA guarantee", starter: false, pro: false, teams: true },
  { label: "Priority support", starter: false, pro: true, teams: true },
];

const faqs = [
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel anytime from your account settings — no questions, no fees. Your projects remain accessible until the end of your billing period.",
  },
  {
    q: "What counts as an 'app generation'?",
    a: "Each time you prompt YantraAI to build a new app from scratch counts as one generation. Editing, refining, and redeploying an existing app does not count.",
  },
  {
    q: "Do you offer a student or non-profit discount?",
    a: "Yes! We offer 50% off for verified students and registered non-profits. Reach out to our team for the discount code.",
  },
  {
    q: "Is the generated code mine?",
    a: "100%. All code generated belongs entirely to you. You can download, modify, and deploy it anywhere — no lock-in.",
  },
];

/* ─── Sub-components ────────────────────────────────── */

function FeatureRow({ text, included }: { text: string; included: boolean }) {
  return (
    <li className="flex items-center gap-3 text-sm">
      {included ? (
        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[var(--primary)]/15 flex items-center justify-center">
          <Check size={11} className="text-[var(--primary)]" strokeWidth={3} />
        </span>
      ) : (
        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[var(--border)]/20 flex items-center justify-center">
          <span className="w-2 h-px bg-[var(--muted-foreground)]/30 block" />
        </span>
      )}
      <span className={included ? "text-[var(--foreground)]/80" : "text-[var(--muted-foreground)]/40 line-through"}>
        {text}
      </span>
    </li>
  );
}

function ComparisonCell({ value }: { value: string | boolean }) {
  if (typeof value === "boolean") {
    return value ? (
      <td className="text-center py-3.5 px-4">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[var(--primary)]/15">
          <Check size={12} className="text-[var(--primary)]" strokeWidth={3} />
        </span>
      </td>
    ) : (
      <td className="text-center py-3.5 px-4">
        <span className="inline-block w-4 h-px bg-[var(--muted-foreground)]/25" />
      </td>
    );
  }
  return (
    <td className="text-center py-3.5 px-4 text-sm text-[var(--foreground)]/70 font-medium">
      {value}
    </td>
  );
}

/* ─── Main Page ─────────────────────────────────────── */

const Pricing = () => {
  const [yearly, setYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="relative min-h-screen bg-[var(--background)] text-[var(--foreground)] overflow-x-hidden">

      {/* ── Ambient background ── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[var(--primary)]/8 blur-[140px] rounded-full" />
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-[var(--primary)]/4 blur-[100px] rounded-full" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `radial-gradient(var(--primary) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 md:px-10">

        {/* ── Hero ── */}
        <section className="pt-28 pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/5 text-[11px] font-bold tracking-[0.25em] text-[var(--primary)] uppercase mb-8"
          >
            <Sparkles size={11} />
            Simple, Transparent Pricing
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl tracking-tighter leading-[0.9] mb-6"
          >
            Pay for what you{" "}
            <span className="italic text-[var(--primary)] drop-shadow-[0_0_35px_oklch(0.68_0.19_45_/_0.4)]">
              build.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-[var(--muted-foreground)] text-lg md:text-xl max-w-lg mx-auto mb-12 leading-relaxed"
          >
            Start free. Scale when you're ready. No hidden fees, no lock-in — ever.
          </motion.p>

          {/* ── Toggle ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-3 p-1.5 rounded-full border border-[var(--border)]/40 bg-[var(--primary)]/5 backdrop-blur"
          >
            <button
              onClick={() => setYearly(false)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                !yearly
                  ? "bg-[var(--primary)] text-black shadow-[0_2px_20px_oklch(0.68_0.19_45_/_0.3)]"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                yearly
                  ? "bg-[var(--primary)] text-black shadow-[0_2px_20px_oklch(0.68_0.19_45_/_0.3)]"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              Yearly
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                −35%
              </span>
            </button>
          </motion.div>
        </section>

        {/* ── Pricing Cards ── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-28">
          {plans.map((plan, i) => {
            const Icon = plan.icon;
            const price = yearly ? plan.yearlyPrice : plan.monthlyPrice;
            const isPro = plan.id === "pro";

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.4, duration: 0.6 }}
                className={`relative rounded-3xl flex flex-col overflow-hidden transition-all duration-300
                  ${isPro
                    ? "border-2 border-[var(--primary)]/50 bg-[var(--primary)]/[0.05] shadow-[0_0_60px_-10px_oklch(0.68_0.19_45_/_0.25)]"
                    : "border border-[var(--border)]/30 bg-[var(--primary)]/[0.02] hover:border-[var(--border)]/50"
                  }`}
              >
                {/* Popular badge */}
                {plan.badge && (
                  <div className={`absolute top-4 right-4 text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-full
                    ${isPro
                      ? "bg-[var(--primary)] text-black"
                      : "border border-[var(--primary)]/40 text-[var(--primary)] bg-[var(--primary)]/10"
                    }`}
                  >
                    {plan.badge}
                  </div>
                )}

                {/* Card header */}
                <div className={`px-7 pt-8 pb-6 ${isPro ? "border-b border-[var(--primary)]/20" : "border-b border-[var(--border)]/20"}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isPro ? "bg-[var(--primary)]" : "bg-[var(--primary)]/10"}`}>
                      <Icon size={16} className={isPro ? "text-black" : "text-[var(--primary)]"} strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="font-display text-lg font-bold">{plan.name}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">{plan.tagline}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-end gap-1 mt-5 mb-1">
                    <span className="font-display text-5xl md:text-6xl tracking-tighter leading-none">
                      {price === 0 ? "Free" : `$${price}`}
                    </span>
                    {price > 0 && (
                      <span className="text-[var(--muted-foreground)] text-sm mb-2">
                        / mo{yearly ? " (billed yearly)" : ""}
                      </span>
                    )}
                  </div>
                  {yearly && price > 0 && (
                    <p className="text-xs text-emerald-400/80 mt-1">
                      Save ${(plan.monthlyPrice - plan.yearlyPrice) * 12}/yr
                    </p>
                  )}

                  {/* CTA */}
                  <button
                    className={`mt-6 w-full relative overflow-hidden group flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl font-semibold text-sm transition-all
                      ${isPro
                        ? "bg-[var(--primary)] text-black hover:scale-[1.02] shadow-[0_0_30px_oklch(0.68_0.19_45_/_0.25)] active:scale-95"
                        : "border border-[var(--border)]/40 text-[var(--foreground)] hover:border-[var(--primary)]/40 hover:bg-[var(--primary)]/5 active:scale-95"
                      }`}
                  >
                    {isPro && (
                      <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition duration-700" />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      {plan.cta}
                      <ArrowRight size={14} strokeWidth={2.5} />
                    </span>
                  </button>
                </div>

                {/* Features */}
                <div className="px-7 py-6 flex-1">
                  <ul className="flex flex-col gap-3">
                    {plan.features.map((f) => (
                      <FeatureRow key={f} text={f} included={true} />
                    ))}
                    {plan.missing.map((f) => (
                      <FeatureRow key={f} text={f} included={false} />
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </section>

        {/* ── Comparison Table ── */}
        <section className="pb-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-4xl md:text-5xl tracking-tighter mb-3">
              Compare plans
            </h2>
            <p className="text-[var(--muted-foreground)] text-base">
              Full feature breakdown across every tier.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="overflow-hidden rounded-2xl border border-[var(--border)]/30"
          >
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)]/30 bg-[var(--primary)]/[0.03]">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-[var(--muted-foreground)]">
                    Feature
                  </th>
                  {plans.map((p) => (
                    <th
                      key={p.id}
                      className={`text-center py-4 px-4 text-sm font-bold ${
                        p.id === "pro" ? "text-[var(--primary)]" : "text-[var(--foreground)]"
                      }`}
                    >
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr
                    key={row.label}
                    className={`border-b border-[var(--border)]/20 transition-colors hover:bg-[var(--primary)]/[0.02] ${
                      i % 2 === 0 ? "" : "bg-[var(--primary)]/[0.01]"
                    }`}
                  >
                    <td className="py-3.5 px-6 text-sm text-[var(--foreground)]/80 font-medium">
                      {row.label}
                    </td>
                    <ComparisonCell value={row.starter} />
                    <ComparisonCell value={row.pro} />
                    <ComparisonCell value={row.teams} />
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </section>

        {/* ── FAQ ── */}
        <section className="pb-28 max-w-[720px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-4xl md:text-5xl tracking-tighter mb-3">
              Common{" "}
              <span className="italic text-[var(--primary)]">questions</span>
            </h2>
          </motion.div>

          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? "border-[var(--primary)]/40 bg-[var(--primary)]/[0.04]"
                      : "border-[var(--border)]/30 hover:border-[var(--border)]/50"
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left group"
                  >
                    <span className={`text-base font-semibold transition-colors ${isOpen ? "text-[var(--primary)]" : "text-[var(--foreground)] group-hover:text-[var(--primary)]"}`}>
                      {faq.q}
                    </span>
                    <span className={`flex-shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-300 text-lg leading-none font-light ${
                      isOpen ? "bg-[var(--primary)] border-[var(--primary)] text-black" : "border-[var(--border)]/40 text-[var(--muted-foreground)]"
                    }`}>
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <div className="px-6 pb-6">
                          <div className="h-px w-full bg-[var(--primary)]/10 mb-4" />
                          <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">{faq.a}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <section className="pb-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative rounded-3xl border border-[var(--primary)]/20 bg-[var(--primary)]/[0.04] overflow-hidden px-8 md:px-16 py-16 text-center"
          >
            {/* Inner conic glow */}
            <div className="absolute inset-0 bg-[conic-gradient(from_180deg_at_50%_0%,oklch(0.68_0.19_45_/_0.08),transparent_50%)] pointer-events-none" />

            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/5 text-[11px] font-bold tracking-[0.25em] text-[var(--primary)] uppercase mb-6"
            >
              <Zap size={11} />
              No credit card required
            </motion.span>

            <h2 className="font-display text-4xl md:text-6xl lg:text-7xl tracking-tighter leading-[0.9] mb-6">
              Build your first app{" "}
              <span className="italic text-[var(--primary)] drop-shadow-[0_0_30px_oklch(0.68_0.19_45_/_0.4)]">
                today.
              </span>
            </h2>
            <p className="text-[var(--muted-foreground)] text-lg max-w-md mx-auto mb-10">
              Start free. No setup. Your product could be live in the next 60 seconds.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="relative overflow-hidden group flex items-center gap-2.5 bg-[var(--primary)] text-black px-8 py-4 rounded-2xl font-bold text-sm hover:scale-[1.04] active:scale-95 transition-all shadow-[0_0_30px_oklch(0.68_0.19_45_/_0.3)]">
                <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition duration-700" />
                <span className="relative z-10 flex items-center gap-2">
                  Get Started Free
                  <ArrowRight size={16} strokeWidth={2.5} />
                </span>
              </button>
              <button className="flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-sm border border-[var(--border)]/40 text-[var(--foreground)] hover:border-[var(--primary)]/40 hover:bg-[var(--primary)]/5 transition-all">
                Compare all plans ↑
              </button>
            </div>
          </motion.div>
        </section>

      </div>
    </main>
  );
};

export default Pricing;