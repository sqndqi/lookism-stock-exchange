import { tickerTape } from "@/lib/market-data";
import { formatCurrency, signedPercent } from "@/lib/utils";

export function TickerTape() {
  return (
    <section className="relative z-20 border-y border-crimson/20 bg-black/75 py-3 backdrop-blur-xl">
      <div className="flex animate-ticker gap-8 whitespace-nowrap">
        {tickerTape.map((item, index) => (
          <div key={`${item.symbol}-${index}`} className="flex items-center gap-3 font-mono text-sm uppercase tracking-[0.14em]">
            <span className="text-white">{item.symbol}</span>
            <span className="text-slate-400">{formatCurrency(item.price)}</span>
            <span className={item.change >= 0 ? "text-ice" : "text-crimson"}>{signedPercent(item.change)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
