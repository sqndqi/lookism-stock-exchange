"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, Star } from "lucide-react";
import { getMarketState } from "@/lib/market-engine";
import { useMarketAutomation } from "@/lib/use-market-automation";
import { readAccount, toggleWatchlist, type Account } from "@/lib/account";
import { formatCurrency, signedPercent } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TradeTicket } from "@/components/TradeTicket";

const sortOptions = ["change", "price", "hype", "power", "risk", "volume", "owned"] as const;

export function MarketScreener() {
  const automation = useMarketAutomation();
  const [account, setAccount] = useState<Account | null>(null);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("ALL");
  const [signal, setSignal] = useState("ALL");
  const [faction, setFaction] = useState("ALL");
  const [ownedOnly, setOwnedOnly] = useState(false);
  const [watchOnly, setWatchOnly] = useState(false);
  const [sort, setSort] = useState<(typeof sortOptions)[number]>("change");
  const market = useMemo(() => getMarketState(account, automation), [account, automation]);
  const factions = useMemo(() => ["ALL", ...new Set(market.assets.map((asset) => asset.faction))], [market.assets]);

  useEffect(() => {
    setAccount(readAccount());
    function accountUpdated(event: Event) {
      setAccount(((event as CustomEvent<Account | null>).detail ?? null));
    }
    window.addEventListener("ptj-account-updated", accountUpdated);
    return () => window.removeEventListener("ptj-account-updated", accountUpdated);
  }, []);

  const filtered = useMemo(() => {
    const owned = new Set(account?.holdings.map((holding) => holding.symbol) ?? []);
    const watched = new Set(account?.watchlist ?? []);
    const needle = query.trim().toLowerCase();
    return market.assets
      .filter((asset) => !needle || [asset.symbol, asset.name, asset.faction, ...(asset.aliases ?? [])].join(" ").toLowerCase().includes(needle))
      .filter((asset) => type === "ALL" || asset.category === type)
      .filter((asset) => signal === "ALL" || asset.signal === signal)
      .filter((asset) => faction === "ALL" || asset.faction === faction)
      .filter((asset) => !ownedOnly || owned.has(asset.symbol))
      .filter((asset) => !watchOnly || watched.has(asset.symbol))
      .sort((a, b) => {
        if (sort === "owned") return Number(owned.has(b.symbol)) - Number(owned.has(a.symbol));
        return (b[sort] as number) - (a[sort] as number);
      });
  }, [account, faction, market.assets, ownedOnly, query, signal, sort, type, watchOnly]);

  const selected = filtered[0] ?? market.assets[0];

  function watch(symbol: string) {
    const next = toggleWatchlist(symbol);
    if (!next) return;
    setAccount(next);
    window.dispatchEvent(new CustomEvent("aura-toast", { detail: `${symbol} ${next.watchlist.includes(symbol) ? "added to" : "removed from"} watchlist.` }));
  }

  return (
    <section className="section-wrap relative z-10 grid gap-5 py-10 lg:grid-cols-[1fr_380px]">
      <div className="grid gap-5">
        <Card>
          <CardHeader>
            <CardTitle>Market Screener</CardTitle>
            <p className="text-sm text-slate-400">Search, filter, and sort fighter/crew assets. Local holdings and watchlist filters stay in this browser.</p>
          </CardHeader>
          <CardContent className="grid gap-3">
            <label className="relative">
              <Search className="absolute left-3 top-3.5 text-slate-500" size={17} />
              <span className="sr-only">Search assets</span>
              <input className="h-12 w-full rounded-md border border-white/10 bg-black/40 pl-10 pr-4 outline-none focus-visible:ring-2 focus-visible:ring-ice" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search symbol, fighter, crew, alias..." />
            </label>
            <div className="grid gap-3 md:grid-cols-4">
              <select aria-label="Filter type" className="h-11 rounded-md border border-white/10 bg-black/40 px-3" value={type} onChange={(event) => setType(event.target.value)}>
                {["ALL", "Character", "Faction", "Holding"].map((item) => <option key={item}>{item}</option>)}
              </select>
              <select aria-label="Filter signal" className="h-11 rounded-md border border-white/10 bg-black/40 px-3" value={signal} onChange={(event) => setSignal(event.target.value)}>
                {["ALL", "BUY", "HOLD", "SHORT"].map((item) => <option key={item}>{item}</option>)}
              </select>
              <select aria-label="Filter faction" className="h-11 rounded-md border border-white/10 bg-black/40 px-3" value={faction} onChange={(event) => setFaction(event.target.value)}>
                {factions.map((item) => <option key={item}>{item}</option>)}
              </select>
              <select aria-label="Sort assets" className="h-11 rounded-md border border-white/10 bg-black/40 px-3" value={sort} onChange={(event) => setSort(event.target.value as (typeof sortOptions)[number])}>
                {sortOptions.map((item) => <option key={item} value={item}>{item.toUpperCase()}</option>)}
              </select>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant={ownedOnly ? "default" : "ghost"} onClick={() => setOwnedOnly((value) => !value)} disabled={!account}>Owned Only</Button>
              <Button size="sm" variant={watchOnly ? "default" : "ghost"} onClick={() => setWatchOnly((value) => !value)} disabled={!account}>Watchlist Only</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="grid gap-3 p-3">
            {filtered.length === 0 ? (
              <div className="rounded-md border border-white/10 bg-black/20 p-5 text-sm text-slate-300">No assets match this screen.</div>
            ) : filtered.map((asset) => {
              const owned = account?.holdings.find((holding) => holding.symbol === asset.symbol);
              const watched = account?.watchlist.includes(asset.symbol) ?? false;
              return (
                <div key={asset.symbol} className="grid gap-3 rounded-md border border-white/10 bg-black/25 p-4 md:grid-cols-[1fr_repeat(6,auto)] md:items-center">
                  <div>
                    <p className="font-display text-2xl font-bold uppercase">{asset.symbol} / {asset.name}</p>
                    <p className="text-sm text-slate-400">{asset.faction} / {asset.category} / {asset.signal}</p>
                  </div>
                  <span>{formatCurrency(asset.price)}</span>
                  <span className={asset.changePercent >= 0 ? "text-ice" : "text-crimson"}>{signedPercent(asset.changePercent)}</span>
                  <span className="terminal-label">PWR {asset.power}</span>
                  <span className="terminal-label">HYPE {asset.hype}</span>
                  <span className="terminal-label">RISK {asset.risk}</span>
                  <div className="flex gap-2 md:justify-end">
                    <Button asChild size="sm" variant="ghost"><Link href={`/asset/${asset.symbol}`}>View</Link></Button>
                    <Button size="sm" variant="ghost" onClick={() => watch(asset.symbol)} disabled={!account} aria-label={`${watched ? "Remove" : "Add"} ${asset.symbol} watchlist`}><Star size={15} className={watched ? "fill-amber text-amber" : ""} /></Button>
                  </div>
                  {owned ? <p className="md:col-span-7 text-xs uppercase tracking-[0.14em] text-ice">{owned.shares.toFixed(4)} fake shares owned</p> : null}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Quick Ticket</CardTitle>
          <p className="text-sm text-slate-400">Uses the first result in the current screen.</p>
        </CardHeader>
        <CardContent>
          {selected ? <TradeTicket account={account} asset={selected} assets={market.assets} onAccount={setAccount} compact /> : null}
        </CardContent>
      </Card>
    </section>
  );
}
