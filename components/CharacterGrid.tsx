"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { getLiveBaseAssets } from "@/lib/live-market";
import { useMarketAutomation } from "@/lib/use-market-automation";
import { StockCard } from "@/components/StockCard";

export function CharacterGrid() {
  const automation = useMarketAutomation();
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const assets = getLiveBaseAssets(automation);
  const factions = ["All", ...Array.from(new Set(assets.map((asset) => asset.category === "Character" ? asset.faction : asset.category)))].slice(0, 8);
  const filtered = useMemo(
    () =>
      assets.filter((asset) => {
        const matchesFilter = filter === "All" || asset.faction === filter || asset.category === filter;
        const text = `${asset.name} ${asset.symbol} ${asset.faction}`.toLowerCase();
        return matchesFilter && text.includes(query.toLowerCase());
      }),
    [assets, filter, query]
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

        <div className="mb-6 grid gap-3 lg:grid-cols-[1fr_auto]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
            <input
              className="h-12 w-full rounded-md border border-white/10 bg-black/40 pl-11 pr-4 text-sm outline-none transition focus:border-ice/60"
              placeholder="Search fighter, symbol, crew..."
              value={query}
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
                type="button"
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((asset, index) => (
            <StockCard key={asset.symbol} asset={asset} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
