import { apiOk } from "@/lib/api-response";
import { getMarketState } from "@/lib/market-engine";

export function GET() {
  const market = getMarketState();
  return apiOk({ factions: market.factions }, { generatedAt: market.generatedAt, factionCount: market.factions.length });
}
