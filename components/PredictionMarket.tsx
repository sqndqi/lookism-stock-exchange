"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock3, Landmark, TrendingUp } from "lucide-react";
import { predictionContracts } from "@/lib/market-data";
import { formatCurrency } from "@/lib/utils";
import type { Account } from "@/lib/account";
import { readAccount, writeAccount } from "@/lib/account";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function positionId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function markValue(stake: number, odds: number) {
  return stake * (0.55 + odds / 100);
}

export function PredictionMarket() {
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [stakeByQuestion, setStakeByQuestion] = useState<Record<string, number>>({});
  const [account, setAccount] = useState<Account | null>(null);
  const [message, setMessage] = useState("Futures desk ready.");

  useEffect(() => {
    setAccount(readAccount());

    function accountUpdated(event: Event) {
      setAccount((event as CustomEvent<Account>).detail);
    }

    window.addEventListener("ptj-account-updated", accountUpdated);
    return () => window.removeEventListener("ptj-account-updated", accountUpdated);
  }, []);

  const openFutures = useMemo(() => (account?.futures ?? []).filter((future) => future.status === "OPEN"), [account]);
  const totalMargin = useMemo(() => openFutures.reduce((sum, future) => sum + future.stake, 0), [openFutures]);
  const markedValue = useMemo(() => openFutures.reduce((sum, future) => sum + markValue(future.stake, future.odds), 0), [openFutures]);

  function save(next: Account, status: string) {
    setAccount(next);
    writeAccount(next);
    setMessage(status);
  }

  function buyFuture(question: string) {
    if (!account) {
      setMessage("Create a PTJ account before opening futures.");
      return;
    }

    const selection = selected[question];
    const contract = predictionContracts.find((item) => item.question === question);
    const option = contract?.options.find((item) => item.label === selection);
    if (!contract || !option) {
      setMessage("Choose a contract side before buying.");
      return;
    }

    const stake = Math.min(Math.max(stakeByQuestion[question] || 25, 1), account.cash);
    if (stake <= 0) {
      setMessage("No cash available for this futures order.");
      return;
    }

    save(
      {
        ...account,
        cash: account.cash - stake,
        futures: [
          ...account.futures,
          {
            id: positionId(),
            question,
            selection,
            stake,
            odds: option.odds,
            openedAt: new Date().toISOString(),
            status: "OPEN"
          }
        ]
      },
      `Opened ${selection} futures for ${formatCurrency(stake)} margin.`
    );
  }

  function closeFuture(id: string) {
    if (!account) return;
    const future = account.futures.find((item) => item.id === id);
    if (!future || future.status !== "OPEN") return;

    const proceeds = markValue(future.stake, future.odds);
    const futures = account.futures.map((item) => (item.id === id ? { ...item, status: "SETTLED" as const } : item));
    save(
      { ...account, cash: account.cash + proceeds, futures },
      `Closed ${future.selection} futures for ${formatCurrency(proceeds)} mark value.`
    );
  }

  return (
    <section id="predictions" className="relative z-10 border-y border-white/10 bg-white/[0.02] py-16">
      <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-crimson">Event futures</p>
            <h2 className="mt-3 text-4xl font-black uppercase leading-none md:text-6xl">Chapter Futures</h2>
          </div>
          <p className="max-w-xl text-slate-400">
            Buy paper contracts on Lookism arc outcomes. Margin, open positions, mark value, and cash settlement all persist in your account.
          </p>
        </div>

        <div className="mb-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-md border border-white/10 bg-black/30 p-4">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">Available cash</p>
            <p className="text-3xl font-black">{formatCurrency(account?.cash ?? 0)}</p>
          </div>
          <div className="rounded-md border border-white/10 bg-black/30 p-4">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">Open margin</p>
            <p className="text-3xl font-black">{formatCurrency(totalMargin)}</p>
          </div>
          <div className="rounded-md border border-white/10 bg-black/30 p-4">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">Mark value</p>
            <p className="text-3xl font-black">{formatCurrency(markedValue)}</p>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {predictionContracts.map((contract) => {
            const stake = stakeByQuestion[contract.question] ?? 25;
            const selectedOption = contract.options.find((option) => option.label === selected[contract.question]);
            return (
              <Card key={contract.question} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <Badge>{contract.closes}</Badge>
                    <span className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
                      Pool {formatCurrency(contract.pool)}
                    </span>
                  </div>
                  <CardTitle className="mt-4 leading-none">{contract.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-5 text-sm leading-6 text-slate-400">{contract.catalyst}</p>
                  <div className="space-y-3">
                    {contract.options.map((option) => (
                      <button
                        key={option.label}
                        className={`w-full rounded-md border p-3 text-left transition hover:border-cyanline/50 hover:bg-cyanline/10 ${
                          selected[contract.question] === option.label ? "border-crimson/60 bg-crimson/10" : "border-white/10 bg-black/25"
                        }`}
                        type="button"
                        onClick={() => setSelected((current) => ({ ...current, [contract.question]: option.label }))}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <span className="font-semibold">{option.label}</span>
                          <span className="font-mono text-ice">{option.odds}%</span>
                        </div>
                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                          <div className="h-full rounded-full bg-crimson shadow-[0_0_18px_rgba(215,25,32,.35)]" style={{ width: `${option.odds}%` }} />
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="mt-5 grid grid-cols-[1fr_auto] gap-3">
                    <input
                      className="h-11 rounded-xl border border-white/10 bg-black/40 px-4 text-sm outline-none transition focus:border-crimson"
                      min={1}
                      max={Math.max(1, Math.floor(account?.cash ?? 1))}
                      type="number"
                      value={stake}
                      disabled={!account}
                      onChange={(event) => setStakeByQuestion((current) => ({ ...current, [contract.question]: Number(event.target.value) }))}
                    />
                    <Button
                      variant="ghost"
                      onClick={() => buyFuture(contract.question)}
                      disabled={!account || !selectedOption || (account?.cash ?? 0) <= 0}
                    >
                      Buy
                    </Button>
                  </div>
                  <p className="mt-3 font-mono text-xs uppercase tracking-[0.16em] text-slate-500">
                    {selectedOption ? `Max payout ${formatCurrency(stake * (100 / selectedOption.odds))}` : "Select a side to quote payout"}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="mt-5">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>Open Futures Book</CardTitle>
              <p className="text-sm text-slate-400">{message}</p>
            </div>
            <Landmark className="text-crimson" size={24} />
          </CardHeader>
          <CardContent className="grid gap-3">
            {!account && (
              <div className="rounded-md border border-crimson/25 bg-crimson/10 p-4 text-sm text-slate-300">
                Create an account to open and settle futures.
              </div>
            )}
            {account && openFutures.length === 0 && (
              <div className="rounded-md border border-white/10 bg-black/20 p-4 text-sm text-slate-400">
                No open contracts. Buy a side above to create a futures position.
              </div>
            )}
            {openFutures.map((future) => (
              <div key={future.id} className="grid gap-4 rounded-md border border-white/10 bg-black/20 p-4 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Badge>{future.selection}</Badge>
                    <span className="flex items-center gap-1 font-mono text-xs uppercase tracking-[0.16em] text-slate-500">
                      <Clock3 size={13} /> {new Date(future.openedAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="font-semibold">{future.question}</p>
                  <p className="mt-2 flex items-center gap-2 text-sm text-slate-400">
                    <TrendingUp size={15} /> Margin {formatCurrency(future.stake)} / odds {future.odds}% / mark {formatCurrency(markValue(future.stake, future.odds))}
                  </p>
                </div>
                <Button variant="ghost" onClick={() => closeFuture(future.id)}>Close</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
