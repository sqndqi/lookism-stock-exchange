import { NextResponse } from "next/server";
import { getAssetQuote } from "@/lib/market-engine";
import { getSourcesForAsset } from "@/lib/sources";

export async function GET(_request: Request, { params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;
  const asset = getAssetQuote(symbol);
  if (!asset) {
    return NextResponse.json({ error: "Asset not found" }, { status: 404 });
  }
  return NextResponse.json({ asset, sources: getSourcesForAsset(asset.symbol) });
}
