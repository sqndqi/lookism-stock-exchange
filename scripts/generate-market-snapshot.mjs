import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const marketDataPath = path.join(root, "lib", "market-data.ts");
const redditPath = path.join(root, "public", "data", "reddit-stocks.json");
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

const snapshot = {
  generatedAt: new Date().toISOString(),
  source: "static assets + cached reddit signal fallback",
  assetCount: assets.length,
  assets
};

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`);
console.log(`Generated market snapshot for ${assets.length} assets.`);
