/** Stable slug for heading anchors (shared by markdown + minimap). */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type TocHeading = {
  id: string;
  title: string;
  level: 2 | 3;
};

/**
 * Pull `##` / `###` headings from markdown body for the post minimap.
 * Skips fenced code blocks so `#` inside code is ignored.
 */
export function extractHeadings(source: string): TocHeading[] {
  const lines = source.split("\n");
  const out: TocHeading[] = [];
  const seen = new Map<string, number>();
  let inFence = false;

  for (const line of lines) {
    if (/^```/.test(line.trim())) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (!match) continue;

    const level = match[1].length as 2 | 3;
    const raw = match[2].replace(/\s+#+\s*$/, "").trim();
    if (!raw) continue;

    // Timeline headings: `2014–2016 · HardFight` — keep full string for context.
    const title = raw;
    let id = slugifyHeading(title);
    if (!id) continue;

    const n = seen.get(id) ?? 0;
    seen.set(id, n + 1);
    if (n > 0) id = `${id}-${n + 1}`;

    out.push({ id, title, level });
  }

  return out;
}
