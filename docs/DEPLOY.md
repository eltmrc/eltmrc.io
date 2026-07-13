# Deploy

## GitHub Pages (`gh-pages` branch)

Vite static output (`dist/`) is published from the **`gh-pages`** branch.

```bash
pnpm build
# publish dist/ → gh-pages (see scripts/deploy-gh-pages.sh)
```

Or:

```bash
pnpm run pages:deploy
```

## GitHub Actions (preferred long-term)

Template: [`github-pages-workflow.yml`](./github-pages-workflow.yml)

Copy to `.github/workflows/deploy.yml` when your GitHub token/app has the **`workflow`** scope, then set:

**Settings → Pages → Source: GitHub Actions**

## Project pages vs custom domain

Default base path is `/eltmrc.io/` (GitHub project pages).

When DNS for `eltmrc.io` is ready:

```bash
CUSTOM_DOMAIN=1 pnpm build
```

and restore `public/CNAME` (currently `public/CNAME.disabled`).
