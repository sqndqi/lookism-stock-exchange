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
- API endpoints for market/assets/sources
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
```

## Fake Market Model

The market is source-driven but safe by default:

- Core assets live in `lib/market-data.ts`
- Source/catalyst records live in `lib/sources.ts`
- Live-looking client ticks come from `lib/use-market-automation.ts`
- Quote, ranking, and explanation utilities live in `lib/market-engine.ts`
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
- Account state is local browser state, not a backend account

Account types live in `lib/account.ts`.

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

## Images

Use local files only. Existing images are in `public/images`.

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
- Import/export local desks
- Donation/tip jar for hosting support only
