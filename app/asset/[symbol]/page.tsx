import { assets } from "@/lib/market-data";
import { AssetDetailTerminal } from "@/components/AssetDetailTerminal";

export function generateStaticParams() {
  return assets.map((asset) => ({ symbol: asset.symbol }));
}

export default async function AssetPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;
  return <AssetDetailTerminal symbol={symbol} />;
}
