"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BriefcaseBusiness, Check, LockKeyhole, Minus, Plus, RadioTower, Wallet } from "lucide-react";
import { findTradableAsset, getTradableAssets, redditMarketMeta } from "@/lib/live-market";
import { formatCurrency } from "@/lib/utils";
import type { Account, CustomStock } from "@/lib/account";
import { readAccount, STARTING_CASH, writeAccount } from "@/lib/account";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const listingDefaults = {
  name: "",
  symbol: "",
  faction: "J High",
  price: 50
};

function sanitizeTicker(value: string) {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
}

export function PortfolioSimulator() {
  const [account, setAccount] = useState<Account | null>(null);
  const [selected, setSelected] = useState("GUN");
  const [investment, setInvestment] = useState(100);
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState(listingDefaults);
  const [message, setMessage] = useState("Market terminal ready.");

  const tradableAssets = useMemo(() => getTradableAssets(account), [account]);
  const holdings = useMemo(() => account?.holdings ?? [], [account]);
  const cash = account?.cash ?? STARTING_CASH;
  const selectedAsset = tradableAssets.find((item) => item.symbol === selected) ?? tradableAssets[0];
  const selectedHolding = holdings.find((holding) => holding.symbol === selected);
  const openFutureMargin = useMemo(
    () => (account?.futures ?? []).filter((future) => future.status === "OPEN").reduce((sum, future) => sum + future.stake, 0),
    [account]
  );

  const holdingsValue = useMemo(
    () =>
      holdings.reduce((sum, holding) => {
        const asset = tradableAssets.find((item) => item.symbol === holding.symbol);
        return sum + (asset?.price ?? 0) * holding.shares;
      }, 0),
    [holdings, tradableAssets]
  );

  useEffect(() => {
    setAccount(readAccount());

    function selectStock(event: Event) {
      const symbol = (event as CustomEvent<string>).detail;
      const currentAccount = readAccount();
      if (getTradableAssets(currentAccount).some((asset) => asset.symbol === symbol)) {
        setSelected(symbol);
        setMessage(`${symbol} loaded into the order ticket.`);
      }
    }

    function accountUpdated(event: Event) {
      const nextAccount = (event as CustomEvent<Account>).detail;
      setAccount(nextAccount);
    }

    window.addEventListener("ptj-select-stock", selectStock);
    window.addEventListener("ptj-account-updated", accountUpdated);
    return () => {
      window.removeEventListener("ptj-select-stock", selectStock);
      window.removeEventListener("ptj-account-updated", accountUpdated);
    };
  }, []);

  useEffect(() => {
    if (selectedAsset) return;
    setSelected(tradableAssets[0]?.symbol ?? "GUN");
  }, [selectedAsset, tradableAssets]);

  function save(next: Account, status?: string) {
    setAccount(next);
    writeAccount(next);
    if (status) setMessage(status);
  }

  function buy() {
    if (!account || !selectedAsset) return;
    const amount = Math.min(Math.max(Number(investment) || 0, 0), account.cash);
    if (amount <= 0) {
      setMessage("Order rejected. Increase order size or add cash from missions.");
      return;
    }

    const shares = amount / selectedAsset.price;
    setLoading(true);
    window.setTimeout(() => {
      const existing = account.holdings.find((item) => item.symbol === selectedAsset.symbol);
      const nextHoldings = (() => {
        if (existing) {
          const nextShares = existing.shares + shares;
          const nextAverageCost = (existing.shares * existing.averageCost + amount) / nextShares;
          return account.holdings.map((item) =>
            item.symbol === selectedAsset.symbol ? { ...item, shares: nextShares, averageCost: nextAverageCost } : item
          );
        }

        return [...account.holdings, { symbol: selectedAsset.symbol, shares, averageCost: selectedAsset.price }];
      })();

      save(
        { ...account, cash: account.cash - amount, holdings: nextHoldings },
        `Filled buy order: ${shares.toFixed(4)} ${selectedAsset.symbol} for ${formatCurrency(amount)}.`
      );
      setLoading(false);
    }, 300);
  }

  function sell(symbol: string, ratio: number) {
    if (!account) return;
    const holding = account.holdings.find((item) => item.symbol === symbol);
    const sellAsset = findTradableAsset(symbol, account);
    if (!holding || !sellAsset) {
      setMessage("Sell rejected. Asset is not listed on the active market.");
      return;
    }

    const sharesToSell = Math.min(holding.shares, holding.shares * ratio);
    const proceeds = sharesToSell * sellAsset.price;
    const nextHoldings = account.holdings
      .map((item) => (item.symbol === symbol ? { ...item, shares: item.shares - sharesToSell } : item))
      .filter((item) => item.shares > 0.0001);

    save(
      { ...account, cash: account.cash + proceeds, holdings: nextHoldings },
      `Filled sell order: ${sharesToSell.toFixed(4)} ${symbol} for ${formatCurrency(proceeds)}.`
    );
  }

  function shortSignal() {
    if (!account || !selectedAsset) return;
    const stake = Math.min(Math.max(Number(investment) || 0, 0), account.cash);
    if (stake <= 0) return;
    const move = Math.max(Math.abs(selectedAsset.change), 1.5);
    const payout = selectedAsset.change < 0 ? stake * (1 + move / 100) : stake * Math.max(0.55, 1 - move / 120);
    save(
      { ...account, cash: account.cash - stake + payout },
      `Short signal settled on ${selectedAsset.symbol}: ${formatCurrency(payout - stake)} P/L.`
    );
  }

  function addListing(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!account) {
      setMessage("Create a PTJ account before listing new stocks.");
      return;
    }

    const symbol = sanitizeTicker(listing.symbol || listing.name);
    const name = listing.name.trim();
    const price = Math.min(Math.max(Number(listing.price) || 0, 1), 9999);

    if (!name || symbol.length < 2) {
      setMessage("Listing rejected. Add a character name and a 2-6 letter ticker.");
      return;
    }

    if (tradableAssets.some((asset) => asset.symbol === symbol)) {
      setMessage(`${symbol} already exists on the PTJ market.`);
      return;
    }

    const customStock: CustomStock = {
      symbol,
      name,
      faction: listing.faction.trim() || "Independent",
      price,
      createdAt: new Date().toISOString()
    };

    save(
      { ...account, customStocks: [...account.customStocks, customStock] },
      `${customStock.symbol} listed at ${formatCurrency(customStock.price)}. It is now tradable in this browser.`
    );
    setSelected(customStock.symbol);
    setListing(listingDefaults);
  }

  return (
    <section id="portfolio" className="relative z-10 mx-auto grid w-[min(1180px,calc(100%-32px))] gap-5 py-16 lg:grid-cols-[.78fr_1.22fr]">
      <div className="grid gap-5">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Dealer Access</CardTitle>
            <p className="text-sm text-slate-400">One local account. Paper cash, holdings, custom listings, and futures save in this browser.</p>
          </CardHeader>
          <CardContent>
            <div className="rounded-2xl border border-crimson/25 bg-crimson/10 p-5">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-black/40 text-crimson">
                  <LockKeyhole size={22} />
                </div>
                <div>
                  <p className="text-3xl font-black">{account ? account.alias : "VIP Desk"}</p>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-400">{account ? `${account.crew} account` : "Create account to trade"}</p>
                </div>
              </div>
              <div className="mt-6 grid gap-3">
                <input className="h-12 rounded-xl border border-white/10 bg-black/30 px-4 text-sm outline-none" value={account ? `${account.alias}@ptj.black` : "new-dealer@ptj.black"} readOnly />
                <input className="h-12 rounded-xl border border-white/10 bg-black/30 px-4 text-sm outline-none" value={account ? `Started with ${formatCurrency(STARTING_CASH)}` : "No account found"} readOnly />
                <Button asChild>
                  <Link href="/login">
                    {account ? <Check size={17} /> : null}
                    {account ? "Account active" : "Create account"}
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Listing Desk</CardTitle>
            <p className="text-sm text-slate-400">Add missing fighters, schools, crews, or meme assets to your local market.</p>
          </CardHeader>
          <CardContent>
            <form className="grid gap-3" onSubmit={addListing}>
              <input
                className="h-12 rounded-xl border border-white/10 bg-black/40 px-4 text-sm outline-none transition focus:border-crimson"
                placeholder="Character or crew name"
                value={listing.name}
                disabled={!account}
                onChange={(event) => setListing((current) => ({ ...current, name: event.target.value }))}
              />
              <div className="grid grid-cols-[.7fr_1fr] gap-3">
                <input
                  className="h-12 rounded-xl border border-white/10 bg-black/40 px-4 text-sm uppercase outline-none transition focus:border-crimson"
                  placeholder="Ticker"
                  value={listing.symbol}
                  disabled={!account}
                  onChange={(event) => setListing((current) => ({ ...current, symbol: sanitizeTicker(event.target.value) }))}
                />
                <input
                  className="h-12 rounded-xl border border-white/10 bg-black/40 px-4 text-sm outline-none transition focus:border-crimson"
                  placeholder="Crew / school"
                  value={listing.faction}
                  disabled={!account}
                  onChange={(event) => setListing((current) => ({ ...current, faction: event.target.value }))}
                />
              </div>
              <div className="grid grid-cols-[1fr_auto] gap-3">
                <input
                  className="h-12 rounded-xl border border-white/10 bg-black/40 px-4 text-sm outline-none transition focus:border-crimson"
                  min={1}
                  max={9999}
                  type="number"
                  value={listing.price}
                  disabled={!account}
                  onChange={(event) => setListing((current) => ({ ...current, price: Number(event.target.value) }))}
                />
                <Button type="submit" disabled={!account}><Plus size={17} /> List</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <CardTitle>Crew Holdings</CardTitle>
            <p className="text-sm text-slate-400">Market orders now use the automatic Reddit-backed price feed plus your local listings.</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-right">
            <div className="rounded-md border border-white/10 bg-black/30 p-3">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">Cash</p>
              <p className="text-2xl font-black">{formatCurrency(cash)}</p>
            </div>
            <div className="rounded-md border border-white/10 bg-black/30 p-3">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">Equity</p>
              <p className="text-2xl font-black">{formatCurrency(holdingsValue)}</p>
            </div>
            <div className="rounded-md border border-white/10 bg-black/30 p-3">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">Net</p>
              <p className="text-2xl font-black">{formatCurrency(holdingsValue + cash)}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!account && (
            <div className="mb-5 rounded-xl border border-crimson/30 bg-crimson/10 p-4 text-sm text-slate-200">
              Create your one-time PTJ account first. You will start with {formatCurrency(STARTING_CASH)}.
            </div>
          )}

          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/25 p-4">
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <RadioTower className="text-ice" size={18} />
              <span>Auto market sync: {redditMarketMeta.postsScanned} Reddit posts scanned</span>
            </div>
            <span className="font-mono text-xs uppercase tracking-[0.16em] text-slate-500">
              Futures margin {formatCurrency(openFutureMargin)}
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_150px_auto_auto_auto]">
            <select
              className="h-12 rounded-xl border border-white/10 bg-black/40 px-4 text-sm outline-none transition focus:border-crimson"
              value={selectedAsset?.symbol ?? selected}
              onChange={(event) => setSelected(event.target.value)}
              disabled={!account}
            >
              {tradableAssets.map((asset) => (
                <option key={asset.symbol} value={asset.symbol}>{asset.name} ({asset.symbol})</option>
              ))}
            </select>
            <input
              className="h-12 rounded-xl border border-white/10 bg-black/40 px-4 text-sm outline-none transition focus:border-crimson"
              min={1}
              max={Math.max(1, Math.floor(cash))}
              type="number"
              value={investment}
              disabled={!account}
              onChange={(event) => setInvestment(Number(event.target.value))}
            />
            <Button onClick={buy} disabled={!account || cash <= 0 || !selectedAsset}><Plus size={17} /> Buy</Button>
            <Button onClick={() => selectedHolding && sell(selected, 0.25)} disabled={!selectedHolding} variant="ghost"><Minus size={17} /> Sell 25%</Button>
            <Button onClick={shortSignal} disabled={!account || cash <= 0 || !selectedAsset} variant="ghost">Short</Button>
          </div>

          {selectedAsset && (
            <p className="mt-3 font-mono text-xs uppercase tracking-[0.16em] text-slate-500">
              Selected: {selectedAsset.name} / {formatCurrency(selectedAsset.price)} per share / {selectedHolding ? `${selectedHolding.shares.toFixed(4)} owned` : "no position"}
            </p>
          )}
          <p className="mt-2 text-sm text-slate-400">{message}</p>

          <div className="mt-6 grid gap-3">
            {loading && <Skeleton className="h-16" />}
            {account && holdings.length === 0 && (
              <div className="rounded-md border border-white/10 bg-black/20 p-5 text-sm text-slate-400">
                No holdings yet. Pick a stock and buy any amount up to your cash balance.
              </div>
            )}
            {holdings.map((holding) => {
              const asset = findTradableAsset(holding.symbol, account);
              if (!asset) return null;
              const value = asset.price * holding.shares;
              const cost = holding.averageCost * holding.shares;
              const gain = value - cost;
              return (
                <div key={holding.symbol} className="flex flex-col gap-4 rounded-md border border-white/10 bg-black/20 p-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-2xl bg-crimson/10 text-crimson">
                      <BriefcaseBusiness size={18} />
                    </div>
                    <div>
                      <p className="font-semibold">{asset.name}</p>
                      <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
                        {holding.shares.toFixed(4)} shares / avg {formatCurrency(holding.averageCost)} / {asset.symbol}
                      </p>
                    </div>
                  </div>
                  <div className="text-left md:text-right">
                    <p>{formatCurrency(value)}</p>
                    <p className={`flex items-center gap-1 md:justify-end ${gain >= 0 ? "text-ice" : "text-crimson"}`}><Wallet size={14} /> {gain >= 0 ? "+" : ""}{formatCurrency(gain)}</p>
                    <div className="mt-2 flex gap-2 md:justify-end">
                      <Button size="sm" variant="ghost" onClick={() => sell(holding.symbol, 0.25)}>Sell 25%</Button>
                      <Button size="sm" variant="ghost" onClick={() => sell(holding.symbol, 1)}>Sell all</Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
