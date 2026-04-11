import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, Terminal, Sparkles } from 'lucide-react';

const LoaderStep = () => {
  const steps = [
    "Analyzing your project structure...",
    "Identifying components and dependencies...",
    "Generating code for your project...",
    "Finalizing and optimizing the code..."
  ];
  
  const STEP_DURATION = 3000;
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, STEP_DURATION);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-8 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-xl max-w-md w-full mx-auto transition-colors duration-300">
      
      {/* Animated Icon Header */}
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="p-4 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20"
        >
          <Terminal className="text-[var(--primary)] w-8 h-8" />
        </motion.div>
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-1 -right-1"
        >
          <Sparkles className="text-[var(--primary)] w-5 h-5" />
        </motion.div>
      </div>

      {/* Main Status Text */}
      <div className="h-12 flex items-center justify-center text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentStep}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            className="text-sm font-medium text-[var(--foreground)] tracking-tight"
          >
            {steps[currentStep]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Progress Indicators */}
      <div className="w-full space-y-4">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <div key={index} className="relative">
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors">
                <div className="flex-shrink-0">
                  {isCompleted ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <CheckCircle2 className="w-4 h-4 text-[var(--primary)]" />
                    </motion.div>
                  ) : isActive ? (
                    <Loader2 className="w-4 h-4 text-[var(--primary)] animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-[var(--border)]" />
                  )}
                </div>
                
                <span className={`text-xs transition-opacity duration-300 ${
                  isActive ? "text-[var(--foreground)] font-bold" : "text-[var(--muted-foreground)] opacity-50"
                }`}>
                  {step}
                </span>
              </div>

              {/* Progress Bar (Only show for active step) */}
              {isActive && (
                <div className="absolute bottom-0 left-0 h-[2px] w-full bg-[var(--secondary)] overflow-hidden rounded-full">
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "0%" }}
                    transition={{ duration: STEP_DURATION / 1000, ease: "linear" }}
                    className="h-full bg-[var(--primary)]"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Subtle Footer Hint */}
      <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--muted-foreground)] font-bold">
        Architect Engine v2.0
      </p>
    </div>
  );
};

export default LoaderStep;