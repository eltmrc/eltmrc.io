#!/usr/bin/env bash
# Build static site and force-push to gh-pages branch.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ -z "${GITHUB_TOKEN:-}" && -z "${GH_TOKEN:-}" ]]; then
  echo "Set GITHUB_TOKEN (or use git credentials) to push gh-pages." >&2
fi

TOKEN="${GITHUB_TOKEN:-${GH_TOKEN:-}}"
REMOTE="${DEPLOY_REMOTE:-origin}"
REPO_URL="$(git remote get-url "$REMOTE" 2>/dev/null || true)"

pnpm run build

# Vite already writes dist/.nojekyll via spaFallback plugin; ensure it exists
touch dist/.nojekyll

TMP="$(mktemp -d)"
cleanup() { rm -rf "$TMP"; }
trap cleanup EXIT

cp -a dist/. "$TMP/"
cd "$TMP"
git init -b gh-pages
git add -A
git -c user.name="${GIT_AUTHOR_NAME:-Eliot Maurice}" \
    -c user.email="${GIT_AUTHOR_EMAIL:-hello@eltmrc.io}" \
    commit -m "deploy: $(date -u +%Y-%m-%dT%H:%M:%SZ)"

if [[ -n "$TOKEN" && "$REPO_URL" == https://* ]]; then
  # inject token for HTTPS remotes
  AUTH_URL="https://x-access-token:${TOKEN}@github.com/eltmrc/eltmrc.io.git"
  git push -f "$AUTH_URL" gh-pages:gh-pages
else
  git remote add origin "$REPO_URL"
  git push -f origin gh-pages
fi

echo "Published to gh-pages."
