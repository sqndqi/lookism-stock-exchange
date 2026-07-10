"use client";

import Link from "next/link";
import { Bell, Trash2 } from "lucide-react";
import type { Account } from "@/lib/account";
import { writeAccount } from "@/lib/account";
import type { MarketAsset } from "@/lib/market-data";
import { checkAlerts, createAlert, deleteAlert, toggleAlert } from "@/lib/alerts";
import { formatCurrency, signedPercent } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function WatchlistAlertsPanel({ account, assets, onAccount }: { account: Account | null; assets: MarketAsset[]; onAccount: (account: Account | null) => void }) {
  const watched = assets.filter((asset) => account?.watchlist.includes(asset.symbol));

  function addRiskAlert(symbol: string) {
    if (!account) return;
    const next = createAlert(account, { symbol, type: "RISK_ABOVE", threshold: 80 });
    writeAccount(next);
    onAccount(next);
  }

  function runAlerts() {
    if (!account) return;
    const result = checkAlerts(account, assets);
    writeAccount(result.account);
    onAccount(result.account);
    window.dispatchEvent(new CustomEvent("aura-toast", { detail: result.hits.length ? result.hits.map((hit) => hit.message).join(" ") : "No local alerts triggered." }));
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <CardTitle>Watchlist & Local Alerts</CardTitle>
          <p className="text-sm text-slate-400">Browser-only alerts. No push notifications, no backend.</p>
        </div>
        <Button variant="ghost" onClick={runAlerts} disabled={!account}><Bell size={16} /> Check Alerts</Button>
      </CardHeader>
      <CardContent className="grid gap-3">
        {!account ? <div className="rounded-md border border-white/10 bg-black/20 p-4 text-sm text-slate-300">Open a desk to use watchlists and alerts.</div> : null}
        {account && watched.length === 0 ? <div className="rounded-md border border-white/10 bg-black/20 p-4 text-sm text-slate-300">No watched assets yet. Add assets from cards or dossiers.</div> : watched.map((asset) => (
          <div key={asset.symbol} className="grid gap-3 rounded-md border border-white/10 bg-black/20 p-4 md:grid-cols-[1fr_auto_auto] md:items-center">
            <div>
              <p className="font-display text-2xl font-bold uppercase">{asset.symbol} / {asset.name}</p>
              <p className="text-sm text-slate-400">Hype {asset.hype ?? Math.min(100, Math.round(asset.volume / 1_700_000))} / Risk {asset.risk ?? asset.volatility} / {asset.catalyst ?? asset.quote}</p>
            </div>
            <div className="md:text-right">
              <p>{formatCurrency(asset.price)}</p>
              <p className={asset.change >= 0 ? "text-ice" : "text-crimson"}>{signedPercent(asset.change)}</p>
            </div>
            <div className="flex gap-2 md:justify-end">
              <Button asChild size="sm" variant="ghost"><Link href={`/asset/${asset.symbol}`}>View</Link></Button>
              <Button size="sm" variant="ghost" onClick={() => addRiskAlert(asset.symbol)}>Risk Alert</Button>
            </div>
          </div>
        ))}
        {account && account.alerts.length > 0 ? (
          <div className="grid gap-2 border-t border-white/10 pt-4">
            <p className="terminal-label">Alert rules</p>
            {account.alerts.map((alert) => (
              <div key={alert.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-white/10 bg-black/25 p-3 text-sm">
                <button className={alert.enabled ? "text-ice" : "text-slate-500"} type="button" onClick={() => { const next = toggleAlert(account, alert.id); writeAccount(next); onAccount(next); }}>{alert.enabled ? "ON" : "OFF"} / {alert.symbol} / {alert.type} {alert.threshold}</button>
                <Button size="sm" variant="ghost" onClick={() => { const next = deleteAlert(account, alert.id); writeAccount(next); onAccount(next); }}><Trash2 size={14} /> Delete</Button>
              </div>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
