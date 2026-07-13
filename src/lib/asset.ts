/**
 * Prefix public asset paths with Next basePath when on project GitHub Pages.
 * next/image sometimes emits /images/... without basePath under static export.
 */
const BASE =
  process.env.NEXT_PUBLIC_BASE_PATH ??
  (process.env.CUSTOM_DOMAIN === "1" ? "" : "/eltmrc.io");

export function asset(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (!BASE) return normalized;
  if (normalized.startsWith(`${BASE}/`) || normalized === BASE) return normalized;
  return `${BASE}${normalized}`;
}

export const basePath = BASE;
