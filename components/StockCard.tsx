"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowDownRight, ArrowUpRight, Gauge } from "lucide-react";
import type { MarketAsset } from "@/lib/market-data";
import { formatCompact, formatCurrency, signedPercent } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketChart } from "@/components/MarketChart";
import { Button } from "@/components/ui/button";

export function StockCard({ asset, index }: { asset: MarketAsset; index: number }) {
  const positive = asset.change >= 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay: index * 0.04 }}
      whileHover={{ y: -4 }}
    >
      <Card className="group relative h-full overflow-hidden p-4">
        <div className="absolute inset-x-0 top-0 h-1" style={{ background: asset.accent }} />
        <div className="relative z-10 flex items-start gap-4">
          <Image src={asset.image} alt={`${asset.name} stock image`} width={420} height={560} className="h-24 w-20 rounded-xl border border-white/10 bg-black object-cover" />
          <div className="min-w-0 flex-1">
            <Badge className="border-white/10 bg-white/5 text-slate-300">{asset.category}</Badge>
            <h3 className="mt-3 text-2xl font-black uppercase leading-none tracking-tight">{asset.name}</h3>
            <p className="mt-1 font-mono text-xs uppercase tracking-[0.14em] text-slate-500">{asset.symbol} / {asset.faction}</p>
          </div>
          <div className={`rounded-2xl border px-3 py-2 font-mono text-xs ${positive ? "border-ice/30 bg-ice/10 text-ice" : "border-crimson/30 bg-crimson/10 text-crimson"}`}>
            {positive ? <ArrowUpRight className="mb-1" size={16} /> : <ArrowDownRight className="mb-1" size={16} />}
            {signedPercent(asset.change)}
          </div>
        </div>
        <div className="relative z-10 mt-6 grid grid-cols-[1fr_auto] items-end gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.14em] text-slate-500">Price</p>
            <p className="text-4xl font-black leading-none">{formatCurrency(asset.price)}</p>
          </div>
          <div className="text-right font-mono text-xs uppercase tracking-[0.14em] text-slate-400">
            <p>Influence {formatCompact(asset.marketCap)}</p>
            <p>Heat {formatCompact(asset.volume)}</p>
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
            <p className="text-slate-400">Volatility</p>
            <p className="mt-1 font-display text-3xl">{asset.volatility}</p>
          </div>
        </div>
        <p className="relative z-10 mt-4 min-h-12 text-sm leading-6 text-slate-400">{asset.quote}</p>
        <div className="relative z-10 mt-5 grid grid-cols-2 gap-3">
          <Button variant="ghost" size="sm">Details</Button>
          <Button size="sm">Trade</Button>
        </div>
      </Card>
    </motion.article>
  );
}
