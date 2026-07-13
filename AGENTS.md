<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# eltmrc.io — agent notes

Personal site for **Eliot Maurice** (`eltmrc`). Minimalist founder blog. Static Next.js on GitHub Pages.

## Hard rules

- **No database.** Posts are MDX files only.
- **Static export** (`output: "export"`). No server-only features, no dynamic SSR, no Route Handlers that need a Node server at runtime (RSS is build-time static).
- Keep the design **quiet and polished** — type, space, one accent. Match the existing tokens in `src/app/globals.css`.
- Do not turn this into a Cial marketing clone; Cial is a featured project, not the whole identity.

## Layout

```
content/writing/*.mdx   # blog posts (source of truth)
src/app/                # routes (Home, Writing, About)
src/components/         # chrome + MDX mapping
src/lib/posts.ts        # load/parse posts
src/lib/site.ts         # name, urls, links
.claude/skills/write-post/  # how to add posts (Claude)
.grok/skills/write-post/    # how to add posts (Grok)
```

## Adding a post

Use the **write-post** skill (`.claude/skills/write-post` or `.grok/skills/write-post`).

Quick path:

1. Create `content/writing/<slug>.mdx` with frontmatter: `title`, `description`, `date`.
2. Set `draft: true` until ready.
3. `npm run build` to verify.

## Commands

```bash
npm run dev      # local
npm run build    # static site → out/
npm run lint
```

## Deploy

Push to `main` → GitHub Actions → GitHub Pages. Custom domain: `eltmrc.io` (`public/CNAME`).
