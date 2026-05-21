"use client";

import { motion } from "framer-motion";

const particles = Array.from({ length: 62 }, (_, index) => ({
  id: index,
  left: `${(index * 37) % 100}%`,
  top: `${(index * 53) % 100}%`,
  delay: (index % 11) * 0.28
}));

export function AnimatedBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-grid bg-[length:86px_86px] opacity-[0.055]" />
      <div className="absolute inset-0 bg-scanline opacity-[0.07]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0,rgba(0,0,0,.52)_70%)]" />
      <motion.div
        animate={{ x: [0, 58, -28, 0], y: [0, -34, 24, 0], scale: [1, 1.08, 0.96, 1] }}
        transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[14%] top-[-8%] h-[34rem] w-[34rem] rounded-full bg-crimson/18 blur-[150px]"
      />
      <motion.div
        animate={{ x: [0, -42, 30, 0], y: [0, 30, -22, 0], scale: [1, 0.94, 1.1, 1] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[-8%] top-[12%] h-[36rem] w-[36rem] rounded-full bg-ice/14 blur-[165px]"
      />
      <motion.div
        animate={{ opacity: [0.25, 0.62, 0.25], rotate: [0, 8, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[-10%] top-[38%] h-px w-[120%] bg-gradient-to-r from-transparent via-crimson/50 to-transparent shadow-[0_0_34px_rgba(239,35,60,.55)]"
      />
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute h-1 w-1 rounded-full bg-ice/70 shadow-[0_0_18px_rgba(155,231,255,.85)]"
          style={{ left: particle.left, top: particle.top }}
          animate={{ opacity: [0.08, 0.9, 0.08], y: [0, -34, 0], scale: [1, 1.7, 1] }}
          transition={{ duration: 5.5, delay: particle.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
