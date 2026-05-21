import type { NextConfig } from "next";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const appDir = dirname(fileURLToPath(import.meta.url));
const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: appDir,
  ...(isGitHubPages
    ? {
        output: "export" as const,
        basePath: "/lookism-stock-exchange",
        assetPrefix: "/lookism-stock-exchange/",
        images: {
          unoptimized: true
        }
      }
    : {})
};

export default nextConfig;
