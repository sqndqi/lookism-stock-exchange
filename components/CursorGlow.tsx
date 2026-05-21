"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CursorGlow() {
  const [active, setActive] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 180, damping: 26 });
  const springY = useSpring(y, { stiffness: 180, damping: 26 });

  useEffect(() => {
    const move = (event: PointerEvent) => {
      setActive(true);
      x.set(event.clientX - 160);
      y.set(event.clientY - 160);
    };
    const leave = () => setActive(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerleave", leave);
    };
  }, [x, y]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed z-[60] hidden h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(239,35,60,.16),rgba(155,231,255,.08)_34%,transparent_68%)] blur-xl md:block"
      style={{ x: springX, y: springY, opacity: active ? 1 : 0 }}
    />
  );
}
