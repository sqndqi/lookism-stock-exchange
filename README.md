# LOOKISM STOCK EXCHANGE

Bloomberg x Korean manhwa x cyberpunk Seoul.

This is a Vercel-ready Next.js 15 dashboard for a fictional Lookism-inspired faction and character market. It ships with cinematic UI, typed mock finance data, animated stock cards, generated silhouette art, a portfolio simulator, and a Reddit-powered updater script for market signals.

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

## Deploy

Push this repository to GitHub and import it into Vercel. No custom build settings are required.

