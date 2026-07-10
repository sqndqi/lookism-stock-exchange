"use client";

import Link from "next/link";
import type { Account } from "@/lib/account";
import type { MarketAsset } from "@/lib/market-data";
import { calculatePortfolio } from "@/lib/portfolio";
import { formatCurrency, signedPercent } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarketChart } from "@/components/MarketChart";

export function PortfolioAnalytics({ account, assets, onSell }: { account: Account; assets: MarketAsset[]; onSell?: (symbol: string) => void }) {
  const portfolio = calculatePortfolio(account, assets);
  const assetBySymbol = new Map(assets.map((asset) => [asset.symbol, asset]));
  const timelineAsset = assets[0] ? {
    ...assets[0],
    symbol: "PORT",
    name: "Portfolio Equity",
    accent: "#8ab4f8",
    chart: [...(account.snapshots ?? [])].reverse().slice(-12).map((snapshot, index) => ({ t: `${index + 1}`, value: snapshot.totalEquity }))
  } : null;

  return (
    <div className="grid gap-5">
      <div className="grid gap-3 md:grid-cols-4">
        {[
          ["Total equity", formatCurrency(portfolio.totalEquity)],
          ["Return", signedPercent(portfolio.totalReturnPct)],
          ["Risk score", String(portfolio.riskScore)],
          ["Win rate", `${portfolio.winRate.toFixed(0)}%`]
        ].map(([label, value]) => (
          <div key={label} className="rounded-md border border-white/10 bg-black/25 p-4">
            <p className="terminal-label">{label}</p>
            <p className="mt-2 font-display text-3xl font-bold">{value}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-[1fr_.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Timeline</CardTitle>
            <p className="text-sm text-slate-400">Built from local snapshots after fake trades.</p>
          </CardHeader>
          <CardContent>
            {timelineAsset && timelineAsset.chart.length > 1 ? <MarketChart asset={timelineAsset} height={220} /> : <div className="rounded-md border border-white/10 bg-black/20 p-5 text-sm text-slate-300">Make a few fake trades to build a local equity timeline.</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Risk Exposure</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {[
              ["Volatility", portfolio.volatilityExposure],
              ["Hype", portfolio.hypeExposure],
              ["Concentration", portfolio.concentrationRisk],
              ["Cash buffer", portfolio.cashAllocationPct]
            ].map(([label, value]) => (
              <div key={label}>
                <div className="mb-1 flex justify-between text-sm"><span>{label}</span><span>{Number(value).toFixed(0)}</span></div>
                <div className="h-1.5 rounded-full bg-white/10"><div className="h-full rounded-full bg-ice" style={{ width: `${Math.min(100, Number(value))}%` }} /></div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Holdings</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {account.holdings.length === 0 ? <div className="rounded-md border border-white/10 bg-black/20 p-4 text-sm text-slate-300">No holdings yet.</div> : account.holdings.map((holding) => {
            const asset = assetBySymbol.get(holding.symbol);
            if (!asset) return null;
            const value = asset.price * holding.shares;
            const cost = holding.averageCost * holding.shares;
            const pnl = value - cost;
            const allocation = portfolio.holdingsValue ? value / portfolio.holdingsValue * 100 : 0;
            return (
              <div key={holding.symbol} className="grid gap-3 rounded-md border border-white/10 bg-black/20 p-4 md:grid-cols-[1fr_auto_auto] md:items-center">
                <div>
                  <p className="font-display text-2xl font-bold uppercase">{asset.symbol} / {asset.name}</p>
                  <p className="text-sm text-slate-400">{holding.shares.toFixed(4)} shares / avg {formatCurrency(holding.averageCost)} / allocation {allocation.toFixed(1)}%</p>
                </div>
                <div className="md:text-right">
                  <p>{formatCurrency(value)}</p>
                  <p className={pnl >= 0 ? "text-ice" : "text-crimson"}>{pnl >= 0 ? "+" : ""}{formatCurrency(pnl)}</p>
                </div>
                <div className="flex gap-2 md:justify-end">
                  <Button asChild size="sm" variant="ghost"><Link href={`/asset/${asset.symbol}`}>View</Link></Button>
                  {onSell ? <Button size="sm" variant="ghost" onClick={() => onSell(asset.symbol)}>Sell</Button> : null}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
