const baseUrl = process.env.SMOKE_BASE_URL ?? "http://localhost:3000";

const routes = [
  ["/", 200],
  ["/login", 200],
  ["/market", 200],
  ["/intel", 200],
  ["/calendar", 200],
  ["/leaderboard", 200],
  ["/dev/market", 200],
  ["/asset/DAN", 200],
  ["/api/health", 200],
  ["/api/snapshot", 200],
  ["/api/market", 200],
  ["/api/assets/DAN", 200],
  ["/api/assets/NOPE", 404]
];

let failed = 0;

for (const [route, expected] of routes) {
  try {
    const response = await fetch(`${baseUrl}${route}`);
    if (response.status !== expected) {
      failed += 1;
      console.error(`SMOKE FAIL ${route}: expected ${expected}, got ${response.status}`);
    } else {
      console.log(`SMOKE OK ${route} ${response.status}`);
    }
  } catch (error) {
    failed += 1;
    console.error(`SMOKE FAIL ${route}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

if (failed) process.exitCode = 1;
