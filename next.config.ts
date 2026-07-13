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
const basePath = useProjectPages ? "/eltmrc.io" : "";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  env: {
    // Used by src/lib/asset.ts for reliable static asset URLs
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  ...(useProjectPages
    ? {
        basePath,
        assetPrefix: basePath,
      }
    : {}),
};

export default nextConfig;
