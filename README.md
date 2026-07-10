# AURA EXCHANGE

Premium underground anime-finance terminal for a fictional Lookism / PTJ-inspired market game.

> Fan-made fictional simulation. AURA EXCHANGE uses fake local simulation credits only. It is not real-money trading, gambling, crypto, investment advice, or an official PTJ/Webtoon product.

## What It Does

- Local trading desk/account stored in browser `localStorage`
- 100,000 fake starting credits
- Fighter, crew, faction, and network assets
- Fake buy/sell market orders with fees, average cost, realized P/L, unrealized P/L, and trade ledger
- Watchlist and owned-position badges
- Asset dossier pages at `/asset/[symbol]`
- Source/catalyst records that explain fictional price movement
- Deterministic fallback market engine for offline/static operation
- Scenario contracts framed as fake-credit lore forecasts
- Local limit order simulator with open/filled/cancelled/expired states
- Watchlist plus browser-local alert rules
- Portfolio analytics, risk exposure, faction exposure, and equity timeline
- Market calendar, Season 1 metadata, index baskets, faction sectors, and simulated leaderboard
- Import/export/reset tools for local desk backups
- Cosmetic achievements, XP, and progression rank names
- API endpoints for market/assets/sources/events/seasons/indices/factions/health/snapshot
- Data validation and image audit scripts

## Tech Stack

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts
- Lucide icons

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build And QA

```bash
npm run lint
npm run build
npm audit --audit-level=high
npm audit
npm run validate:data
npm run audit:images
npm run update:market
npm run update:all
npm run check
```

## Fake Market Model

The market is source-driven but safe by default:

- Core assets live in `lib/market-data.ts`
- Source/catalyst records live in `lib/sources.ts`
- Live-looking client ticks come from `lib/use-market-automation.ts`
- Quote, ranking, event, index, sector, and explanation utilities live in `lib/market-engine.ts`
- Generated static fallback snapshot is written to `public/data/market-snapshot.json`

The engine combines base price, cached Reddit-like source signals, manual catalysts, hype, volatility, confidence, and deterministic fallback movement. The app works without API keys.

## Fake Trading System

Portfolio logic lives in `lib/portfolio.ts`.

Rules:

- Orders use fake simulation credits only
- No negative cash
- No selling more shares than held
- Fake fee is applied to buy/sell previews
- Trades update holdings, average cost, realized P/L, snapshots, and ledger
- Limit orders are local-only: buy if price is at/below target, sell if price is at/above target
- Limit orders can be checked manually from the ticket and are never sent to a backend
- Portfolio analytics calculate total return, win rate, risk, volatility exposure, hype exposure, concentration, and faction allocation
- Account state is local browser state, not a backend account

Account types live in `lib/account.ts`.
The account schema is versioned. `readAccount()` normalizes older localStorage desks and writes a backup copy to `ptj-account-backup` before migration. Export/import tools validate and normalize JSON before overwriting the active local desk.

## Routes

- `/` homepage terminal
- `/login` local desk creation
- `/market` screener and quick ticket
- `/asset/[symbol]` asset dossier and advanced trade ticket
- `/intel` catalyst/source terminal
- `/calendar` market events and season panel
- `/leaderboard` local/demo desk ranking
- `/dev/market` safe diagnostics, counts, and QA commands

## Sources And Catalysts

`SourceRecord` supports:

- `reddit`
- `wiki`
- `chapter`
- `manual`
- `official`
- `community`
- `dev`

Only short summaries, metadata, tags, timestamps, confidence, impact, hype, and attribution should be stored. Do not copy full copyrighted text. Do not scrape or embed manga panels.

Run source/market updates:

```bash
npm run update:sources
npm run update:market
npm run update:all
```

`update:sources` currently uses the existing Reddit updater and gracefully keeps cached data when fetches fail.

Events live in `lib/events.ts`; current season rules live in `lib/seasons.ts`; index baskets live in `lib/indices.ts`; faction sectors are calculated in `lib/factions.ts`.

## Alerts, Progression, And Seasons

- Alerts are browser-local rules for price, change, hype, risk, or source count
- Achievements and XP are cosmetic only and never grant fake credits
- Seasons never reset the desk automatically
- Manual season reset should be done only after exporting a backup
- Demo leaderboard rows are deterministic local/demo entries, not real global users

## Images

Use local files only. Existing PNGs are in `public/images`.

If you want to use PNGs from the wiki, download them yourself, verify you have the right to use them, and store them locally. Do not hotlink wiki files and do not scrape manga panels.

Recommended future convention:

```text
public/images/fighters/
public/images/crews/
public/images/backgrounds/
public/images/placeholders/
```

Wire images through asset records in `lib/market-data.ts`. The media manifest in `lib/media.ts` maps symbols to image paths, alt text, fallback type, and accent color.

Run:

```bash
npm run audit:images
```

## Adding A Fighter Or Crew

1. Add a new asset to `assets` in `lib/market-data.ts`
2. Use a unique symbol
3. Add aliases, faction, image, stats, catalyst, and chart points
4. Add source records in `lib/sources.ts` if the asset needs catalyst support
5. Add the local image to `public/images`
6. Run:

```bash
npm run validate:data
npm run audit:images
npm run update:market
```

## API Endpoints

- `/api/assets`
- `/api/assets/[symbol]`
- `/api/market`
- `/api/sources`
- `/api/events`
- `/api/seasons`
- `/api/indices`
- `/api/factions`
- `/api/health`
- `/api/snapshot`

These expose static/generated simulation data. Portfolio state remains local-only.

## Deployment

```bash
npm run build
```

The project can deploy to Vercel or static GitHub Pages depending on repository workflow settings.

Expected GitHub Pages URL:

```text
https://sqndqi.github.io/lookism-stock-exchange/
```

## Donation Roadmap

A future tip jar may support hosting and development only. It must never:

- Buy fake credits
- Boost assets
- Affect rankings
- Unlock trading power
- Create pay-to-win mechanics

No payment integration exists in this MVP.

## Roadmap

- Backend accounts and auth
- Real global leaderboard
- Admin source dashboard
- Scheduled source refresh with spam-safe commits
- User-submitted catalysts with moderation
- Richer portfolio history charts
- Donation/tip jar for hosting support only
- PWA/offline service worker
- Backend-authenticated global leaderboard
- Admin source CMS
