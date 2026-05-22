import redditStocks from "@/public/data/reddit-stocks.json";
import { assets, type MarketAsset, type StockPoint } from "@/lib/market-data";
import type { Account, CustomStock } from "@/lib/account";

type RedditStock = {
  name: string;
  price: number;
  change?: number;
  changePercent: number;
  mentions: number;
  sentiment: number;
  trend: "up" | "down" | "flat";
  reason: string;
};

type RedditFeed = {
  generatedAt: string;
  postsScanned: number;
  market?: RedditStock[];
};

const feed = redditStocks as RedditFeed;

const redditSymbolAliases: Record<string, string[]> = {
  "Daniel Park": ["BDNL", "LDNL"],
  "Gun Park": ["GUN", "WTJC"],
  "Goo Kim": ["GOO"],
  "Johan Seong": ["JHL"],
  "Jake Kim": ["JKE", "BDL"],
  "Eli Jang": ["ELI", "HSTL"],
  Vasco: ["VAS"],
  "Zack Lee": ["ZACK"],
  "Samuel Seo": ["SML"],
  "James Lee": ["JMS"],
  "Kitae Kim": ["KTAE"],
  "Gitae Kim": ["KTAE"],
  Elite: ["CCH"]
};

const redditOnlySymbols: Record<string, string> = {
  "Tom Lee": "TOM",
  "Jay Hong": "JAY",
  "Vin Jin": "VIN",
  "Mary Kim": "MRY",
  "Sinu Han": "SINU",
  "Seongji Yuk": "SGJ"
};

const factionHints: Record<string, string> = {
  "Tom Lee": "White Tiger",
  "Jay Hong": "J High",
  "Vin Jin": "Cheonliang",
  "Mary Kim": "Cheonliang",
  "Sinu Han": "Big Deal",
  "Seongji Yuk": "Cheonliang"
};

export const redditMarketMeta = {
  generatedAt: feed.generatedAt,
  postsScanned: feed.postsScanned
};

const redditMarket = feed.market ?? [];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function signalFromChange(change: number): MarketAsset["signal"] {
  if (change >= 3) return "BUY";
  if (change <= -3) return "SHORT";
  return "HOLD";
}

function accentFromTrend(stock: RedditStock, fallback = "#c7ccd4") {
  if (stock.changePercent > 4) return "#93b7d8";
  if (stock.changePercent < -2) return "#d71920";
  return fallback;
}

function chartFromSignal(price: number, changePercent: number): StockPoint[] {
  const start = price / (1 + changePercent / 100 || 1);
  const noise = [-0.35, 0.18, -0.1, 0.28, -0.16, 0.22, -0.08, 0.12, 0];

  return noise.map((move, index) => {
    const progress = index / (noise.length - 1);
    const value = start + (price - start) * progress + price * move * 0.015;
    return {
      t: `${index + 9}:00`,
      value: Number(value.toFixed(2))
    };
  });
}

function normalizeSymbol(value: string) {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
}

function redditBySymbol() {
  const entries = new Map<string, RedditStock>();

  for (const stock of redditMarket) {
    const symbols = redditSymbolAliases[stock.name] ?? [];
    for (const symbol of symbols) {
      entries.set(symbol, stock);
    }
  }

  return entries;
}

function applyRedditSignal(asset: MarketAsset, stock: RedditStock): MarketAsset {
  const priceMultiplier = asset.symbol === "LDNL" ? 0.94 : asset.symbol === "WTJC" ? 1.08 : asset.symbol === "BDL" || asset.symbol === "HSTL" ? 0.82 : 1;
  const price = Number((stock.price * priceMultiplier).toFixed(2));
  const mentionBoost = stock.mentions * 1_250_000;

  return {
    ...asset,
    price,
    change: Number(stock.changePercent.toFixed(2)),
    marketCap: Math.max(asset.marketCap, Math.round(price * 18_000_000 + mentionBoost)),
    volume: Math.max(asset.volume, Math.round(stock.mentions * 1_000_000 + Math.abs(stock.changePercent) * 2_400_000)),
    power: clamp(Math.round(asset.power + stock.sentiment * 2 + stock.mentions / 40), 1, 100),
    volatility: clamp(Math.round(Math.abs(stock.changePercent) * 7 + stock.mentions / 3 + 32), 12, 99),
    signal: signalFromChange(stock.changePercent),
    accent: accentFromTrend(stock, asset.accent),
    quote: `${stock.reason} Reddit mentions: ${stock.mentions}.`,
    chart: chartFromSignal(price, stock.changePercent)
  };
}

