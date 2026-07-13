---
name: write-post
description: >
  Create a new blog post for eltmrc.io (Eliot Maurice personal site).
  Use when the user asks to write, draft, add, or publish a post, essay,
  lab note, or MDX article. Triggers: /write-post, "new post", "blog post",
  "write an essay", "add writing".
---

# Write a post on eltmrc.io

File-based blog — **no database**. Each post is one MDX file under `content/writing/`.

## Workflow

1. **Clarify** (if missing): topic, angle, title, tags, draft vs publish.
2. **Choose a slug**: kebab-case, short, stable. Example: `why-im-building-cial`.
   - File path: `content/writing/<slug>.mdx`
   - URL: `/writing/<slug>/`
3. **Write the MDX file** with valid frontmatter (see schema).
4. **Do not** invent a CMS, API, or SQLite table.
5. Optionally link the post from home only if it should be featured (home auto-lists latest 4).
6. Run `npm run build` if you changed structure; for content-only, build is enough to verify MDX compiles.
7. Commit with a message like: `writing: add <slug>`.

## Frontmatter schema (required)

```yaml
---
title: "Clear, specific title"
description: "One sentence for SEO / previews (≤160 chars ideal)"
date: "YYYY-MM-DD"   # publish date, ISO date only
tags: ["tag-one", "tag-two"]  # optional but preferred
draft: false         # optional; true excludes from lists & 404s the page in prod lists
image: "/og/foo.png" # optional; path under public/
---
```

## Body conventions

- **MDX** (Markdown + optional JSX). Prefer Markdown unless a custom component is needed.
- Voice: first person, concrete, calm founder tone. No corporate fluff, no engagement bait.
- Structure: short intro → 2–4 sections with `##` → closing line optional.
- Length: lab notes 600–1200 words; essays 1200–2500. Prefer sharp over long.
- Links: use full URLs for external; site internals as `/writing/other-slug/`.
- Code: fenced blocks with language tags.
- Don't hardcode colors or layout chrome in the post body.

## Post types (pick one mental model)

| Type | Tags examples | Tone |
|------|----------------|------|
| Essay / story | `founding`, `cial`, `story` | Narrative, decisions |
| Tech tried / lab | `lab`, stack name | Honest tradeoffs |
| Field notes | `shipping`, `notes` | Short, dated observations |
| Meta | `meta`, `site` | Site/process |

## Checklist before finishing

- [ ] File is `content/writing/<slug>.mdx`
- [ ] `title`, `description`, `date` present
- [ ] `draft: true` if not ready to publish
- [ ] No secrets, private URLs, or unreleased customer data
- [ ] Title is unique vs existing posts (`ls content/writing`)
- [ ] Reads well on mobile (short paragraphs)

## Scaffold template

```mdx
---
title: ""
description: ""
date: "2026-07-13"
tags: []
draft: true
---

Opening paragraph — why this matters now.

## Section

Body.

## What I'd do differently

Optional closer.
```

## Out of scope

- Do not add a database, admin UI, or auth for posts.
- Do not put posts under `src/app/` as hard-coded pages (unless a fully custom one-off landing).
- Design system / chrome lives in `src/`; posts only provide content.
