# LOOKISM STOCK EXCHANGE

Bloomberg x Korean manhwa x cyberpunk Seoul.

This is a Vercel-ready Next.js 15 dashboard for a fictional Lookism-inspired faction and character market. It ships with cinematic UI, typed mock finance data, animated stock cards, generated silhouette art, prediction contracts, crew missions, a portfolio simulator, Lookism Wiki dossiers, and a Reddit-powered updater script for market signals.

> Fan-made project. Character and faction names are used as fictional market labels. Visual assets are original silhouettes/textures, not ripped webtoon art.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Shadcn-style UI primitives
- Lucide Icons
- Recharts

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production Build

```bash
npm run build
npm start
```

## Reddit Market Updater

```bash
npm run update:reddit
```

The script scans recent `r/lookismcomic` posts and writes data to `public/data/reddit-stocks.json`. The GitHub Actions workflow runs it every 6 hours and commits updated data.

## Research Sources

- `https://www.reddit.com/r/lookismcomic/` for current discourse, theory, meme, raws, and power-scaling catalysts
- `https://lookism.fandom.com/wiki/Lookism_Wikia` for character, generation, organization, and gang taxonomy
- `https://stockism.app/` as a product reference for a fan-market loop, then expanded with stronger visual identity and source intelligence

## Feature Set

- Cinematic Seoul-night hero and chapter-review market halt banner
- Animated ticker tape and Bloomberg-style fictional trading dashboard
- Expanded character/faction universe with Big Daniel, Little Daniel, Gun, Goo, Kitae, James, J High, Workers, Big Deal, Hostel, White Tiger, and more
- Reddit x Wiki intelligence desk with top discussion catalysts and source links
- Prediction market with pools, odds, catalysts, and paper bets
- Missions, daily check-in, crew league, cash, equity, buy, and short simulation
- Responsive layouts for desktop, tablet, and mobile

## Deploy

Push this repository to GitHub and import it into Vercel. No custom build settings are required.
