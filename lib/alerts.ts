import type { Account, AlertRule } from "@/lib/account";
import type { MarketAsset } from "@/lib/market-data";

type AlertAsset = MarketAsset & {
  changePercent?: number;
  sourceCount?: number;
};

export type AlertHit = {
  id: string;
  symbol: string;
  message: string;
};

export function createAlert(account: Account, alert: Omit<AlertRule, "id" | "createdAt" | "enabled">): Account {
  const nextAlert: AlertRule = {
    ...alert,
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    enabled: true,
    createdAt: new Date().toISOString()
  };
  return { ...account, alerts: [nextAlert, ...(account.alerts ?? [])].slice(0, 50) };
}

export function deleteAlert(account: Account, id: string): Account {
  return { ...account, alerts: (account.alerts ?? []).filter((alert) => alert.id !== id) };
}

export function toggleAlert(account: Account, id: string): Account {
  return {
    ...account,
    alerts: (account.alerts ?? []).map((alert) => alert.id === id ? { ...alert, enabled: !alert.enabled } : alert)
  };
}

export function checkAlerts(account: Account, assets: AlertAsset[]) {
  const hits: AlertHit[] = [];
  const now = new Date().toISOString();
  const nextAlerts = (account.alerts ?? []).map((alert) => {
    if (!alert.enabled) return alert;
    const asset = assets.find((item) => item.symbol === alert.symbol);
    if (!asset) return alert;
    const changePercent = asset.changePercent ?? asset.change;
    const hype = asset.hype ?? Math.min(100, asset.volume / 1_700_000);
    const risk = asset.risk ?? asset.volatility;
    const sourceCount = asset.sourceCount ?? 0;
    const triggered =
      (alert.type === "PRICE_ABOVE" && asset.price >= alert.threshold) ||
      (alert.type === "PRICE_BELOW" && asset.price <= alert.threshold) ||
      (alert.type === "CHANGE_ABOVE" && Math.abs(changePercent) >= alert.threshold) ||
      (alert.type === "HYPE_ABOVE" && hype >= alert.threshold) ||
      (alert.type === "RISK_ABOVE" && risk >= alert.threshold) ||
      (alert.type === "NEW_SOURCE" && sourceCount >= alert.threshold);

    if (!triggered) return alert;
    hits.push({ id: alert.id, symbol: alert.symbol, message: `${alert.symbol} alert triggered: ${alert.type.replaceAll("_", " ").toLowerCase()} ${alert.threshold}.` });
    return { ...alert, lastTriggeredAt: now };
  });

  return { account: { ...account, alerts: nextAlerts }, hits };
}
