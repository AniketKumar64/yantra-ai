import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal } from 'lucide-react';

const LoaderStep = () => {
  const steps = [
    "Initializing architect engine",
    "Mapping system dependencies",
    "Synthesizing component logic",
    "Finalizing deployment build"
  ];
  
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[var(--card)] text-[var(--foreground)] overflow-hidden font-mono">
      
      {/* Background HUD Elements - Very Subtle */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large Decorative Circle */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-[var(--primary)]/[0.03] rounded-full"
        />
        {/* Scanning Axis */}
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--primary)]/10 to-transparent" />
        <div className="absolute top-0 left-1/2 w-[1px] h-full bg-gradient-to-b from-transparent via-[var(--primary)]/10 to-transparent" />
      </div>

      {/* Central Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-xl px-10">
        
        {/* Minimal Core Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-12 relative"
        >
          <motion.div 
            animate={{ 
              boxShadow: ["0 0 20px 0px rgba(var(--primary-rgb), 0)", "0 0 30px 2px rgba(var(--primary-rgb), 0.2)", "0 0 20px 0px rgba(var(--primary-rgb), 0)"] 
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="p-5 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/5"
          >
            <Terminal className="w-8 h-8 text-[var(--primary)]" />
          </motion.div>
          
          {/* Orbital Dot */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[var(--primary)] rounded-full shadow-[0_0_10px_var(--primary)]" />
          </motion.div>
        </motion.div>

        {/* Step Text - Minimal & Large Tracking */}
        <div className="h-20 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, letterSpacing: "0.5em", filter: "blur(10px)" }}
              animate={{ opacity: 1, letterSpacing: "0.2em", filter: "blur(0px)" }}
              exit={{ opacity: 0, letterSpacing: "0.1em", filter: "blur(10px)" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <h1 className="text-xs uppercase font-bold text-[var(--primary)] mb-4 tracking-[0.5em] opacity-60">
                Phase {currentStep + 1}
              </h1>
              <p className="text-lg md:text-xl font-light text-[var(--foreground)] uppercase">
                {steps[currentStep]}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Full-width Progress Bar (Minimal Line) */}
        <div className="w-64 mt-12 relative h-[1px] bg-[var(--primary)]/10">
          <motion.div
            key={currentStep}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3, ease: "linear" }}
            className="absolute top-0 left-0 h-full bg-[var(--primary)] shadow-[0_0_10px_var(--primary)]"
          />
        </div>

        {/* Screen Bottom Metadata */}
        <div className="absolute bottom-12 left-12 flex flex-col gap-1 opacity-30 select-none">
          <span className="text-[10px] uppercase tracking-widest">Lat: 28.5355° N</span>
          <span className="text-[10px] uppercase tracking-widest">Lng: 77.3910° E</span>
        </div>

        <div className="absolute bottom-12 right-12 flex flex-col items-end gap-1 opacity-30 select-none">
          <span className="text-[10px] uppercase tracking-widest">System Architecture v2.0</span>
          <span className="text-[10px] uppercase tracking-widest">© 2026 ARCHITECT ENGINE</span>
        </div>
      </div>

      {/* Random Data "Noise" in corners */}
      <div className="absolute top-12 left-12 w-32 h-32 border-l border-t border-[var(--primary)]/10" />
      <div className="absolute bottom-12 right-12 w-32 h-32 border-r border-b border-[var(--primary)]/10" />
    </div>
  );
};

export default LoaderStep;