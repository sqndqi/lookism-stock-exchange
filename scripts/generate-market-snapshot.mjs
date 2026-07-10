import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const marketDataPath = path.join(root, "lib", "market-data.ts");
const redditPath = path.join(root, "public", "data", "reddit-stocks.json");
const eventsPath = path.join(root, "lib", "events.ts");
const outputPath = path.join(root, "public", "data", "market-snapshot.json");

function extractAssets(source) {
  const blocks = source.match(/\{\s*symbol:[\s\S]*?\n  \}/g) ?? [];
  return blocks
    .map((block) => ({
      symbol: block.match(/symbol:\s*"([^"]+)"/)?.[1],
      name: block.match(/name:\s*"([^"]+)"/)?.[1],
      faction: block.match(/faction:\s*"([^"]+)"/)?.[1],
      price: Number(block.match(/price:\s*([0-9.]+)/)?.[1]),
      change: Number(block.match(/change:\s*(-?[0-9.]+)/)?.[1]),
      volume: Number(block.match(/volume:\s*([0-9_]+)/)?.[1]?.replaceAll("_", "")),
      volatility: Number(block.match(/volatility:\s*([0-9.]+)/)?.[1])
    }))
    .filter((asset) => asset.symbol && Number.isFinite(asset.price));
}

const source = await readFile(marketDataPath, "utf8");
const reddit = JSON.parse(await readFile(redditPath, "utf8"));
const eventsSource = await readFile(eventsPath, "utf8");
const assets = extractAssets(source).map((asset) => {
  const redditSignal = (reddit.market ?? []).find((item) => asset.name?.includes(item.name) || item.name?.includes(asset.name));
  const sourceImpact = redditSignal ? Math.max(-12, Math.min(12, redditSignal.changePercent)) : asset.change;
  const price = Number((asset.price * (1 + sourceImpact / 100 * 0.18)).toFixed(2));
  return {
    ...asset,
    price,
    change: Number(sourceImpact.toFixed(2)),
    generatedBy: "AURA deterministic snapshot v1"
  };
});

const indices = [
  { symbol: "AURA100", components: ["DAN", "JMS", "GUN", "KTAE", "TOM", "SGJ", "GOO"] },
  { symbol: "CREWWAR", components: ["WRK", "BDL", "WTJC", "JHI", "HSTL"] },
  { symbol: "JHIGH", components: ["DAN", "LDAN", "JHI", "VAS", "ZACK"] }
].map((index) => {
  const components = index.components.map((symbol) => assets.find((asset) => asset.symbol === symbol)).filter(Boolean);
  const price = components.reduce((sum, asset) => sum + asset.price, 0) / (components.length || 1);
  const change = components.reduce((sum, asset) => sum + asset.change, 0) / (components.length || 1);
  return { ...index, price: Number(price.toFixed(2)), change: Number(change.toFixed(2)) };
});

const events = [...eventsSource.matchAll(/\{\s*id:\s*"([^"]+)"[\s\S]*?title:\s*"([^"]+)"[\s\S]*?status:\s*"([^"]+)"[\s\S]*?\}/g)]
  .map((match) => ({ id: match[1], title: match[2], status: match[3] }));

const movers = {
  gainers: [...assets].sort((a, b) => b.change - a.change).slice(0, 5).map((asset) => asset.symbol),
  losers: [...assets].sort((a, b) => a.change - b.change).slice(0, 5).map((asset) => asset.symbol),
  volatile: [...assets].sort((a, b) => b.volatility - a.volatility).slice(0, 5).map((asset) => asset.symbol)
};

const snapshot = {
  generatedAt: new Date().toISOString(),
  engineVersion: "aura-engine-2.0",
  marketStatus: "open",
  season: "season-1-seoul-opening-bell",
  source: "static assets + cached reddit signal fallback + manual events",
  assetCount: assets.length,
  indices,
  movers,
  events,
  sourcesSummary: {
    cachedRedditGeneratedAt: reddit.generatedAt,
    cachedPostsScanned: reddit.postsScanned,
    warnings: ["No external API key required; cached/fallback data is safe for offline builds."]
  },
  assets
};

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`);
console.log(`Generated market snapshot for ${assets.length} assets.`);
