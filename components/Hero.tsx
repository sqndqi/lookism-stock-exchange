"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ShieldCheck, Swords, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section id="top" className="relative z-10 min-h-[calc(100vh-64px)] overflow-hidden">
      <div className="absolute inset-x-0 bottom-0 h-[60%] city-mask opacity-90">
        <div className="absolute bottom-0 left-0 h-56 w-full bg-[linear-gradient(to_top,#05070a,transparent)]" />
        <div className="absolute bottom-0 left-[3%] h-52 w-24 bg-slate-900/90 shadow-[0_0_35px_rgba(239,35,60,.18)]" />
        <div className="absolute bottom-0 left-[15%] h-80 w-32 bg-black/80" />
        <div className="absolute bottom-0 left-[31%] h-64 w-28 bg-slate-950" />
        <div className="absolute bottom-0 left-[47%] h-96 w-40 bg-black/90" />
        <div className="absolute bottom-0 left-[66%] h-72 w-32 bg-slate-900/95" />
        <div className="absolute bottom-0 left-[84%] h-60 w-28 bg-black/80" />
        <div className="absolute bottom-20 left-0 h-px w-full bg-crimson/70 shadow-[0_0_34px_rgba(239,35,60,.9)]" />
        <div className="absolute bottom-32 left-0 h-px w-full bg-ice/40 shadow-[0_0_30px_rgba(155,231,255,.7)]" />
      </div>

      <div className="mx-auto grid w-[min(1440px,calc(100%-32px))] grid-cols-1 items-center gap-12 py-20 lg:grid-cols-[1.08fr_.92fr] lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <Badge>Seoul underground desk / chapter halt active</Badge>
          <h1 className="mt-6 max-w-5xl font-display text-[clamp(4.7rem,13vw,13rem)] uppercase leading-[0.76] tracking-wide">
            The
            <span className="text-shadow-red block text-crimson">Underground</span>
            <span className="font-outline block">Market</span>
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
            Trade power. Invest in legends. Track aura, crew dominance, Reddit hype, and Wiki-classified generation control inside a black-market PTJ terminal.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <a href="#market">Enter the pit <ArrowUpRight size={18} /></a>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <a href="#characters">Inspect monsters <Swords size={18} /></a>
            </Button>
          </div>
          <div className="mt-10 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
            {["Aura surge +18.4", "Generation control 64%", "Crew flow 2.7B"].map((label) => (
              <div key={label} className="luxury-panel rounded-3xl p-4 font-mono text-xs uppercase tracking-[0.2em] text-slate-300">
                {label}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="relative min-h-[520px]"
        >
          <div className="absolute inset-0 rounded-full bg-crimson/20 blur-[110px]" />
          <div className="manga-border absolute inset-x-4 bottom-8 top-0 overflow-hidden rounded-[34px] bg-gradient-to-b from-white/12 to-black/60">
            <div className="noise absolute inset-0 opacity-40" />
            <div className="absolute inset-x-0 top-0 h-1 bg-crimson shadow-[0_0_34px_rgba(239,35,60,.9)]" />
            <div className="aura-ring absolute left-1/2 top-20 h-80 w-80 -translate-x-1/2 rounded-full opacity-70" />
            <div className="absolute bottom-0 left-1/2 h-[88%] w-[42%] -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,.9),transparent)] opacity-15 blur-xl" />
            <div className="absolute bottom-0 left-[18%] h-[78%] w-28 rounded-t-full bg-black shadow-[26px_0_0_rgba(15,23,42,.96)]" />
            <div className="absolute bottom-0 left-[42%] h-[96%] w-36 rounded-t-full bg-black shadow-[34px_0_0_rgba(15,23,42,.95)]" />
            <div className="absolute bottom-0 right-[16%] h-[72%] w-24 rounded-t-full bg-black shadow-[-28px_0_0_rgba(15,23,42,.94)]" />
            <div className="absolute left-6 top-6 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-ice">
              <ShieldCheck size={16} /> Fight aura terminal
            </div>
            <div className="absolute right-6 top-6 flex items-center gap-2 rounded-full border border-crimson/40 bg-crimson/10 px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-crimson">
              <Zap size={15} /> UI Daniel live
            </div>
            <div className="absolute bottom-8 left-6 right-6 grid grid-cols-2 gap-3">
              <div className="rounded-3xl border border-white/10 bg-black/55 p-4 backdrop-blur-md">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-400">Current monster</p>
                <p className="mt-1 font-display text-5xl">UID</p>
              </div>
              <div className="rounded-3xl border border-crimson/30 bg-crimson/10 p-4 backdrop-blur-md">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-300">Order flow</p>
                <p className="text-shadow-red mt-1 font-display text-5xl text-crimson">RAGE</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
