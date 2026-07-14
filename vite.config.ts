import path from "node:path";
import { pathToFileURL } from "node:url";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "node:fs";

/**
 * Static site for GitHub Pages.
 *
 * Custom domain https://eltmrc.io is live (public/CNAME + apex DNS),
 * so root base is the default. Set PROJECT_PAGES=1 to build for the
 * legacy project URL https://eltmrc.github.io/eltmrc.io/ instead.
 */
const useProjectPages = process.env.PROJECT_PAGES === "1";
const base = useProjectPages ? "/eltmrc.io/" : "/";

function spaFallback(): Plugin {
  return {
    name: "spa-github-pages-fallback",
    closeBundle() {
      const dist = path.resolve(__dirname, "dist");
      // Jekyll on GitHub Pages ignores folders starting with _ unless this exists
      fs.writeFileSync(path.join(dist, ".nojekyll"), "");
    },
  };
}

/** robots.txt, sitemap, RSS, prerendered SEO shells for crawlers. */
function seoAssets(): Plugin {
  return {
    name: "seo-assets",
    async closeBundle() {
      // Absolute file URL so TypeScript doesn't resolve a missing .d.ts for .mjs
      const mod = (await import(
        pathToFileURL(path.resolve(__dirname, "scripts/seo-build.mjs")).href
      )) as { runSeoBuild: () => void };
      mod.runSeoBuild();
    },
  };
}

export default defineConfig({
  base,
  plugins: [react(), tailwindcss(), spaFallback(), seoAssets()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    host: "127.0.0.1",
    port: 5173,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    // Keep builds light on small machines (≈4GB RAM hosts)
    sourcemap: false,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 800,
    minify: "esbuild",
    cssMinify: true,
    target: "es2022",
    rollupOptions: {
      // Fewer parallel file ops → lower peak RSS
      maxParallelFileOps: 2,
      output: {
        manualChunks: undefined,
      },
    },
  },
});
