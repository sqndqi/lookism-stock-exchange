# Lookism Character Stocks

A GitHub Pages dashboard that turns conversation from `r/lookismcomic` into fake market movement for Lookism characters.

This is not financial advice. It is a noisy fandom sentiment toy.

## What It Does

- Checks recent Reddit posts from `r/lookismcomic`
- Looks for character mentions and common hype/downplay language
- Converts attention, engagement, and sentiment into fake stock prices
- Publishes a dashboard from the `docs/` folder
- Runs automatically with GitHub Actions every 6 hours

## Local Run

```bash
npm install
npm run update
npm run serve
```

Then open `http://localhost:4173`.

## GitHub Pages

After pushing this repo to GitHub:

1. Go to repository **Settings**
2. Open **Pages**
3. Set source to **Deploy from a branch**
4. Choose branch `main` and folder `/docs`

The dashboard reads `docs/data/stocks.json`, which the workflow updates automatically.

## Automation

The workflow lives at `.github/workflows/update-stocks.yml`.

It can run on a schedule, on manual dispatch, or after pushes to `main`. The workflow commits updated stock data back into the repo when Reddit data changes.

## Tuning

Edit `data/characters.json` to add more characters or aliases.

Edit `src/update-stocks.mjs` to change:

- scoring weights
- bullish and bearish terms
- subreddit source
- update frequency logic

