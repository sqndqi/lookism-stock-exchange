import { readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const imageDir = path.resolve("public/images");
const files = await readdir(imageDir);
const targets = files.filter((file) => file.endsWith(".svg") && /^(fighter|crew)-/.test(file));

for (const file of targets) {
  const source = path.join(imageDir, file);
  const output = path.join(imageDir, file.replace(/\.svg$/, ".png"));
  await sharp(source).png({ compressionLevel: 9 }).toFile(output);
  console.log(`Rasterized ${file} -> ${path.basename(output)}`);
}
