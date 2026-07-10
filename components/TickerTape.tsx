"use client";

import { getTickerTape } from "@/lib/live-market";
import { useMarketAutomation } from "@/lib/use-market-automation";
import { formatCurrency, signedPercent } from "@/lib/utils";

export function TickerTape() {
  const automation = useMarketAutomation();
  const tickerTape = getTickerTape(automation);

  return (
    <section className="relative z-20 border-y border-white/10 bg-black/80 py-3 backdrop-blur-xl">
      <div className="flex animate-ticker gap-8 whitespace-nowrap">
        {tickerTape.map((item, index) => (
          <div key={`${item.symbol}-${index}`} className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.14em]">
            <span className="h-1.5 w-1.5 rounded-full bg-crimson shadow-[0_0_12px_rgba(239,35,60,.9)]" />
            <span className="text-white">{item.symbol}</span>
            <span className="text-slate-400">{formatCurrency(item.price)}</span>
            <span className={item.change >= 0 ? "text-ice" : "text-crimson"}>{signedPercent(item.change)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
