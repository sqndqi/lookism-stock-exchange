export const STARTING_CASH = 1000;
export const ACCOUNT_KEY = "ptj-account";

export type Holding = {
  symbol: string;
  shares: number;
  averageCost: number;
};

export type Account = {
  alias: string;
  crew: string;
  cash: number;
  holdings: Holding[];
  claimedMissions: string[];
  createdAt: string;
};

export function createAccount(alias: string, crew: string): Account {
  return {
    alias,
    crew,
    cash: STARTING_CASH,
    holdings: [],
    claimedMissions: [],
    createdAt: new Date().toISOString()
  };
}

export function readAccount(): Account | null {
  const raw = window.localStorage.getItem(ACCOUNT_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as Account;
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
