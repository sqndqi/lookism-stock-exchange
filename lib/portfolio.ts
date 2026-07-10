import type { Account, Holding, Trade } from "@/lib/account";
import type { MarketAsset } from "@/lib/market-data";

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
};

const FEE_RATE = 0.0015;

function money(value: number) {
  return Math.round(value * 100) / 100;
}

function safeQuantity(value: number) {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

export function estimateOrder(side: "BUY" | "SELL", quantity: number, price: number) {
  const gross = money(safeQuantity(quantity) * price);
  const fee = money(Math.max(0.01, gross * FEE_RATE));
  const net = side === "BUY" ? money(gross + fee) : money(gross - fee);
  return { gross, fee, net };
}

export function calculatePortfolio(account: Account, assets: MarketAsset[]): PortfolioSnapshot {
  const assetBySymbol = new Map(assets.map((asset) => [asset.symbol, asset]));
  const holdingPnls = account.holdings.map((holding) => {
    const price = assetBySymbol.get(holding.symbol)?.price ?? holding.averageCost;
    const value = price * holding.shares;
    const cost = holding.averageCost * holding.shares;
    const pnl = value - cost;
    return {
      symbol: holding.symbol,
      value,
      pnl,
      pnlPercent: cost ? (pnl / cost) * 100 : 0
    };
  });

  const holdingsValue = money(holdingPnls.reduce((sum, item) => sum + item.value, 0));
  const unrealizedPnl = money(holdingPnls.reduce((sum, item) => sum + item.pnl, 0));
  const realizedPnl = money(account.realizedPnl ?? 0);

  return {
    timestamp: new Date().toISOString(),
    cash: money(account.cash),
    holdingsValue,
    totalEquity: money(account.cash + holdingsValue),
    realizedPnl,
    unrealizedPnl,
    bestHolding: holdingPnls.sort((a, b) => b.pnlPercent - a.pnlPercent)[0],
    worstHolding: [...holdingPnls].sort((a, b) => a.pnlPercent - b.pnlPercent)[0]
  };
}

export function executeTrade(account: Account, order: OrderRequest, assets: MarketAsset[]): OrderResult {
  const asset = assets.find((item) => item.symbol === order.symbol);
  if (!asset) return { ok: false, account, message: "Order rejected. Asset is not listed on AURA EXCHANGE." };

  const quantity = safeQuantity(order.quantity);
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
    realizedPnl += existing ? (asset.price - existing.averageCost) * quantity - estimate.fee : 0;
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
    message: `${order.side === "BUY" ? "Bought" : "Sold"} ${quantity.toFixed(4)} ${asset.symbol} for ${estimate.net.toLocaleString()} simulation credits.`
  };
}
