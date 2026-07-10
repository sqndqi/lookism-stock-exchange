import type { MarketAsset } from "@/lib/market-data";

export function calculateFactionSectors(assets: MarketAsset[]) {
  const byFaction = new Map<string, MarketAsset[]>();
  for (const asset of assets) {
    byFaction.set(asset.faction, [...(byFaction.get(asset.faction) ?? []), asset]);
  }

  return [...byFaction.entries()].map(([faction, members]) => {
    const marketCap = members.reduce((sum, asset) => sum + asset.marketCap, 0);
    const avgReturn = members.reduce((sum, asset) => sum + asset.change, 0) / members.length;
    const hype = members.reduce((sum, asset) => sum + (asset.hype ?? Math.min(100, asset.volume / 1_700_000)), 0) / members.length;
    const risk = members.reduce((sum, asset) => sum + (asset.risk ?? asset.volatility), 0) / members.length;
    return {
      slug: faction.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      name: faction,
      symbol: faction.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8) || "SECTOR",
      description: `${faction} sector basket across ${members.length} listed assets.`,
      members,
      influence: Math.min(100, Math.round(marketCap / 180_000_000)),
      risk: Math.round(risk),
      hype: Math.round(hype),
      averageReturn: Number(avgReturn.toFixed(2)),
      marketCap
    };
  }).sort((a, b) => b.marketCap - a.marketCap);
}
