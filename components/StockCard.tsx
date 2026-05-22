"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowDownRight, ArrowUpRight, Check, Gauge } from "lucide-react";
import type { MarketAsset } from "@/lib/market-data";
import { formatCompact, formatCurrency, signedPercent } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketChart } from "@/components/MarketChart";
import { Button } from "@/components/ui/button";
import { assetPath } from "@/lib/site-path";

export function StockCard({ asset, index }: { asset: MarketAsset; index: number }) {
  const positive = asset.change >= 0;
  const [expanded, setExpanded] = useState(false);
  const [queued, setQueued] = useState(false);

  function trade() {
    window.dispatchEvent(new CustomEvent("ptj-select-stock", { detail: asset.symbol }));
    setQueued(true);
    window.setTimeout(() => setQueued(false), 1400);
    document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay: index * 0.04 }}
      whileHover={{ y: -4 }}
    >
      <Card className="group manhwa-panel relative h-full overflow-hidden p-4">
        <Image
          src={assetPath(asset.image)}
          alt=""
          width={420}
          height={560}
          aria-hidden
          className="absolute right-[-36px] top-3 h-60 w-44 object-cover opacity-[0.18] grayscale transition duration-300 group-hover:opacity-[0.30]"
        />
        <div className="absolute inset-x-0 top-0 h-1" style={{ background: asset.accent }} />
        <div className="relative z-10 flex items-start gap-4">
          <Image src={assetPath(asset.image)} alt={`${asset.name} stock image`} width={420} height={560} className="h-28 w-24 rounded-xl border border-white/10 bg-black object-cover grayscale" />
          <div className="min-w-0 flex-1">
            <Badge className="border-white/10 bg-white/5 text-slate-300">{asset.category === "Faction" ? "CREW" : asset.category === "Holding" ? "NETWORK" : "FIGHTER"}</Badge>
            <h3 className="mt-3 font-comic text-2xl font-black uppercase leading-none tracking-tight">{asset.name}</h3>
            <p className="mt-1 font-mono text-xs uppercase tracking-[0.14em] text-slate-500">{asset.symbol} / {asset.faction}</p>
          </div>
          <div className={`rounded-2xl border px-3 py-2 font-mono text-xs ${positive ? "border-ice/30 bg-ice/10 text-ice" : "border-crimson/30 bg-crimson/10 text-crimson"}`}>
            {positive ? <ArrowUpRight className="mb-1" size={16} /> : <ArrowDownRight className="mb-1" size={16} />}
            {signedPercent(asset.change)}
          </div>
        </div>
        <div className="relative z-10 mt-6 grid grid-cols-[1fr_auto] items-end gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.14em] text-slate-500">Street Value</p>
            <p className="text-4xl font-black leading-none">{formatCurrency(asset.price)}</p>
          </div>
          <div className="text-right font-mono text-xs uppercase tracking-[0.14em] text-slate-400">
            <p>Influence {formatCompact(asset.marketCap)}</p>
            <p>Rumor Heat {formatCompact(asset.volume)}</p>
          </div>
        </div>
        <MarketChart asset={asset} height={110} />
        <div className="relative z-10 mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
            <div className="flex items-center gap-2 text-slate-400"><Gauge size={15} /> Power</div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full" style={{ width: `${asset.power}%`, background: asset.accent }} />
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
            <p className="text-slate-400">Instability</p>
            <p className="mt-1 font-display text-3xl">{asset.volatility}</p>
          </div>
        </div>
        {asset.variants?.length ? (
          <div className="relative z-10 mt-3 flex flex-wrap gap-2">
            {asset.variants.map((variant) => (
              <span key={variant} className="rounded-md border border-crimson/25 bg-crimson/10 px-2 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-slate-300">
                {variant}
              </span>
            ))}
          </div>
        ) : null}
        <p className="relative z-10 mt-4 min-h-12 text-sm leading-6 text-slate-400">{asset.quote}</p>
        {expanded && (
          <div className="relative z-10 mt-4 grid gap-2 rounded-xl border border-white/10 bg-black/30 p-3 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-slate-300">
            <div className="flex justify-between gap-4"><span>Street Call</span><strong className="text-white">{asset.signal === "BUY" ? "BACK" : asset.signal === "SHORT" ? "DROP" : "WATCH"}</strong></div>
            <div className="flex justify-between gap-4"><span>Crew tie</span><strong className="text-white">{asset.faction}</strong></div>
            <div className="flex justify-between gap-4"><span>Fight Power</span><strong style={{ color: asset.accent }}>{asset.power}/100</strong></div>
            <div className="border-t border-white/10 pt-2 normal-case tracking-normal text-slate-400">{asset.catalyst ?? "Rumor wire catalyst pending."}</div>
          </div>
        )}
        <div className="relative z-10 mt-5 grid grid-cols-2 gap-3">
          <Button variant="ghost" size="sm" onClick={() => setExpanded((value) => !value)}>
            {expanded ? "Hide" : "Details"}
          </Button>
          <Button size="sm" onClick={trade}>
            {queued ? <Check size={16} /> : null}
            {queued ? `${asset.symbol} loaded` : "Back / Drop"}
          </Button>
        </div>
      </Card>
    </motion.article>
  );
}
