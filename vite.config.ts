import path from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "node:fs";
import { parseFrontmatter } from "./src/lib/frontmatter";

/**
 * Static site for GitHub Pages.
 *
 * Project site (no custom DNS yet): https://eltmrc.github.io/eltmrc.io/
 *   → base path required
 *
 * When DNS for eltmrc.io is ready, set CUSTOM_DOMAIN=1 (or remove base)
 * and put public/CNAME back.
 */
const useProjectPages = process.env.CUSTOM_DOMAIN !== "1";
const base = useProjectPages ? "/eltmrc.io/" : "/";

function spaFallback(): Plugin {
  return {
    name: "spa-github-pages-fallback",
    closeBundle() {
      const dist = path.resolve(__dirname, "dist");
      const index = path.join(dist, "index.html");
      if (fs.existsSync(index)) {
        fs.copyFileSync(index, path.join(dist, "404.html"));
      }
      // Jekyll on GitHub Pages ignores folders starting with _ unless this exists
      fs.writeFileSync(path.join(dist, ".nojekyll"), "");
    },
  };
}

function writeRss(): Plugin {
  return {
    name: "write-rss",
    closeBundle() {
      const writingDir = path.resolve(__dirname, "content/writing");
      const siteUrl = "https://eltmrc.github.io/eltmrc.io";
      const siteName = "Eliot Maurice";
      const siteDescription =
        "Founder of Cial. Writing about building software, AI workspaces, and the craft of shipping.";

      if (!fs.existsSync(writingDir)) return;

      const posts = fs
        .readdirSync(writingDir)
        .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
        .map((filename) => {
          const raw = fs.readFileSync(path.join(writingDir, filename), "utf8");
          const { data } = parseFrontmatter(raw);
          if (!data.title || !data.date || data.draft) return null;
          return {
            slug: filename.replace(/\.mdx?$/, ""),
            title: String(data.title),
            description: String(data.description ?? ""),
            date: String(data.date),
          };
        })
        .filter((p): p is NonNullable<typeof p> => p !== null)
        .sort((a, b) => (a.date < b.date ? 1 : -1));

      const escapeXml = (s: string) =>
        s
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;")
          .replaceAll('"', "&quot;")
          .replaceAll("'", "&apos;");

      const items = posts
        .map(
          (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${siteUrl}/writing/${post.slug}/</link>
      <guid>${siteUrl}/writing/${post.slug}/</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.description)}</description>
    </item>`,
        )
        .join("\n");

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(siteName)}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(siteDescription)}</description>
    <language>en</language>
${items}
  </channel>
</rss>
`;

      const dist = path.resolve(__dirname, "dist");
      fs.mkdirSync(dist, { recursive: true });
      fs.writeFileSync(path.join(dist, "rss.xml"), xml);
    },
  };
}

export default defineConfig({
  base,
  plugins: [react(), tailwindcss(), writeRss(), spaFallback()],
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

