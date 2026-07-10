export const STARTING_CASH = 100000;
export const ACCOUNT_KEY = "ptj-account";
export const ACCOUNT_SCHEMA_VERSION = 3;

const crewAliases: Record<string, string> = {
  "J High School": "J High",
  "J High Alliance": "J High",
  Allied: "Allied",
  "Big Deal": "Big Deal",
  Workers: "Workers",
  Hostel: "Hostel",
  "White Tiger": "White Tiger",
  "God Dog": "God Dog"
};

export type Holding = {
  symbol: string;
  shares: number;
  averageCost: number;
  updatedAt?: string;
};

export type Trade = {
  id: string;
  symbol: string;
  side: "BUY" | "SELL";
  quantity: number;
  price: number;
  gross: number;
  fee: number;
  net: number;
  timestamp: string;
  reason?: string;
};

export type LimitOrder = {
  id: string;
  symbol: string;
  side: "BUY" | "SELL";
  quantity: number;
  targetPrice: number;
  createdAt: string;
  expiresAt?: string;
  status: "OPEN" | "FILLED" | "CANCELLED" | "EXPIRED";
  filledAt?: string;
  note?: string;
};

export type AlertRule = {
  id: string;
  symbol: string;
  type: "PRICE_ABOVE" | "PRICE_BELOW" | "CHANGE_ABOVE" | "HYPE_ABOVE" | "RISK_ABOVE" | "NEW_SOURCE";
  threshold: number;
  enabled: boolean;
  createdAt: string;
  lastTriggeredAt?: string;
};

export type AchievementState = {
  id: string;
  unlockedAt: string;
};

export type PortfolioSnapshotRecord = {
  timestamp: string;
  cash: number;
  holdingsValue: number;
  totalEquity: number;
  realizedPnl: number;
  unrealizedPnl: number;
};

export type CustomStock = {
  symbol: string;
  name: string;
  faction: string;
  price: number;
  createdAt: string;
};

export type FuturePosition = {
  id: string;
  question: string;
  selection: string;
  stake: number;
  odds: number;
  openedAt: string;
  status: "OPEN" | "SETTLED";
};

export type ShortPosition = {
  id: string;
  symbol: string;
  quantity: number;
  entryPrice: number;
  openedAt: string;
  status: "OPEN" | "CLOSED";
};

export type Account = {
  schemaVersion: number;
  id: string;
  alias: string;
  crew: string;
  cash: number;
  startingCash: number;
  watchlist: string[];
  alerts: AlertRule[];
  limitOrders: LimitOrder[];
  holdings: Holding[];
  trades: Trade[];
  snapshots: PortfolioSnapshotRecord[];
  realizedPnl: number;
  xp: number;
  level: number;
  achievements: AchievementState[];
  viewedAssets: string[];
  readSources: string[];
  settings: {
    showAdvancedTicket: boolean;
    riskMode: "standard" | "aggressive";
  };
  customStocks: CustomStock[];
  futures: FuturePosition[];
  shorts: ShortPosition[];
  claimedMissions: string[];
  createdAt: string;
};

function accountId(alias: string) {
  return `desk-${alias.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString(36)}`;
}

function normalizeCrew(crew?: string) {
  if (!crew) return "J High";
  return crewAliases[crew] ?? crew;
}

export function createAccount(alias: string, crew: string): Account {
  return {
    schemaVersion: ACCOUNT_SCHEMA_VERSION,
    id: accountId(alias),
    alias,
    crew: normalizeCrew(crew),
    cash: STARTING_CASH,
    startingCash: STARTING_CASH,
    watchlist: ["DAN", "GUN", "JMS"],
    alerts: [],
    limitOrders: [],
    holdings: [],
    trades: [],
    snapshots: [],
    realizedPnl: 0,
    xp: 0,
    level: 1,
    achievements: [],
    viewedAssets: [],
    readSources: [],
    settings: {
      showAdvancedTicket: true,
      riskMode: "standard"
    },
    customStocks: [],
    futures: [],
    shorts: [],
    claimedMissions: [],
    createdAt: new Date().toISOString()
  };
}

