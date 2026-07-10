import type { Account, Holding, LimitOrder, Trade } from "@/lib/account";
import type { MarketAsset } from "@/lib/market-data";
import { formatCurrency, formatQuantity } from "@/lib/utils";

export type OrderRequest = {
  symbol: string;
  side: "BUY" | "SELL";
  quantity: number;
  reason?: string;
};

export type OrderResult = {
  ok: boolean;
  account: Account;
  message: string;
  trade?: Trade;
};

export type PortfolioSnapshot = {
  timestamp: string;
  cash: number;
  holdingsValue: number;
  totalEquity: number;
  realizedPnl: number;
  unrealizedPnl: number;
  bestHolding?: { symbol: string; pnl: number; pnlPercent: number };
  worstHolding?: { symbol: string; pnl: number; pnlPercent: number };
  totalReturnPct: number;
  tradeCount: number;
  winRate: number;
  riskScore: number;
  volatilityExposure: number;
  hypeExposure: number;
  concentrationRisk: number;
  cashAllocationPct: number;
  factionExposure: Array<{ faction: string; value: number; allocationPct: number }>;
  bestTrade?: { symbol: string; pnl: number };
  worstTrade?: { symbol: string; pnl: number };
};

const FEE_RATE = 0.0015;

function money(value: number) {
  if (!Number.isFinite(value)) return 0;
  const rounded = Math.round(value * 100) / 100;
  return Object.is(rounded, -0) ? 0 : rounded;
}

