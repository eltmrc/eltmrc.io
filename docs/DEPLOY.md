# Deploy

## GitHub Pages (`gh-pages` branch)

Static export (`out/`) is published from the **`gh-pages`** branch.

```bash
npm run build
# publish out/ → gh-pages (see scripts or agent deploy)
```

## GitHub Actions (preferred long-term)

Template: [`github-pages-workflow.yml`](./github-pages-workflow.yml)

Copy to `.github/workflows/deploy.yml` when your GitHub token/app has the **`workflow`** scope, then set:

**Settings → Pages → Source: GitHub Actions**
