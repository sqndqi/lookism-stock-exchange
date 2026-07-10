"use client";

import { marketPulse } from "@/lib/market-data";
import { getLiveBaseAssets, redditMarketMeta } from "@/lib/live-market";
import { useMarketAutomation } from "@/lib/use-market-automation";
import { formatCompact, formatCurrency, signedPercent } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarketChart } from "@/components/MarketChart";

export function Dashboard() {
  const automation = useMarketAutomation();
  const assets = getLiveBaseAssets(automation);
  const lead = [...assets].sort((a, b) => b.price - a.price)[0] ?? assets[0];
  const hypeSpikes = [...assets]
    .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
    .slice(0, 6);
  const topMovers = [...assets].sort((a, b) => b.change - a.change).slice(0, 5);
  const stress = [...assets].sort((a, b) => b.volatility - a.volatility).slice(0, 4);

  return (
    <section id="market" className="section-wrap relative z-10 py-14">
      <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="terminal-label text-ice">Market command center</p>
          <h2 className="mt-3 font-display text-5xl font-bold uppercase leading-none md:text-7xl">Generation War Index</h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-slate-400 md:text-base">
          A scan-first terminal for street value, power premium, rumor velocity, instability, and crew-sector pressure.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        {marketPulse.map((item) => (
          <Card key={item.label} className="p-5">
            <div className="relative z-10 flex items-center justify-between">
              <item.icon className="text-crimson" size={20} />
              <span className={item.delta.startsWith("+") ? "font-mono text-xs text-ice" : "font-mono text-xs text-crimson"}>{item.delta}</span>
            </div>
            <p className="terminal-label relative z-10 mt-6">{item.label}</p>
            <div className="mt-2 flex items-end justify-between">
              <strong className="relative z-10 font-display text-4xl font-bold">{item.value}</strong>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Generation War Index</CardTitle>
            <p className="terminal-label">
              {lead.symbol} composite / {redditMarketMeta.postsScanned} posts scanned
              {automation ? ` / live tick ${automation.tick}` : ""}
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="font-display text-6xl font-bold">{formatCurrency(lead.price)}</p>
                <p className="mt-2 text-ice">{signedPercent(lead.change)} street value shift</p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  ["Signal", lead.signal === "BUY" ? "BACK" : lead.signal === "SHORT" ? "SHORT" : "HOLD"],
                  ["Power", lead.power],
                  ["Vol", lead.volatility]
                ].map(([label, value]) => (
                  <div key={label} className="rounded-md border border-white/10 bg-white/[0.035] px-4 py-3">
                    <p className="terminal-label text-[0.58rem]">{label}</p>
                    <p className="mt-1 font-display text-2xl font-bold text-white">{value}</p>
                  </div>
                ))}
              </div>
            </div>
            <MarketChart asset={lead} height={280} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hype Spikes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {hypeSpikes.map((asset) => (
              <div key={asset.symbol} className="flex items-center justify-between rounded-md border border-white/10 bg-black/25 p-3">
                <div>
                  <p className="font-semibold leading-tight">{asset.name}</p>
                  <p className="terminal-label text-[0.58rem]">{asset.symbol} / Heat {formatCompact(asset.volume)}</p>
                </div>
                <div className="text-right">
                  <p>{formatCurrency(asset.price)}</p>
                  <p className={asset.change >= 0 ? "text-profit" : "text-danger"}>{signedPercent(asset.change)}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
        <Card>
          <CardHeader>
            <CardTitle>Top Movers</CardTitle>
            <p className="terminal-label">highest positive flow</p>
          </CardHeader>
          <CardContent className="space-y-2">
            {topMovers.map((asset, index) => (
              <div key={asset.symbol} className="grid grid-cols-[36px_1fr_auto] items-center gap-3 rounded-md border border-white/10 bg-white/[0.03] p-3">
                <span className="font-mono text-xs text-slate-500">0{index + 1}</span>
                <div>
                  <p className="font-bold">{asset.name}</p>
                  <p className="terminal-label text-[0.58rem]">{asset.symbol} / {asset.faction}</p>
                </div>
                <span className={asset.change >= 0 ? "text-ice" : "text-crimson"}>{signedPercent(asset.change)}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk & Rumor Heat</CardTitle>
            <p className="terminal-label">volatility leaders under active catalyst pressure</p>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {stress.map((asset) => (
              <div key={asset.symbol} className="rounded-md border border-white/10 bg-black/25 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-display text-2xl font-bold uppercase">{asset.symbol}</p>
                    <p className="text-sm text-slate-400">{asset.name}</p>
                  </div>
                  <span className="rounded border border-amber/30 bg-amber/10 px-2 py-1 font-mono text-xs text-amber">VOL {asset.volatility}</span>
                </div>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-amber" style={{ width: `${asset.volatility}%` }} />
                </div>
                <p className="mt-3 text-xs leading-5 text-slate-400">{asset.catalyst ?? asset.quote}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