function redditOnlyAsset(stock: RedditStock): MarketAsset | null {
  const symbol = redditOnlySymbols[stock.name] ?? normalizeSymbol(stock.name);
  if (!symbol || assets.some((asset) => asset.symbol === symbol)) return null;

  const price = Number(stock.price.toFixed(2));
  return {
    symbol,
    name: stock.name,
    category: "Character",
    price,
    change: Number(stock.changePercent.toFixed(2)),
    marketCap: Math.round(price * 8_500_000 + stock.mentions * 950_000),
    volume: Math.round(8_000_000 + stock.mentions * 1_100_000),
    power: clamp(Math.round(72 + stock.mentions / 2 + stock.sentiment * 5), 45, 96),
    volatility: clamp(Math.round(38 + Math.abs(stock.changePercent) * 8 + stock.mentions / 2), 18, 99),
    signal: signalFromChange(stock.changePercent),
    faction: factionHints[stock.name] ?? "Reddit Wire",
    accent: accentFromTrend(stock),
    image: "/images/fighter-generic.svg",
    quote: `${stock.reason} Auto-listed from r/lookismcomic activity.`,
    chart: chartFromSignal(price, stock.changePercent)
  };
}

export function getLiveBaseAssets(): MarketAsset[] {
  const signals = redditBySymbol();
  const knownSymbols = new Set(assets.map((asset) => asset.symbol));
  const merged = assets.map((asset) => {
    const stock = signals.get(asset.symbol);
    return stock ? applyRedditSignal(asset, stock) : asset;
  });

  const autoListed = redditMarket
    .map(redditOnlyAsset)
    .filter((asset): asset is MarketAsset => Boolean(asset))
    .filter((asset) => {
      if (knownSymbols.has(asset.symbol)) return false;
      knownSymbols.add(asset.symbol);
      return true;
    });

  return [...merged, ...autoListed];
}

export function customStockToAsset(stock: CustomStock): MarketAsset {
  const price = clamp(Number(stock.price) || 25, 1, 9999);
  const symbolSeed = normalizeSymbol(stock.symbol);
  const seed = [...symbolSeed].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const change = Number((((seed % 13) - 5) / 2).toFixed(2));
  const accent = change >= 0 ? "#93b7d8" : "#d71920";

  return {
    symbol: symbolSeed,
    name: stock.name,
    category: "Character",
    price,
    change,
    marketCap: Math.round(price * 4_000_000 + seed * 95_000),
    volume: Math.round(2_000_000 + seed * 32_000),
    power: clamp(58 + (seed % 33), 40, 96),
    volatility: clamp(35 + (seed % 54), 20, 99),
    signal: signalFromChange(change),
    faction: stock.faction,
    accent,
    image: "/images/fighter-generic.svg",
    quote: "User-listed desk asset. Price is set at listing and trades with local portfolio logic.",
    chart: chartFromSignal(price, change)
  };
}

export function getTradableAssets(account?: Account | null): MarketAsset[] {
  const base = getLiveBaseAssets();
  const custom = account?.customStocks ?? [];
  const symbols = new Set(base.map((asset) => asset.symbol));

  return [
    ...base,
    ...custom.map(customStockToAsset).filter((asset) => {
      if (symbols.has(asset.symbol)) return false;
      symbols.add(asset.symbol);
      return true;
    })
  ];
}

export function findTradableAsset(symbol: string, account?: Account | null) {
  return getTradableAssets(account).find((asset) => asset.symbol === symbol);
}

export function getTickerTape() {
  const live = getLiveBaseAssets();
  return [...live, ...live.slice(0, 8)].map((asset) => ({
    symbol: asset.symbol,
    price: asset.price,
    change: asset.change
  }));
}
