/** Remark plugin: prefix known product names in body text with their logo chip. */

type MdNode = {
  type: string;
  value?: string;
  children?: MdNode[];
  data?: Record<string, unknown>;
};

const BRANDS: [RegExp, string][] = [
  [/GLM 5\.3 (?:Abliterated|Uncensored)|GLM(?: 5\.3)?|Z\.ai/, "glm"],
  [/(?:Claude )?Opus 5\.5|Claude/, "claude"],
  [/GPT-6 Astra|Astra|Codex|ChatGPT/, "openai"],
  [/Anthropic/, "anthropic"],
  [/Cial/, "cial"],
];

const PATTERN = new RegExp(
  `\\b(${BRANDS.map(([re]) => re.source).join("|")})(?![\\w-])`,
  "g",
);

const SKIP = new Set(["heading", "code", "inlineCode", "html", "image"]);

function brandOf(match: string): string {
  return BRANDS.find(([re]) => new RegExp(`^(?:${re.source})$`).test(match))![1];
}

function split(text: string): MdNode[] | null {
  const out: MdNode[] = [];
  let last = 0;
  for (const m of text.matchAll(PATTERN)) {
    const i = m.index ?? 0;
    if (i > last) out.push({ type: "text", value: text.slice(last, i) });
    out.push({
      type: "brand",
      data: { hName: "span", hProperties: { className: ["brand", `brand--${brandOf(m[0])}`] } },
      children: [{ type: "text", value: m[0] }],
    });
    last = i + m[0].length;
  }
  if (!out.length) return null;
  if (last < text.length) out.push({ type: "text", value: text.slice(last) });
  return out;
}

function walk(node: MdNode) {
  if (!node.children || SKIP.has(node.type)) return;
  node.children = node.children.flatMap((child) => {
    if (child.type === "text" && child.value) return split(child.value) ?? [child];
    walk(child);
    return [child];
  });
}

export function remarkBrands() {
  return (tree: MdNode) => walk(tree);
}
