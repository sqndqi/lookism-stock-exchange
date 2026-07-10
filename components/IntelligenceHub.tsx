import redditStocks from "@/public/data/reddit-stocks.json";
import Link from "next/link";
import { wikiDossiers } from "@/lib/market-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSourceRecords } from "@/lib/sources";

type RedditStock = {
  name: string;
  price: number;
  changePercent: number;
  mentions: number;
  sentiment: number;
  reason: string;
  citedPosts?: Array<{ title: string; url: string; ups: number; comments: number }>;
};

const redditMarket = (redditStocks.market ?? []) as RedditStock[];
const citedPosts = redditMarket
  .flatMap((stock) =>
    (stock.citedPosts ?? []).map((post) => ({
      ...post,
      stock: stock.name
    }))
  )
  .sort((a, b) => b.ups + b.comments - (a.ups + a.comments))
  .slice(0, 5);
const sourceRecords = getSourceRecords().slice(0, 8);

export function IntelligenceHub() {
  return (
    <section id="intel" className="section-wrap relative z-10 py-14">
      <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="terminal-label text-ice">Live intelligence feed</p>
          <h2 className="mt-3 font-display text-5xl font-bold uppercase leading-none md:text-7xl">Catalyst Desk</h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-slate-400 md:text-base">
          Chapter catalysts, Reddit rumors, power-scaling disputes, and crew movement translated into market impact.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[.95fr_1.05fr]">
        <Card className="overflow-hidden">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-3">
              <Badge>Source signals</Badge>
              <span className="terminal-label">
                {sourceRecords.length} active records / {redditStocks.postsScanned} posts scanned
              </span>
            </div>
            <CardTitle className="mt-3">Rumor Catalyst Board</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sourceRecords.map((source) => (
              <div key={source.id} className="rounded-md border border-white/10 bg-black/25 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-display text-3xl font-bold uppercase leading-none">{source.title}</p>
                    <p className="mt-1 text-sm text-slate-400">{source.summary}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm">{source.type}</p>
                    <p className={source.impact >= 0 ? "text-ice" : "text-crimson"}>
                      Impact {source.impact}
                    </p>
                  </div>
                </div>
                <div className="terminal-label mt-3 grid grid-cols-2 gap-3 text-[0.58rem]">
                  <span>Confidence {source.confidence}</span>
                  <span>Hype {source.hype}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[...source.characterSymbols, ...source.crewSymbols].map((symbol) => (
                    <Link key={symbol} href={`/asset/${symbol}`} className="rounded border border-white/10 px-2 py-1 text-xs text-ice transition hover:border-ice/50">
                      {symbol}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid gap-5">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center gap-3">
                <Badge>Chapter context</Badge>
                <a
                  className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500 transition hover:text-cyanline"
                  href="https://lookism.fandom.com/wiki/Lookism_Wikia"
                  target="_blank"
                  rel="noreferrer"
                >
                  source map
                </a>
              </div>
              <CardTitle className="mt-3">Fight Dossiers</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {wikiDossiers.map((dossier) => (
                <a
                  key={dossier.name}
                  href={`https://lookism.fandom.com/wiki/${dossier.sourcePath}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md border border-white/10 bg-white/[0.035] p-4 transition hover:border-cyanline/50 hover:bg-cyanline/10"
                >
                  <p className="text-2xl font-black">{dossier.name}</p>
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-ice">{dossier.group}</p>
                  <p className="mt-3 text-sm text-slate-400">{dossier.role}</p>
                  <p className="mt-2 text-sm text-slate-300">{dossier.marketUse}</p>
                </a>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Discussion Catalysts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {citedPosts.map((post) => (
                <a
                  key={`${post.stock}-${post.url}`}
                  href={post.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-md border border-white/10 bg-black/20 p-4 transition hover:border-cyanline/50 hover:bg-cyanline/10"
                >
                  <p className="font-semibold">{post.title}</p>
                  <p className="mt-2 font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
                    {post.stock} / {post.ups} upvotes / {post.comments} comments
                  </p>
                </a>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
