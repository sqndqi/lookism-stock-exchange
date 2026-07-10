import { apiOk } from "@/lib/api-response";
import { getMarketState } from "@/lib/market-engine";

export function GET() {
  const market = getMarketState();
  return apiOk({
    generatedAt: market.generatedAt,
    topGainers: market.topGainers,
    topLosers: market.topLosers,
    mostVolatile: market.mostVolatile,
    mostWatched: market.mostWatched,
    indices: market.indices,
    season: market.season,
    events: market.events,
    assetCount: market.assets.length
  }, { engineVersion: market.engineVersion, marketStatus: market.marketStatus });
}
