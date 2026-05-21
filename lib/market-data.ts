import { Activity, Building2, Flame, Shield, Swords, TrendingDown, TrendingUp, Users } from "lucide-react";

export type StockPoint = {
  t: string;
  value: number;
};

export type MarketAsset = {
  symbol: string;
  name: string;
  category: "Faction" | "Character" | "Holding";
  price: number;
  change: number;
  marketCap: number;
  volume: number;
  power: number;
  volatility: number;
  signal: "BUY" | "HOLD" | "SHORT";
  faction: string;
  accent: string;
  quote: string;
  chart: StockPoint[];
};

export type NewsItem = {
  title: string;
  tag: string;
  impact: string;
  time: string;
};

export const marketPulse = [
  { label: "Market Heat", value: "91.8", icon: Flame, delta: "+8.4%" },
  { label: "Faction Volume", value: "2.7B", icon: Activity, delta: "+14.2%" },
  { label: "Risk Index", value: "64", icon: Shield, delta: "-2.1%" },
  { label: "Active Traders", value: "128K", icon: Users, delta: "+21.0%" }
];

const series = (base: number, moves: number[]) =>
  moves.map((move, index) => ({
    t: `${index + 9}:00`,
    value: Number((base + move).toFixed(2))
  }));

export const assets: MarketAsset[] = [
  {
    symbol: "DNL",
    name: "Daniel Park",
    category: "Character",
    price: 428.72,
    change: 9.82,
    marketCap: 9200000000,
    volume: 89000000,
    power: 98,
    volatility: 87,
    signal: "BUY",
    faction: "J High",
    accent: "#7dd3fc",
    quote: "Dual-body premium is still underpriced by the street.",
    chart: series(380, [2, 18, 12, 38, 29, 48, 42, 61, 55])
  },
  {
    symbol: "GUN",
    name: "Gun Park",
    category: "Character",
    price: 512.18,
    change: 12.44,
    marketCap: 11800000000,
    volume: 112000000,
    power: 100,
    volatility: 71,
    signal: "BUY",
    faction: "White Tiger",
    accent: "#e5e7eb",
    quote: "Institutional fear remains the strongest moat in the sector.",
    chart: series(455, [4, 21, 28, 44, 39, 52, 71, 66, 83])
  },
  {
    symbol: "GOO",
    name: "Goo Kim",
    category: "Character",
    price: 486.03,
    change: -3.26,
    marketCap: 10400000000,
    volume: 74000000,
    power: 99,
    volatility: 96,
    signal: "HOLD",
    faction: "Independent",
    accent: "#facc15",
    quote: "High chaos beta. Traders love it until settlement day.",
    chart: series(500, [0, -18, 21, 4, 31, -8, 18, -4, -14])
  },
  {
    symbol: "JHL",
    name: "Johan Seong",
    category: "Character",
    price: 308.9,
    change: 4.65,
    marketCap: 5600000000,
    volume: 49000000,
    power: 92,
    volatility: 84,
    signal: "BUY",
    faction: "God Dog",
    accent: "#38bdf8",
    quote: "Copycat upside remains lethal in short windows.",
    chart: series(280, [1, 8, 4, 18, 21, 17, 25, 33, 29])
  },
  {
    symbol: "BDL",
    name: "Big Deal",
    category: "Faction",
    price: 184.22,
    change: 6.11,
    marketCap: 3200000000,
    volume: 68000000,
    power: 79,
    volatility: 58,
    signal: "BUY",
    faction: "Gangbuk",
    accent: "#60a5fa",
    quote: "Loyalty premium is outperforming the street economy index.",
    chart: series(160, [0, 6, 9, 14, 12, 20, 19, 26, 24])
  },
  {
    symbol: "WRK",
    name: "Workers Corp",
    category: "Faction",
    price: 221.47,
    change: -7.39,
    marketCap: 6100000000,
    volume: 154000000,
    power: 88,
    volatility: 91,
    signal: "SHORT",
    faction: "Workers",
    accent: "#fb7185",
    quote: "Regulatory pressure and executive risk keep the tape unstable.",
    chart: series(250, [0, -8, -2, -17, -14, -22, -19, -31, -28])
  },
  {
    symbol: "HSTL",
    name: "Hostel",
    category: "Faction",
    price: 143.08,
    change: 2.18,
    marketCap: 2100000000,
    volume: 30000000,
    power: 74,
    volatility: 52,
    signal: "HOLD",
    faction: "Hostel",
    accent: "#94a3b8",
    quote: "Family-based fundamentals. Low float, loyal holders.",
    chart: series(135, [1, 2, 4, 3, 5, 6, 4, 8, 7])
  },
  {
    symbol: "JMS",
    name: "James Lee",
    category: "Character",
    price: 545.54,
    change: 5.74,
    marketCap: 13400000000,
    volume: 97000000,
    power: 100,
    volatility: 63,
    signal: "BUY",
    faction: "Legend",
    accent: "#c084fc",
    quote: "Legend multiple remains expensive, but the chart refuses to break.",
    chart: series(510, [3, 12, 18, 24, 21, 29, 33, 41, 36])
  },
  {
    symbol: "CCH",
    name: "Charles Choi Holdings",
    category: "Holding",
    price: 336.16,
    change: -11.02,
    marketCap: 15500000000,
    volume: 183000000,
    power: 93,
    volatility: 94,
    signal: "SHORT",
    faction: "Elite",
    accent: "#f8fafc",
    quote: "Governance discount is widening after boardroom rumors.",
    chart: series(380, [0, -12, -20, -18, -33, -27, -41, -44, -43])
  },
  {
    symbol: "JHI",
    name: "J High Industries",
    category: "Faction",
    price: 199.8,
    change: 3.92,
    marketCap: 3900000000,
    volume: 52000000,
    power: 83,
    volatility: 67,
    signal: "BUY",
    faction: "J High",
    accent: "#22d3ee",
    quote: "Youth pipeline and training arc momentum keep buyers active.",
    chart: series(182, [2, 4, 8, 7, 12, 15, 13, 18, 17])
  }
];

