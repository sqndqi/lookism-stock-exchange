"use client";

import { useEffect, useState } from "react";
import { readAccount } from "@/lib/account";
import {
  createMarketAutomationSnapshot,
  getTradableAssets,
  type MarketAutomationSnapshot
} from "@/lib/live-market";

const STORAGE_KEY = "ptj-auto-market-v1";
const TICK_MS = 22000;
let activeConsumers = 0;
let marketInterval: number | null = null;

function readSnapshot(): MarketAutomationSnapshot | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const snapshot = JSON.parse(raw) as MarketAutomationSnapshot;
    if (!snapshot?.overrides || typeof snapshot.tick !== "number") return null;
    return snapshot;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function writeSnapshot(snapshot: MarketAutomationSnapshot) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  window.dispatchEvent(new CustomEvent("ptj-market-tick", { detail: snapshot }));
}

function runMarketTick() {
  const previous = readSnapshot();
  const account = readAccount();
  const baseAssets = getTradableAssets(account);
  const next = createMarketAutomationSnapshot(baseAssets, previous);
  writeSnapshot(next);
  return next;
}

export function useMarketAutomation() {
  const [snapshot, setSnapshot] = useState<MarketAutomationSnapshot | null>(null);

  useEffect(() => {
    function handleTick(event: Event) {
      setSnapshot((event as CustomEvent<MarketAutomationSnapshot>).detail);
    }

    activeConsumers += 1;
    const existing = readSnapshot();
    if (existing) {
      setSnapshot(existing);
    } else {
      setSnapshot(runMarketTick());
    }

    if (marketInterval === null) {
      marketInterval = window.setInterval(runMarketTick, TICK_MS);
    }

    window.addEventListener("ptj-market-tick", handleTick);

    return () => {
      activeConsumers = Math.max(0, activeConsumers - 1);
      window.removeEventListener("ptj-market-tick", handleTick);
      if (activeConsumers === 0 && marketInterval !== null) {
        window.clearInterval(marketInterval);
        marketInterval = null;
      }
    };
  }, []);

  return snapshot;
}
