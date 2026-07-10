"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { getMarketState, getRelatedAssets } from "@/lib/market-engine";
import { getSourcesForAsset } from "@/lib/sources";
import { getEventsForSymbol } from "@/lib/events";
import { predictionContracts } from "@/lib/market-data";
import { useMarketAutomation } from "@/lib/use-market-automation";
import { markAssetViewed, readAccount, type Account } from "@/lib/account";
import { calculatePortfolio } from "@/lib/portfolio";
import { formatCurrency, signedPercent } from "@/lib/utils";
import { assetPath } from "@/lib/site-path";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarketChart } from "@/components/MarketChart";
import { TradeTicket } from "@/components/TradeTicket";

export function AssetDetailTerminal({ symbol }: { symbol: string }) {
  const automation = useMarketAutomation();
  const [account, setAccount] = useState<Account | null>(null);

  useEffect(() => {
    setAccount(readAccount());

    function accountUpdated(event: Event) {
      setAccount(((event as CustomEvent<Account | null>).detail ?? null));
    }

    window.addEventListener("ptj-account-updated", accountUpdated);
    return () => window.removeEventListener("ptj-account-updated", accountUpdated);
  }, []);

  const market = useMemo(() => getMarketState(account, automation), [account, automation]);
  const asset = market.assets.find((item) => item.symbol === symbol.toUpperCase());
  const assetSymbol = asset?.symbol;
  const sources = asset ? getSourcesForAsset(asset.symbol) : [];
  const events = asset ? getEventsForSymbol(asset.symbol, asset.faction) : [];
  const scenarios = asset ? predictionContracts.filter((contract) => contract.catalyst.toLowerCase().includes(asset.name.toLowerCase()) || contract.question.toLowerCase().includes(asset.name.toLowerCase()) || contract.catalyst.toLowerCase().includes(asset.symbol.toLowerCase())) : [];
  const related = asset ? getRelatedAssets(asset, market.assets) : [];
  const holding = asset ? account?.holdings.find((item) => item.symbol === asset.symbol) : undefined;
  const symbolTrades = asset ? (account?.trades ?? []).filter((trade) => trade.symbol === asset.symbol).slice(0, 5) : [];
  const alertCount = asset ? (account?.alerts ?? []).filter((alert) => alert.symbol === asset.symbol).length : 0;
  const portfolio = account ? calculatePortfolio(account, market.assets) : null;

  useEffect(() => {
    if (!assetSymbol) return;
    const next = markAssetViewed(assetSymbol);
    if (next) setAccount(next);
  }, [assetSymbol]);

  if (!asset) {
    return (
      <main className="relative z-10 min-h-screen bg-abyss text-white">
        <div className="section-wrap py-20">
          <Card>
            <CardContent>
              <p className="terminal-label text-crimson">Asset not found</p>
              <h1 className="mt-3 font-display text-5xl font-bold uppercase">No listed dossier</h1>
              <Button asChild className="mt-6"><Link href="/#fighters"><ArrowLeft size={16} /> Back to market</Link></Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="relative z-10 min-h-screen bg-abyss text-white">
      <section className="section-wrap grid gap-5 py-8 lg:grid-cols-[1.05fr_.95fr]">
        <div className="dossier-panel rounded-lg p-5 md:p-7">
          <Button asChild variant="ghost" size="sm"><Link href="/#fighters"><ArrowLeft size={16} /> Market</Link></Button>
          <div className="mt-6 grid gap-6 md:grid-cols-[220px_1fr] md:items-end">
            <div className="relative h-72 overflow-hidden rounded-lg border border-white/10 bg-black">
              <Image src={assetPath(asset.image)} alt={`${asset.name} fictional asset dossier image`} fill className="object-cover object-top" sizes="220px" priority />
            </div>
            <div>
              <Badge>{asset.category === "Character" ? "Fighter asset" : "Crew sector"}</Badge>
              <h1 className="mt-4 font-display text-6xl font-bold uppercase leading-none md:text-8xl">{asset.name}</h1>
              <p className="terminal-label mt-3">{asset.symbol} / {asset.faction} / Fake-money market simulation</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-md border border-white/10 bg-black/35 p-4">
                  <p className="terminal-label">Street valuation</p>
                  <p className="mt-2 font-display text-4xl font-bold">{formatCurrency(asset.price)}</p>
                </div>
                <div className="rounded-md border border-white/10 bg-black/35 p-4">
                  <p className="terminal-label">Move</p>
                  <p className={asset.changePercent >= 0 ? "mt-2 font-display text-4xl font-bold text-ice" : "mt-2 font-display text-4xl font-bold text-crimson"}>{signedPercent(asset.changePercent)}</p>
                </div>
                <div className="rounded-md border border-white/10 bg-black/35 p-4">
                  <p className="terminal-label">Confidence</p>
                  <p className="mt-2 font-display text-4xl font-bold">{asset.confidence}</p>
                </div>
              </div>
            </div>
          </div>
          <MarketChart asset={asset} height={300} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Trading Desk 2.0</CardTitle>
            <p className="text-sm text-slate-400">Market and local limit orders. Simulation credits only.</p>
          </CardHeader>
          <CardContent>
            <TradeTicket account={account} asset={asset} assets={market.assets} onAccount={setAccount} />
            <div className="mt-5 grid gap-3 border-t border-white/10 pt-5 sm:grid-cols-4">
              <div><p className="terminal-label text-[0.58rem]">Cash</p><p>{portfolio ? formatCurrency(portfolio.cash) : "Locked"}</p></div>
              <div><p className="terminal-label text-[0.58rem]">Equity</p><p>{portfolio ? formatCurrency(portfolio.totalEquity) : "Locked"}</p></div>
              <div><p className="terminal-label text-[0.58rem]">Unrealized</p><p>{portfolio ? formatCurrency(portfolio.unrealizedPnl) : "Locked"}</p></div>
              <div><p className="terminal-label text-[0.58rem]">Owned</p><p>{holding ? holding.shares.toFixed(4) : "0"}</p></div>
              <div><p className="terminal-label text-[0.58rem]">Alerts</p><p>{alertCount}</p></div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="section-wrap grid gap-5 pb-14 lg:grid-cols-[.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Why It Moved</CardTitle>
            <p className="text-sm text-slate-400">{asset.moveExplanation}</p>
          </CardHeader>
          <CardContent className="grid gap-3">
            {[
              ["Power", asset.power],
              ["Hype", asset.hype],
              ["Risk", asset.risk],
              ["Liquidity", asset.liquidity]
            ].map(([label, value]) => (
              <div key={label} className="rounded-md border border-white/10 bg-black/25 p-3">
                <div className="mb-2 flex justify-between text-sm"><span>{label}</span><span>{value}</span></div>
                <div className="h-1.5 rounded-full bg-white/10"><div className="h-full rounded-full bg-ice" style={{ width: `${value}%` }} /></div>
              </div>
            ))}
            <div className="rounded-md border border-white/10 bg-black/25 p-4 text-sm text-slate-300">
              <p className="terminal-label mb-2">Bull case</p>{asset.bullCase}
            </div>
            <div className="rounded-md border border-white/10 bg-black/25 p-4 text-sm text-slate-300">
              <p className="terminal-label mb-2">Bear case</p>{asset.bearCase}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Catalyst Timeline</CardTitle>
            <p className="text-sm text-slate-400">Original summaries and source metadata only. No manga panels or copied chapters.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {sources.length === 0 ? (
              <div className="rounded-md border border-white/10 bg-black/20 p-4 text-sm text-slate-300">No active source records. The asset is running on fallback dossier data.</div>
            ) : sources.map((source) => (
              <article key={source.id} className="rounded-md border border-white/10 bg-black/25 p-4">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Badge>{source.type}</Badge>
                  <span className="terminal-label">Impact {source.impact} / Confidence {source.confidence}</span>
                </div>
                <h3 className="font-display text-2xl font-bold uppercase">{source.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{source.summary}</p>
                <p className="mt-3 terminal-label">{source.attribution}</p>
              </article>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="section-wrap pb-5">
        <Card>
          <CardHeader>
            <CardTitle>Local Trade Tape</CardTitle>
            <p className="text-sm text-slate-400">Recent fake-money trades for this symbol in this browser only.</p>
          </CardHeader>
          <CardContent className="grid gap-3">
            {symbolTrades.length === 0 ? (
              <div className="rounded-md border border-white/10 bg-black/20 p-4 text-sm text-slate-300">No local trades for {asset.symbol} yet.</div>
            ) : symbolTrades.map((trade) => (
              <div key={trade.id} className="grid gap-2 rounded-md border border-white/10 bg-black/20 p-4 text-sm md:grid-cols-[auto_1fr_auto] md:items-center">
                <span className={trade.side === "BUY" ? "text-ice" : "text-crimson"}>{trade.side}</span>
                <span>{trade.quantity.toFixed(4)} fake shares at {formatCurrency(trade.price)}</span>
                <span>{trade.realizedPnl !== undefined ? `P/L ${formatCurrency(trade.realizedPnl)}` : formatCurrency(trade.net)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="section-wrap pb-16">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Related Assets</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-4">
            {related.map((item) => (
              <Link key={item.symbol} href={`/asset/${item.symbol}`} className="rounded-md border border-white/10 bg-black/25 p-4 transition hover:border-ice/50">
                <p className="terminal-label">{item.symbol}</p>
                <p className="mt-2 font-display text-2xl font-bold uppercase">{item.name}</p>
                <p className={item.changePercent >= 0 ? "mt-2 text-ice" : "mt-2 text-crimson"}>{signedPercent(item.changePercent)}</p>
              </Link>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Events & Scenarios</CardTitle>
            <p className="text-sm text-slate-400">Scheduled catalysts and fictional lore forecasts linked to this asset.</p>
          </CardHeader>
          <CardContent className="grid gap-3">
            {events.length === 0 && scenarios.length === 0 ? (
              <div className="rounded-md border border-white/10 bg-black/20 p-4 text-sm text-slate-300">No linked events or scenario contracts yet.</div>
            ) : null}
            {events.map((event) => (
              <Link key={event.id} href="/calendar" className="rounded-md border border-white/10 bg-black/25 p-4 transition hover:border-ice/50">
                <p className="terminal-label">{event.status} / impact {event.expectedImpact}</p>
                <p className="mt-2 font-display text-2xl font-bold uppercase">{event.title}</p>
                <p className="mt-2 text-sm text-slate-400">{event.description}</p>
              </Link>
            ))}
            {scenarios.map((contract) => (
              <Link key={contract.question} href="/#predictions" className="rounded-md border border-white/10 bg-black/25 p-4 transition hover:border-ice/50">
                <p className="terminal-label">Scenario contract / pool {formatCurrency(contract.pool)}</p>
                <p className="mt-2 font-display text-2xl font-bold uppercase">{contract.question}</p>
              </Link>
            ))}
          </CardContent>
        </Card>
        </div>
        <div className="mt-5 flex items-start gap-3 rounded-md border border-amber/25 bg-amber/10 p-4 text-sm text-amber">
          <ShieldAlert size={18} />
          <p>AURA EXCHANGE is a fan-made fictional market game using fake simulation credits only. It is not gambling, investing, crypto, or financial advice.</p>
        </div>
      </section>
    </main>
  );
}
