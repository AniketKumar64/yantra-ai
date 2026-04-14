import { motion } from "framer-motion";
import { Check, Zap, ArrowRight, Sparkles, Building2, Rocket } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import api from "@/Context/axios";



const appPlans = [
  {
    id: 'basic',
    name: 'Basic',
    icon: Rocket,
    price: 5,
    credits: 100,
    description: 'Start Now, scale up as you grow.',
    features: ['Upto 20 Creations', 'Limited Revisions', 'Basic AI Models', 'Email support', 'Basic analytics'],
    cta: "Get Started",
  },
  {
    id: 'pro',
    name: 'Pro',
    icon: Zap,
    badge: "Most Popular",
    price: 19,
    credits: 400,
    description: 'Add credits to create more projects',
    features: ['Upto 80 Creations', 'Extended Revisions', 'Advanced AI Models', 'Priority email support', 'Advanced analytics'],
    cta: "Upgrade to Pro",
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    icon: Building2,
    price: 49,
    credits: 1000,
    description: 'Add credits to create more projects',
    features: ['Upto 200 Creations', 'Increased Revisions', 'Advanced AI Models', 'Email + Chat support', 'Advanced analytics'],
    cta: "Contact Sales",
  }
];

function FeatureRow({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3 text-sm">
      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[var(--primary)]/15 flex items-center justify-center">
        <Check size={11} className="text-[var(--primary)]" strokeWidth={3} />
      </span>
      <span className="text-[var(--foreground)]/80">{text}</span>
    </li>
  );
}

const Pricing = () => {
  const { data: session } = authClient.useSession();
  // const [plans] = React.useState<plan[]>(appPlans);

  // Purchase Handler
  const handlePurchase = async (planId: string) => {
    try {
      if (!session?.user) {
        return toast.error("Please login to purchase credits");
      }

      const { data } = await api.post("/me/purchase-credits", { planId });
      window.location.href = data.payment_link;

    } catch (error: any) {
      console.error("Purchase Error:", error instanceof Error ? error.message : error);
      toast.error("Failed to initiate purchase. Please try again.");
    }
  };

  return (
    <main className="relative min-h-screen bg-[var(--background)] text-[var(--foreground)] overflow-x-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[var(--primary)]/8 blur-[140px] rounded-full" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: `radial-gradient(var(--primary) 1px, transparent 1px)`, backgroundSize: "40px 40px" }}
        />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 md:px-10">
        {/* Hero */}
        <section className="pt-28 pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/5 text-[11px] font-bold tracking-[0.25em] text-[var(--primary)] uppercase mb-8"
          >
            <Sparkles size={11} />
            Flexible Credit Plans
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-5xl md:text-7xl tracking-tighter leading-[0.9] mb-6"
          >
            Boost your <span className="italic text-[var(--primary)]">workflow.</span>
          </motion.h1>

          <p className="text-[var(--muted-foreground)] text-lg max-w-lg mx-auto mb-12">
            Choose a plan that fits your scale. Get credits instantly to power your AI creations.
          </p>
        </section>

        {/* Pricing Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-28">
          {appPlans.map((plan, i) => {
            const Icon = plan.icon;
            const isPro = plan.id === "pro";

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className={`relative rounded-3xl flex flex-col overflow-hidden transition-all duration-300
                  ${isPro
                    ? "border-2 border-[var(--primary)]/50 bg-[var(--primary)]/[0.05] shadow-[0_0_60px_-10px_oklch(0.68_0.19_45_/_0.25)] scale-105 z-20"
                    : "border border-[var(--border)]/30 bg-[var(--primary)]/[0.02] hover:border-[var(--border)]/50"
                  }`}
              >
                {plan.badge && (
                  <div className="absolute top-4 right-4 text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-full bg-[var(--primary)] text-black">
                    {plan.badge}
                  </div>
                )}

                <div className={`px-7 pt-8 pb-6 border-b ${isPro ? "border-[var(--primary)]/20" : "border-[var(--border)]/20"}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isPro ? "bg-[var(--primary)]" : "bg-[var(--primary)]/10"}`}>
                      <Icon size={16} className={isPro ? "text-black" : "text-[var(--primary)]"} strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="font-display text-lg font-bold">{plan.name}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">{plan.credits} Credits included</p>
                    </div>
                  </div>

                  <div className="flex items-end gap-1 mt-5 mb-1">
                    <span className="font-display text-5xl md:text-6xl tracking-tighter leading-none">${plan.price}</span>
                    <span className="text-[var(--muted-foreground)] text-sm mb-2">/one-time</span>
                  </div>
                  <p className="text-sm text-[var(--muted-foreground)] mt-2">{plan.description}</p>

                  <button
                    onClick={() => handlePurchase(plan.id)}
                    className={`mt-6 w-full relative overflow-hidden group flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl font-semibold text-sm transition-all
                      ${isPro
                        ? "bg-[var(--primary)] text-black hover:scale-[1.02] active:scale-95"
                        : "border border-[var(--border)]/40 text-[var(--foreground)] hover:bg-[var(--primary)]/5 active:scale-95"
                      }`}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {plan.cta}
                      <ArrowRight size={14} strokeWidth={2.5} />
                    </span>
                  </button>
                </div>

                <div className="px-7 py-6 flex-1 bg-[var(--foreground)]/[0.02]">
                  <ul className="flex flex-col gap-3">
                    {plan.features.map((f) => (
                      <FeatureRow key={f} text={f} />
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </section>
      </div>
    </main>
  );
};

export default Pricing;