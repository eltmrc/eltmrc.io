import type { NextConfig } from "next";

/**
 * Static export for GitHub Pages.
 * Custom domain (eltmrc.io) → no basePath.
 * Project URL only (eltmrc.github.io/eltmrc.io) would need basePath: "/eltmrc.io".
 */
const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
