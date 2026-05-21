import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const charactersPath = path.join(root, "data", "characters.json");
const outputPath = path.join(root, "public", "data", "reddit-stocks.json");

const subreddit = "lookismcomic";
const sourceUrls = [
  `https://www.reddit.com/r/${subreddit}/hot.json?limit=50`,
  `https://www.reddit.com/r/${subreddit}/new.json?limit=50`,
  `https://www.reddit.com/r/${subreddit}/top.json?limit=50&t=week`
];

const bullishTerms = [
  "goat",
  "peak",
  "strong",
  "stronger",
  "wins",
  "won",
  "beats",
  "beat",
  "aura",
  "him",
  "upscale",
  "top tier",
  "cooked him",
  "low diff",
  "no diff"
];

const bearishTerms = [
  "fraud",
  "lost",
  "loses",
  "bum",
  "fodder",
  "washed",
  "nerfed",
  "downscale",
  "overrated",
  "clown",
  "got cooked",
  "trash"
];

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const round = (value, digits = 2) => Number(value.toFixed(digits));

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function countMatches(text, alias) {
  const pattern = new RegExp(`(^|[^a-z0-9])${escapeRegex(alias.toLowerCase())}([^a-z0-9]|$)`, "g");
  return [...text.matchAll(pattern)].length;
}

function countTerms(text, terms) {
  return terms.reduce((total, term) => total + countMatches(text, term), 0);
}

async function readJson(filePath, fallback) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

async function fetchRedditPosts() {
  const seen = new Set();
  const posts = [];

  for (const url of sourceUrls) {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "lookism-stock-exchange/1.0 by fictional-market-dashboard"
      }
    });

    if (!response.ok) {
      throw new Error(`Reddit request failed: ${response.status} ${response.statusText} for ${url}`);
    }

    const payload = await response.json();
    for (const child of payload?.data?.children ?? []) {
      const post = child.data;
      if (!post?.id || seen.has(post.id)) continue;
      seen.add(post.id);
      posts.push({
        id: post.id,
        title: post.title ?? "",
        selftext: post.selftext ?? "",
        ups: Number(post.ups ?? 0),
        comments: Number(post.num_comments ?? 0),
        permalink: post.permalink ? `https://www.reddit.com${post.permalink}` : "",
        createdUtc: post.created_utc ? new Date(post.created_utc * 1000).toISOString() : null
      });
    }
  }

  return posts;
}

function scoreCharacter(character, posts, previousPrice) {
  let mentions = 0;
  let weightedMentions = 0;
  let sentimentRaw = 0;
  const citedPosts = [];

  for (const post of posts) {
    const text = `${post.title} ${post.selftext}`.toLowerCase();
    const aliasHits = character.aliases.reduce((sum, alias) => sum + countMatches(text, alias), 0);
    if (!aliasHits) continue;

    const engagement = Math.log10(post.ups + post.comments * 2 + 10);
    const bullish = countTerms(text, bullishTerms);
    const bearish = countTerms(text, bearishTerms);
    const postSentiment = clamp(bullish - bearish, -3, 3);

    mentions += aliasHits;
    weightedMentions += aliasHits * engagement;
    sentimentRaw += postSentiment * engagement;
    citedPosts.push({
      title: post.title,
      url: post.permalink,
      ups: post.ups,
      comments: post.comments,
      sentiment: postSentiment
    });
  }

  return {
    name: character.name,
    previousPrice,
    mentions,
    weightedMentions,
    sentimentRaw,
    citedPosts: citedPosts
      .sort((a, b) => b.ups + b.comments - (a.ups + a.comments))
      .slice(0, 3)
  };
}

function explainStock(stock) {
  if (stock.mentions === 0) return "Quiet cycle. No strong Reddit signal found.";
  if (stock.sentiment > 0.35) return "Bullish chatter and engagement are pushing attention up.";
  if (stock.sentiment < -0.35) return "Recent discussion is leaning bearish or downplay-heavy.";
  return "Movement is mostly driven by attention volume rather than clear sentiment.";
}

function buildMarket(characters, posts, previousMarket) {
  const previousByName = new Map(previousMarket.map((item) => [item.name, Number(item.price) || 100]));
  const rawScores = characters.map((character) => scoreCharacter(character, posts, previousByName.get(character.name) ?? 100));
  const maxWeightedMentions = Math.max(1, ...rawScores.map((item) => item.weightedMentions));

  return rawScores
    .map((item) => {
      const attention = item.weightedMentions / maxWeightedMentions;
      const sentiment = item.weightedMentions ? clamp(item.sentimentRaw / item.weightedMentions, -1, 1) : 0;
      const marketPressure = item.mentions ? attention * 11 + sentiment * 5 : -0.75;
      const randomlessNoise = item.mentions ? Math.sin(item.name.length + item.mentions) * 0.9 : 0;
      const changePercent = clamp(marketPressure + randomlessNoise - 2.5, -14, 18);
      const price = clamp(item.previousPrice * (1 + changePercent / 100), 10, 500);

      return {
        name: item.name,
        price: round(price),
        change: round(price - item.previousPrice),
        changePercent: round(changePercent),
        mentions: item.mentions,
        sentiment: round(sentiment),
        trend: changePercent > 1 ? "up" : changePercent < -1 ? "down" : "flat",
        reason: explainStock({ ...item, sentiment }),
        citedPosts: item.citedPosts
      };
    })
    .sort((a, b) => b.price - a.price);
}

async function main() {
  const characters = await readJson(charactersPath, []);
  const previous = await readJson(outputPath, { market: [] });
  const posts = await fetchRedditPosts();
  const market = buildMarket(characters, posts, previous.market ?? []);

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(
    outputPath,
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        subreddit: `r/${subreddit}`,
        sourceUrls,
        postsScanned: posts.length,
        market
      },
      null,
      2
    )}\n`
  );

  console.log(`Updated ${market.length} Reddit-driven stocks from ${posts.length} posts.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

