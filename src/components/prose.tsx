import { Fragment, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  EvolutionStrip,
  parseEvolutionBlock,
} from "@/components/evolution-strip";
import { markdownComponents } from "@/components/mdx-components";
import { MosaicDemo } from "@/components/mosaic-demo";
import { remarkBrands } from "@/lib/remark-brands";

const remarkPlugins = [remarkGfm, remarkBrands];

/**
 * Fenced blocks rendered as React between markdown chunks:
 *   :::evolution … :::   → archive strip
 *   :::mosaic            → the interactive MOSAIC demonstration (self-closing line)
 */
const BLOCK =
  /(?:^|\n):::evolution(?:[ \t]+([^\n]*))?\n([\s\S]*?)\n:::(?=\n|$)|(?:^|\n):::mosaic(?=\n|$)/g;

function splitBlocks(source: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  const re = new RegExp(BLOCK.source, "g");
  let key = 0;

  while ((match = re.exec(source)) !== null) {
    const before = source.slice(last, match.index);
    if (before.trim()) {
      nodes.push(
        <ReactMarkdown
          key={`md-${key++}`}
          remarkPlugins={remarkPlugins}
          components={markdownComponents}
        >
          {before}
        </ReactMarkdown>,
      );
    }

    if (match[0].includes(":::mosaic")) {
      nodes.push(<MosaicDemo key={`mosaic-${key++}`} />);
    } else {
      const headerCaption = match[1]?.trim();
      const body = match[2] ?? "";
      const parsed = parseEvolutionBlock(
        headerCaption ? `${headerCaption}\n${body}` : body,
      );
      if (parsed) {
        nodes.push(
          <EvolutionStrip
            key={`evo-${key++}`}
            frames={parsed.frames}
            caption={parsed.caption}
          />,
        );
      }
    }

    last = match.index + match[0].length;
  }

  const tail = source.slice(last);
  if (tail.trim() || nodes.length === 0) {
    nodes.push(
      <ReactMarkdown
        key={`md-${key++}`}
        remarkPlugins={remarkPlugins}
        components={markdownComponents}
      >
        {tail || source}
      </ReactMarkdown>,
    );
  }

  return nodes;
}

export function Prose({ source }: { source: string }) {
  const hasBlocks = source.includes(":::evolution") || source.includes(":::mosaic");
  const children = hasBlocks ? (
    splitBlocks(source)
  ) : (
    <ReactMarkdown remarkPlugins={remarkPlugins} components={markdownComponents}>
      {source}
    </ReactMarkdown>
  );

  return (
    <article className="prose-shell">
      {hasBlocks ? <Fragment>{children}</Fragment> : children}
    </article>
  );
}
