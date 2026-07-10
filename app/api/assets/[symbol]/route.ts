import { apiError, apiOk } from "@/lib/api-response";
import { getAssetQuote } from "@/lib/market-engine";
import { getSourcesForAsset } from "@/lib/sources";

export async function GET(_request: Request, { params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;
  const asset = getAssetQuote(symbol);
  if (!asset) {
    return apiError("ASSET_NOT_FOUND", "Asset not found", 404, { symbol: symbol.toUpperCase() });
  }
  return apiOk({ asset, sources: getSourcesForAsset(asset.symbol) }, { symbol: asset.symbol });
}
