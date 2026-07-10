import { assets } from "@/lib/market-data";

export type MediaRecord = {
  symbol: string;
  image: string;
  alt: string;
  fallback: "fighter" | "crew" | "index";
  accent: string;
};

export const mediaManifest: MediaRecord[] = assets.map((asset) => ({
  symbol: asset.symbol,
  image: asset.image,
  alt: `${asset.name} fictional AURA EXCHANGE asset image`,
  fallback: asset.category === "Character" ? "fighter" : asset.category === "Faction" ? "crew" : "index",
  accent: asset.accent
}));

const manifestBySymbol = new Map(mediaManifest.map((item) => [item.symbol, item]));

export function getAssetMedia(symbol: string, name?: string): MediaRecord {
  return manifestBySymbol.get(symbol) ?? {
    symbol,
    image: "/images/fighter-generic.png",
    alt: `${name ?? symbol} fictional AURA EXCHANGE asset image`,
    fallback: "fighter",
    accent: "#d8dee9"
  };
}

export function initialsForAsset(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "AX";
}
