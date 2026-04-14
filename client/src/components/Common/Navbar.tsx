import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Layers, ArrowRight, Sun, Moon, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { UserButton } from "@daveyplate/better-auth-ui";
import { useTheme } from "../../Context/ThemeContext";
import api from "@/Context/axios";
import { toast } from "sonner";

const Navbar = () => {
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();
  const { isDark, toggleTheme } = useTheme();
  const { scrollY } = useScroll();
  const [credits, setCredits] = useState(0);


const getCredits = async () => {
  try {
    const { data } = await api.get("/me/credits");

    setCredits(data?.credits ?? 0);

    console.log("Credits fetched successfully:", data);
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Failed to fetch credits");
    console.error("Error fetching credits:", error);
  }
};

  const [open, setOpen] = useState(false);

  // Scroll animations
  const width = useTransform(scrollY, [0, 100], ["94%", "85%"]);
  const top = useTransform(scrollY, [0, 100], ["16px", "20px"]);
  const borderRadius = useTransform(scrollY, [0, 100], ["16px", "24px"]);

  const shadow = useTransform(
    scrollY,
    [0, 100],
    [
      isDark ? "0 0 0px rgba(0,0,0,0)" : "0 4px 6px -1px rgba(0,0,0,0.05)",
      isDark
        ? "0 10px 30px -10px oklch(0.68 0.19 45 / 0.2)"
        : "0 10px 15px -3px rgba(0,0,0,0.1)",
    ]
  );

  const bgLight = useTransform(scrollY, [0, 100], [
    "rgba(250, 250, 247, 1)",
    "rgba(255, 255, 255, 0.8)",
  ]);

  const bgDark = useTransform(scrollY, [0, 100], [
    "rgba(0, 0, 0, 1)",
    "rgba(0, 0, 0, 0.75)",
  ]);

  const navLinks = [
    { name: "Projects", path: "/projects" },
    { name: "Community", path: "/community" },
    { name: "Pricing", path: "/pricing" },
  ];

  useEffect(() => {
    if (session?.user) {
      getCredits();
    }
  }, [session?.user]);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center pointer-events-none">
      <motion.nav
        style={{
          width,
          marginTop: top,
          borderRadius,
          boxShadow: shadow,
          backgroundColor: isDark ? bgDark : bgLight,
          border: `1px solid ${
            isDark
              ? "oklch(0.35 0.08 45 / 0.2)"
              : "rgba(228, 225, 217, 0.8)"
          }`,
        }}
        className="pointer-events-auto backdrop-blur-xl flex items-center justify-between px-6 py-3 transition-colors duration-500"
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <div className="bg-[var(--primary)] dark:bg-[var(--primary)] p-2 rounded-md transition-all group-hover:scale-105 ">
            <Layers size={18} className="text-[var(--background)] dark:text-black" />
          </div>
          <span className="font-display text-2xl text-[var(--foreground)] tracking-tight hidden sm:block">
            Yantra<span className="text-[var(--primary)]">Ai.</span>
          </span>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--muted-foreground)]">
          {navLinks.map((link, i) => (
            <button
              key={i}
              onClick={() => navigate(link.path)}
              className="hover:text-[var(--primary)] transition"
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-4">

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-[var(--muted)]/50 transition-colors text-[var(--muted-foreground)]"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={isDark ? "dark" : "light"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </motion.div>
            </AnimatePresence>
          </button>

          {/* Divider */}
          <div className="h-6 w-px bg-[var(--border)]/50 mx-1 hidden md:block" />
  <button  className="flex items-center gap-2 px-3 py-1 rounded-lg border border-[var(--border)] bg-transparent">
                <span className="text-sm font-medium text-[var(--muted-foreground)]">
                  Credits: <span className="font-bold text-[var(--foreground)]">
                    {credits}
                  </span>
                </span>
              </button>
                        <div className="h-6 w-px bg-[var(--border)]/50 mx-1 hidden md:block" />


          {/* Auth / User */}
          {!session?.user ? (
            <button
              onClick={() => navigate("/auth/signin")}
              className="flex items-center gap-2 bg-[var(--foreground)] dark:bg-[var(--primary)] 
              text-[var(--background)] dark:text-black px-4 py-2 rounded-xl text-sm font-bold 
              transition-all hover:opacity-90 active:scale-95"
            >
              Sign In
              <ArrowRight size={14} />
            </button>
          ) : (
            <div className="relative">
            


              {isDark && (
                <div className="absolute inset-0 rounded-full bg-[var(--primary)]/20 blur-lg" />
              )}
              <div className="relative">
                <UserButton
                  size="icon"
                  className="rounded-full border border-[var(--border)] bg-transparent 
                  hover:scale-105 transition-all duration-300"
                />
              </div>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg hover:bg-[var(--muted)]/50"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-[80px] w-[90%] rounded-2xl border border-border/40 
            bg-background/80 backdrop-blur-xl p-6 flex flex-col gap-4 md:hidden"
          >
            {navLinks.map((link, i) => (
              <button
                key={i}
                onClick={() => {
                  navigate(link.path);
                  setOpen(false);
                }}
                className="text-left text-lg text-[var(--foreground)] hover:text-[var(--primary)]"
              >
                {link.name}
              </button>
            ))}

            <div className="h-px bg-border/30 my-2" />

            {!session?.user ? (
              <button
                onClick={() => navigate("/auth/signin")}
                className="bg-emerald-800 dark:bg-[var(--primary)] text-white px-4 py-2 rounded-xl"
              >
                Sign In
              </button>
            ) : (
              <UserButton />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;