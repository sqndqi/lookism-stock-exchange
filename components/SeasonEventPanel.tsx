import Link from "next/link";
import { currentSeason } from "@/lib/seasons";
import { marketEvents } from "@/lib/events";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function SeasonEventPanel() {
  return (
    <Card>
      <CardHeader>
        <Badge>{currentSeason.id}</Badge>
        <CardTitle className="mt-3">{currentSeason.name}</CardTitle>
        <p className="text-sm text-slate-400">{currentSeason.theme}</p>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="grid gap-2 sm:grid-cols-3">
          <div><p className="terminal-label">Start</p><p>{currentSeason.startsAt.slice(0, 10)}</p></div>
          <div><p className="terminal-label">Close</p><p>{currentSeason.endsAt.slice(0, 10)}</p></div>
          <div><p className="terminal-label">Starting credits</p><p>{currentSeason.startingCash.toLocaleString()}</p></div>
        </div>
        <div className="grid gap-3">
          {marketEvents.map((event) => (
            <article key={event.id} className="rounded-md border border-white/10 bg-black/25 p-4">
              <div className="mb-2 flex flex-wrap gap-2">
                <Badge>{event.status}</Badge>
                <span className="terminal-label">Impact {event.expectedImpact} / Confidence {event.confidence}</span>
              </div>
              <h3 className="font-display text-2xl font-bold uppercase">{event.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{event.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {event.affectedSymbols.map((symbol) => <Link key={symbol} className="rounded border border-white/10 px-2 py-1 text-xs text-ice" href={`/asset/${symbol}`}>{symbol}</Link>)}
              </div>
            </article>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
