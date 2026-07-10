import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const marketDataPath = path.join(root, "lib", "market-data.ts");
const redditPath = path.join(root, "public", "data", "reddit-stocks.json");
const eventsPath = path.join(root, "lib", "events.ts");
const sourcesPath = path.join(root, "lib", "sources.ts");

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

const eventsSource = await readFile(eventsPath, "utf8");
const eventSymbolRefs = [...eventsSource.matchAll(/affectedSymbols:\s*\[([^\]]*)\]/g)]
  .flatMap((match) => [...match[1].matchAll(/"([^"]+)"/g)].map((item) => item[1]));
for (const symbol of eventSymbolRefs) {
  if (!symbols.has(symbol)) fail(`Event references unknown symbol ${symbol}.`);
}

const sourceRecords = await readFile(sourcesPath, "utf8");
const sourceSymbolRefs = [...sourceRecords.matchAll(/(?:characterSymbols|crewSymbols):\s*\[([^\]]*)\]/g)]
  .flatMap((match) => [...match[1].matchAll(/"([^"]+)"/g)].map((item) => item[1]));
for (const symbol of sourceSymbolRefs) {
  if (!symbols.has(symbol)) fail(`Source references unknown symbol ${symbol}.`);
}

const summaries = [...sourceRecords.matchAll(/summary:\s*"([^"]+)"/g)].map((match) => match[1]);
for (const summary of summaries) {
  if (summary.split(/\s+/).length > 48) fail(`Source summary is too long: ${summary.slice(0, 64)}...`);
}

if (!process.exitCode) {
  console.log(`Validated ${assets.length} assets, ${eventSymbolRefs.length} event refs, and ${sourceSymbolRefs.length} source refs.`);
}
