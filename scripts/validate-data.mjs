import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const marketDataPath = path.join(root, "lib", "market-data.ts");
const redditPath = path.join(root, "public", "data", "reddit-stocks.json");

function fail(message) {
  console.error(`DATA ERROR: ${message}`);
  process.exitCode = 1;
}

function extractAssets(source) {
  const blocks = source.match(/\{\s*symbol:[\s\S]*?\n  \}/g) ?? [];
  return blocks
    .map((block) => ({
      symbol: block.match(/symbol:\s*"([^"]+)"/)?.[1],
      name: block.match(/name:\s*"([^"]+)"/)?.[1],
      image: block.match(/image:\s*"([^"]+)"/)?.[1],
      price: Number(block.match(/price:\s*([0-9.]+)/)?.[1]),
      power: Number(block.match(/power:\s*([0-9.]+)/)?.[1]),
      volatility: Number(block.match(/volatility:\s*([0-9.]+)/)?.[1])
    }))
    .filter((asset) => asset.symbol);
}

const source = await readFile(marketDataPath, "utf8");
const assets = extractAssets(source);
const symbols = new Set();

if (assets.length < 10) fail(`Expected at least 10 assets, found ${assets.length}.`);

for (const asset of assets) {
  if (symbols.has(asset.symbol)) fail(`Duplicate symbol ${asset.symbol}.`);
  symbols.add(asset.symbol);
  if (!asset.name) fail(`${asset.symbol} missing name.`);
  if (!Number.isFinite(asset.price) || asset.price <= 0) fail(`${asset.symbol} has invalid price.`);
  if (!Number.isFinite(asset.power) || asset.power < 1 || asset.power > 100) fail(`${asset.symbol} has invalid power.`);
  if (!Number.isFinite(asset.volatility) || asset.volatility < 1 || asset.volatility > 100) fail(`${asset.symbol} has invalid volatility.`);
  if (!asset.image) fail(`${asset.symbol} missing image.`);
}

try {
  const reddit = JSON.parse(await readFile(redditPath, "utf8"));
  if (!Array.isArray(reddit.market)) fail("reddit-stocks.json missing market array.");
} catch (error) {
  fail(`Unable to parse reddit-stocks.json: ${error instanceof Error ? error.message : String(error)}`);
}

if (!process.exitCode) {
  console.log(`Validated ${assets.length} assets and source fixtures.`);
}
