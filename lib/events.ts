export type MarketEvent = {
  id: string;
  title: string;
  description: string;
  type: "chapter" | "crew-war" | "return" | "training" | "source-refresh" | "rebalance" | "season" | "scenario";
  startsAt: string;
  endsAt: string;
  affectedSymbols: string[];
  affectedFactions: string[];
  expectedImpact: number;
  confidence: number;
  status: "upcoming" | "live" | "completed" | "stale";
  sourceIds: string[];
  tags: string[];
};

export const marketEvents: MarketEvent[] = [
  {
    id: "event-chapter-window-ui",
    title: "Chapter Window: UI Body Thesis",
    description: "A scheduled catalyst window for Daniel body-control theories and rescue timing.",
    type: "chapter",
    startsAt: "2026-07-10T00:00:00.000Z",
    endsAt: "2026-07-17T00:00:00.000Z",
    affectedSymbols: ["DAN", "LDAN", "JHI"],
    affectedFactions: ["J High"],
    expectedImpact: 74,
    confidence: 82,
    status: "live",
    sourceIds: ["manual-dan-ui-body"],
    tags: ["chapter", "ui", "daniel"]
  },
  {
    id: "event-crew-war-rebalance",
    title: "Crew War Rebalance",
    description: "Sector desk refresh for Workers, Big Deal, and White Tiger volatility.",
    type: "rebalance",
    startsAt: "2026-07-12T00:00:00.000Z",
    endsAt: "2026-07-20T00:00:00.000Z",
    affectedSymbols: ["WRK", "BDL", "WTJC", "CCH"],
    affectedFactions: ["Workers", "Big Deal", "White Tiger"],
    expectedImpact: 58,
    confidence: 76,
    status: "upcoming",
    sourceIds: ["manual-workers-betrayal-risk"],
    tags: ["crew", "sector", "rebalance"]
  },
  {
    id: "event-season-close",
    title: "Season Close: Seoul Opening Bell",
    description: "Local demo season checkpoint. No automatic account reset.",
    type: "season",
    startsAt: "2026-08-01T00:00:00.000Z",
    endsAt: "2026-08-03T00:00:00.000Z",
    affectedSymbols: ["DAN", "GUN", "JMS", "WRK"],
    affectedFactions: ["J High", "White Tiger", "Workers"],
    expectedImpact: 35,
    confidence: 90,
    status: "upcoming",
    sourceIds: [],
    tags: ["season", "reset", "checkpoint"]
  }
];

export function getEventsForSymbol(symbol: string, faction?: string) {
  return marketEvents.filter((event) => event.affectedSymbols.includes(symbol) || Boolean(faction && event.affectedFactions.includes(faction)));
}
