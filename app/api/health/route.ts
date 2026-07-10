import { apiOk } from "@/lib/api-response";
import { getMarketState } from "@/lib/market-engine";
import { getSourceRecords } from "@/lib/sources";
import snapshot from "@/public/data/market-snapshot.json";

export function GET() {
  const market = getMarketState();
  return apiOk({
    status: "healthy",
    generatedAt: market.generatedAt,
    engineVersion: market.engineVersion,
    assetCount: market.assets.length,
    sourceCount: getSourceRecords().length,
    eventCount: market.events.length,
    season: market.season.id,
    snapshotStatus: snapshot?.generatedAt ? "generated" : "missing",
    snapshotGeneratedAt: snapshot?.generatedAt ?? null
  });
}
