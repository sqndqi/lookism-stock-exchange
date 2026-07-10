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

function contractPayout(stake: number, odds: number) {
  return stake * (100 / odds);
}

export function PredictionMarket() {
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [stakeByQuestion, setStakeByQuestion] = useState<Record<string, number>>({});
  const [account, setAccount] = useState<Account | null>(null);
  const [message, setMessage] = useState("Scenario contract desk ready. Fake credits only.");

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
  const markedValue = useMemo(() => openFutures.reduce((sum, future) => sum + contractPayout(future.stake, future.odds), 0), [openFutures]);

  function save(next: Account, status: string) {
    setAccount(next);
    writeAccount(next);
    setMessage(status);
  }

  function buyFuture(question: string) {
    if (!account) {
      setMessage("Create an AURA EXCHANGE desk before opening scenario contracts.");
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
      setMessage("No simulation credits available for this scenario contract.");
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
      `Allocated ${formatCurrency(stake)} fake credits to ${selection}. Simulated payout: ${formatCurrency(contractPayout(stake, option.odds))}.`
    );
  }

  function closeFuture(id: string) {
    if (!account) return;
    const future = account.futures.find((item) => item.id === id);
    if (!future || future.status !== "OPEN") return;

    const proceeds = contractPayout(future.stake, future.odds);
    const futures = account.futures.map((item) => (item.id === id ? { ...item, status: "SETTLED" as const } : item));
    save(
      { ...account, cash: account.cash + proceeds, futures },
      `Settled ${future.selection} scenario for ${formatCurrency(proceeds)} fake credits.`
    );
  }

  return (
    <section id="predictions" className="relative z-10 border-y border-white/10 bg-white/[0.018] py-14">
      <div className="section-wrap">
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="terminal-label text-crimson">Scenario contracts</p>
            <h2 className="mt-3 font-display text-5xl font-bold uppercase leading-none md:text-7xl">Lore Forecast Desk</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-400 md:text-base">
            Explore fictional market expectations with simulation credits only. No real-money markets, gambling, or financial advice.
          </p>
        </div>

        <div className="mb-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-md border border-white/10 bg-black/30 p-4">
            <p className="terminal-label">Simulation credits</p>
            <p className="text-3xl font-black">{account ? formatCurrency(account.cash) : "Locked"}</p>
          </div>
          <div className="rounded-md border border-white/10 bg-black/30 p-4">
            <p className="terminal-label">Allocated</p>
            <p className="text-3xl font-black">{formatCurrency(totalMargin)}</p>
          </div>
          <div className="rounded-md border border-white/10 bg-black/30 p-4">
            <p className="terminal-label">Potential payout</p>
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
                    <span className="terminal-label">
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
                        className={`w-full rounded-md border p-3 text-left transition hover:border-cyanline/50 hover:bg-cyanline/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ice focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                          selected[contract.question] === option.label ? "border-crimson/60 bg-crimson/10" : "border-white/10 bg-black/25"
                        }`}
                        aria-pressed={selected[contract.question] === option.label}
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

                  <div className="mt-5 grid grid-cols-[1fr_auto] items-end gap-3">
                    <label className="grid gap-2">
                      <span className="terminal-label text-[0.58rem]">Allocation</span>
                      <input
                        className="h-11 rounded-md border border-white/10 bg-black/40 px-4 text-sm outline-none transition focus:border-crimson focus-visible:ring-2 focus-visible:ring-ice focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                        min={1}
                        max={Math.max(1, Math.floor(account?.cash ?? 1))}
                        type="number"
                        value={stake}
                        disabled={!account}
                        onChange={(event) => setStakeByQuestion((current) => ({ ...current, [contract.question]: Number(event.target.value) }))}
                      />
                    </label>
                    <Button
                      onClick={() => buyFuture(contract.question)}
                      disabled={!account || !selectedOption || (account?.cash ?? 0) <= 0}
                    >
                      Back
                    </Button>
                  </div>
                  <p className="mt-3 font-mono text-xs uppercase tracking-[0.16em] text-slate-500">
                    {selectedOption ? `Simulated payout ${formatCurrency(contractPayout(stake, selectedOption.odds))}` : "Select a side to quote scenario probabilities"}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="mt-5">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>Open Prediction Book</CardTitle>
              <p className="text-sm text-slate-400">{message}</p>
            </div>
            <Landmark className="text-crimson" size={24} />
          </CardHeader>
          <CardContent className="grid gap-3">
            {!account && (
              <div className="rounded-md border border-crimson/25 bg-crimson/10 p-4 text-sm text-slate-300">
                Create an AURA EXCHANGE desk to receive simulation credits and unlock scenario contracts.
              </div>
            )}
            {account && openFutures.length === 0 && (
              <div className="rounded-md border border-white/10 bg-black/25 p-4 text-sm text-slate-300">
                No open scenarios. Select a side, set fake-credit allocation, and quote a lore forecast.
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
                    <TrendingUp size={15} /> Allocation {formatCurrency(future.stake)} / scenario probability {future.odds}% / simulated payout {formatCurrency(contractPayout(future.stake, future.odds))}
                  </p>
                </div>
                <Button variant="ghost" onClick={() => closeFuture(future.id)}>Settle Scenario</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
