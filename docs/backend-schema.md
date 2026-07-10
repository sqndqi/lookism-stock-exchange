# Backend Schema Draft

AURA EXCHANGE is fake-money only. This schema is a future planning draft, not an active integration.

## Rules

- No real-money trading tables.
- No crypto wallets.
- No buying fake credits.
- Donations must stay separate from gameplay.
- Donations must never affect balances, rankings, trades, alerts, achievements, or market data.

## Tables

- `users`: auth provider id, email hash, created timestamp, disabled flag.
- `profiles`: user id, alias, crew, cosmetic rank, settings.
- `portfolios`: user id, season id, fake cash, starting fake cash, realized P/L, created timestamp.
- `holdings`: portfolio id, symbol, fake share quantity, average cost, updated timestamp.
- `trades`: portfolio id, symbol, side, quantity, price, gross, fee, net, realized P/L, reason, timestamp.
- `orders`: portfolio id, symbol, side, order type, quantity, target price, status, expires timestamp.
- `alerts`: user id, symbol, alert type, threshold, enabled flag, last triggered timestamp.
- `achievements`: user id, achievement id, unlocked timestamp, cosmetic XP.
- `sources`: source id, type, title, summary, url, confidence, impact, hype, status, attribution.
- `source_votes`: user id, source id, vote, created timestamp.
- `events`: event id, title, type, start/end timestamps, affected symbols, confidence, status.
- `seasons`: season id, name, start/end timestamps, starting fake cash, modifiers, rules.
- `leaderboard_snapshots`: season id, user id, fake equity, return %, risk score, snapshot timestamp.
- `audit_logs`: actor id, action, target type/id, metadata, timestamp.

## Backend Readiness Notes

The current app uses `lib/stores.ts` as the adapter boundary. `localAccountStore` is the only active adapter. A future remote adapter should implement the same store contracts and keep local mode as a fallback/demo path.

Future hosted features should add rate limits, abuse checks, moderation queues for user-submitted catalysts, audit logs for admin actions, and season reset safeguards.
