import type { NextConfig } from "next";

/**
 * Static export for GitHub Pages.
 *
 * Project site (no custom DNS yet): https://eltmrc.github.io/eltmrc.io/
 *   → basePath + assetPrefix required
 *
 * When DNS for eltmrc.io is ready, set CUSTOM_DOMAIN=1 (or remove basePath)
 * and put public/CNAME back.
 */
const useProjectPages = process.env.CUSTOM_DOMAIN !== "1";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  ...(useProjectPages
    ? {
        basePath: "/eltmrc.io",
        assetPrefix: "/eltmrc.io",
      }
    : {}),
};

export default nextConfig;
