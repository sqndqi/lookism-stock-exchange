import { getLiveBaseAssets, type MarketAutomationSnapshot } from "@/lib/live-market";
import type { Account } from "@/lib/account";
import type { MarketAsset } from "@/lib/market-data";
import { getSourcesForAsset, sourceImpactForSymbol } from "@/lib/sources";
import { marketEvents } from "@/lib/events";
import { currentSeason } from "@/lib/seasons";
import { calculateIndices } from "@/lib/indices";
import { calculateFactionSectors } from "@/lib/factions";

export type AssetQuote = MarketAsset & {
  previousClose: number;
  changePercent: number;
  hype: number;
  risk: number;
  confidence: number;
  liquidity: number;
  sourceCount: number;
  moveExplanation: string;
  lore: string;
  bullCase: string;
  bearCase: string;
};

export type MarketState = {
  generatedAt: string;
  engineVersion: string;
  season: typeof currentSeason;
  marketStatus: "open" | "review" | "closed";
  assets: AssetQuote[];
  topGainers: AssetQuote[];
  topLosers: AssetQuote[];
  mostVolatile: AssetQuote[];
  mostWatched: AssetQuote[];
  trendingCatalysts: ReturnType<typeof getSourcesForAsset>;
  events: typeof marketEvents;
  indices: ReturnType<typeof calculateIndices>;
  factions: ReturnType<typeof calculateFactionSectors>;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function quoteFromAsset(asset: MarketAsset): AssetQuote {
  const sourceSignal = sourceImpactForSymbol(asset.symbol);
  const eventBoost = marketEvents
    .filter((event) => event.status === "live" && (event.affectedSymbols.includes(asset.symbol) || event.affectedFactions.includes(asset.faction)))
    .reduce((sum, event) => sum + event.expectedImpact * 0.04, 0);
  const seasonBoost = currentSeason.featuredSymbols.includes(asset.symbol) ? 3 : 0;
  const previousClose = Number((asset.price / (1 + asset.change / 100 || 1)).toFixed(2));
  const hype = asset.hype ?? clamp(Math.round(asset.volume / 1_700_000 + sourceSignal.hype * 0.28 + eventBoost + seasonBoost), 8, 100);
  const risk = asset.risk ?? clamp(Math.round(asset.volatility * currentSeason.modifiers.volatilityMultiplier * 0.72 + Math.abs(asset.change) * 1.8 + eventBoost * 0.5), 10, 100);
  const confidence = asset.confidence ?? sourceSignal.confidence;
  const liquidity = asset.liquidity ?? clamp(Math.round(asset.volume / 2_000_000), 8, 100);
  const sources = getSourcesForAsset(asset.symbol);

  return {
    ...asset,
    previousClose,
    changePercent: asset.change,
    hype,
    risk,
    confidence,
    liquidity,
    sourceCount: sources.length,
    lore: asset.lore ?? asset.quote,
    bullCase: asset.bullCase ?? `${asset.name} benefits when ${asset.faction} catalysts, hype, and source confidence stay elevated.`,
    bearCase: asset.bearCase ?? `${asset.name} weakens if rumor heat fades, volatility spikes, or stronger related assets absorb attention.`,
    moveExplanation: explainAssetMove(asset)
  };
}

export function explainAssetMove(asset: MarketAsset) {
  const sourceSignal = sourceImpactForSymbol(asset.symbol);
  const direction = asset.change >= 0 ? "higher" : "lower";
  return `${asset.symbol} priced ${direction} from ${sourceSignal.summary} Source impact ${sourceSignal.impact}, hype ${sourceSignal.hype}, confidence ${sourceSignal.confidence}.`;
}

export function getMarketState(account?: Account | null, automation?: MarketAutomationSnapshot | null): MarketState {
  const watchlist = account?.watchlist ?? [];
  const quotes = getLiveBaseAssets(automation).map((asset) => quoteFromAsset(asset));

  return {
    generatedAt: automation?.generatedAt ?? "static-fallback",
    engineVersion: "aura-engine-2.0",
    season: currentSeason,
    marketStatus: "open",
    assets: quotes,
    topGainers: [...quotes].sort((a, b) => b.changePercent - a.changePercent).slice(0, 6),
    topLosers: [...quotes].sort((a, b) => a.changePercent - b.changePercent).slice(0, 6),
    mostVolatile: [...quotes].sort((a, b) => b.risk - a.risk).slice(0, 6),
    mostWatched: [...quotes].sort((a, b) => Number(watchlist.includes(b.symbol)) - Number(watchlist.includes(a.symbol)) || b.hype - a.hype).slice(0, 6),
    trendingCatalysts: quotes.flatMap((asset) => getSourcesForAsset(asset.symbol)).slice(0, 8),
    events: marketEvents,
    indices: calculateIndices(quotes),
    factions: calculateFactionSectors(quotes)
  };
}

export function getAssetQuote(symbol: string, account?: Account | null, automation?: MarketAutomationSnapshot | null) {
  return getMarketState(account, automation).assets.find((asset) => asset.symbol === symbol.toUpperCase());
}

export function getRelatedAssets(asset: AssetQuote, allAssets: AssetQuote[]) {
  const related = new Set([...(asset.related ?? []), ...(asset.affected ?? [])]);
  return allAssets
    .filter((item) => item.symbol !== asset.symbol)
    .filter((item) => related.has(item.symbol) || item.faction === asset.faction || item.category === asset.category)
    .slice(0, 4);
}
