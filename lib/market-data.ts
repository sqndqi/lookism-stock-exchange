import {
  Activity,
  BadgeCheck,
  Building2,
  Flame,
  Goal,
  Shield,
  Swords,
  TrendingDown,
  TrendingUp,
  Trophy,
  Users
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type StockPoint = {
  t: string;
  value: number;
};

export type MarketAsset = {
  symbol: string;
  name: string;
  category: "Faction" | "Character" | "Holding";
  aliases?: string[];
  variants?: string[];
  price: number;
  change: number;
  marketCap: number;
  volume: number;
  power: number;
  volatility: number;
  catalyst?: string;
  affected?: string[];
  signal: "BUY" | "HOLD" | "SHORT";
  faction: string;
  accent: string;
  image: string;
  quote: string;
  chart: StockPoint[];
};

export type NewsItem = {
  title: string;
  tag: string;
  impact: string;
  time: string;
};

export type WikiDossier = {
  name: string;
  group: string;
  role: string;
  marketUse: string;
  sourcePath: string;
};

export type PredictionContract = {
  question: string;
  pool: number;
  closes: string;
  options: Array<{ label: string; odds: number }>;
  catalyst: string;
};

export type Mission = {
  title: string;
  reward: number;
  progress: number;
  icon: LucideIcon;
};

export const marketPulse = [
  { label: "Aura Surge", value: "91.8", icon: Flame, delta: "+8.4%" },
  { label: "Street Activity", value: "2.7B", icon: Activity, delta: "+14.2%" },
  { label: "Threat Index", value: "64", icon: Shield, delta: "-2.1%" },
  { label: "Active Crews", value: "128K", icon: Users, delta: "+21.0%" }
];

const series = (base: number, moves: number[]) =>
  moves.map((move, index) => ({
    t: `${index + 9}:00`,
    value: Number((base + move).toFixed(2))
  }));

export const assets: MarketAsset[] = [
  {
    symbol: "DAN",
    name: "Big Daniel",
    category: "Character",
    aliases: ["Daniel Park", "Second Body", "UI Daniel"],
    variants: ["Second Body", "UI State"],
    price: 618.72,
    change: 8.62,
    marketCap: 14600000000,
    volume: 122000000,
    power: 100,
    volatility: 84,
    signal: "BUY",
    faction: "J High",
    accent: "#7dd3fc",
    image: "/images/fighter-daniel.png",
    quote: "Big Daniel is the tape leader whenever UI, second-body, and rescue theories hit the rumor wire.",
    catalyst: "UI/body mystery theories and second-body control debate are the main catalyst.",
    affected: ["J High Alliance", "Allied", "Workers"],
    chart: series(560, [4, 15, 22, 29, 36, 42, 38, 57, 59])
  },
  {
    symbol: "LDAN",
    name: "Little Daniel",
    category: "Character",
    aliases: ["Original Daniel", "Original Body Daniel"],
    variants: ["Original Body", "Heat / Mastery Build"],
    price: 391.44,
    change: 6.12,
    marketCap: 7400000000,
    volume: 67000000,
    power: 94,
    volatility: 73,
    signal: "BUY",
    faction: "J High",
    accent: "#93c5fd",
    image: "/images/fighter-daniel.png",
    quote: "Little Daniel gains when training payoff, copy growth, and original-body respect posts start moving.",
    catalyst: "Original-body growth and mastery debate are lifting Little Daniel.",
    affected: ["J High Alliance", "Gun Park"],
    chart: series(350, [2, 6, 11, 18, 23, 28, 24, 39, 41])
  },
  {
    symbol: "GUN",
    name: "Gun Park",
    category: "Character",
    aliases: ["Jong Gun", "Yamazaki Gun"],
    variants: ["Base", "TUI / Yamazaki Mode"],
    price: 521.18,
    change: 5.94,
    marketCap: 12600000000,
    volume: 106000000,
    power: 100,
    volatility: 68,
    signal: "BUY",
    faction: "White Tiger",
    accent: "#e5e7eb",
    image: "/images/fighter-gun.png",
    quote: "Gun still prints fear premium, but the desk is valuing him under James until the next major upscale lands.",
    catalyst: "Yamazaki/TUI debate and Goo rematch speculation keep Gun hot without overtaking James.",
    affected: ["White Tiger", "Goo Kim", "Daniel Park"],
    chart: series(492, [2, 8, 15, 23, 19, 28, 35, 31, 29])
  },
  {
    symbol: "KTAE",
    name: "Gitae Kim",
    category: "Character",
    price: 507.07,
    change: 2.1,
    marketCap: 12200000000,
    volume: 101000000,
    power: 100,
    volatility: 89,
    signal: "BUY",
    faction: "Gapryong Line",
    accent: "#f87171",
    image: "/images/fighter-gitae.png",
    quote: "Gapryong bloodline talk keeps Gitae unstable and dangerous.",
    catalyst: "Gapryong lineage and endgame villain theories are moving the tape.",
    chart: series(492, [0, 10, 2, 18, 11, 23, 19, 16, 12])
  },
  {
    symbol: "TOM",
    name: "Tom Lee",
    category: "Character",
    aliases: ["Fighting Genius"],
    variants: ["White Tiger Chief", "Old Guard Monster"],
    price: 474.62,
    change: 3.92,
    marketCap: 11300000000,
    volume: 83000000,
    power: 99,
    volatility: 58,
    signal: "BUY",
    faction: "White Tiger",
    accent: "#f8fafc",
    image: "/images/fighter-tom.png",
    quote: "Tom Lee holds veteran monster premium whenever White Tiger, Fist Gang, or old-gen debates flare up.",
    catalyst: "Old-generation monster talk and White Tiger relevance are pushing Tom back into the top tier.",
    chart: series(446, [1, 4, 9, 14, 17, 21, 18, 29, 27])
  },
  {
    symbol: "SGJ",
    name: "Seongji Yuk",
    category: "Character",
    aliases: ["Cheonliang King"],
    variants: ["King of Cheonliang"],
    price: 438.28,
    change: 4.48,
    marketCap: 8700000000,
    volume: 79000000,
    power: 97,
    volatility: 74,
    signal: "BUY",
    faction: "Cheonliang",
    accent: "#c084fc",
    image: "/images/fighter-seongji.png",
    quote: "Seongji moves whenever king-tier scaling and Cheonliang flashback talk take over the feed.",
    catalyst: "Cheonliang king debates and sacrifice aura are driving Seongji premium.",
    chart: series(408, [2, 7, 14, 18, 23, 21, 28, 34, 30])
  },
  {
    symbol: "GOO",
    name: "Goo Kim",
    category: "Character",
    aliases: ["Kim Joongoo"],
    variants: ["Base", "Weapon Genius"],
    price: 348.03,
    change: -1.86,
    marketCap: 8400000000,
    volume: 69000000,
    power: 98,
    volatility: 91,
    signal: "HOLD",
    faction: "Independent",
    accent: "#facc15",
    image: "/images/fighter-goo.png",
    quote: "Weapon genius chaos. Goo stays high value, but the desk is discounting him below the current monster tier.",
    catalyst: "Gun rematch discourse and weapon-scaling arguments keep Goo volatile.",
    chart: series(372, [0, -12, 8, 5, 15, -4, 9, -2, -7])
  },
  {
    symbol: "JKE",
    name: "Jake Kim",
    category: "Character",
    price: 271.72,
    change: 3.23,
    marketCap: 5200000000,
    volume: 54000000,
    power: 91,
    volatility: 78,
    signal: "BUY",
    faction: "Big Deal",
    accent: "#60a5fa",
    image: "/images/fighter-jake.png",
    quote: "Jake gains when Big Deal loyalty, Gangseo, and Gapryong links enter the chapter talk.",
    catalyst: "Big Deal loyalty and Gapryong-family speculation are moving Jake.",
    chart: series(250, [2, 9, 8, 16, 21, 19, 28, 33, 31])
  },
  {
    symbol: "ELI",
    name: "Eli Jang",
    category: "Character",
    price: 214.44,
    change: -1.86,
    marketCap: 4100000000,
    volume: 31000000,
    power: 86,
    volatility: 69,
    signal: "HOLD",
    faction: "Hostel",
    accent: "#cbd5e1",
    image: "/images/fighter-eli.png",
    quote: "Eli moves on Hostel family stakes and any sign of a wild-mode return.",
    catalyst: "Hostel loyalty and family-risk discussion are the current catalyst.",
    chart: series(220, [0, -3, 4, 2, -5, -1, -6, -4, -5])
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
    image: "/images/fighter-johan.png",
    quote: "Johan reacts to copy genius hype, eyesight talk, and God Dog comeback rumors.",
    catalyst: "Copycat scaling and rescue speculation are moving Johan.",
    chart: series(280, [1, 8, 4, 18, 21, 17, 25, 33, 29])
  },
  {
    symbol: "VAS",
    name: "Vasco",
    category: "Character",
    price: 244.34,
    change: 3.94,
    marketCap: 4200000000,
    volume: 33000000,
    power: 89,
    volatility: 55,
    signal: "HOLD",
    faction: "Burn Knuckles",
    accent: "#38bdf8",
    image: "/images/fighter-vasco.png",
    quote: "Vasco gets steady support whenever Burn Knuckles conviction or mastery talk returns.",
    catalyst: "Conviction and training-arc posts are carrying Vasco.",
    chart: series(176, [1, 3, 5, 4, 8, 7, 9, 12, 11])
  },
  {
    symbol: "ZACK",
    name: "Zack Lee",
    category: "Character",
    price: 176.19,
    change: 3.37,
    marketCap: 3000000000,
    volume: 25000000,
    power: 83,
    volatility: 61,
    signal: "HOLD",
    faction: "J High",
    accent: "#a5b4fc",
    image: "/images/fighter-zack.png",
    quote: "Zack moves on boxing mastery, endurance feats, and J High comeback energy.",
    catalyst: "Boxing mastery and J High training posts are lifting Zack.",
    chart: series(162, [1, 2, 6, 5, 9, 11, 10, 15, 14])
  },
  {
    symbol: "SML",
    name: "Samuel Seo",
    category: "Character",
    price: 247.8,
    change: -4.8,
    marketCap: 4800000000,
    volume: 53000000,
    power: 88,
    volatility: 93,
    signal: "SHORT",
    faction: "Workers",
    accent: "#fb7185",
    image: "/images/fighter-samuel.png",
    quote: "Samuel is pure heat mode risk: ego, Workers baggage, and betrayal chatter.",
    catalyst: "Workers baggage and heat-mode arguments are driving Samuel.",
    chart: series(270, [0, -8, -2, -15, -10, -24, -18, -28, -22])
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
    image: "/images/crew-big-deal.png",
    quote: "Gangseo loyalty, Jake's name, and street romance keep Big Deal alive.",
    catalyst: "Gangseo loyalty and Jake-centered chapter talk support Big Deal.",
    chart: series(160, [0, 6, 9, 14, 12, 20, 19, 26, 24])
  },
  {
    symbol: "WRK",
    name: "Workers / Affiliates",
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
    image: "/images/crew-workers.png",
    quote: "Affiliate pressure, Eugene strategy, and betrayal risk keep Workers unstable.",
    catalyst: "Affiliate drama and Eugene strategy are driving Workers.",
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
    image: "/images/crew-hostel.png",
    quote: "Hostel is a family-first crew asset: smaller territory, stubborn loyalty.",
    catalyst: "Family stakes and Eli-related chapter chatter are moving Hostel.",
    chart: series(135, [1, 2, 4, 3, 5, 6, 4, 8, 7])
  },
  {
    symbol: "JMS",
    name: "James Lee",
    category: "Character",
    aliases: ["DG"],
    variants: ["Legend", "DG Persona"],
    price: 545.54,
    change: 5.74,
    marketCap: 13400000000,
    volume: 97000000,
    power: 100,
    volatility: 63,
    signal: "BUY",
    faction: "Legend",
    accent: "#c084fc",
    image: "/images/fighter-james.png",
    quote: "James rises on legend debate, King Era lore, and speed mastery arguments.",
    catalyst: "King Era scaling and DG identity talk are moving James.",
    chart: series(510, [3, 12, 18, 24, 21, 29, 33, 41, 36])
  },
  {
    symbol: "CCH",
    name: "Charles Choi Network",
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
    image: "/images/crew-elite.png",
    quote: "Elite Network falls when betrayal risk and old-generation secrets resurface.",
    catalyst: "Betrayal risk, old-generation secrets, and Charles Choi theories are pressuring Elite.",
    chart: series(380, [0, -12, -20, -18, -33, -27, -41, -44, -43])
  },
  {
    symbol: "WTJC",
    name: "White Tiger Job Center",
    category: "Faction",
    price: 296.44,
    change: 5.06,
    marketCap: 7200000000,
    volume: 88000000,
    power: 96,
    volatility: 62,
    signal: "BUY",
    faction: "White Tiger",
    accent: "#e2e8f0",
    image: "/images/crew-white-tiger.png",
    quote: "White Tiger moves on mercenary pressure, Tom Lee links, and Gun proximity.",
    catalyst: "Tom Lee, Gun proximity, and mercenary contracts are moving White Tiger.",
    chart: series(276, [1, 4, 8, 13, 12, 17, 21, 19, 20])
  },
  {
    symbol: "JHI",
    name: "J High Alliance",
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
    image: "/images/crew-j-high.png",
    quote: "Daniel's circle moves on school-alliance rescues and training arc momentum.",
    catalyst: "J High rescue energy and Daniel's circle theories are moving the alliance.",
    chart: series(182, [2, 4, 8, 7, 12, 15, 13, 18, 17])
  }
];

export const characterRoster = [
  {
    name: "Big Daniel",
    ticker: "DAN",
    rank: 1,
    price: 612,
    change: 18.4,
    power: 100,
    faction: "J High",
    rarity: "Mythic",
    aura: 99,
    generation: "Anomaly",
    fightingStyle: "Copy / UI",
    masteryType: "Instinct",
    currentArc: "Second body / UI crisis",
    signatureColor: "#9be7ff",
    image: "/images/fighter-daniel.png"
  },
  {
    name: "James Lee",
    ticker: "JMS",
    rank: 2,
    price: 581,
    change: 6.1,
    power: 100,
    faction: "Legend",
    rarity: "Mythic",
    aura: 98,
    generation: "1st Generation",
    fightingStyle: "Speed / precision",
    masteryType: "Speed",
    currentArc: "Legend premium",
    signatureColor: "#ef233c",
    image: "/images/fighter-james.png"
  },
  {
    name: "Gun Park",
    ticker: "GUN",
    rank: 3,
    price: 553,
    change: 5.2,
    power: 100,
    faction: "White Tiger",
    rarity: "Mythic",
    aura: 97,
    generation: "2nd Gen Monster",
    fightingStyle: "Kyokushin / UI",
    masteryType: "Endurance",
    currentArc: "TUI discourse",
    signatureColor: "#d8dee9",
    image: "/images/fighter-gun.png"
  },
  {
    name: "Kitae Kim",
    ticker: "KTAE",
    rank: 4,
    price: 504,
    change: 1.4,
    power: 99,
    faction: "Gapryong Line",
    rarity: "Mythic",
    aura: 96,
    generation: "Bloodline",
    fightingStyle: "Brutal pressure",
    masteryType: "Power",
    currentArc: "Shadow territory",
    signatureColor: "#ef4444",
    image: "/images/fighter-gitae.png"
  },
  {
    name: "Tom Lee",
    ticker: "TOM",
    rank: 5,
    price: 501,
    change: 4.8,
    power: 99,
    faction: "White Tiger",
    rarity: "Legendary",
    aura: 95,
    generation: "0th Generation",
    fightingStyle: "Street dominance / wild brawling",
    masteryType: "Monster endurance",
    currentArc: "Old guard premium",
    signatureColor: "#f8fafc",
    image: "/images/fighter-tom.png"
  },
  {
    name: "Seongji Yuk",
    ticker: "SGJ",
    rank: 6,
    price: 446,
    change: 7.4,
    power: 97,
    faction: "Cheonliang",
    rarity: "Legendary",
    aura: 93,
    generation: "1st Generation King",
    fightingStyle: "Overwhelming pressure",
    masteryType: "Power / endurance",
    currentArc: "Cheonliang king debate",
    signatureColor: "#c084fc",
    image: "/images/fighter-seongji.png"
  },
  {
    name: "Little Daniel",
    ticker: "LDAN",
    rank: 7,
    price: 418,
    change: 9.6,
    power: 95,
    faction: "J High",
    rarity: "Legendary",
    aura: 92,
    generation: "2nd Generation",
    fightingStyle: "Copy / unpredictability",
    masteryType: "Growth",
    currentArc: "Original-body rise",
    signatureColor: "#93c5fd",
    image: "/images/fighter-daniel.png"
  },
  {
    name: "Goo Kim",
    ticker: "GOO",
    rank: 8,
    price: 382,
    change: -1.9,
    power: 98,
    faction: "Independent",
    rarity: "Legendary",
    aura: 90,
    generation: "2nd Generation",
    fightingStyle: "Weapon genius",
    masteryType: "Technique",
    currentArc: "Weapon genius risk",
    signatureColor: "#f8fafc",
    image: "/images/fighter-goo.png"
  },
  {
    name: "Johan Seong",
    ticker: "JHL",
    rank: 9,
    price: 309,
    change: 4.6,
    power: 92,
    faction: "God Dog",
    rarity: "Epic",
    aura: 86,
    generation: "2nd Generation",
    fightingStyle: "Copy",
    masteryType: "Vision",
    currentArc: "Copycat premium",
    signatureColor: "#9be7ff",
    image: "/images/fighter-johan.png"
  },
  {
    name: "Vasco",
    ticker: "VAS",
    rank: 10,
    price: 244,
    change: 3.9,
    power: 89,
    faction: "Burn Knuckles",
    rarity: "Epic",
    aura: 82,
    generation: "J High",
    fightingStyle: "Muay Thai",
    masteryType: "Conviction",
    currentArc: "Conviction accumulation",
    signatureColor: "#9be7ff",
    image: "/images/fighter-vasco.png"
  },
  {
    name: "Jake Kim",
    ticker: "JKE",
    rank: 11,
    price: 233,
    change: 3.2,
    power: 91,
    faction: "Big Deal",
    rarity: "Epic",
    aura: 81,
    generation: "2nd Generation",
    fightingStyle: "Boxing / conviction",
    masteryType: "Leadership",
    currentArc: "Big Deal rebound",
    signatureColor: "#60a5fa",
    image: "/images/fighter-jake.png"
  },
  {
    name: "Samuel Seo",
    ticker: "SML",
    rank: 12,
    price: 221,
    change: -4.8,
    power: 88,
    faction: "Workers",
    rarity: "Epic",
    aura: 78,
    generation: "2nd Generation",
    fightingStyle: "Dirty boxing",
    masteryType: "Heat mode",
    currentArc: "Ego drawdown",
    signatureColor: "#ef233c",
    image: "/images/fighter-samuel.png"
  },
  {
    name: "Eli Jang",
    ticker: "ELI",
    rank: 13,
    price: 214,
    change: -1.8,
    power: 86,
    faction: "Hostel",
    rarity: "Epic",
    aura: 76,
    generation: "2nd Generation",
    fightingStyle: "Wild technique",
    masteryType: "Animal instinct",
    currentArc: "Defensive base",
    signatureColor: "#d8dee9",
    image: "/images/fighter-eli.png"
  },
  {
    name: "Zack Lee",
    ticker: "ZACK",
    rank: 14,
    price: 176,
    change: 3.3,
    power: 83,
    faction: "J High",
    rarity: "Epic",
    aura: 77,
    generation: "J High",
    fightingStyle: "Boxing",
    masteryType: "Endurance",
    currentArc: "Recovery bid",
    signatureColor: "#d8dee9",
    image: "/images/fighter-zack.png"
  },
  {
    name: "Sinu Han",
    ticker: "SINU",
    rank: 15,
    price: 173,
    change: 4.7,
    power: 87,
    faction: "Big Deal",
    rarity: "Rare",
    aura: 75,
    generation: "Pre-Gen 2 Bridge",
    fightingStyle: "Street dominance",
    masteryType: "Experience",
    currentArc: "Big Deal elder premium",
    signatureColor: "#a5b4fc",
    image: "/images/fighter-sinu.png"
  },
  {
    name: "Jay Hong",
    ticker: "JAY",
    rank: 16,
    price: 164,
    change: 2.1,
    power: 79,
    faction: "J High",
    rarity: "Rare",
    aura: 74,
    generation: "J High",
    fightingStyle: "Systema / weapons",
    masteryType: "Technique",
    currentArc: "Quiet whale",
    signatureColor: "#f8fafc",
    image: "/images/fighter-jay.png"
  }
];

export const factionRanks = [
  { name: "White Tiger", score: 98, icon: Swords, change: "+4.2%" },
  { name: "Workers / Affiliates", score: 91, icon: Building2, change: "-6.8%" },
  { name: "Big Deal", score: 84, icon: TrendingUp, change: "+9.1%" },
  { name: "Hostel", score: 76, icon: Shield, change: "+1.7%" },
  { name: "God Dog", score: 70, icon: TrendingDown, change: "-2.4%" }
];

export const wikiDossiers: WikiDossier[] = [
  {
    name: "Daniel Park",
    group: "J High School",
    role: "dual-body thesis asset",
    marketUse: "Core index constituent for body-swap, UI, and protagonist catalysts.",
    sourcePath: "Daniel_Park"
  },
  {
    name: "Gun Park",
    group: "Most visited character",
    role: "fear-volatility benchmark",
    marketUse: "Used as the market's violence premium and power-scaling hedge.",
    sourcePath: "Gun_Park"
  },
  {
    name: "James Lee",
    group: "1st Generation",
    role: "legend index anchor",
    marketUse: "High multiple asset when first-generation lore enters the feed.",
    sourcePath: "James_Lee"
  },
  {
    name: "Tom Lee",
    group: "0th Generation",
    role: "old-guard underground desk",
    marketUse: "Defensive veteran exposure during Fist Gang discourse.",
    sourcePath: "Tom_Lee"
  },
  {
    name: "Kitae Kim",
    group: "Gapryong line",
    role: "shadow territory shock",
    marketUse: "Moves hard when Reddit theories mention bloodline or endgame power.",
    sourcePath: "Kitae_Kim"
  },
  {
    name: "Zack Lee / Vasco / Jay Hong",
    group: "J High basket",
    role: "training arc alliance basket",
    marketUse: "Tracks school-side development, teamwork, and comeback chatter.",
    sourcePath: "J_High_School"
  }
];

export const predictionContracts: PredictionContract[] = [
  {
    question: "Will Daniel stay in UI mode through the next major reveal?",
    pool: 31520,
    closes: "Chapter review window",
    catalyst: "Reddit is actively discussing UI Daniel, second-body reveals, and who finds little Daniel.",
    options: [
      { label: "Full UI hold", odds: 42 },
      { label: "Breaks before reveal", odds: 38 },
      { label: "Interrupted by third party", odds: 20 }
    ]
  },
  {
    question: "Does Gun receive a new upscale before Goo discourse cools?",
    pool: 18440,
    closes: "48h",
    catalyst: "Recent subreddit titles are centered on Gun, Goo, TUI scaling, and plot re-entry.",
    options: [
      { label: "Gun upscales", odds: 51 },
      { label: "Goo recovers", odds: 29 },
      { label: "No clear winner", odds: 20 }
    ]
  },
  {
    question: "Will James Lee regain top legend momentum this week?",
    pool: 22780,
    closes: "Weekly close",
    catalyst: "James scaling memes and theory posts are keeping volume elevated.",
    options: [
      { label: "Legend bid returns", odds: 46 },
      { label: "Kitae steals volume", odds: 34 },
      { label: "Flat close", odds: 20 }
    ]
  }
];

export const missions: Mission[] = [
  { title: "Daily check-in", reward: 300, progress: 100, icon: BadgeCheck },
  { title: "Vote on one prediction contract", reward: 125, progress: 66, icon: Goal },
  { title: "Build a 5-fighter crew basket", reward: 500, progress: 40, icon: Users },
  { title: "Beat the chapter-lock rumor spread", reward: 750, progress: 25, icon: Trophy }
];

export const news: NewsItem[] = [
  {
    title: "Second-body reveal chatter pushes Daniel basket into auction imbalance",
    tag: "Reddit Wire",
    impact: "DAN +9.82%",
    time: "Live"
  },
  {
    title: "TUI Gun versus Goo discourse drives volatility desk volume",
    tag: "Power Scaling",
    impact: "GUN +12.44%",
    time: "Live"
  },
  {
    title: "Gangseo street activity spikes after Big Deal loyalty rumors",
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
    title: "Workers / Affiliates slips as betrayal risk hits Eugene strategy",
    tag: "Breaking",
    impact: "WRK -7.39%",
    time: "10:03 KST"
  },
  {
    title: "J High Alliance gains after Daniel's circle training chatter",
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