export function sanitizeQuantity(value: number) {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

export function estimateOrder(side: "BUY" | "SELL", quantity: number, price: number) {
  const gross = money(sanitizeQuantity(quantity) * Math.max(0, Number.isFinite(price) ? price : 0));
  const fee = gross > 0 ? money(Math.max(0.01, gross * FEE_RATE)) : 0;
  const net = side === "BUY" ? money(gross + fee) : money(gross - fee);
  return { gross, fee, net };
}

export function calculatePortfolio(account: Account, assets: MarketAsset[]): PortfolioSnapshot {
  const assetBySymbol = new Map(assets.map((asset) => [asset.symbol, asset]));
  const holdingPnls = account.holdings.map((holding) => {
    const asset = assetBySymbol.get(holding.symbol);
    const price = asset?.price ?? holding.averageCost;
    const value = price * holding.shares;
    const cost = holding.averageCost * holding.shares;
    const pnl = value - cost;
    return {
      symbol: holding.symbol,
      faction: asset?.faction ?? "Unknown",
      volatility: asset?.volatility ?? 50,
      hype: asset?.hype ?? Math.min(100, (asset?.volume ?? 0) / 1_700_000),
      value,
      pnl,
      pnlPercent: cost ? (pnl / cost) * 100 : 0
    };
  });

  const holdingsValue = money(holdingPnls.reduce((sum, item) => sum + item.value, 0));
  const unrealizedPnl = money(holdingPnls.reduce((sum, item) => sum + item.pnl, 0));
  const realizedPnl = money(account.realizedPnl ?? 0);
  const totalEquity = money(account.cash + holdingsValue);
  const totalReturnPct = account.startingCash ? ((totalEquity - account.startingCash) / account.startingCash) * 100 : 0;
  const realizedTrades = (account.trades ?? []).filter((trade) => trade.side === "SELL" && typeof trade.realizedPnl === "number");
  const winningTrades = realizedTrades.filter((trade) => (trade.realizedPnl ?? 0) > 0).length;
  const sellTrades = (account.trades ?? []).filter((trade) => trade.side === "SELL").length;
  const bestTrade = realizedTrades.length ? realizedTrades.reduce((best, trade) => (trade.realizedPnl ?? 0) > (best.realizedPnl ?? 0) ? trade : best) : undefined;
  const worstTrade = realizedTrades.length ? realizedTrades.reduce((worst, trade) => (trade.realizedPnl ?? 0) < (worst.realizedPnl ?? 0) ? trade : worst) : undefined;
  const largestHolding = holdingPnls.reduce((max, item) => Math.max(max, item.value), 0);
  const concentrationRisk = holdingsValue ? (largestHolding / holdingsValue) * 100 : 0;
  const volatilityExposure = holdingsValue ? holdingPnls.reduce((sum, item) => sum + item.volatility * (item.value / holdingsValue), 0) : 0;
  const hypeExposure = holdingsValue ? holdingPnls.reduce((sum, item) => sum + item.hype * (item.value / holdingsValue), 0) : 0;
  const factionMap = new Map<string, number>();
  for (const item of holdingPnls) {
    factionMap.set(item.faction, (factionMap.get(item.faction) ?? 0) + item.value);
  }
  const factionExposure = [...factionMap.entries()]
    .map(([faction, value]) => ({ faction, value: money(value), allocationPct: holdingsValue ? (value / holdingsValue) * 100 : 0 }))
    .sort((a, b) => b.value - a.value);
  const riskScore = Math.min(100, Math.round(volatilityExposure * 0.45 + hypeExposure * 0.25 + concentrationRisk * 0.3));

  return {
    timestamp: new Date().toISOString(),
    cash: money(account.cash),
    holdingsValue,
    totalEquity,
    realizedPnl,
    unrealizedPnl,
    totalReturnPct,
    tradeCount: account.trades?.length ?? 0,
    winRate: sellTrades ? winningTrades / sellTrades * 100 : 0,
    riskScore,
    volatilityExposure: money(volatilityExposure),
    hypeExposure: money(hypeExposure),
    concentrationRisk: money(concentrationRisk),
    cashAllocationPct: totalEquity ? account.cash / totalEquity * 100 : 100,
    factionExposure,
    bestTrade: bestTrade ? { symbol: bestTrade.symbol, pnl: money(bestTrade.realizedPnl ?? 0) } : undefined,
    worstTrade: worstTrade ? { symbol: worstTrade.symbol, pnl: money(worstTrade.realizedPnl ?? 0) } : undefined,
    bestHolding: holdingPnls.sort((a, b) => b.pnlPercent - a.pnlPercent)[0],
    worstHolding: [...holdingPnls].sort((a, b) => a.pnlPercent - b.pnlPercent)[0]
  };
}

export function createLimitOrder(account: Account, order: Omit<LimitOrder, "id" | "createdAt" | "status">): Account {
  const limitOrder: LimitOrder = {
    ...order,
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    createdAt: new Date().toISOString(),
    status: "OPEN"
  };
  return { ...account, limitOrders: [limitOrder, ...(account.limitOrders ?? [])].slice(0, 50) };
}

export function cancelLimitOrder(account: Account, id: string): Account {
  return {
    ...account,
    limitOrders: (account.limitOrders ?? []).map((order) => order.id === id && order.status === "OPEN" ? { ...order, status: "CANCELLED" as const } : order)
  };
}

export function checkLimitOrders(account: Account, assets: MarketAsset[]): { account: Account; messages: string[] } {
  let next = account;
  const messages: string[] = [];
  const now = Date.now();

  for (const order of account.limitOrders ?? []) {
    if (order.status !== "OPEN") continue;
    if (order.expiresAt && new Date(order.expiresAt).getTime() < now) {
      next = {
        ...next,
        limitOrders: next.limitOrders.map((item) => item.id === order.id ? { ...item, status: "EXPIRED" } : item)
      };
      messages.push(`${order.symbol} limit order expired.`);
      continue;
    }

    const asset = assets.find((item) => item.symbol === order.symbol);
    if (!asset) continue;
    const canFill = order.side === "BUY" ? asset.price <= order.targetPrice : asset.price >= order.targetPrice;
    if (!canFill) continue;

    const result = executeTrade(next, { symbol: order.symbol, side: order.side, quantity: order.quantity, reason: "local limit order fill" }, assets);
    next = {
      ...result.account,
      limitOrders: result.account.limitOrders.map((item) => item.id === order.id ? { ...item, status: result.ok ? "FILLED" : item.status, filledAt: result.ok ? new Date().toISOString() : item.filledAt } : item)
    };
    messages.push(result.ok ? `Filled ${order.side} limit for ${order.symbol}.` : result.message);
  }

  return { account: next, messages };
}

export function executeTrade(account: Account, order: OrderRequest, assets: MarketAsset[]): OrderResult {
  const asset = assets.find((item) => item.symbol === order.symbol);
  if (!asset) return { ok: false, account, message: "Order rejected. Asset is not listed on AURA EXCHANGE." };

  const quantity = sanitizeQuantity(order.quantity);
  if (quantity <= 0) return { ok: false, account, message: "Order rejected. Enter a valid fake-share quantity." };

  const estimate = estimateOrder(order.side, quantity, asset.price);
  const existing = account.holdings.find((holding) => holding.symbol === asset.symbol);

  if (order.side === "BUY" && estimate.net > account.cash) {
    return { ok: false, account, message: "Order rejected. Not enough simulation credits." };
  }

  if (order.side === "SELL" && (!existing || existing.shares + 0.000001 < quantity)) {
    return { ok: false, account, message: "Order rejected. You cannot sell more fake shares than you hold." };
  }

  const now = new Date().toISOString();
  const trade: Trade = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    symbol: asset.symbol,
    side: order.side,
    quantity,
    price: asset.price,
    gross: estimate.gross,
    fee: estimate.fee,
    net: estimate.net,
    timestamp: now,
    reason: order.reason ?? "market order"
  };

  let cash = account.cash;
  let realizedPnl = account.realizedPnl ?? 0;
  let holdings: Holding[] = account.holdings;

  if (order.side === "BUY") {
    cash = money(cash - estimate.net);
    holdings = existing
      ? holdings.map((holding) => {
          if (holding.symbol !== asset.symbol) return holding;
          const nextShares = holding.shares + quantity;
          const nextCost = holding.averageCost * holding.shares + estimate.gross;
          return { ...holding, shares: nextShares, averageCost: nextCost / nextShares, updatedAt: now };
        })
      : [...holdings, { symbol: asset.symbol, shares: quantity, averageCost: asset.price, updatedAt: now }];
  } else {
    cash = money(cash + estimate.net);
    const tradePnl = existing ? money((asset.price - existing.averageCost) * quantity - estimate.fee) : 0;
    trade.realizedPnl = tradePnl;
    realizedPnl += tradePnl;
    holdings = holdings
      .map((holding) => holding.symbol === asset.symbol ? { ...holding, shares: holding.shares - quantity, updatedAt: now } : holding)
      .filter((holding) => holding.shares > 0.000001);
  }

  const next: Account = {
    ...account,
    cash,
    holdings,
    trades: [trade, ...(account.trades ?? [])].slice(0, 100),
    realizedPnl: money(realizedPnl),
    snapshots: [calculatePortfolio({ ...account, cash, holdings, realizedPnl }, assets), ...(account.snapshots ?? [])].slice(0, 60)
  };

  return {
    ok: true,
    account: next,
    trade,
    message: `${order.side === "BUY" ? "Bought" : "Sold"} ${formatQuantity(quantity)} ${asset.symbol} for ${formatCurrency(estimate.net)} simulation credits.`
  };
}
