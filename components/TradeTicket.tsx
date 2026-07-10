"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Star } from "lucide-react";
import type { Account } from "@/lib/account";
import { toggleWatchlist, writeAccount } from "@/lib/account";
import type { MarketAsset } from "@/lib/market-data";
import { cancelLimitOrder, checkLimitOrders, createLimitOrder, estimateOrder, executeTrade } from "@/lib/portfolio";
import { formatCurrency, formatQuantity } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function TradeTicket({
  account,
  asset,
  assets,
  onAccount,
  compact = false
}: {
  account: Account | null;
  asset: MarketAsset;
  assets: MarketAsset[];
  onAccount: (account: Account | null) => void;
  compact?: boolean;
}) {
  const [side, setSide] = useState<"BUY" | "SELL">("BUY");
  const [mode, setMode] = useState<"MARKET" | "LIMIT">("MARKET");
  const [quantity, setQuantity] = useState(1);
  const [targetPrice, setTargetPrice] = useState(asset.price);
  const [message, setMessage] = useState("Simulation credits only.");
  const holding = account?.holdings.find((item) => item.symbol === asset.symbol);
  const preview = useMemo(() => estimateOrder(side, quantity, asset.price), [asset.price, quantity, side]);
  const maxBuy = account ? Math.max(0, account.cash / asset.price / 1.002) : 0;
  const maxSell = holding?.shares ?? 0;
  const positionAfter = side === "BUY" ? (holding?.shares ?? 0) + quantity : Math.max(0, (holding?.shares ?? 0) - quantity);
  const cashAfter = account ? side === "BUY" ? account.cash - preview.net : account.cash + preview.net : 0;
  const watched = account?.watchlist.includes(asset.symbol) ?? false;
  const heavyCash = account && side === "BUY" && preview.net > account.cash * 0.75;
  const allOut = side === "SELL" && holding && quantity >= holding.shares;
  const volatile = asset.volatility >= 85 || (asset.risk ?? 0) >= 85;

  useEffect(() => {
    setTargetPrice(asset.price);
    setQuantity(1);
    setMessage("Simulation credits only.");
  }, [asset.symbol, asset.price]);

  function submit() {
    if (!account) {
      setMessage("Open a local desk before placing fake-money orders.");
      return;
    }
    if (mode === "LIMIT") {
      if (!Number.isFinite(targetPrice) || targetPrice <= 0 || quantity <= 0) {
        setMessage("Limit order rejected. Enter a valid fake-share quantity and target price.");
        return;
      }
      if (side === "BUY" && preview.net > account.cash) {
        setMessage("Limit order rejected. This browser desk does not have enough simulation credits for that size.");
        return;
      }
      if (side === "SELL" && (!holding || holding.shares + 0.000001 < quantity)) {
        setMessage("Limit order rejected. You cannot place a local sell limit above the fake shares held.");
        return;
      }
      const next = createLimitOrder(account, {
        symbol: asset.symbol,
        side,
        quantity,
        targetPrice,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        note: "24h local simulator"
      });
      writeAccount(next);
      onAccount(next);
      window.dispatchEvent(new CustomEvent("aura-toast", { detail: `${asset.symbol} local limit order created.` }));
      setMessage(`Created local ${side} limit order for ${asset.symbol}. Use Check Orders to test fills.`);
      return;
    }
    const result = executeTrade(account, { symbol: asset.symbol, side, quantity, reason: "advanced ticket" }, assets);
    setMessage(result.message);
    if (result.ok) {
      writeAccount(result.account);
      onAccount(result.account);
      window.dispatchEvent(new CustomEvent("aura-toast", { detail: result.message }));
    }
  }

  function watch() {
    const next = toggleWatchlist(asset.symbol);
    if (!next) {
      setMessage("Open a local desk before watching assets.");
      return;
    }
    onAccount(next);
    window.dispatchEvent(new CustomEvent("aura-toast", { detail: `${asset.symbol} ${next.watchlist.includes(asset.symbol) ? "added to" : "removed from"} watchlist.` }));
    setMessage(`${asset.symbol} ${next.watchlist.includes(asset.symbol) ? "added to" : "removed from"} watchlist.`);
  }

  function checkOrders() {
    if (!account) return;
    const result = checkLimitOrders(account, assets);
    writeAccount(result.account);
    onAccount(result.account);
    window.dispatchEvent(new CustomEvent("aura-toast", { detail: result.messages.length ? result.messages.join(" ") : "No local limit orders filled." }));
    setMessage(result.messages.length ? result.messages.join(" ") : "No local limit orders filled at current quote.");
  }

  function cancelOrder(id: string) {
    if (!account) return;
    const next = cancelLimitOrder(account, id);
    writeAccount(next);
    onAccount(next);
    setMessage("Limit order cancelled.");
  }

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-2">
        {(["BUY", "SELL"] as const).map((item) => (
          <button key={item} type="button" aria-pressed={side === item} onClick={() => setSide(item)} className={`rounded-md border px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] ${side === item ? "border-crimson/60 bg-crimson/15 text-white" : "border-white/10 bg-black/30 text-slate-400"}`}>
            {item}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {(["MARKET", "LIMIT"] as const).map((item) => (
          <button key={item} type="button" aria-pressed={mode === item} onClick={() => setMode(item)} className={`rounded-md border px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] ${mode === item ? "border-ice/60 bg-ice/10 text-white" : "border-white/10 bg-black/30 text-slate-400"}`}>
            {item}
          </button>
        ))}
      </div>
      <div className={`grid gap-3 ${compact ? "" : "sm:grid-cols-2"}`}>
        <label className="grid gap-2">
          <span className="terminal-label text-[0.58rem]">Fake shares</span>
          <input className="h-12 rounded-md border border-white/10 bg-black/40 px-4 outline-none focus-visible:ring-2 focus-visible:ring-ice" min={0.0001} step={0.0001} type="number" value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} />
        </label>
        {mode === "LIMIT" ? (
          <label className="grid gap-2">
            <span className="terminal-label text-[0.58rem]">Target price</span>
            <input className="h-12 rounded-md border border-white/10 bg-black/40 px-4 outline-none focus-visible:ring-2 focus-visible:ring-ice" min={1} step={0.01} type="number" value={targetPrice} onChange={(event) => setTargetPrice(Number(event.target.value))} />
          </label>
        ) : (
          <div className="rounded-md border border-white/10 bg-black/30 p-3">
            <p className="terminal-label text-[0.58rem]">Last quote</p>
            <p className="font-display text-3xl font-bold">{formatCurrency(asset.price)}</p>
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {side === "BUY" ? (
          <>
            {[1, 5, 10, 25, 50].map((value) => <Button key={value} size="sm" variant="ghost" onClick={() => setQuantity(value)}>{value}</Button>)}
            {[0.1, 0.25, 0.5, 1].map((value) => <Button key={value} size="sm" variant="ghost" disabled={!account} onClick={() => setQuantity(Number((maxBuy * value).toFixed(4)))}>{value === 1 ? "MAX" : `${value * 100}% cash`}</Button>)}
          </>
        ) : (
          [0.25, 0.5, 0.75, 1].map((value) => <Button key={value} size="sm" variant="ghost" disabled={!holding} onClick={() => setQuantity(Number((maxSell * value).toFixed(4)))}>{value === 1 ? "100%" : `${value * 100}%`}</Button>)
        )}
      </div>
      <div className="grid gap-2 rounded-md border border-white/10 bg-black/25 p-4 text-sm text-slate-300 sm:grid-cols-3">
        <span><span className="terminal-label block text-[0.58rem]">Gross</span>{formatCurrency(preview.gross)}</span>
        <span><span className="terminal-label block text-[0.58rem]">Fake fee</span>{formatCurrency(preview.fee)}</span>
          <span><span className="terminal-label block text-[0.58rem]">Net</span>{formatCurrency(preview.net)}</span>
        <span><span className="terminal-label block text-[0.58rem]">Cash after</span>{account ? formatCurrency(cashAfter) : "Locked"}</span>
        <span><span className="terminal-label block text-[0.58rem]">Position after</span>{formatQuantity(positionAfter)}</span>
        <span><span className="terminal-label block text-[0.58rem]">Avg cost</span>{holding ? formatCurrency(holding.averageCost) : "None"}</span>
      </div>
      {(heavyCash || allOut || volatile) ? (
        <div className="flex gap-2 rounded-md border border-amber/25 bg-amber/10 p-3 text-sm text-amber">
          <AlertTriangle size={17} />
          <span>{heavyCash ? "This order uses more than 75% of cash. " : ""}{allOut ? "This sell closes the position. " : ""}{volatile ? "This is a high-volatility asset. " : ""}</span>
        </div>
      ) : null}
      <div className="grid gap-2 sm:grid-cols-3">
        <Button onClick={submit} disabled={!account || quantity <= 0}>{mode === "LIMIT" ? "Place Limit" : `${side} Now`}</Button>
        <Button variant="ghost" onClick={watch}><Star size={16} className={watched ? "fill-amber text-amber" : ""} /> {watched ? "Watching" : "Watch"}</Button>
        <Button variant="ghost" onClick={checkOrders} disabled={!account}>Check Orders</Button>
      </div>
      <p className="text-sm text-slate-300" aria-live="polite">{message}</p>
      {account && account.limitOrders.some((order) => order.status === "OPEN") ? (
        <div className="grid gap-2 border-t border-white/10 pt-4">
          <p className="terminal-label">Open local limit orders</p>
          {account.limitOrders.filter((order) => order.status === "OPEN").slice(0, 4).map((order) => (
            <div key={order.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-white/10 bg-black/25 p-3 text-sm">
              <span>{order.side} {formatQuantity(order.quantity)} {order.symbol} @ {formatCurrency(order.targetPrice)} / {order.status}</span>
              <Button size="sm" variant="ghost" onClick={() => cancelOrder(order.id)}>Cancel</Button>
            </div>
          ))}
        </div>
      ) : null}
      <p className="text-xs leading-5 text-slate-400">Fake local simulator. No real money, no gambling, no investment advice.</p>
    </div>
  );
}
