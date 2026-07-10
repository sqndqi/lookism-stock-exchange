import { readFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = await readFile(path.join(root, "lib", "market-data.ts"), "utf8");
const imagePaths = [...source.matchAll(/image:\s*"([^"]+)"/g)].map((match) => match[1]);
const unique = [...new Set(imagePaths)];
let missing = 0;
let hotlinked = 0;
let invalid = 0;

for (const image of unique) {
  if (/^https?:\/\//i.test(image)) {
    hotlinked += 1;
    console.error(`IMAGE HOTLINKED: ${image}`);
    continue;
  }
  if (!image.startsWith("/images/") || image.includes("..")) {
    invalid += 1;
    console.error(`IMAGE INVALID PATH: ${image}`);
    continue;
  }
  const filePath = path.join(root, "public", image.replace(/^\//, ""));
  try {
    await access(filePath);
  } catch {
    missing += 1;
    console.error(`IMAGE MISSING: ${image}`);
  }
}

if (missing || hotlinked || invalid) {
  process.exitCode = 1;
} else {
  console.log(`Audited ${unique.length} referenced images. No missing files.`);
}
