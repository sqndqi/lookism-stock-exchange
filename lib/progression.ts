import type { Account } from "@/lib/account";
import type { MarketAsset } from "@/lib/market-data";

export type AchievementDefinition = {
  id: string;
  title: string;
  description: string;
  xp: number;
  test: (account: Account, assets: MarketAsset[]) => boolean;
};

export const rankNames = [
  "Street Observer",
  "Desk Rookie",
  "Rumor Analyst",
  "Sector Scout",
  "Market Operator",
  "Underground Broker",
  "Aura Strategist"
];

export const achievements: AchievementDefinition[] = [
  { id: "first-desk", title: "Desk Opened", description: "Open a local AURA EXCHANGE desk.", xp: 50, test: (account) => Boolean(account.createdAt) },
  { id: "first-buy", title: "Opening Print", description: "Place your first fake buy order.", xp: 75, test: (account) => account.trades.some((trade) => trade.side === "BUY") },
  { id: "first-sell", title: "Exit Ticket", description: "Sell fake shares from a held asset.", xp: 75, test: (account) => account.trades.some((trade) => trade.side === "SELL") },
  { id: "watch-five", title: "Signal Board", description: "Add five assets to the watchlist.", xp: 80, test: (account) => account.watchlist.length >= 5 },
  { id: "three-factions", title: "Sector Scout", description: "Hold assets from three factions.", xp: 120, test: (account, assets) => new Set(account.holdings.map((holding) => assets.find((asset) => asset.symbol === holding.symbol)?.faction).filter(Boolean)).size >= 3 },
  { id: "ten-trades", title: "Tape Operator", description: "Complete ten fake trades.", xp: 150, test: (account) => account.trades.length >= 10 },
  { id: "ten-dossiers", title: "Dossier Reader", description: "Open ten asset dossiers.", xp: 100, test: (account) => account.viewedAssets.length >= 10 }
];

export function rankForLevel(level: number) {
  return rankNames[Math.min(rankNames.length - 1, Math.max(0, level - 1))];
}

export function syncAchievements(account: Account, assets: MarketAsset[]) {
  const unlocked = new Set(account.achievements.map((achievement) => achievement.id));
  let next = account;
  const newlyUnlocked: AchievementDefinition[] = [];

  for (const achievement of achievements) {
    if (unlocked.has(achievement.id) || !achievement.test(next, assets)) continue;
    next = {
      ...next,
      achievements: [...next.achievements, { id: achievement.id, unlockedAt: new Date().toISOString() }],
      xp: next.xp + achievement.xp
    };
    next = { ...next, level: Math.max(1, Math.floor(next.xp / 250) + 1) };
    newlyUnlocked.push(achievement);
  }

  return { account: next, newlyUnlocked };
}
