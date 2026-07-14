# eltmrc.io — agent notes

Personal site for **Eliot Maurice** (`eltmrc`). Minimalist founder blog.
Static **Vite + React + Tailwind** site on GitHub Pages.

## Hard rules

- **No database.** Posts are MD/MDX files only.
- **Static SPA.** Vite builds to `dist/`. No server runtime, no SSR.
- Keep the design **quiet and polished** — type, space, one accent. Match tokens in `src/index.css`.
- Do not turn this into a Cial marketing clone; Cial is a featured project, not the whole identity.

## Layout

```
content/writing/*.mdx   # blog posts (source of truth)
src/pages/              # route pages (Home, Writing)
src/components/         # chrome + markdown mapping + category icons
src/lib/posts.ts        # load/parse posts (import.meta.glob + frontmatter)
src/lib/frontmatter.ts  # tiny YAML frontmatter parser (no gray-matter)
src/lib/site.ts         # name, urls, links
src/App.tsx             # react-router routes
.claude/skills/write-post/  # how to add posts (Claude)
.grok/skills/write-post/    # how to add posts (Grok)
```

## Adding a post

Use the **write-post** skill (`.claude/skills/write-post` or `.grok/skills/write-post`).

Quick path:

1. Create `content/writing/<slug>.mdx` with frontmatter: `title`, `description`, `date`, `category`.
2. Set `draft: true` until ready.
3. `pnpm typecheck` (or `pnpm build` when you need a full static check).

## Commands

```bash
pnpm install
pnpm dev         # local Vite
pnpm typecheck   # tsc only (light)
pnpm build       # static site → dist/
pnpm lint
pnpm run pages:deploy  # build + force-push dist/ to gh-pages
```

Package manager: **pnpm** (see `packageManager` in `package.json`). Prefer it over npm/yarn.

## Deploy

Push to `main` → GitHub Actions → GitHub Pages. Custom domain: `public/CNAME` → `eltmrc.io`.

## Categories

- Animated icons: `src/components/category-icons.tsx`
- Posts set `category: <slug>` in frontmatter
