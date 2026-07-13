# eltmrc.io

Personal site for **Eliot Maurice** — writing, notes, and the work behind [Cial](https://cial.ai).

- **Stack:** Next.js 16 (static export), React 19, Tailwind CSS 4, Motion  
- **Content:** MDX files in `content/writing/` (no database)  
- **Host:** GitHub Pages → [eltmrc.io](https://eltmrc.io)

## Develop

```bash
npm install
npm run dev
```

## Build & deploy

```bash
npm run build          # static output → out/
npm run deploy         # build + force-push out/ to gh-pages
```

Pages is served from the **`gh-pages`** branch. Custom domain: `public/CNAME` → `eltmrc.io`.

DNS (when ready): point `eltmrc.io` at GitHub Pages per [GitHub docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

Actions template (optional): `docs/github-pages-workflow.yml` — requires a token with the `workflow` scope to commit under `.github/workflows/`.

## Add a post

Create `content/writing/your-slug.mdx`:

```mdx
---
title: "Your title"
description: "One-line summary"
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
| `/writing/[slug]` | Post |
| `/about` | About |
| `/rss.xml` | RSS feed |
