"use client";

import { motion } from "framer-motion";

const particles = Array.from({ length: 34 }, (_, index) => ({
  id: index,
  left: `${(index * 29) % 100}%`,
  top: `${(index * 47) % 100}%`,
  delay: (index % 8) * 0.35
}));

export function AnimatedBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-grid bg-[length:72px_72px] opacity-[0.08]" />
      <div className="absolute inset-0 bg-scanline opacity-[0.08]" />
      <motion.div
        animate={{ x: [0, 40, -20, 0], y: [0, -25, 20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/4 top-0 h-80 w-80 rounded-full bg-cyanline/20 blur-[110px]"
      />
      <motion.div
        animate={{ x: [0, -35, 22, 0], y: [0, 26, -18, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-0 top-28 h-96 w-96 rounded-full bg-white/10 blur-[130px]"
      />
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute h-1 w-1 rounded-full bg-cyanline/70 shadow-[0_0_16px_rgba(125,211,252,.9)]"
          style={{ left: particle.left, top: particle.top }}
          animate={{ opacity: [0.15, 0.95, 0.15], y: [0, -22, 0] }}
          transition={{ duration: 4.5, delay: particle.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

