import { predictionContracts } from "@/lib/market-data";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function PredictionMarket() {
  return (
    <section id="predictions" className="relative z-10 border-y border-white/10 bg-white/[0.025] py-24">
      <div className="mx-auto w-[min(1440px,calc(100%-32px))]">
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-crimson">Reddit prophecy contracts</p>
            <h2 className="text-shadow-red mt-3 font-display text-6xl uppercase leading-none md:text-8xl">Fight Bets</h2>
          </div>
          <p className="max-w-xl text-slate-400">
            Better than a static poll: each contract has a liquidity pool, catalyst note, and odds ladder tied to current Lookism discourse.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {predictionContracts.map((contract) => (
            <Card key={contract.question} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <Badge>{contract.closes}</Badge>
                  <span className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
                    Pool {formatCurrency(contract.pool)}
                  </span>
                </div>
                <CardTitle className="mt-4 leading-none">{contract.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-5 text-sm leading-6 text-slate-400">{contract.catalyst}</p>
                <div className="space-y-3">
                  {contract.options.map((option) => (
                    <button
                      key={option.label}
                      className="w-full rounded-md border border-white/10 bg-black/25 p-3 text-left transition hover:border-cyanline/50 hover:bg-cyanline/10"
                      type="button"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <span className="font-semibold">{option.label}</span>
                        <span className="font-mono text-ice">{option.odds}%</span>
                      </div>
                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-crimson shadow-[0_0_18px_rgba(239,35,60,.45)]" style={{ width: `${option.odds}%` }} />
                      </div>
                    </button>
                  ))}
                </div>
                <Button className="mt-5 w-full" variant="ghost">Place paper bet</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
