import redditStocks from "@/public/data/reddit-stocks.json";
import { assets } from "@/lib/market-data";

export type SourceRecord = {
  id: string;
  type: "reddit" | "wiki" | "chapter" | "manual" | "official" | "community" | "dev";
  title: string;
  summary: string;
  url?: string;
  characterSymbols: string[];
  crewSymbols: string[];
  tags: string[];
  confidence: number;
  impact: number;
  sentiment: number;
  hype: number;
  createdAt: string;
  discoveredAt: string;
  expiresAt?: string;
  status: "active" | "stale" | "archived";
  attribution: string;
};

type RedditStock = {
  name: string;
  changePercent: number;
  mentions: number;
  sentiment: number;
  reason: string;
  citedPosts?: Array<{ title: string; url: string; ups: number; comments: number }>;
};

type RedditFeed = {
  generatedAt?: string;
  market?: RedditStock[];
};

const symbolByName = new Map<string, string>();
for (const asset of assets) {
  symbolByName.set(asset.name, asset.symbol);
  for (const alias of asset.aliases ?? []) {
    symbolByName.set(alias, asset.symbol);
  }
}

const manualSources: SourceRecord[] = [
  {
    id: "manual-dan-ui-body",
    type: "chapter",
    title: "UI/body mystery keeps Daniel basket at the center of the board",
    summary: "Manual catalyst tracking second-body control theories, rescue timing, and UI escalation discourse.",
    characterSymbols: ["DAN", "LDAN"],
    crewSymbols: ["JHI"],
    tags: ["chapter catalyst", "ui", "protagonist"],
    confidence: 84,
    impact: 72,
    sentiment: 54,
    hype: 91,
    createdAt: "2026-07-01T00:00:00.000Z",
    discoveredAt: "2026-07-01T00:00:00.000Z",
    status: "active",
    attribution: "AURA manual catalyst desk"
  },
  {
    id: "manual-workers-betrayal-risk",
    type: "manual",
    title: "Affiliate pressure keeps Workers risk elevated",
    summary: "Manual risk note for internal affiliate instability, Eugene strategy pressure, and betrayal-risk chatter.",
    characterSymbols: ["SML"],
    crewSymbols: ["WRK", "CCH"],
    tags: ["crew movement", "risk", "workers"],
    confidence: 78,
    impact: -58,
    sentiment: -46,
    hype: 74,
    createdAt: "2026-07-01T00:00:00.000Z",
    discoveredAt: "2026-07-01T00:00:00.000Z",
    status: "active",
    attribution: "AURA manual catalyst desk"
  },
  {
    id: "manual-gun-goo-spread",
    type: "community",
    title: "Gun/Goo spread stays volatile under power-scaling debate",
    summary: "Community signal summarizing TUI, weapon genius, and rematch arguments without copying source text.",
    characterSymbols: ["GUN", "GOO"],
    crewSymbols: ["WTJC"],
    tags: ["power scaling", "volatility", "spread"],
    confidence: 81,
    impact: 49,
    sentiment: 24,
    hype: 88,
    createdAt: "2026-07-01T00:00:00.000Z",
    discoveredAt: "2026-07-01T00:00:00.000Z",
    status: "active",
    attribution: "AURA community synthesis"
  }
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function redditSources(): SourceRecord[] {
  const feed = redditStocks as RedditFeed;
  const generatedAt = feed.generatedAt ?? new Date(0).toISOString();

  return (feed.market ?? []).flatMap((stock) => {
    const symbol = symbolByName.get(stock.name);
    if (!symbol) return [];

    const base: SourceRecord = {
      id: `reddit-${slug(stock.name)}`,
      type: "reddit",
      title: `${stock.name} rumor wire moved ${stock.changePercent >= 0 ? "up" : "down"}`,
      summary: stock.reason || "Reddit source signal moved the fictional market model.",
      characterSymbols: [symbol],
      crewSymbols: assets.find((asset) => asset.symbol === symbol)?.category === "Faction" ? [symbol] : [],
      tags: ["reddit", "rumor heat"],
      confidence: clamp(45 + stock.mentions * 2, 45, 92),
      impact: clamp(stock.changePercent * 8, -100, 100),
      sentiment: clamp(stock.sentiment * 100, -100, 100),
      hype: clamp(stock.mentions * 3, 0, 100),
      createdAt: generatedAt,
      discoveredAt: generatedAt,
      status: "active",
      attribution: "r/lookismcomic signal summary"
    };

    const cited = (stock.citedPosts ?? []).slice(0, 2).map((post, index) => ({
      ...base,
      id: `${base.id}-post-${index + 1}`,
      title: post.title.slice(0, 120),
      url: post.url,
      confidence: clamp(base.confidence + Math.round((post.ups + post.comments) / 60), 45, 96),
      hype: clamp(base.hype + Math.round((post.ups + post.comments) / 35), 0, 100),
      attribution: "r/lookismcomic cited discussion"
    }));

    return cited.length ? cited : [base];
  });
}

export function getSourceRecords(): SourceRecord[] {
  return [...manualSources, ...redditSources()];
}

export function getSourcesForAsset(symbol: string) {
  return getSourceRecords()
    .filter((source) => source.characterSymbols.includes(symbol) || source.crewSymbols.includes(symbol))
    .sort((a, b) => Math.abs(b.impact) + b.hype - (Math.abs(a.impact) + a.hype));
}

export function sourceImpactForSymbol(symbol: string) {
  const sources = getSourcesForAsset(symbol);
  if (!sources.length) return { impact: 0, hype: 0, confidence: 45, summary: "No active source signal. Fallback model is using base dossier data." };

  const weight = sources.reduce((sum, source) => sum + source.confidence, 0) || 1;
  const impact = sources.reduce((sum, source) => sum + source.impact * source.confidence, 0) / weight;
  const hype = sources.reduce((sum, source) => sum + source.hype * source.confidence, 0) / weight;
  const confidence = sources.reduce((sum, source) => sum + source.confidence, 0) / sources.length;

  return {
    impact: Math.round(impact),
    hype: Math.round(hype),
    confidence: Math.round(confidence),
    summary: sources[0].summary
  };
}
