export const STARTING_CASH = 1000;
export const ACCOUNT_KEY = "ptj-account";

export type Holding = {
  symbol: string;
  shares: number;
  averageCost: number;
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
  alias: string;
  crew: string;
  cash: number;
  holdings: Holding[];
  customStocks: CustomStock[];
  futures: FuturePosition[];
  shorts: ShortPosition[];
  claimedMissions: string[];
  createdAt: string;
};

export function createAccount(alias: string, crew: string): Account {
  return {
    alias,
    crew,
    cash: STARTING_CASH,
    holdings: [],
    customStocks: [],
    futures: [],
    shorts: [],
    claimedMissions: [],
    createdAt: new Date().toISOString()
  };
}

function normalizeAccount(account: Partial<Account>): Account {
  return {
    alias: account.alias || "dealer",
    crew: account.crew || "J High",
    cash: Number.isFinite(account.cash) ? Number(account.cash) : STARTING_CASH,
    holdings: Array.isArray(account.holdings) ? account.holdings : [],
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
