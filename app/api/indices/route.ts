import { apiOk } from "@/lib/api-response";
import { getMarketState } from "@/lib/market-engine";

export function GET() {
  const market = getMarketState();
  return apiOk({ indices: market.indices }, { generatedAt: market.generatedAt, indexCount: market.indices.length });
}
