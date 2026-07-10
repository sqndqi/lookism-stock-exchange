"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { Download, RotateCcw, Upload } from "lucide-react";
import type { Account } from "@/lib/account";
import { clearAccount, exportAccountJson, importAccountJson, writeAccount } from "@/lib/account";
import { calculatePortfolio } from "@/lib/portfolio";
import type { MarketAsset } from "@/lib/market-data";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AccountToolsPanel({ account, assets, onAccount }: { account: Account | null; assets: MarketAsset[]; onAccount: (account: Account | null) => void }) {
  const [rawImport, setRawImport] = useState("");
  const [message, setMessage] = useState("Back up or repair the local browser desk.");
  const parsed = useMemo(() => rawImport.trim() ? importAccountJson(rawImport) : null, [rawImport]);
  const portfolio = account ? calculatePortfolio(account, assets) : null;

  function exportDesk() {
    if (!account) return;
    const blob = new Blob([exportAccountJson(account)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `aura-exchange-${account.alias.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setMessage("Exported local desk backup JSON.");
    window.dispatchEvent(new CustomEvent("aura-toast", { detail: "Local desk backup exported." }));
  }

  function onFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    file.text().then(setRawImport).catch(() => setMessage("Import failed. Could not read that JSON file."));
  }

  function importDesk() {
    if (!parsed) {
      setMessage("Import rejected. Paste or upload a valid AURA EXCHANGE desk JSON backup.");
      return;
    }
    writeAccount(parsed);
    onAccount(parsed);
    setRawImport("");
    setMessage(`Imported ${parsed.alias} with ${parsed.holdings.length} holding(s).`);
    window.dispatchEvent(new CustomEvent("aura-toast", { detail: "Local desk imported and normalized." }));
  }

  function resetDesk() {
    if (!window.confirm("Reset this local fake-money desk? Export a backup first if you want to keep it.")) return;
    clearAccount();
    onAccount(null);
    setMessage("Local desk reset. Create a new desk from Login to restart the season.");
    window.dispatchEvent(new CustomEvent("aura-toast", { detail: "Local desk reset." }));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Desk Backup & Recovery</CardTitle>
        <p className="text-sm text-slate-400">Versioned localStorage account tools. Fake simulation credits only.</p>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-3 sm:grid-cols-4">
          <div><p className="terminal-label">Alias</p><p className="font-display text-2xl font-bold uppercase">{account?.alias ?? "No desk"}</p></div>
          <div><p className="terminal-label">Cash</p><p>{portfolio ? formatCurrency(portfolio.cash) : "Locked"}</p></div>
          <div><p className="terminal-label">Holdings</p><p>{account?.holdings.length ?? 0}</p></div>
          <div><p className="terminal-label">Trades</p><p>{account?.trades.length ?? 0}</p></div>
        </div>
        <div className="grid gap-3 md:grid-cols-[auto_auto_1fr]">
          <Button onClick={exportDesk} disabled={!account}><Download size={16} /> Export JSON</Button>
          <Button variant="ghost" onClick={resetDesk} disabled={!account}><RotateCcw size={16} /> Reset Desk</Button>
          <label className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-md border border-white/12 bg-white/[0.045] px-4 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:border-ice/50 hover:bg-white/[0.09]">
            <Upload size={16} /> Upload Backup
            <input className="sr-only" type="file" accept="application/json,.json" onChange={onFile} />
          </label>
        </div>
        <label className="grid gap-2">
          <span className="terminal-label text-[0.58rem]">Import preview JSON</span>
          <textarea className="min-h-28 rounded-md border border-white/10 bg-black/40 p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ice" value={rawImport} onChange={(event) => setRawImport(event.target.value)} placeholder="Paste exported AURA EXCHANGE desk JSON..." />
        </label>
        {parsed ? (
          <div className="rounded-md border border-ice/25 bg-ice/10 p-3 text-sm text-slate-200">
            Preview: {parsed.alias} / {formatCurrency(parsed.cash)} cash / {parsed.holdings.length} holding(s) / {parsed.trades.length} trade(s)
          </div>
        ) : null}
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={importDesk} disabled={!parsed}>Import & Normalize</Button>
          <p className="text-sm text-slate-400" aria-live="polite">{message}</p>
        </div>
      </CardContent>
    </Card>
  );
}
