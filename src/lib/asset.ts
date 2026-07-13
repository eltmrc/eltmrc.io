/**
 * Prefix public asset paths with Vite base when on project GitHub Pages.
 * import.meta.env.BASE_URL is e.g. "/eltmrc.io/" or "/".
 */
const BASE = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "");

export function asset(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (!BASE) return normalized;
  if (normalized.startsWith(`${BASE}/`) || normalized === BASE) return normalized;
  return `${BASE}${normalized}`;
}

export const basePath = BASE;
