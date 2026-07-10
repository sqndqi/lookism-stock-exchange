export type MarketSeason = {
  id: string;
  name: string;
  theme: string;
  startsAt: string;
  endsAt: string;
  startingCash: number;
  featuredSymbols: string[];
  modifiers: {
    volatilityMultiplier: number;
    hypeSensitivity: number;
    factionBoosts: Record<string, number>;
  };
  rules: string[];
};

export const currentSeason: MarketSeason = {
  id: "season-1-seoul-opening-bell",
  name: "Season 1: Seoul Opening Bell",
  theme: "First desk launch, fighter repricing, and crew-sector discovery.",
  startsAt: "2026-07-01T00:00:00.000Z",
  endsAt: "2026-08-03T00:00:00.000Z",
  startingCash: 100000,
  featuredSymbols: ["DAN", "GUN", "JMS", "WRK", "BDL"],
  modifiers: {
    volatilityMultiplier: 1.08,
    hypeSensitivity: 1.15,
    factionBoosts: {
      "J High": 1.08,
      Workers: 1.04,
      "White Tiger": 1.03
    }
  },
  rules: [
    "Simulation credits only.",
    "No automatic account reset.",
    "Export your desk before any manual reset.",
    "Demo rankings are local/simulated only."
  ]
};
