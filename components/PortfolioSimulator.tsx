"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BriefcaseBusiness, Check, LockKeyhole, Minus, Plus, Wallet } from "lucide-react";
import { assets } from "@/lib/market-data";
import { formatCurrency } from "@/lib/utils";
import type { Account } from "@/lib/account";
import { readAccount, STARTING_CASH, writeAccount } from "@/lib/account";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PortfolioSimulator() {
  const [account, setAccount] = useState<Account | null>(null);
  const [selected, setSelected] = useState("GUN");
  const [investment, setInvestment] = useState(100);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAccount(readAccount());

    function selectStock(event: Event) {
      const symbol = (event as CustomEvent<string>).detail;
      if (assets.some((asset) => asset.symbol === symbol)) {
        setSelected(symbol);
      }
    }

    function accountUpdated(event: Event) {
      setAccount((event as CustomEvent<Account>).detail);
    }

    window.addEventListener("ptj-select-stock", selectStock);
    window.addEventListener("ptj-account-updated", accountUpdated);
    return () => {
      window.removeEventListener("ptj-select-stock", selectStock);
      window.removeEventListener("ptj-account-updated", accountUpdated);
    };
  }, []);

  const holdings = useMemo(() => account?.holdings ?? [], [account]);
  const cash = account?.cash ?? STARTING_CASH;
  const selectedAsset = assets.find((item) => item.symbol === selected) ?? assets[0];

  const total = useMemo(
    () =>
      holdings.reduce((sum, holding) => {
        const asset = assets.find((item) => item.symbol === holding.symbol);
        return sum + (asset?.price ?? 0) * holding.shares;
      }, 0),
    [holdings]
  );

  const selectedHolding = holdings.find((holding) => holding.symbol === selected);

  function save(next: Account) {
    setAccount(next);
    writeAccount(next);
  }

  function buy() {
    if (!account || !selectedAsset) return;
    const amount = Math.min(Math.max(Number(investment) || 0, 0), account.cash);
    if (amount <= 0) return;
    const shares = amount / selectedAsset.price;

    setLoading(true);
    window.setTimeout(() => {
      const existing = account.holdings.find((item) => item.symbol === selected);
      const holdings = (() => {
        if (existing) {
          const nextShares = existing.shares + shares;
          const nextAverageCost = ((existing.shares * existing.averageCost) + amount) / nextShares;
          return account.holdings.map((item) =>
            item.symbol === selected ? { ...item, shares: nextShares, averageCost: nextAverageCost } : item
          );
        }

        return [...account.holdings, { symbol: selected, shares, averageCost: selectedAsset.price }];
      })();

      save({ ...account, cash: account.cash - amount, holdings });
      setLoading(false);
    }, 450);
  }

  function sell(symbol: string, ratio: number) {
    if (!account) return;
    const holding = account.holdings.find((item) => item.symbol === symbol);
    const asset = assets.find((item) => item.symbol === selected);
    const sellAsset = assets.find((item) => item.symbol === symbol);
    if (!holding || !sellAsset || !asset) return;

    const sharesToSell = Math.min(holding.shares, holding.shares * ratio);
    const proceeds = sharesToSell * sellAsset.price;
    const nextHoldings = account.holdings
      .map((item) => (item.symbol === symbol ? { ...item, shares: item.shares - sharesToSell } : item))
      .filter((item) => item.shares > 0.0001);

    save({ ...account, cash: account.cash + proceeds, holdings: nextHoldings });
  }

  function shortSignal() {
    if (!account || !selectedAsset) return;
    const stake = Math.min(Math.max(Number(investment) || 0, 0), account.cash);
    if (stake <= 0) return;
    const payout = stake * Math.max(Math.abs(selectedAsset.change), 2) / 100;
    save({ ...account, cash: account.cash - stake + payout });
  }

  return (
    <section id="portfolio" className="relative z-10 mx-auto grid w-[min(1180px,calc(100%-32px))] gap-5 py-16 lg:grid-cols-[.82fr_1.18fr]">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Dealer Access</CardTitle>
          <p className="text-sm text-slate-400">Luxury guest desk for paper trades inside the Seoul underground.</p>
        </CardHeader>
        <CardContent>
          <div className="rounded-[26px] border border-crimson/25 bg-crimson/10 p-5">
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
              <input className="h-12 rounded-2xl border border-white/10 bg-black/30 px-4 text-sm outline-none transition focus:border-crimson" value={account ? `${account.alias}@ptj.black` : "new-dealer@ptj.black"} readOnly />
              <input className="h-12 rounded-2xl border border-white/10 bg-black/30 px-4 text-sm outline-none transition focus:border-crimson" value={account ? `Started with ${formatCurrency(STARTING_CASH)}` : "No account found"} readOnly />
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
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>Crew Holdings</CardTitle>
            <p className="text-sm text-slate-400">Invest paper cash into fighter and crew stocks. Your account saves in this browser.</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-md border border-white/10 bg-black/30 p-3 text-right">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">Cash</p>
              <p className="text-3xl font-black">{formatCurrency(cash)}</p>
            </div>
            <div className="rounded-md border border-white/10 bg-black/30 p-3 text-right">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">Influence</p>
              <p className="text-3xl font-black">{formatCurrency(total + cash)}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!account && (
            <div className="mb-5 rounded-xl border border-crimson/30 bg-crimson/10 p-4 text-sm text-slate-200">
              Create your one-time PTJ account first. You will start with {formatCurrency(STARTING_CASH)}.
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-[1fr_150px_auto_auto_auto]">
            <select
              className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm outline-none transition focus:border-crimson"
              value={selected}
              onChange={(event) => setSelected(event.target.value)}
              disabled={!account}
            >
              {assets.map((asset) => (
                <option key={asset.symbol} value={asset.symbol}>{asset.name} ({asset.symbol})</option>
              ))}
            </select>
            <input
              className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm outline-none transition focus:border-crimson"
              min={1}
              max={Math.max(1, Math.floor(cash))}
              type="number"
              value={investment}
              disabled={!account}
              onChange={(event) => setInvestment(Number(event.target.value))}
            />
            <Button onClick={buy} disabled={!account || cash <= 0}><Plus size={17} /> Invest</Button>
            <Button onClick={() => selectedHolding && sell(selected, 0.25)} disabled={!selectedHolding} variant="ghost"><Minus size={17} /> Sell 25%</Button>
            <Button onClick={shortSignal} disabled={!account || cash <= 0} variant="ghost">Short signal</Button>
          </div>
          <p className="mt-3 font-mono text-xs uppercase tracking-[0.16em] text-slate-500">
            Selected: {selectedAsset.name} / {formatCurrency(selectedAsset.price)} per share / {selectedHolding ? `${selectedHolding.shares.toFixed(4)} owned` : "no position"}
          </p>

          <div className="mt-6 grid gap-3">
            {loading && <Skeleton className="h-16" />}
            {account && holdings.length === 0 && (
              <div className="rounded-md border border-white/10 bg-black/20 p-5 text-sm text-slate-400">
                No holdings yet. Pick a stock and invest any amount up to your cash balance.
              </div>
            )}
            {holdings.map((holding) => {
              const asset = assets.find((item) => item.symbol === holding.symbol);
              if (!asset) return null;
              const value = asset.price * holding.shares;
              const cost = holding.averageCost * holding.shares;
              const gain = value - cost;
              return (
                <div key={holding.symbol} className="flex items-center justify-between rounded-md border border-white/10 bg-black/20 p-4">
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
                  <div className="text-right">
                    <p>{formatCurrency(value)}</p>
                    <p className={`flex items-center justify-end gap-1 ${gain >= 0 ? "text-ice" : "text-crimson"}`}><Wallet size={14} /> {gain >= 0 ? "+" : ""}{formatCurrency(gain)}</p>
                    <div className="mt-2 flex justify-end gap-2">
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
