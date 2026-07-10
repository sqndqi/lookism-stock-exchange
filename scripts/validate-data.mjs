import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const marketDataPath = path.join(root, "lib", "market-data.ts");
const redditPath = path.join(root, "public", "data", "reddit-stocks.json");
const eventsPath = path.join(root, "lib", "events.ts");
const sourcesPath = path.join(root, "lib", "sources.ts");
const seasonsPath = path.join(root, "lib", "seasons.ts");
const indicesPath = path.join(root, "lib", "indices.ts");
const snapshotPath = path.join(root, "public", "data", "market-snapshot.json");

function fail(message) {
  console.error(`DATA ERROR: ${message}`);
  process.exitCode = 1;
}

function extractAssets(source) {
  const blocks = source.match(/\{\s*symbol:[\s\S]*?\n  \}/g) ?? [];
  return blocks
    .map((block) => ({
      block,
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
  const chartMatch = asset.block.match(/chart:\s*series\(\s*([0-9.]+)\s*,\s*\[([^\]]+)\]/);
  const chartBase = Number(chartMatch?.[1]);
  const chartMoves = chartMatch?.[2].split(",").map((value) => Number(value.trim())) ?? [];
  if (!chartMatch || !Number.isFinite(chartBase) || chartBase <= 0 || chartMoves.length < 3 || chartMoves.some((value) => !Number.isFinite(value))) {
    fail(`${asset.symbol} has invalid chart data.`);
  }
  const related = [...asset.block.matchAll(/related:\s*\[([^\]]*)\]/g)]
    .flatMap((match) => [...match[1].matchAll(/"([^"]+)"/g)].map((item) => item[1]));
  for (const ref of related) {
    if (!symbols.has(ref)) fail(`${asset.symbol} references unknown related asset ${ref}.`);
  }
}

try {
  const reddit = JSON.parse(await readFile(redditPath, "utf8"));
  if (!Array.isArray(reddit.market)) fail("reddit-stocks.json missing market array.");
} catch (error) {
  fail(`Unable to parse reddit-stocks.json: ${error instanceof Error ? error.message : String(error)}`);
}

const eventsSource = await readFile(eventsPath, "utf8");
const eventIds = [...eventsSource.matchAll(/id:\s*"([^"]+)"/g)].map((match) => match[1]);
if (new Set(eventIds).size !== eventIds.length) fail("Duplicate event IDs found.");
const eventSymbolRefs = [...eventsSource.matchAll(/affectedSymbols:\s*\[([^\]]*)\]/g)]
  .flatMap((match) => [...match[1].matchAll(/"([^"]+)"/g)].map((item) => item[1]));
for (const symbol of eventSymbolRefs) {
  if (!symbols.has(symbol)) fail(`Event references unknown symbol ${symbol}.`);
}

const sourceRecords = await readFile(sourcesPath, "utf8");
const sourceIds = [...sourceRecords.matchAll(/id:\s*"([^"]+)"/g)].map((match) => match[1]);
if (new Set(sourceIds).size !== sourceIds.length) fail("Duplicate source IDs found.");
const sourceSymbolRefs = [...sourceRecords.matchAll(/(?:characterSymbols|crewSymbols):\s*\[([^\]]*)\]/g)]
  .flatMap((match) => [...match[1].matchAll(/"([^"]+)"/g)].map((item) => item[1]));
for (const symbol of sourceSymbolRefs) {
  if (!symbols.has(symbol)) fail(`Source references unknown symbol ${symbol}.`);
}

const summaries = [...sourceRecords.matchAll(/summary:\s*"([^"]+)"/g)].map((match) => match[1]);
for (const summary of summaries) {
  if (summary.split(/\s+/).length > 48) fail(`Source summary is too long: ${summary.slice(0, 64)}...`);
}

const seasonsSource = await readFile(seasonsPath, "utf8");
const seasonSymbols = [...seasonsSource.matchAll(/featuredSymbols:\s*\[([^\]]*)\]/g)]
  .flatMap((match) => [...match[1].matchAll(/"([^"]+)"/g)].map((item) => item[1]));
for (const symbol of seasonSymbols) {
  if (!symbols.has(symbol)) fail(`Season references unknown featured symbol ${symbol}.`);
}

const indicesSource = await readFile(indicesPath, "utf8");
const indexSymbols = [...indicesSource.matchAll(/\{\s*symbol:\s*"([^"]+)",\s*weight:/g)].map((match) => match[1]);
for (const symbol of indexSymbols) {
  if (!symbols.has(symbol)) fail(`Index references unknown component ${symbol}.`);
}

try {
  const snapshot = JSON.parse(await readFile(snapshotPath, "utf8"));
  for (const field of ["generatedAt", "engineVersion", "marketStatus", "season", "indices", "movers", "events", "assets"]) {
    if (!(field in snapshot)) fail(`market-snapshot.json missing ${field}.`);
  }
  if (!Array.isArray(snapshot.assets) || snapshot.assets.length !== assets.length) fail("market-snapshot.json asset count does not match market data.");
} catch (error) {
  fail(`Unable to parse market-snapshot.json: ${error instanceof Error ? error.message : String(error)}`);
}

if (!process.exitCode) {
  console.log(`Validated ${assets.length} assets, ${eventSymbolRefs.length} event refs, ${sourceSymbolRefs.length} source refs, ${seasonSymbols.length} season refs, and ${indexSymbols.length} index refs.`);
}
