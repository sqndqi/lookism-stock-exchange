"use client";

import Link from "next/link";
import { marketPulse } from "@/lib/market-data";
import { redditMarketMeta } from "@/lib/live-market";
import { useMarketAutomation } from "@/lib/use-market-automation";
import { formatCompact, formatCurrency, signedPercent } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarketChart } from "@/components/MarketChart";
import { getMarketState } from "@/lib/market-engine";
import { readAccount, type Account } from "@/lib/account";
import { calculatePortfolio } from "@/lib/portfolio";
import { useEffect, useMemo, useState } from "react";

export function Dashboard() {
  const automation = useMarketAutomation();
  const [account, setAccount] = useState<Account | null>(null);
  const market = useMemo(() => getMarketState(account, automation), [account, automation]);
  const assets = market.assets;
  const lead = [...assets].sort((a, b) => b.price - a.price)[0] ?? assets[0];
  const hypeSpikes = [...assets]
    .sort((a, b) => b.hype - a.hype)
    .slice(0, 6);
  const topMovers = market.topGainers.slice(0, 5);
  const stress = market.mostVolatile.slice(0, 4);
  const portfolio = account ? calculatePortfolio(account, assets) : null;
  const demoRankings = [
    { alias: account?.alias ?? "Your Desk", crew: account?.crew ?? "Unclaimed", equity: portfolio?.totalEquity ?? 100000, returnPct: portfolio ? ((portfolio.totalEquity - (account?.startingCash ?? 100000)) / (account?.startingCash ?? 100000)) * 100 : 0 },
    { alias: "Cheonliang Quant", crew: "Cheonliang", equity: 124880, returnPct: 24.88 },
    { alias: "Gangseo Tape", crew: "Big Deal", equity: 116420, returnPct: 16.42 },
    { alias: "White Tiger Desk", crew: "White Tiger", equity: 109730, returnPct: 9.73 }
  ].sort((a, b) => b.equity - a.equity);

  useEffect(() => {
    setAccount(readAccount());
    function accountUpdated(event: Event) {
      setAccount(((event as CustomEvent<Account | null>).detail ?? null));
    }
    window.addEventListener("ptj-account-updated", accountUpdated);
    return () => window.removeEventListener("ptj-account-updated", accountUpdated);
  }, []);

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

      {portfolio ? (
        <Card className="mt-5">
          <CardHeader>
            <CardTitle>Your Local Desk</CardTitle>
            <p className="text-sm text-slate-400">Simulation credits only. Local browser portfolio, not a global ranking.</p>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-4">
            <div><p className="terminal-label">Cash</p><p className="font-display text-3xl font-bold">{formatCurrency(portfolio.cash)}</p></div>
            <div><p className="terminal-label">Equity</p><p className="font-display text-3xl font-bold">{formatCurrency(portfolio.totalEquity)}</p></div>
            <div><p className="terminal-label">Unrealized</p><p className={portfolio.unrealizedPnl >= 0 ? "font-display text-3xl font-bold text-ice" : "font-display text-3xl font-bold text-crimson"}>{formatCurrency(portfolio.unrealizedPnl)}</p></div>
            <div><p className="terminal-label">Watchlist</p><p className="font-display text-3xl font-bold">{account?.watchlist.length ?? 0}</p></div>
          </CardContent>
        </Card>
      ) : null}

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
                  ["Risk", lead.risk]
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
                  <p className="terminal-label text-[0.58rem]">{asset.symbol} / Hype {asset.hype} / {formatCompact(asset.volume)}</p>
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
                <span className={asset.changePercent >= 0 ? "text-ice" : "text-crimson"}>{signedPercent(asset.changePercent)}</span>
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
                  <span className="rounded border border-amber/30 bg-amber/10 px-2 py-1 font-mono text-xs text-amber">RISK {asset.risk}</span>
                </div>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-amber" style={{ width: `${asset.risk}%` }} />
                </div>
                <p className="mt-3 text-xs leading-5 text-slate-400">{asset.catalyst ?? asset.quote}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Index Board</CardTitle>
            <p className="terminal-label">fictional composite baskets</p>
          </CardHeader>
          <CardContent className="grid gap-3">
            {market.indices.map((index) => (
              <div key={index.symbol} className="rounded-md border border-white/10 bg-black/25 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-2xl font-bold uppercase">{index.symbol}</p>
                    <p className="text-sm text-slate-400">{index.name}</p>
                  </div>
                  <div className="text-right">
                    <p>{formatCurrency(index.price)}</p>
                    <p className={index.change >= 0 ? "text-ice" : "text-crimson"}>{signedPercent(index.change)}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {index.components.slice(0, 5).map((component) => (
                    <Link key={component.symbol} className="rounded border border-white/10 px-2 py-1 text-xs text-ice hover:border-ice/50" href={`/asset/${component.symbol}`}>{component.symbol}</Link>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Faction Sectors</CardTitle>
            <p className="terminal-label">crew exposure and instability</p>
          </CardHeader>
          <CardContent className="grid gap-3">
            {market.factions.slice(0, 4).map((sector) => (
              <div key={sector.slug} className="rounded-md border border-white/10 bg-black/25 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-2xl font-bold uppercase">{sector.name}</p>
                    <p className="text-sm text-slate-400">{sector.members.length} listed assets / influence {sector.influence}</p>
                  </div>
                  <span className="rounded border border-amber/30 bg-amber/10 px-2 py-1 font-mono text-xs text-amber">RISK {sector.risk}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {sector.members.slice(0, 5).map((member) => (
                    <Link key={member.symbol} className="rounded border border-white/10 px-2 py-1 text-xs text-ice hover:border-ice/50" href={`/asset/${member.symbol}`}>{member.symbol}</Link>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Demo Desk Ranking</CardTitle>
          <p className="text-sm text-slate-400">Local/simulated board for product feel only. No global users, no real-money rewards, no pay-to-win mechanics.</p>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-4">
          {demoRankings.map((desk, index) => (
            <div key={`${desk.alias}-${desk.crew}`} className="rounded-md border border-white/10 bg-black/25 p-4">
              <p className="terminal-label">Rank #{index + 1}</p>
              <p className="mt-2 font-display text-2xl font-bold uppercase">{desk.alias}</p>
              <p className="text-sm text-slate-400">{desk.crew}</p>
              <p className="mt-3">{formatCurrency(desk.equity)}</p>
              <p className={desk.returnPct >= 0 ? "text-ice" : "text-crimson"}>{signedPercent(desk.returnPct)}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
