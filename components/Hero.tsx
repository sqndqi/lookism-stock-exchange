"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BarChart3, ShieldCheck, Sparkles, Swords } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { assetPath } from "@/lib/site-path";
import { readAccount, type Account } from "@/lib/account";

export function Hero() {
  const [account, setAccount] = useState<Account | null>(null);

  useEffect(() => {
    setAccount(readAccount());

    function accountUpdated(event: Event) {
      setAccount(((event as CustomEvent<Account | null>).detail ?? null));
    }

    window.addEventListener("ptj-account-updated", accountUpdated);
    return () => window.removeEventListener("ptj-account-updated", accountUpdated);
  }, []);

  return (
    <section id="top" className="relative z-10 overflow-hidden">
      <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] grid-cols-1 items-center gap-10 py-12 lg:grid-cols-[1fr_.95fr] lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <Badge>Lookism underground crew market</Badge>
          <h1 className="mt-5 max-w-4xl font-comic text-[clamp(3.1rem,8vw,7rem)] font-black uppercase leading-[0.9] tracking-tight text-shadow-red">
            PTJ-Stocks
            <span className="block text-crimson">Seoul crew exchange</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
            A fan-made Lookism terminal for fighter street value, crew war momentum, Reddit rumor flow, and chapter-driven power scaling.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <a href="#market">Enter exchange <ArrowUpRight size={18} /></a>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <a href="#characters">Character board <Swords size={18} /></a>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link href={account ? "/#portfolio" : "/login"}>{account ? "Open crew basket" : "Create account"} <ShieldCheck size={18} /></Link>
            </Button>
          </div>
          <div className="mt-8 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              account ? `${account.alias.toUpperCase()} / ${account.crew.toUpperCase()}` : "NEW DEALER DESK",
              "DANIEL FEATURED",
              "RUMOR WIRE LIVE"
            ].map((label) => (
              <div key={label} className="ink-scratch rounded-xl border border-white/10 bg-black/35 p-4 font-mono text-xs uppercase tracking-[0.14em] text-slate-300">
                {label}
              </div>
            ))}
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              ["Fight Power", "Character strength stays separate from market value."],
              ["Rumor Heat", "Reddit chatter and chapter debate push the tape."],
              ["Crew Influence", "Alliances, betrayals, and territory move crews."]
            ].map(([title, copy]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-black/35 p-4">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">{title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{copy}</p>
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
          <div className="manhwa-panel absolute inset-0 overflow-hidden rounded-3xl border border-white/10 bg-black">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(215,25,32,.28),transparent_24%),linear-gradient(160deg,rgba(255,255,255,.02),rgba(0,0,0,.08)_30%,rgba(0,0,0,.72)_72%)]" />
            <Image src={assetPath("/images/seoul-night.svg")} alt="Minimal Seoul night skyline" width={1200} height={760} priority className="absolute inset-0 h-full w-full object-cover opacity-30" />
            <Image src={assetPath("/images/fighter-daniel.svg")} alt="Daniel Park feature render" width={900} height={1200} priority className="absolute bottom-0 right-[-24px] h-[96%] w-auto object-contain object-bottom" />
            <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-r from-black via-black/55 to-transparent" />
            <div className="relative z-10 flex h-full flex-col justify-between p-6 md:p-7">
              <div className="flex items-start justify-between gap-4">
                <div className="rounded-xl border border-white/10 bg-black/55 px-4 py-3">
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">Featured fighter</p>
                  <p className="mt-1 text-3xl font-black uppercase text-white">Daniel Park</p>
                </div>
                <div className="rounded-xl border border-crimson/30 bg-crimson/10 px-4 py-3 font-mono text-xs uppercase tracking-[0.18em] text-crimson">
                  WANTED
                </div>
              </div>

              <div className="max-w-sm">
                <div className="mb-4 flex items-center gap-2 text-sm text-slate-300">
                  <Sparkles size={17} className="text-crimson" />
                  Alternative body / UI pressure / chapter catalyst
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/10 bg-black/60 p-4">
                    <p className="font-mono text-xs uppercase tracking-[0.14em] text-slate-400">Street call</p>
                    <p className="mt-1 text-3xl font-black text-crimson">Back</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/60 p-4">
                    <p className="font-mono text-xs uppercase tracking-[0.14em] text-slate-400">Fight power</p>
                    <p className="mt-1 text-3xl font-black text-white">100</p>
                  </div>
                </div>
                <div className="mt-4 rounded-2xl border border-white/10 bg-black/45 p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <BarChart3 size={17} className="text-ice" />
                    Landing board
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Start here, open a local desk, then move into crews, chapter odds, and fighter backing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
