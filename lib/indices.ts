import type { MarketAsset } from "@/lib/market-data";

export type MarketIndex = {
  symbol: string;
  name: string;
  description: string;
  components: Array<{ symbol: string; weight: number }>;
};

export const marketIndices: MarketIndex[] = [
  {
    symbol: "AURA100",
    name: "AURA-100 Fighter Composite",
    description: "Top fighter composite weighted toward power, hype, and liquidity.",
    components: [
      { symbol: "DAN", weight: 20 },
      { symbol: "JMS", weight: 18 },
      { symbol: "GUN", weight: 18 },
      { symbol: "KTAE", weight: 15 },
      { symbol: "TOM", weight: 12 },
      { symbol: "SGJ", weight: 10 },
      { symbol: "GOO", weight: 7 }
    ]
  },
  {
    symbol: "CREWWAR",
    name: "Crew War Index",
    description: "Faction volatility basket for crew-sector pressure.",
    components: [
      { symbol: "WRK", weight: 28 },
      { symbol: "BDL", weight: 22 },
      { symbol: "WTJC", weight: 22 },
      { symbol: "JHI", weight: 16 },
      { symbol: "HSTL", weight: 12 }
    ]
  },
  {
    symbol: "JHIGH",
    name: "J High Alliance Index",
    description: "School-side protagonist basket for Daniel-circle movement.",
    components: [
      { symbol: "DAN", weight: 35 },
      { symbol: "LDAN", weight: 25 },
      { symbol: "JHI", weight: 20 },
      { symbol: "VAS", weight: 10 },
      { symbol: "ZACK", weight: 10 }
    ]
  }
];

export function calculateIndices(assets: MarketAsset[]) {
  const bySymbol = new Map(assets.map((asset) => [asset.symbol, asset]));
  return marketIndices.map((index) => {
    const components = index.components.map((component) => ({ ...component, asset: bySymbol.get(component.symbol) })).filter((item) => item.asset);
    const totalWeight = components.reduce((sum, component) => sum + component.weight, 0) || 1;
    const price = components.reduce((sum, component) => sum + (component.asset?.price ?? 0) * (component.weight / totalWeight), 0);
    const change = components.reduce((sum, component) => sum + (component.asset?.change ?? 0) * (component.weight / totalWeight), 0);
    return {
      ...index,
      price: Number(price.toFixed(2)),
      change: Number(change.toFixed(2)),
      components: components.map((component) => ({
        symbol: component.symbol,
        weight: component.weight,
        name: component.asset?.name ?? component.symbol,
        price: component.asset?.price ?? 0
      }))
    };
  });
}
