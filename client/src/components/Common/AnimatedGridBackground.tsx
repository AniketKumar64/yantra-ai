import { motion } from "framer-motion";

const AnimatedGridBackground = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none text-[var(--primary)]">
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20" />

      <motion.svg
        className="absolute inset-0 w-full h-full opacity-20"
        viewBox="0 0 1440 720"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.path
          d="M-15.227 702.342H1439.7"
          stroke="currentColor"
          strokeOpacity=".4"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 6, repeat: Infinity }}
        />

        <motion.path
          d="M-15.227 573.66H1439.7"
          stroke="currentColor"
          strokeOpacity=".3"
        />

        <motion.path
          d="M-15.227 164.029H1439.7"
          stroke="currentColor"
          strokeOpacity=".3"
        />

        <motion.circle
          cx="711.819"
          cy="372.562"
          r="308.334"
          stroke="currentColor"
          strokeOpacity=".4"
          animate={{ r: [300, 320, 300] }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        <motion.circle
          cx="782.595"
          cy="411.166"
          r="308.334"
          stroke="currentColor"
          strokeOpacity=".3"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 12, repeat: Infinity }}
        />

        <motion.circle
          cx="16.942"
          cy="20.834"
          r="308.334"
          stroke="currentColor"
          strokeOpacity=".25"
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 18, repeat: Infinity }}
        />
      </motion.svg>

      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
};

export default AnimatedGridBackground;