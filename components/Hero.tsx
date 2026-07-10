"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BarChart3, RadioTower, ShieldCheck, Swords, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { assetPath } from "@/lib/site-path";
import { readAccount, type Account } from "@/lib/account";
import { assets } from "@/lib/market-data";
import { MarketChart } from "@/components/MarketChart";
import { formatCurrency, signedPercent } from "@/lib/utils";

export function Hero() {
  const [account, setAccount] = useState<Account | null>(null);
  const featured = assets.find((asset) => asset.symbol === "DAN") ?? assets[0];

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
      <div className="section-wrap grid grid-cols-1 items-center gap-8 py-10 lg:grid-cols-[1.02fr_.98fr] lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <Badge>Aura Exchange / private beta terminal</Badge>
          <h1 className="mt-5 max-w-5xl font-display text-[clamp(3.9rem,9vw,8.7rem)] font-bold uppercase leading-[0.78] tracking-normal text-shadow-red">
            Seoul&apos;s fighter market
            <span className="block text-crimson">has a price.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
            A cinematic fictional exchange for Lookism-inspired fighters, crews, chapter catalysts, rumor heat, and prediction contracts.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <a href="#market">Open Market <ArrowUpRight size={18} /></a>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <a href="#fighters">View Fighters <Swords size={18} /></a>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link href={account ? "/#portfolio" : "/login"}>{account ? "Open Desk" : "Create Desk"} <ShieldCheck size={18} /></Link>
            </Button>
          </div>
          <div className="mt-8 grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              ["Desk", account ? `${account.alias} / ${account.crew}` : "Unclaimed"],
              ["Market", "Open / rumor wire live"],
              ["Signal", "Chapter catalysts active"]
            ].map(([label, value]) => (
              <div key={label} className="terminal-shell rounded-md p-4">
                <p className="terminal-label">{label}</p>
                <p className="mt-2 font-display text-2xl font-bold uppercase text-white">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              ["Fighter assets", "Street value is priced separately from raw fight power."],
              ["Crew sectors", "Factions trade like funds with territory and betrayal risk."],
              ["Odds desk", "Chapter outcomes quote like contracts before the close."]
            ].map(([title, copy]) => (
              <div key={title} className="rounded-md border border-white/10 bg-black/35 p-4">
                <p className="terminal-label">{title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{copy}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="relative min-h-[560px]"
        >
          <div className="dossier-panel absolute inset-0 rounded-lg bg-black">
            <Image src={assetPath("/images/seoul-night.svg")} alt="Minimal Seoul night skyline" width={1200} height={760} priority className="absolute inset-0 h-full w-full object-cover opacity-25" />
            <Image src={assetPath(featured.image)} alt={`${featured.name} feature render`} width={900} height={1200} priority className="absolute bottom-0 right-[-34px] h-[96%] w-auto object-contain object-bottom drop-shadow-[0_32px_80px_rgba(0,0,0,.8)]" />
            <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-r from-black via-black/55 to-transparent" />
            <div className="relative z-10 flex h-full flex-col justify-between p-6 md:p-7">
              <div className="flex items-start justify-between gap-4">
                <div className="rounded-md border border-white/10 bg-black/60 px-4 py-3 backdrop-blur">
                  <p className="terminal-label">Featured asset</p>
                  <p className="mt-1 font-display text-4xl font-bold uppercase text-white">{featured.name}</p>
                </div>
                <div className="rounded-md border border-crimson/30 bg-crimson/10 px-4 py-3 font-mono text-xs uppercase tracking-[0.18em] text-crimson">
                  {featured.symbol} / {featured.signal}
                </div>
              </div>

              <div className="max-w-sm">
                <div className="mb-4 flex items-center gap-2 text-sm text-slate-300">
                  <RadioTower size={17} className="text-crimson" />
                  UI pressure / body mystery / rumor imbalance
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-md border border-white/10 bg-black/60 p-4">
                    <p className="terminal-label">Street value</p>
                    <p className="mt-1 font-display text-3xl font-bold text-white">{formatCurrency(featured.price)}</p>
                  </div>
                  <div className="rounded-md border border-white/10 bg-black/60 p-4">
                    <p className="terminal-label">Move</p>
                    <p className="mt-1 font-display text-3xl font-bold text-crimson">{signedPercent(featured.change)}</p>
                  </div>
                </div>
                <div className="mt-4 rounded-md border border-white/10 bg-black/55 p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <BarChart3 size={17} className="text-ice" />
                    Live signal
                  </div>
                  <MarketChart asset={featured} height={112} />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[
                    ["Power", featured.power],
                    ["Risk", featured.volatility],
                    ["Hype", Math.min(99, Math.round(featured.volume / 1800000))]
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-md border border-white/10 bg-black/55 p-3">
                      <p className="terminal-label text-[0.58rem]">{label}</p>
                      <p className="mt-1 font-display text-2xl font-bold text-white">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute bottom-5 right-5 z-10 hidden items-center gap-2 rounded-md border border-amber/25 bg-amber/10 px-3 py-2 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-amber md:flex">
              <Zap size={14} /> Catalyst scan active
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
