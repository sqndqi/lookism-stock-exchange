"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { getLiveBaseAssets } from "@/lib/live-market";
import { useMarketAutomation } from "@/lib/use-market-automation";
import { StockCard } from "@/components/StockCard";

export function CharacterGrid() {
  const automation = useMarketAutomation();
  const [filter, setFilter] = useState("All");
  const [signal, setSignal] = useState("All");
  const [sort, setSort] = useState("hype");
  const [query, setQuery] = useState("");
  const assets = getLiveBaseAssets(automation);
  const factions = ["All", ...Array.from(new Set(assets.map((asset) => asset.category === "Character" ? asset.faction : asset.category)))].slice(0, 8);
  const filtered = useMemo(
    () => {
      const result = assets.filter((asset) => {
        const matchesFilter = filter === "All" || asset.faction === filter || asset.category === filter;
        const matchesSignal = signal === "All" || asset.signal === signal;
        const text = `${asset.name} ${asset.symbol} ${asset.faction} ${(asset.aliases ?? []).join(" ")}`.toLowerCase();
        return matchesFilter && matchesSignal && text.includes(query.toLowerCase());
      });

      return result.sort((a, b) => {
        if (sort === "price") return b.price - a.price;
        if (sort === "change") return b.change - a.change;
        if (sort === "power") return b.power - a.power;
        if (sort === "volatility") return b.volatility - a.volatility;
        if (sort === "volume") return b.volume - a.volume;
        return (b.hype ?? b.volume / 1_700_000) - (a.hype ?? a.volume / 1_700_000);
      });
    },
    [assets, filter, query, signal, sort]
  );

  return (
    <section id="fighters" className="relative z-10 border-y border-white/10 bg-[linear-gradient(180deg,rgba(239,35,60,.055),rgba(255,255,255,.015),rgba(0,0,0,.2))] py-14">
      <div className="section-wrap">
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="terminal-label text-crimson">Tradable fighter assets</p>
            <h2 className="mt-3 font-display text-5xl font-bold uppercase leading-none text-shadow-red md:text-7xl">Asset Dossiers</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-400 md:text-base">
            Each listing quotes price, signal, power, volatility, catalyst, and a live mini chart. Dense enough for scanning, sharp enough for the underground desk.
          </p>
        </div>

        <div className="mb-6 grid gap-3 xl:grid-cols-[1fr_auto]">
          <label className="relative block">
            <span className="sr-only">Search fighter assets</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
            <input
              className="h-12 w-full rounded-md border border-white/10 bg-black/40 pl-11 pr-4 text-sm outline-none transition focus:border-ice/60 focus-visible:ring-2 focus-visible:ring-ice focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              placeholder="Search fighter, symbol, crew..."
              value={query}
              aria-label="Search fighter assets"
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {factions.map((item) => (
              <button
                key={item}
                className={`rounded-md border px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] transition ${
                  filter === item ? "border-crimson/60 bg-crimson/15 text-white" : "border-white/10 bg-white/[0.035] text-slate-400 hover:border-ice/40 hover:text-white"
                }`}
                aria-pressed={filter === item}
                type="button"
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6 grid gap-3 rounded-md border border-white/10 bg-black/25 p-3 md:grid-cols-[auto_1fr_1fr] md:items-center">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <SlidersHorizontal size={16} className="text-ice" />
            <span className="terminal-label">Desk filters</span>
          </div>
          <label className="grid gap-2">
            <span className="sr-only">Filter by signal</span>
            <select className="h-11 rounded-md border border-white/10 bg-black/40 px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ice" value={signal} onChange={(event) => setSignal(event.target.value)}>
              <option value="All">All signals</option>
              <option value="BUY">Back signals</option>
              <option value="HOLD">Hold signals</option>
              <option value="SHORT">Short signals</option>
            </select>
          </label>
          <label className="grid gap-2">
            <span className="sr-only">Sort assets</span>
            <select className="h-11 rounded-md border border-white/10 bg-black/40 px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ice" value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="hype">Sort by hype</option>
              <option value="price">Sort by price</option>
              <option value="change">Sort by change</option>
              <option value="power">Sort by power</option>
              <option value="volatility">Sort by volatility</option>
              <option value="volume">Sort by volume</option>
            </select>
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((asset, index) => (
            <StockCard key={asset.symbol} asset={asset} index={index} />
          ))}
        </div>
        {filtered.length === 0 ? (
          <div className="mt-6 rounded-md border border-white/10 bg-black/35 p-6 text-sm text-slate-300">
            No assets matched that scan. Clear the search or switch sectors to reopen the board.
          </div>
        ) : null}
      </div>
    </section>
  );
}
