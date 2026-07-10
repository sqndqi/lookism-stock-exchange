import { apiOk } from "@/lib/api-response";
import { getMarketState } from "@/lib/market-engine";

export function GET() {
  const market = getMarketState();
  return apiOk(
    { assets: market.assets },
    { generatedAt: market.generatedAt, engineVersion: market.engineVersion, assetCount: market.assets.length }
  );
}
