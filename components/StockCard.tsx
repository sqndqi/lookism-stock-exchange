"use client";

import { motion } from "framer-motion";
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
      whileHover={{ y: -8, scale: 1.01 }}
    >
      <Card className="group relative h-full overflow-hidden p-5">
        <div className="absolute inset-x-0 top-0 h-1" style={{ background: asset.accent }} />
        <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full opacity-20 blur-3xl" style={{ background: asset.accent }} />
        <div className="flex items-start justify-between gap-4">
          <div>
            <Badge className="border-white/10 bg-white/5 text-slate-300">{asset.category}</Badge>
            <h3 className="mt-4 font-display text-4xl uppercase tracking-wide">{asset.name}</h3>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate-500">{asset.symbol} / {asset.faction}</p>
          </div>
          <div className={`rounded-md border px-3 py-2 font-mono text-xs ${positive ? "border-profit/30 bg-profit/10 text-profit" : "border-danger/30 bg-danger/10 text-danger"}`}>
            {positive ? <ArrowUpRight className="mb-1" size={16} /> : <ArrowDownRight className="mb-1" size={16} />}
            {signedPercent(asset.change)}
          </div>
        </div>
        <div className="mt-6 grid grid-cols-[1fr_auto] items-end gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Last price</p>
            <p className="font-display text-5xl">{formatCurrency(asset.price)}</p>
          </div>
          <div className="text-right font-mono text-xs uppercase tracking-[0.18em] text-slate-400">
            <p>Cap {formatCompact(asset.marketCap)}</p>
            <p>Vol {formatCompact(asset.volume)}</p>
          </div>
        </div>
        <MarketChart asset={asset} height={150} />
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-md border border-white/10 bg-black/20 p-3">
            <div className="flex items-center gap-2 text-slate-400"><Gauge size={15} /> Power</div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full" style={{ width: `${asset.power}%`, background: asset.accent }} />
            </div>
          </div>
          <div className="rounded-md border border-white/10 bg-black/20 p-3">
            <p className="text-slate-400">Volatility</p>
            <p className="mt-1 font-display text-3xl">{asset.volatility}</p>
          </div>
        </div>
        <p className="mt-4 min-h-12 text-sm leading-6 text-slate-400">{asset.quote}</p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Button variant="ghost" size="sm">Details</Button>
          <Button size="sm">Trade</Button>
        </div>
      </Card>
    </motion.article>
  );
}
