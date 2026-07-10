import type { Account } from "@/lib/account";
import { clearAccount, importAccountJson, readAccount, toggleWatchlist, writeAccount } from "@/lib/account";

export type AccountStore = {
  mode: "local" | "remote";
  read(): Account | null;
  write(account: Account): void;
  clear(): void;
  toggleWatchlist(symbol: string): Account | null;
  importJson(raw: string): Account | null;
};

export type StoreAdapters = {
  accountStore: AccountStore;
};

export const localAccountStore: AccountStore = {
  mode: "local",
  read: readAccount,
  write: writeAccount,
  clear: clearAccount,
  toggleWatchlist,
  importJson: importAccountJson
};

export const stores: StoreAdapters = {
  accountStore: localAccountStore
};
