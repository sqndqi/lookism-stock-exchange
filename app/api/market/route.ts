import { NextResponse } from "next/server";
import { getMarketState } from "@/lib/market-engine";

export function GET() {
  const market = getMarketState();
  return NextResponse.json({
    generatedAt: market.generatedAt,
    topGainers: market.topGainers,
    topLosers: market.topLosers,
    mostVolatile: market.mostVolatile,
    mostWatched: market.mostWatched,
    indices: market.indices,
    season: market.season,
    events: market.events,
    assetCount: market.assets.length
  });
}
