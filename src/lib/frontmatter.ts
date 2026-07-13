/**
 * Minimal YAML frontmatter parser for MD/MDX posts.
 * Avoids gray-matter (and its Buffer dependency) in the browser bundle.
 *
 * Supports: scalars, booleans, numbers, quoted strings, inline arrays,
 * and simple block lists under a key.
 */

export type FrontmatterData = Record<string, unknown>;

export type ParsedFrontmatter = {
  data: FrontmatterData;
  content: string;
};

function unquote(value: string): string {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

function parseScalar(raw: string): unknown {
  const value = raw.trim();
  if (!value) return "";

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  if (value === "true") return true;
  if (value === "false") return false;
  if (value === "null" || value === "~") return null;

  if (/^-?\d+(\.\d+)?$/.test(value)) {
    return Number(value);
  }

  // Inline array: ["a", "b"] or [a, b]
  if (value.startsWith("[") && value.endsWith("]")) {
    const inner = value.slice(1, -1).trim();
    if (!inner) return [];
    return inner.split(",").map((part) => unquote(part.trim()));
  }

  return value;
}

function parseFrontmatterBlock(block: string): FrontmatterData {
  const data: FrontmatterData = {};
  const lines = block.replace(/\r\n/g, "\n").split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    i += 1;

    if (!line.trim() || line.trimStart().startsWith("#")) continue;

    const match = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (!match) continue;

    const key = match[1];
    const rest = match[2];

    // Block list:
    // tags:
    //   - a
    //   - b
    if (rest === "" || rest === "|" || rest === ">") {
      const items: string[] = [];
      while (i < lines.length) {
        const next = lines[i];
        const listItem = next.match(/^\s+-\s+(.*)$/);
        if (!listItem) break;
        items.push(String(parseScalar(listItem[1])));
        i += 1;
      }
      if (items.length > 0) {
        data[key] = items;
        continue;
      }
      data[key] = rest === "" ? "" : rest;
      continue;
    }

    data[key] = parseScalar(rest);
  }

  return data;
}

/**
 * Parse `---\nfrontmatter\n---\nbody` documents.
 * If no frontmatter fence is present, returns empty data and the full string as content.
 */
export function parseFrontmatter(raw: string): ParsedFrontmatter {
  const text = raw.replace(/^\uFEFF/, "");
  if (!text.startsWith("---")) {
    return { data: {}, content: text };
  }

  const end = text.indexOf("\n---", 3);
  if (end === -1) {
    return { data: {}, content: text };
  }

  const block = text.slice(3, end).replace(/^\n/, "");
  let content = text.slice(end + 4); // after \n---
  if (content.startsWith("\n")) content = content.slice(1);

  return {
    data: parseFrontmatterBlock(block),
    content,
  };
}
