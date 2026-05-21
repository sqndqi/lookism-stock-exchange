"use client";

import { useMemo, useState } from "react";
import { BriefcaseBusiness, LockKeyhole, Minus, Plus, Wallet } from "lucide-react";
import { assets } from "@/lib/market-data";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type Holding = {
  symbol: string;
  shares: number;
};

export function PortfolioSimulator() {
  const [holdings, setHoldings] = useState<Holding[]>([
    { symbol: "BDNL", shares: 3 },
    { symbol: "BDL", shares: 9 }
  ]);
  const [selected, setSelected] = useState("GUN");
  const [loading, setLoading] = useState(false);
  const [cash, setCash] = useState(5000);

  const total = useMemo(
    () =>
      holdings.reduce((sum, holding) => {
        const asset = assets.find((item) => item.symbol === holding.symbol);
        return sum + (asset?.price ?? 0) * holding.shares;
      }, 0),
    [holdings]
  );

  function buy() {
    const asset = assets.find((item) => item.symbol === selected);
    if (!asset || cash < asset.price) return;
    setLoading(true);
    window.setTimeout(() => {
      setCash((value) => value - asset.price);
      setHoldings((current) => {
        const existing = current.find((item) => item.symbol === selected);
        if (existing) {
          return current.map((item) => (item.symbol === selected ? { ...item, shares: item.shares + 1 } : item));
        }
        return [...current, { symbol: selected, shares: 1 }];
      });
      setLoading(false);
    }, 450);
  }

  function short() {
    const asset = assets.find((item) => item.symbol === selected);
    if (!asset) return;
    setCash((value) => value + asset.price * 0.15);
  }

  return (
    <section id="portfolio" className="relative z-10 mx-auto grid w-[min(1440px,calc(100%-32px))] gap-5 py-24 lg:grid-cols-[.82fr_1.18fr]">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Dealer Access</CardTitle>
          <p className="text-sm text-slate-400">Luxury guest desk for paper trades inside the Seoul underground.</p>
        </CardHeader>
        <CardContent>
          <div className="rounded-[26px] border border-crimson/25 bg-crimson/10 p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-black/40 text-crimson">
                <LockKeyhole size={22} />
              </div>
              <div>
                <p className="font-display text-4xl">VIP PIT 04</p>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-400">Paper trading enabled</p>
              </div>
            </div>
            <div className="mt-6 grid gap-3">
              <input className="h-12 rounded-2xl border border-white/10 bg-black/30 px-4 text-sm outline-none transition focus:border-crimson" value="dealer@ptj.black" readOnly />
              <input className="h-12 rounded-2xl border border-white/10 bg-black/30 px-4 text-sm outline-none transition focus:border-crimson" value="**********" readOnly />
              <Button>Authenticate desk</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>Crew Holdings</CardTitle>
            <p className="text-sm text-slate-400">Buy, short, and rebalance fake fighter positions like a crew broker.</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-md border border-white/10 bg-black/30 p-3 text-right">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">Cash</p>
              <p className="font-display text-4xl">{formatCurrency(cash)}</p>
            </div>
            <div className="rounded-md border border-white/10 bg-black/30 p-3 text-right">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">Influence</p>
              <p className="font-display text-4xl">{formatCurrency(total + cash)}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-[1fr_auto_auto]">
            <select
              className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm outline-none transition focus:border-crimson"
              value={selected}
              onChange={(event) => setSelected(event.target.value)}
            >
              {assets.map((asset) => (
                <option key={asset.symbol} value={asset.symbol}>{asset.name} ({asset.symbol})</option>
              ))}
            </select>
            <Button onClick={buy}><Plus size={17} /> Buy 1 Share</Button>
            <Button onClick={short} variant="ghost"><Minus size={17} /> Short</Button>
          </div>

          <div className="mt-6 grid gap-3">
            {loading && <Skeleton className="h-16" />}
            {holdings.map((holding) => {
              const asset = assets.find((item) => item.symbol === holding.symbol);
              if (!asset) return null;
              return (
                <div key={holding.symbol} className="flex items-center justify-between rounded-md border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-2xl bg-crimson/10 text-crimson">
                      <BriefcaseBusiness size={18} />
                    </div>
                    <div>
                      <p className="font-semibold">{asset.name}</p>
                      <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">{holding.shares} shares / {asset.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p>{formatCurrency(asset.price * holding.shares)}</p>
                    <p className="flex items-center justify-end gap-1 text-ice"><Wallet size={14} /> Locked</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
