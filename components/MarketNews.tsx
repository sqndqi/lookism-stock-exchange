import { factionRanks, news } from "@/lib/market-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function MarketNews() {
  return (
    <section id="news" className="relative z-10 border-t border-white/10 bg-black/25 py-16">
      <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-5 lg:grid-cols-[1.25fr_.75fr]">
        <Card>
          <CardHeader>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-crimson">PTJ rumor wire</p>
            <CardTitle className="text-4xl md:text-5xl">Underground Intel</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {news.map((item) => (
              <article key={item.title} className="group rounded-lg border border-white/10 bg-white/[0.035] p-5 transition hover:border-cyanline/50 hover:bg-cyanline/10">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge>{item.tag}</Badge>
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">{item.time}</span>
                </div>
                <h3 className="mt-4 text-2xl font-black uppercase leading-tight transition group-hover:text-ice">{item.title}</h3>
                <p className="mt-4 font-mono text-sm uppercase tracking-[0.18em] text-ice">{item.impact}</p>
              </article>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Faction Ranking</CardTitle>
            <p className="text-sm text-slate-400">Leaderboard scored by power, liquidity, and rumor velocity.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {factionRanks.map((faction, index) => (
              <div key={faction.name} className="rounded-md border border-white/10 bg-black/20 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-md border border-white/10 bg-white/5">
                      <faction.icon size={18} />
                    </div>
                    <div>
                      <p className="font-semibold">{index + 1}. {faction.name}</p>
                      <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">Score {faction.score}</p>
                    </div>
                  </div>
                  <span className={faction.change.startsWith("+") ? "text-profit" : "text-danger"}>{faction.change}</span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-cyanline" style={{ width: `${faction.score}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
