import { NextResponse } from "next/server";
import { getMarketState } from "@/lib/market-engine";
import { getSourceRecords } from "@/lib/sources";

export function GET() {
  const market = getMarketState();
  return NextResponse.json({
    ok: true,
    engineVersion: market.engineVersion,
    assetCount: market.assets.length,
    sourceCount: getSourceRecords().length,
    eventCount: market.events.length,
    season: market.season.id
  });
}
