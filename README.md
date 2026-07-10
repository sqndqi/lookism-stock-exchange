# AURA EXCHANGE

Premium underground anime-finance terminal for fictional Lookism-inspired fighter assets, crew sectors, rumor heat, and chapter prediction contracts.

This is a Vercel-ready Next.js 15 dashboard for a fictional Lookism-inspired faction and character market. It ships with a cinematic terminal UI, typed mock finance data, animated asset dossiers, prediction contracts, crew-sector boards, a portfolio simulator, Lookism Wiki dossiers, and a Reddit-powered updater script for market signals.

> Fan-made project. Character and faction names are used as fictional market labels.



The script scans recent `r/lookismcomic` posts and writes data to `public/data/reddit-stocks.json`. The GitHub Actions workflow runs it every 6 hours and commits updated data.

## GitHub Pages

This repository is configured to deploy as a static GitHub Pages site using `.github/workflows/deploy-pages.yml`.

Expected URL:

```text
https://sqndqi.github.io/lookism-stock-exchange/
```

## Research Sources

- `https://www.reddit.com/r/lookismcomic/` for current discourse, theory, meme, raws, and power-scaling catalysts
- `https://lookism.fandom.com/wiki/Lookism_Wikia` for character, generation, organization, and gang taxonomy
