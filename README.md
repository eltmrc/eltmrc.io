# eltmrc.io

Personal site for **Eliot Maurice** — writing, notes, and the work behind [Cial](https://cial.app).

- **Stack:** Vite 7, React 19, Tailwind CSS 4, pnpm, Motion  
- **Content:** MD/MDX files in `content/writing/` (no database)  
- **Host:** GitHub Pages → [eltmrc.io](https://eltmrc.io)

## Develop

```bash
pnpm install
pnpm dev
```

## Build & deploy

```bash
pnpm build          # static output → dist/
pnpm run pages:deploy  # build + force-push dist/ to gh-pages
```

Pages is served from the **`gh-pages`** branch (or GitHub Actions artifact). Custom domain: `public/CNAME` → `eltmrc.io`.

DNS (when ready): point `eltmrc.io` at GitHub Pages per [GitHub docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site), then build with `CUSTOM_DOMAIN=1`.

Actions workflow: `.github/workflows/deploy.yml`.

## Add a post

Create `content/writing/your-slug.mdx`:

```mdx
---
title: "Your title"
description: "One-line summary"
category: notes
date: "2026-07-13"
tags: ["notes"]
---

Your markdown here.
```

AI agents: use the **write-post** skill:

- `.claude/skills/write-post/SKILL.md`
- `.grok/skills/write-post/SKILL.md`

## Site map

| Route | Description |
|-------|-------------|
| `/` | Landing |
| `/writing` | Post index |
| `/writing/:slug` | Post |
| `/categories` | Category index |
| `/categories/:slug` | Posts in a category |
| `/about` | About |
| `/rss.xml` | RSS feed (build-time) |
