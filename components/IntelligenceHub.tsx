import redditStocks from "@/public/data/reddit-stocks.json";
import { wikiDossiers } from "@/lib/market-data";
import { formatCurrency, signedPercent } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

export function IntelligenceHub() {
  return (
    <section id="intel" className="relative z-10 mx-auto w-[min(1180px,calc(100%-32px))] py-16">
      <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-ice">Rumor wire</p>
          <h2 className="mt-3 text-4xl font-black uppercase leading-none md:text-6xl">Why Did This Move?</h2>
        </div>
        <p className="max-w-xl text-slate-400">
          Reddit catalysts, chapter theories, and Lookism Wiki context converted into fighter and crew movement.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[.95fr_1.05fr]">
        <Card className="overflow-hidden">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-3">
              <Badge>r/lookismcomic</Badge>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">
                {redditStocks.postsScanned} posts scanned
              </span>
            </div>
            <CardTitle className="mt-3">Rumor Catalyst Board</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {redditMarket.slice(0, 6).map((stock) => (
              <div key={stock.name} className="rounded-md border border-white/10 bg-black/25 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-2xl font-black leading-none">{stock.name}</p>
                    <p className="mt-1 text-sm text-slate-400">{stock.reason}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm">{formatCurrency(stock.price)} street value</p>
                    <p className={stock.changePercent >= 0 ? "text-ice" : "text-crimson"}>
                      {signedPercent(stock.changePercent)}
                    </p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 font-mono text-xs uppercase tracking-[0.16em] text-slate-500">
                  <span>Rumor Heat {stock.mentions}</span>
                  <span>Aura Sentiment {stock.sentiment}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid gap-5">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center gap-3">
                <Badge>Lookism Wikia</Badge>
                <a
                  className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500 transition hover:text-cyanline"
                  href="https://lookism.fandom.com/wiki/Lookism_Wikia"
                  target="_blank"
                  rel="noreferrer"
                >
                  source map
                </a>
              </div>
              <CardTitle className="mt-3">Wikia Dossiers</CardTitle>
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
