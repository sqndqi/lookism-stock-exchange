"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight, BarChart3, Swords } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { assetPath } from "@/lib/site-path";

export function Hero() {
  return (
    <section id="top" className="relative z-10 overflow-hidden">
      <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] grid-cols-1 items-center gap-10 py-14 lg:grid-cols-[1fr_.9fr] lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <Badge>Lookism community stock board</Badge>
          <h1 className="mt-5 max-w-4xl text-[clamp(3rem,8vw,6.8rem)] font-black uppercase leading-[0.9] tracking-tight">
            PTJ-Stocks
            <span className="block text-crimson">character market</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
            A simple Lookism-inspired board for character prices, crew holdings, aura movement, Reddit signals, and PTJ universe notes.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <a href="#market">View stocks <ArrowUpRight size={18} /></a>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <a href="#characters">Characters <Swords size={18} /></a>
            </Button>
          </div>
          <div className="mt-8 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
            {["Aura +18.4", "Crews 128K", "Reddit 135 posts"].map((label) => (
              <div key={label} className="rounded-xl border border-white/10 bg-white/[0.035] p-4 font-mono text-xs uppercase tracking-[0.14em] text-slate-300">
                {label}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="relative min-h-[360px]"
        >
          <div className="absolute inset-0 overflow-hidden rounded-2xl border border-white/10 bg-black">
            <Image src={assetPath("/images/seoul-night.svg")} alt="Minimal Seoul night skyline" width={1200} height={760} priority className="h-full w-full object-cover opacity-80" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/55 to-transparent p-5">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <BarChart3 size={17} className="text-ice" />
                Seoul night session
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 bg-black/60 p-4">
                  <p className="font-mono text-xs uppercase tracking-[0.14em] text-slate-400">Top</p>
                  <p className="mt-1 text-3xl font-black">UID</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/60 p-4">
                  <p className="font-mono text-xs uppercase tracking-[0.14em] text-slate-400">Signal</p>
                  <p className="mt-1 text-3xl font-black text-crimson">Hold</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