function normalizeAccount(account: Partial<Account>): Account {
  const alias = account.alias || "dealer";
  const legacyHoldings = Array.isArray(account.holdings) ? account.holdings : [];
  return {
    schemaVersion: ACCOUNT_SCHEMA_VERSION,
    id: account.id || accountId(alias),
    alias,
    crew: normalizeCrew(account.crew),
    cash: Number.isFinite(account.cash) ? Number(account.cash) : STARTING_CASH,
    startingCash: Number.isFinite(account.startingCash) ? Number(account.startingCash) : STARTING_CASH,
    watchlist: Array.isArray(account.watchlist) ? account.watchlist : ["DAN", "GUN", "JMS"],
    alerts: Array.isArray(account.alerts) ? account.alerts : [],
    limitOrders: Array.isArray(account.limitOrders) ? account.limitOrders : [],
    holdings: legacyHoldings.map((holding) => ({
      ...holding,
      shares: Number.isFinite(holding.shares) ? Number(holding.shares) : 0,
      averageCost: Number.isFinite(holding.averageCost) ? Number(holding.averageCost) : 0
    })).filter((holding) => holding.shares > 0),
    trades: Array.isArray(account.trades) ? account.trades : [],
    snapshots: Array.isArray(account.snapshots) ? account.snapshots : [],
    realizedPnl: Number.isFinite(account.realizedPnl) ? Number(account.realizedPnl) : 0,
    xp: Number.isFinite(account.xp) ? Number(account.xp) : 0,
    level: Number.isFinite(account.level) ? Math.max(1, Number(account.level)) : 1,
    achievements: Array.isArray(account.achievements) ? account.achievements : [],
    viewedAssets: Array.isArray(account.viewedAssets) ? account.viewedAssets : [],
    readSources: Array.isArray(account.readSources) ? account.readSources : [],
    settings: account.settings ?? {
      showAdvancedTicket: true,
      riskMode: "standard"
    },
    customStocks: Array.isArray(account.customStocks) ? account.customStocks : [],
    futures: Array.isArray(account.futures) ? account.futures : [],
    shorts: Array.isArray(account.shorts) ? account.shorts : [],
    claimedMissions: Array.isArray(account.claimedMissions) ? account.claimedMissions : [],
    createdAt: account.createdAt || new Date().toISOString()
  };
}

export function readAccount(): Account | null {
  const raw = window.localStorage.getItem(ACCOUNT_KEY);
  if (!raw) return null;

  try {
    if (raw) {
      window.localStorage.setItem(`${ACCOUNT_KEY}-backup`, raw);
    }
    const account = normalizeAccount(JSON.parse(raw) as Partial<Account>);
    window.localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
    return account;
  } catch {
    window.localStorage.removeItem(ACCOUNT_KEY);
    return null;
  }
}

export function writeAccount(account: Account) {
  window.localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
  window.localStorage.setItem("ptj-session", "active");
  window.localStorage.setItem("ptj-profile", JSON.stringify({ alias: account.alias, crew: account.crew }));
  window.dispatchEvent(new CustomEvent("ptj-account-updated", { detail: account }));
}

export function parseAccountBackup(raw: string): Account | null {
  try {
    return normalizeAccount(JSON.parse(raw) as Partial<Account>);
  } catch {
    return null;
  }
}

export function exportAccountJson(account: Account) {
  return JSON.stringify(normalizeAccount(account), null, 2);
}

export function importAccountJson(raw: string) {
  return parseAccountBackup(raw);
}

export function toggleWatchlist(symbol: string) {
  const account = readAccount();
  if (!account) return null;
  const nextWatchlist = account.watchlist.includes(symbol)
    ? account.watchlist.filter((item) => item !== symbol)
    : [...account.watchlist, symbol];
  const next = { ...account, watchlist: nextWatchlist };
  writeAccount(next);
  return next;
}

export function addXp(account: Account, amount: number): Account {
  const xp = Math.max(0, account.xp + amount);
  const level = Math.max(1, Math.floor(xp / 250) + 1);
  return { ...account, xp, level };
}

export function markAssetViewed(symbol: string) {
  const account = readAccount();
  if (!account) return null;
  const viewedAssets = account.viewedAssets.includes(symbol) ? account.viewedAssets : [...account.viewedAssets, symbol];
  const next = addXp({ ...account, viewedAssets }, 10);
  writeAccount(next);
  return next;
}

export function clearAccount() {
  window.localStorage.removeItem(ACCOUNT_KEY);
  window.localStorage.removeItem("ptj-session");
  window.localStorage.removeItem("ptj-profile");
  window.localStorage.removeItem("ptj-auto-market-v1");
  window.dispatchEvent(new CustomEvent("ptj-account-updated", { detail: null }));
}
