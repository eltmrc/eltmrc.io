/**
 * Build-time SEO assets for the static SPA:
 *  - robots.txt
 *  - sitemap.xml
 *  - rss.xml (canonical domain)
 *  - prerendered route shells with correct <head> for crawlers
 *
 * Invoked from vite closeBundle via dynamic import, or: node scripts/seo-build.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const WRITING = path.join(ROOT, "content/writing");

const SITE = {
  name: "Eliot Maurice",
  url: "https://eltmrc.io",
  description:
    "Eliot Maurice (eltmrc). Builder in Paris. Co-founder of Cial and ClinicPilot, creator of OpenCial. Notes and articles on AI, software, and shipping products.",
  defaultOgImage: "https://eltmrc.io/images/portrait.jpg",
  lang: "en",
  locale: "en_US",
  twitter: "@ByProcyx",
  email: "eliot@cial.app",
};

function escapeXml(s) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function escapeHtml(s) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function parseFrontmatter(raw) {
  if (!raw.startsWith("---")) return { data: {}, content: raw };
  const end = raw.indexOf("\n---", 3);
  if (end === -1) return { data: {}, content: raw };
  const block = raw.slice(3, end).trim();
  const content = raw.slice(end + 4).replace(/^\n/, "");
  const data = {};
  // Minimal YAML-ish: key: value, arrays of strings
  let listKey = null;
  for (const line of block.split("\n")) {
    if (/^\s+-\s+/.test(line) && listKey) {
      const v = line.replace(/^\s+-\s+/, "").replace(/^["']|["']$/g, "");
      if (!Array.isArray(data[listKey])) data[listKey] = [];
      data[listKey].push(v);
      continue;
    }
    listKey = null;
    const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    let val = m[2].trim();
    if (val === "" || val === "|" || val === ">") {
      listKey = key;
      data[key] = data[key] ?? [];
      continue;
    }
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (val === "true") data[key] = true;
    else if (val === "false") data[key] = false;
    else data[key] = val;
  }
  return { data, content };
}

function loadPosts() {
  if (!fs.existsSync(WRITING)) return [];
  return fs
    .readdirSync(WRITING)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((filename) => {
      const raw = fs.readFileSync(path.join(WRITING, filename), "utf8");
      const { data } = parseFrontmatter(raw);
      if (!data.title || !data.date || data.draft) return null;
      return {
        slug: filename.replace(/\.mdx?$/, ""),
        title: String(data.title),
        description: String(data.description ?? ""),
        date: String(data.date),
        image: data.image ? String(data.image) : undefined,
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      };
    })
    .filter(Boolean)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

function abs(p) {
  if (/^https?:\/\//i.test(p)) return p;
  return `${SITE.url}${p.startsWith("/") ? p : `/${p}`}`;
}

function ogImage(image) {
  if (!image || image === "cial-mark") return SITE.defaultOgImage;
  return abs(image);
}

function writeRobots() {
  const body = `User-agent: *
Allow: /

Sitemap: ${SITE.url}/sitemap.xml
`;
  fs.writeFileSync(path.join(DIST, "robots.txt"), body);
}

function writeSitemap(posts) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    { loc: `${SITE.url}/`, changefreq: "weekly", priority: "1.0", lastmod: today },
    {
      loc: `${SITE.url}/writing/`,
      changefreq: "weekly",
      priority: "0.9",
      lastmod: posts[0]?.date ?? today,
    },
    ...posts.map((p) => ({
      loc: `${SITE.url}/writing/${p.slug}/`,
      changefreq: "monthly",
      priority: "0.8",
      lastmod: p.date,
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;
  fs.writeFileSync(path.join(DIST, "sitemap.xml"), xml);
}

function writeRss(posts) {
  const items = posts
    .map(
      (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE.url}/writing/${post.slug}/</link>
      <guid isPermaLink="true">${SITE.url}/writing/${post.slug}/</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.description)}</description>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE.name)}</title>
    <link>${SITE.url}/</link>
    <atom:link href="${SITE.url}/rss.xml" rel="self" type="application/rss+xml"/>
    <description>${escapeXml(SITE.description)}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;
  fs.writeFileSync(path.join(DIST, "rss.xml"), xml);
}

function injectHead(html, meta) {
  const {
    title,
    description,
    path,
    type = "website",
    image,
    publishedTime,
    jsonLd = [],
    noindex = false,
  } = meta;

  const url = abs(path);
  const img = ogImage(image);
  const robots = noindex
    ? "noindex, nofollow"
    : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

  const ld = (Array.isArray(jsonLd) ? jsonLd : [jsonLd])
    .map(
      (node) =>
        `    <script type="application/ld+json">${JSON.stringify(node)}</script>`,
    )
    .join("\n");

  const articleMeta =
    type === "article" && publishedTime
      ? `
    <meta property="article:published_time" content="${escapeHtml(publishedTime)}" />
    <meta property="article:modified_time" content="${escapeHtml(publishedTime)}" />
    <meta property="article:author" content="${escapeHtml(SITE.name)}" />`
      : "";

  const block = `
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="author" content="${escapeHtml(SITE.name)}" />
    <meta name="robots" content="${robots}" />
    <meta name="googlebot" content="${robots}" />
    <link rel="canonical" href="${escapeHtml(url)}" />
    <link rel="alternate" type="application/rss+xml" title="${escapeHtml(SITE.name)} RSS" href="${SITE.url}/rss.xml" />
    <meta property="og:type" content="${type}" />
    <meta property="og:locale" content="${SITE.locale}" />
    <meta property="og:url" content="${escapeHtml(url)}" />
    <meta property="og:site_name" content="${escapeHtml(SITE.name)}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${escapeHtml(img)}" />
    <meta property="og:image:alt" content="${escapeHtml(SITE.name)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="${SITE.twitter}" />
    <meta name="twitter:creator" content="${SITE.twitter}" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(img)}" />${articleMeta}
${ld}
`;

  // Replace existing title + description meta so crawlers see one set.
  let out = html
    .replace(/<title>[^<]*<\/title>/i, "")
    .replace(/<meta\s+name="description"[^>]*>/i, "")
    .replace(/<link\s+rel="canonical"[^>]*>/i, "");

  // Insert after <head>
  out = out.replace(/<head[^>]*>/i, (m) => `${m}\n${block}`);
  return out;
}

function writeRouteShell(indexHtml, routePath, meta) {
  // routePath like "/" or "/writing/" or "/writing/slug/"
  const rel =
    routePath === "/"
      ? "index.html"
      : path.join(routePath.replace(/^\//, "").replace(/\/$/, ""), "index.html");
  const outPath = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, injectHead(indexHtml, meta));
}

export function runSeoBuild() {
  if (!fs.existsSync(DIST)) {
    console.warn("[seo-build] dist/ missing — skip");
    return;
  }
  const indexPath = path.join(DIST, "index.html");
  if (!fs.existsSync(indexPath)) {
    console.warn("[seo-build] dist/index.html missing — skip");
    return;
  }

  const posts = loadPosts();
  const indexHtml = fs.readFileSync(indexPath, "utf8");

  writeRobots();
  writeSitemap(posts);
  writeRss(posts);

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE.name,
    url: SITE.url,
    image: SITE.defaultOgImage,
    email: SITE.email,
    sameAs: [
      "https://github.com/eltmrc",
      "https://x.com/ByProcyx",
      "https://www.linkedin.com/in/eliot-m-2b43b418b/",
      "https://cial.app",
      "https://opencial.ai",
    ],
  };
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    inLanguage: SITE.lang,
  };

  // Home
  writeRouteShell(indexHtml, "/", {
    title: `${SITE.name} — builder, co-founder of Cial & OpenCial`,
    description: SITE.description,
    path: "/",
    type: "website",
    jsonLd: [person, website],
  });

  // Writing index
  writeRouteShell(indexHtml, "/writing/", {
    title: `Notes & Articles · ${SITE.name}`,
    description:
      "Notes and articles on software, AI, building Cial, and shipping products.",
    path: "/writing/",
    type: "website",
    jsonLd: [
      website,
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Notes & Articles",
        url: `${SITE.url}/writing/`,
        isPartOf: { "@type": "WebSite", url: SITE.url },
      },
    ],
  });

  // Posts
  for (const post of posts) {
    const path_ = `/writing/${post.slug}/`;
    writeRouteShell(indexHtml, path_, {
      title: `${post.title} · ${SITE.name}`,
      description: post.description || SITE.description,
      path: path_,
      type: "article",
      image: post.image,
      publishedTime: post.date,
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          dateModified: post.date,
          url: abs(path_),
          image: [ogImage(post.image)],
          author: { "@type": "Person", name: SITE.name, url: SITE.url },
          publisher: { "@type": "Person", name: SITE.name, url: SITE.url },
          inLanguage: SITE.lang,
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: `${SITE.url}/`,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Writing",
              item: `${SITE.url}/writing/`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: post.title,
              item: abs(path_),
            },
          ],
        },
      ],
    });
  }

  // Keep SPA fallback for unknown paths
  fs.copyFileSync(path.join(DIST, "index.html"), path.join(DIST, "404.html"));

  console.log(
    `[seo-build] robots, sitemap, rss, and ${2 + posts.length} route shells written`,
  );
}

// CLI
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runSeoBuild();
}
