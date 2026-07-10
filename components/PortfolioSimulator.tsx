"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BriefcaseBusiness, Check, LockKeyhole, Minus, Plus, RadioTower, Wallet } from "lucide-react";
import { findTradableAsset, getTradableAssets, redditMarketMeta } from "@/lib/live-market";
import { useMarketAutomation } from "@/lib/use-market-automation";
import { formatCurrency } from "@/lib/utils";
import type { Account, CustomStock, ShortPosition } from "@/lib/account";
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
  const [message, setMessage] = useState("Crew basket terminal ready.");
  const automation = useMarketAutomation();

  const tradableAssets = useMemo(() => getTradableAssets(account, automation), [account, automation]);
  const holdings = useMemo(() => account?.holdings ?? [], [account]);
  const cash = account?.cash ?? 0;
  const selectedAsset = tradableAssets.find((item) => item.symbol === selected) ?? tradableAssets[0];
  const selectedHolding = holdings.find((holding) => holding.symbol === selected);
  const openShorts = useMemo(() => (account?.shorts ?? []).filter((item) => item.status === "OPEN"), [account]);
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
      const currentAssets = getTradableAssets(currentAccount, automation);
      if (currentAssets.some((asset) => asset.symbol === symbol)) {
        setSelected(symbol);
        const asset = currentAssets.find((item) => item.symbol === symbol);
        setMessage(`${asset?.name ?? symbol} loaded into the crew basket order ticket.`);
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
  }, [automation]);

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
      setMessage("Back order rejected. Increase stake or claim account demo cash.");
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
        `Backed ${selectedAsset.name}: ${shares.toFixed(4)} units for ${formatCurrency(amount)}.`
      );
      setLoading(false);
    }, 300);
  }

  function sell(symbol: string, ratio: number) {
    if (!account) return;
    const holding = account.holdings.find((item) => item.symbol === symbol);
    const sellAsset = findTradableAsset(symbol, account, automation);
    if (!holding || !sellAsset) {
      setMessage("Drop rejected. Asset is not listed on the active crew market.");
      return;
    }

    const sharesToSell = Math.min(holding.shares, holding.shares * ratio);
    const proceeds = sharesToSell * sellAsset.price;
    const nextHoldings = account.holdings
      .map((item) => (item.symbol === symbol ? { ...item, shares: item.shares - sharesToSell } : item))
      .filter((item) => item.shares > 0.0001);

    save(
      { ...account, cash: account.cash + proceeds, holdings: nextHoldings },
      `Dropped ${sharesToSell.toFixed(4)} ${symbol} for ${formatCurrency(proceeds)}.`
    );
  }

  function openShort() {
    if (!account || !selectedAsset) return;
    const margin = Math.min(Math.max(Number(investment) || 0, 0), account.cash);
    if (margin <= 0) {
      setMessage("Drop order rejected. No demo cash available for margin.");
      return;
    }
    const quantity = margin / selectedAsset.price;
    const short: ShortPosition = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      symbol: selectedAsset.symbol,
      quantity,
      entryPrice: selectedAsset.price,
      openedAt: new Date().toISOString(),
      status: "OPEN"
    };
    save(
      { ...account, cash: account.cash - margin, shorts: [...account.shorts, short] },
      `Opened Drop position on ${selectedAsset.name}: ${quantity.toFixed(4)} units at ${formatCurrency(selectedAsset.price)}.`
    );
  }

  function closeShort(id: string) {
    if (!account) return;
    const short = account.shorts.find((item) => item.id === id);
    if (!short || short.status !== "OPEN") return;
    const asset = findTradableAsset(short.symbol, account, automation);
    if (!asset) return;

    const entryValue = short.entryPrice * short.quantity;
    const coverValue = asset.price * short.quantity;
    const proceeds = Math.max(0, entryValue + (entryValue - coverValue));
    const shorts = account.shorts.map((item) => (item.id === id ? { ...item, status: "CLOSED" as const } : item));
    save(
      { ...account, cash: account.cash + proceeds, shorts },
      `Closed Drop on ${asset.name}: ${formatCurrency(proceeds - entryValue)} unrealized result settled.`
    );
  }

  function addListing(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!account) {
      setMessage("Create an AURA EXCHANGE desk before listing new fighter or crew assets.");
      return;
    }

    const symbol = sanitizeTicker(listing.symbol || listing.name);
    const name = listing.name.trim();
    const price = Math.min(Math.max(Number(listing.price) || 0, 1), 9999);

    if (!name || symbol.length < 2) {
      setMessage("Listing rejected. Add a fighter/crew name and a 2-6 letter ticker.");
      return;
    }

    if (tradableAssets.some((asset) => asset.symbol === symbol)) {
      setMessage(`${symbol} already exists on AURA EXCHANGE.`);
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
      `${customStock.symbol} listed at ${formatCurrency(customStock.price)} street value. It is now tradable in this browser.`
    );
    setSelected(customStock.symbol);
    setListing(listingDefaults);
  }

  return (
    <section id="portfolio" className="section-wrap relative z-10 grid gap-5 py-14 lg:grid-cols-[.78fr_1.22fr]">
      <div className="grid gap-5">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Open Trading Desk</CardTitle>
            <p className="text-sm text-slate-400">One local desk. Demo cash, holdings, short positions, listings, and prediction contracts persist in this browser.</p>
          </CardHeader>
          <CardContent>
            <div className="rounded-2xl border border-crimson/25 bg-crimson/10 p-5">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-black/40 text-crimson">
                  <LockKeyhole size={22} />
                </div>
                <div>
                  <p className="font-display text-4xl font-bold uppercase">{account ? account.alias : "VIP Desk"}</p>
                  <p className="terminal-label">{account ? `${account.crew} desk` : "Create account to unlock trading"}</p>
                </div>
              </div>
              <div className="mt-6 grid gap-3">
                <input className="h-12 rounded-md border border-white/10 bg-black/30 px-4 text-sm outline-none" value={account ? `${account.alias}@aura.exchange` : "new-desk@aura.exchange"} readOnly />
                <input className="h-12 rounded-xl border border-white/10 bg-black/30 px-4 text-sm outline-none" value={account ? `Started with ${formatCurrency(STARTING_CASH)} demo cash` : "Create account to receive demo cash"} readOnly />
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
            <CardTitle>Private Listing</CardTitle>
            <p className="text-sm text-slate-400">List missing fighters, schools, crews, or theory assets to your local market.</p>
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
            <CardTitle>Portfolio Simulator</CardTitle>
            <p className="text-sm text-slate-400">Back, drop, or short fighter and crew assets using the rumor feed plus your local listings.</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-right">
            <div className="rounded-md border border-white/10 bg-black/30 p-3">
              <p className="terminal-label text-[0.58rem]">Demo Cash</p>
              <p className="text-2xl font-black">{account ? formatCurrency(cash) : "Locked"}</p>
            </div>
            <div className="rounded-md border border-white/10 bg-black/30 p-3">
              <p className="terminal-label text-[0.58rem]">Asset Value</p>
              <p className="text-2xl font-black">{account ? formatCurrency(holdingsValue) : "Locked"}</p>
            </div>
            <div className="rounded-md border border-white/10 bg-black/30 p-3">
              <p className="terminal-label text-[0.58rem]">Desk Equity</p>
              <p className="text-2xl font-black">{account ? formatCurrency(holdingsValue + cash) : "Locked"}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!account && (
            <div className="mb-5 rounded-xl border border-crimson/30 bg-crimson/10 p-4 text-sm text-slate-200">
              Create your AURA EXCHANGE desk to receive {formatCurrency(STARTING_CASH)} demo cash and unlock trading.
            </div>
          )}

          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/25 p-4">
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <RadioTower className="text-ice" size={18} />
              <span>Rumor wire sync: {redditMarketMeta.postsScanned} r/lookismcomic posts scanned</span>
            </div>
            <span className="font-mono text-xs uppercase tracking-[0.16em] text-slate-500">
              Chapter prediction margin {formatCurrency(openFutureMargin)}
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
            <Button onClick={buy} disabled={!account || cash <= 0 || !selectedAsset}><Plus size={17} /> Back</Button>
            <Button onClick={() => selectedHolding && sell(selected, 0.25)} disabled={!selectedHolding} variant="ghost"><Minus size={17} /> Drop 25%</Button>
            <Button onClick={openShort} disabled={!account || cash <= 0 || !selectedAsset} variant="ghost">Open Drop</Button>
          </div>

          {selectedAsset && (
            <p className="mt-3 font-mono text-xs uppercase tracking-[0.16em] text-slate-500">
              Selected: {selectedAsset.name} / {formatCurrency(selectedAsset.price)} street value / {selectedHolding ? `${selectedHolding.shares.toFixed(4)} backed` : "no backing"}
            </p>
          )}
          <p className="mt-2 text-sm text-slate-400">{message}</p>

          <div className="mt-6 grid gap-3">
            {loading && <Skeleton className="h-16" />}
            {account && holdings.length === 0 && (
              <div className="rounded-md border border-white/10 bg-black/20 p-5 text-sm text-slate-400">
                No crew basket positions yet. Pick a fighter or crew asset and back any amount up to your demo cash balance.
              </div>
            )}
            {holdings.map((holding) => {
                const asset = findTradableAsset(holding.symbol, account, automation);
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
                        {holding.shares.toFixed(4)} units / entry {formatCurrency(holding.averageCost)} / {asset.symbol}
                      </p>
                    </div>
                  </div>
                  <div className="text-left md:text-right">
                    <p>{formatCurrency(value)}</p>
                    <p className={`flex items-center gap-1 md:justify-end ${gain >= 0 ? "text-ice" : "text-crimson"}`}><Wallet size={14} /> {gain >= 0 ? "+" : ""}{formatCurrency(gain)}</p>
                    <div className="mt-2 flex gap-2 md:justify-end">
                      <Button size="sm" variant="ghost" onClick={() => sell(holding.symbol, 0.25)}>Drop 25%</Button>
                      <Button size="sm" variant="ghost" onClick={() => sell(holding.symbol, 1)}>Drop all</Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {account && openShorts.length > 0 && (
            <div className="mt-6 grid gap-3 border-t border-white/10 pt-5">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-crimson">Open Drop Positions</p>
              {openShorts.map((short) => {
                const asset = findTradableAsset(short.symbol, account, automation);
                if (!asset) return null;
                const entryValue = short.entryPrice * short.quantity;
                const currentValue = asset.price * short.quantity;
                const pnl = entryValue - currentValue;
                return (
                  <div key={short.id} className="flex flex-col gap-3 rounded-md border border-crimson/25 bg-crimson/10 p-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-semibold">{asset.name} Drop</p>
                      <p className="font-mono text-xs uppercase tracking-[0.16em] text-slate-400">
                        Entry {formatCurrency(short.entryPrice)} / current {formatCurrency(asset.price)} / {short.quantity.toFixed(4)} units
                      </p>
                    </div>
                    <div className="flex items-center gap-3 md:justify-end">
                      <span className={pnl >= 0 ? "text-ice" : "text-crimson"}>{pnl >= 0 ? "+" : ""}{formatCurrency(pnl)}</span>
                      <Button size="sm" variant="ghost" onClick={() => closeShort(short.id)}>Close Drop</Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
