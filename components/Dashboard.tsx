import { marketPulse } from "@/lib/market-data";
import { getLiveBaseAssets, redditMarketMeta } from "@/lib/live-market";
import { formatCurrency, signedPercent } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StockCard } from "@/components/StockCard";
import { MarketChart } from "@/components/MarketChart";

export function Dashboard() {
  const assets = getLiveBaseAssets();
  const lead = assets.find((asset) => asset.symbol === "JMS") ?? assets[0];

  return (
    <section id="market" className="relative z-10 mx-auto w-[min(1180px,calc(100%-32px))] py-16">
      <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-ice">Crew market board</p>
          <h2 className="mt-3 text-4xl font-black uppercase leading-none md:text-6xl">Seoul Underground Exchange</h2>
        </div>
        <p className="max-w-xl text-slate-400">
          Street value, fight power, rumor heat, crew influence, and instability stay separated so this reads like Lookism, not Wall Street.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {marketPulse.map((item) => (
          <Card key={item.label} className="p-5">
            <item.icon className="mb-5 text-crimson" size={22} />
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate-500">{item.label}</p>
            <div className="mt-2 flex items-end justify-between">
              <strong className="text-3xl font-black">{item.value}</strong>
              <span className={item.delta.startsWith("+") ? "text-profit" : "text-danger"}>{item.delta}</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.3fr_.7fr]">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Generation War Index</CardTitle>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate-500">
              {lead.symbol} composite / {redditMarketMeta.postsScanned} posts scanned
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-5xl font-black">{formatCurrency(lead.price)}</p>
                <p className="text-ice">{signedPercent(lead.change)} street value shift</p>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[lead.signal === "BUY" ? "BACK" : lead.signal === "SHORT" ? "DROP" : "WATCH", `POWER ${lead.power}`, `INSTABILITY ${lead.volatility}`].map((text) => (
                  <div key={text} className="rounded-md border border-white/10 bg-white/[0.035] px-4 py-3 font-mono text-xs uppercase tracking-[0.16em] text-slate-300">
                    {text}
                  </div>
                ))}
              </div>
            </div>
            <MarketChart asset={lead} height={280} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Biggest Hype Spikes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {assets.slice(0, 6).map((asset) => (
              <div key={asset.symbol} className="flex items-center justify-between rounded-md border border-white/10 bg-black/20 p-3">
                <div>
                  <p className="font-semibold">{asset.name}</p>
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">{asset.symbol}</p>
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

      <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {assets.map((asset, index) => (
          <StockCard key={asset.symbol} asset={asset} index={index} />
        ))}
      </div>
    </section>
  );
}