export const characterRoster = [
  "Daniel Park",
  "Gun Park",
  "Goo Kim",
  "Johan Seong",
  "Jake Kim",
  "Eli Jang",
  "Vasco",
  "Zack Lee",
  "James Lee",
  "Samuel Seo",
  "Vin Jin",
  "Jay Hong"
].map((name, index) => ({
  name,
  ticker: name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .padEnd(3, "X")
    .slice(0, 3)
    .toUpperCase(),
  rank: index + 1,
  price: 120 + index * 37 + (index % 3) * 24,
  change: index % 4 === 0 ? -2.6 - index : 3.2 + index * 0.7,
  power: 74 + ((12 - index) % 8) * 3,
  faction: ["J High", "White Tiger", "Workers", "Big Deal", "Hostel", "Legend"][index % 6]
}));

export const factionRanks = [
  { name: "White Tiger", score: 98, icon: Swords, change: "+4.2%" },
  { name: "Workers Corp", score: 91, icon: Building2, change: "-6.8%" },
  { name: "Big Deal", score: 84, icon: TrendingUp, change: "+9.1%" },
  { name: "Hostel", score: 76, icon: Shield, change: "+1.7%" },
  { name: "God Dog", score: 70, icon: TrendingDown, change: "-2.4%" }
];

export const news: NewsItem[] = [
  {
    title: "Gangbuk liquidity spikes after Big Deal block trade",
    tag: "Underground Economy",
    impact: "BDL +6.11%",
    time: "08:40 KST"
  },
  {
    title: "White Tiger desk raises Gun Park target to new all-time high",
    tag: "Analyst Note",
    impact: "GUN +12.44%",
    time: "09:15 KST"
  },
  {
    title: "Workers Corp sells off as governance risk hits affiliate pricing",
    tag: "Breaking",
    impact: "WRK -7.39%",
    time: "10:03 KST"
  },
  {
    title: "J High training arc basket attracts retail inflows",
    tag: "Market Flow",
    impact: "JHI +3.92%",
    time: "11:22 KST"
  }
];

export const tickerTape = [...assets, ...assets.slice(0, 6)].map((asset) => ({
  symbol: asset.symbol,
  price: asset.price,
  change: asset.change
}));

