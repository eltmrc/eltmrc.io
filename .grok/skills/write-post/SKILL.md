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

1. **Clarify** (if missing): topic, angle, title, **category**, draft vs publish.
2. **Choose a slug**: kebab-case, short, stable. Example: `why-im-building-cial`.
   - File path: `content/writing/<slug>.mdx`
   - URL: `/writing/<slug>/`
3. **Pick a category** from the list below (required when possible).
4. **Write the MDX file** with valid frontmatter.
5. **Do not** invent a CMS, API, or SQLite table.
6. Run `pnpm typecheck` to verify (prefer over full build on small machines).
7. Commit: `writing: add <slug>` then `pnpm run pages:deploy` if publishing live.

## Categories (use exact slug)

| slug | name |
|------|------|
| `ai` | AI |
| `building` | Building |
| `design` | Design |
| `engineering` | Engineering |
| `product` | Product |
| `tools` | Tools |
| `lab` | Lab |
| `systems` | Systems |
| `founding` | Founding |
| `infrastructure` | Infrastructure |
| `shipping` | Shipping |
| `learning` | Learning |
| `open-source` | Open source |
| `security` | Security |
| `performance` | Performance |
| `work` | Work |
| `notes` | Notes |
| `writing` | Writing |
| `ux` | UX |
| `meta` | Meta |

Source of truth: `src/lib/categories.ts`. Icons: `src/components/category-icons.tsx`.

## Frontmatter schema

```yaml
---
title: "Clear, specific title"
description: "One sentence for SEO / previews (≤160 chars ideal)"
category: lab          # required when it fits — exact slug from table
date: "YYYY-MM-DD"
tags: ["optional", "freeform"]
draft: false
image: "/images/foo.jpg"  # optional under public/
---
```

## Body conventions

- MDX preferred. Voice: first person, concrete, calm founder tone.
- Structure: short intro → 2–4 `##` sections.
- Prefer sharp over long.

## Scaffold

```mdx
---
title: ""
description: ""
category: notes
date: "2026-07-13"
tags: []
draft: true
---

Opening paragraph.

## Section

Body.
```

## Out of scope

- No database or admin UI for posts/categories.
- Do not invent new category slugs without updating `src/lib/categories.ts` + icon map.
