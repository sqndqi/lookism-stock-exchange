"use client";

import { useEffect, useMemo, useState } from "react";
import { readAccount, type Account } from "@/lib/account";
import { getMarketState } from "@/lib/market-engine";
import { calculatePortfolio } from "@/lib/portfolio";
import { formatCurrency, signedPercent } from "@/lib/utils";
import { featureFlags } from "@/lib/config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LeaderboardTerminal() {
  const [account, setAccount] = useState<Account | null>(null);
  const market = useMemo(() => getMarketState(account), [account]);
  const portfolio = account ? calculatePortfolio(account, market.assets) : null;
  const localRow = { alias: account?.alias ?? "Your Desk", crew: account?.crew ?? "Unclaimed", equity: portfolio?.totalEquity ?? 100000, returnPct: portfolio?.totalReturnPct ?? 0, risk: portfolio?.riskScore ?? 0, label: "local" };
  const rows = [
    localRow,
    ...(featureFlags.enableDemoLeaderboard ? [
    { alias: "Cheonliang Quant", crew: "Cheonliang", equity: 124880, returnPct: 24.88, risk: 71, label: "demo" },
    { alias: "Gangseo Tape", crew: "Big Deal", equity: 116420, returnPct: 16.42, risk: 58, label: "demo" },
    { alias: "White Tiger Desk", crew: "White Tiger", equity: 109730, returnPct: 9.73, risk: 64, label: "demo" },
    { alias: "Workers Arb", crew: "Workers", equity: 98440, returnPct: -1.56, risk: 86, label: "demo" }
    ] : [])
  ].sort((a, b) => b.equity - a.equity);

  useEffect(() => {
    setAccount(readAccount());
    function accountUpdated(event: Event) {
      setAccount(((event as CustomEvent<Account | null>).detail ?? null));
    }
    window.addEventListener("ptj-account-updated", accountUpdated);
    return () => window.removeEventListener("ptj-account-updated", accountUpdated);
  }, []);

  return (
    <section className="section-wrap relative z-10 py-10">
      <div className="mb-8">
        <p className="terminal-label text-ice">Local/demo ranking only</p>
        <h1 className="mt-3 font-display text-6xl font-bold uppercase leading-none">Desk Leaderboard</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-400">
          No global users, no rewards, no real-money mechanics.
          {featureFlags.enableDemoLeaderboard ? " Your browser desk is compared with deterministic demo desks for game feel." : " Demo desk rows are disabled by deployment config."}
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Simulated Desk Board</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {rows.map((row, index) => (
            <div key={`${row.alias}-${row.crew}`} className={`grid gap-3 rounded-md border p-4 md:grid-cols-[56px_1fr_repeat(3,auto)] md:items-center ${row.label === "local" ? "border-ice/35 bg-ice/10" : "border-white/10 bg-black/25"}`}>
              <span className="font-mono text-sm text-slate-400">#{index + 1}</span>
              <div>
                <p className="font-display text-2xl font-bold uppercase">{row.alias}</p>
                <p className="text-sm text-slate-400">{row.crew} / {row.label}</p>
              </div>
              <span>{formatCurrency(row.equity)}</span>
              <span className={row.returnPct >= 0 ? "text-ice" : "text-crimson"}>{signedPercent(row.returnPct)}</span>
              <span className="terminal-label">RISK {row.risk}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
