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

## Build

```bash
npm run build
# static output in out/
```

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

AI agents: use the **write-post** skill under `.claude/skills/write-post` or `.grok/skills/write-post`.

## GitHub Pages

1. Repo: `eltmrc/eltmrc.io`
2. Settings → Pages → Source: **GitHub Actions**
3. Push to `main` runs `.github/workflows/deploy.yml`
4. DNS for `eltmrc.io`: point to GitHub Pages (A/ALIAS or CNAME as per GitHub docs). `public/CNAME` is already set.
