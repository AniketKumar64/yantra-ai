import  { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, ShieldCheck, AlertTriangle } from "lucide-react";
import { AccountSettingsCards, DeleteAccountCard, ChangePasswordCard } from "@daveyplate/better-auth-ui";
import { authClient } from "@/lib/auth-client";

// The "Ember" constants for logic-based styling


const NAV_ITEMS = [
  { id: "account", icon: User, label: "Profile", sub: "Identity & preferences", tag: "01" },
  { id: "security", icon: ShieldCheck, label: "Security", sub: "Password & auth", tag: "02" },
  { id: "danger", icon: AlertTriangle, label: "Danger Zone", sub: "Destructive actions", tag: "03", danger: true },
];

const NavItem = ({ item, active, onClick, index }: { item: typeof NAV_ITEMS[number]; active: boolean; onClick: () => void; index: number }) => {
  const Icon = item.icon;
  // Dynamic coloring based on danger status and theme variables
  const colorClass = item.danger ? "text-red-500" : "text-[var(--primary)]";
  
  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }} 
      animate={{ opacity: 1, x: 0 }} 
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className={`relative flex w-full items-center gap-3 p-3 rounded-xl border transition-all group 
        ${active 
          ? (item.danger ? "bg-red-500/10 border-red-500/20" : "bg-[var(--primary)]/10 border-[var(--border)] shadow-[0_0_15px_rgba(0,0,0,0.5)]") 
          : "hover:bg-[var(--muted)]/30 border-transparent"}`}
    >
      {active && (
        <motion.div 
          layoutId="active-pill" 
          className={`absolute left-0 top-3 bottom-3 w-1 rounded-full ${item.danger ? "bg-red-500" : "bg-[var(--primary)]"}`} 
        />
      )}
      <span className={`text-[10px] font-bold tracking-widest min-w-[20px] ${active ? colorClass : "text-[var(--muted-foreground)]"}`}>
        {item.tag}
      </span>
      <Icon size={18} strokeWidth={active ? 2.2 : 1.8} className={active ? colorClass : "text-[var(--muted-foreground)]"} />
      <div className="flex flex-col items-start overflow-hidden text-left">
        <span className={`text-sm font-semibold leading-tight ${active ? "text-[var(--foreground)]" : "text-[var(--muted-foreground)]"}`}>
          {item.label}
        </span>
        <span className="text-[11px] text-[var(--muted-foreground)]/60 truncate">{item.sub}</span>
      </div>
    </motion.button>
  );
};

const SectionHeader = ({ tag, title, italic, desc, danger }: { tag: string; title: string; italic: string; desc: string; danger?: boolean }) => (
  <div className="mb-10">
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-4 
      ${danger ? "bg-red-500/10 text-red-400" : "bg-[var(--primary)]/10 text-[var(--primary)]"}`}>
      <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${danger ? "bg-red-500 shadow-[0_0_8px_red]" : "bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]"}`} /> 
      {tag}
    </div>
    <h2 className="font-display text-5xl text-[var(--foreground)] leading-tight mb-3">
      {title} <em className={`italic ${danger ? "text-red-500" : "text-[var(--primary)]"}`}>{italic}</em>
    </h2>
    <p className="font-body text-[var(--muted-foreground)] text-sm leading-relaxed max-w-md">{desc}</p>
    <div className={`mt-6 h-px w-full bg-gradient-to-r ${danger ? "from-red-500/50" : "from-[var(--border)]"} to-transparent`} />
  </div>
);

const SettingsUI = () => {
  const [activeTab, setActiveTab] = useState("account");
  const { data: session } = authClient.useSession();

  const sections = {
    account: { tag: "Profile", title: "Personal", italic: "Details.", desc: "Manage your public-facing identity and primary contact information.", comp: <AccountSettingsCards /> },
    security: { tag: "Security", title: "Keep it", italic: "Safe.", desc: "Update your authentication methods and monitor your account's integrity.", comp: <ChangePasswordCard /> },
    danger: { tag: "Danger Zone", title: "System", italic: "Exit.", desc: "Permanent actions regarding your account existence and data retention.", danger: true, comp: (
      <>
        <div className="flex items-start gap-4 p-4 rounded-xl bg-red-950/20 border border-red-900/50 mb-6">
          <AlertTriangle className="text-red-500 mt-0.5 shrink-0" size={18} />
          <p className="text-xs text-red-200/80 leading-relaxed font-medium">Deleting your account is <strong>permanent</strong>. You will lose all data immediately.</p>
        </div>
        <DeleteAccountCard />
      </>
    )}
  } as const;

  const current = sections[activeTab as keyof typeof sections];

  return (
    <div className="min-h-screen bg-[var(--background)] font-body text-[var(--foreground)] selection:bg-[var(--primary)]/30">
      
      {/* Futuristic Top Bar Glow */}
      <div className="fixed top-0 inset-x-0 h-[1px] z-50 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-50" />
      
      {/* Grid Pattern Background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: `radial-gradient(var(--primary) 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />

      <div className="relative z-10 flex min-h-screen">
  
        {/* ================= SIDEBAR ================= */}
        <aside className="hidden md:flex flex-col w-[280px] bg-[var(--sidebar)] border-r border-[var(--sidebar-border)] sticky top-0 h-screen">
          <div className="p-8">
      
            <p className="text-[11px] text-[var(--muted-foreground)] font-medium uppercase tracking-widest ml-11">Settings</p>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {NAV_ITEMS.map((item, i) => (
              <NavItem key={item.id} item={item} active={activeTab === item.id} onClick={() => setActiveTab(item.id)} index={i} />
            ))}
          </nav>

          {/* User Card */}
          <div className="p-4 mt-auto">
            <div className="group bg-[var(--card)] p-3 rounded-2xl border border-[var(--border)] flex items-center gap-3 transition-all duration-300 hover:border-[var(--primary)]/50">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--primary)] to-red-700 flex items-center justify-center text-[var(--background)] font-bold text-sm">
                {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="min-w-0 leading-tight">
                <p className="text-xs font-semibold truncate text-[var(--foreground)]">{session?.user?.name || "User"}</p>
                <p className="text-[10px] text-[var(--muted-foreground)] truncate">{session?.user?.email || "No email"}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* ================= MAIN ================= */}
        <main className="flex-1 flex flex-col min-w-0 bg-gradient-to-b from-[var(--background)] to-oklch(0.05_0.01_45)">
          {/* Content */}
          <div className="flex-1 px-6 py-12 md:px-16 md:py-20 max-w-3xl w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <SectionHeader {...current} />
                <div className="prose-ember">
                    {current.comp}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <footer className="mt-auto px-6 py-6 md:px-16 border-t border-[var(--border)]/30 flex items-center justify-between bg-black">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-[var(--primary)]" />
              <span className="text-[10px] font-medium text-[var(--muted-foreground)] uppercase tracking-widest">
                System Protocol Active
              </span>
            </div>
            <div className="flex gap-1.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-1 h-1 rounded-full bg-[var(--primary)]/40" />
              ))}
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default SettingsUI;