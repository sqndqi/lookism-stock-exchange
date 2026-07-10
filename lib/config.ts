export type FeatureFlags = {
  enableDevDiagnostics: boolean;
  enableDemoLeaderboard: boolean;
  enableLimitOrders: boolean;
  enableSourceRefresh: boolean;
  enableDonationPlaceholder: boolean;
};

function flag(value: string | undefined, fallback: boolean) {
  if (value === undefined || value === "") return fallback;
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

export const featureFlags: FeatureFlags = {
  enableDevDiagnostics: flag(process.env.NEXT_PUBLIC_ENABLE_DEV_DIAGNOSTICS, false),
  enableDemoLeaderboard: flag(process.env.NEXT_PUBLIC_ENABLE_DEMO_LEADERBOARD, true),
  enableLimitOrders: flag(process.env.NEXT_PUBLIC_ENABLE_LIMIT_ORDERS, true),
  enableSourceRefresh: flag(process.env.NEXT_PUBLIC_ENABLE_SOURCE_REFRESH, false),
  enableDonationPlaceholder: flag(process.env.NEXT_PUBLIC_ENABLE_DONATION_PLACEHOLDER, false)
};

export const appConfig = {
  name: "AURA EXCHANGE",
  mode: "local-demo",
  engineVersion: "aura-engine-2.0",
  featureFlags
};
