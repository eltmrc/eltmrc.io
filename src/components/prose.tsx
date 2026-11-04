import { Fragment, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  EvolutionStrip,
  parseEvolutionBlock,
} from "@/components/evolution-strip";
import { LyriksDemo } from "@/components/lyriks-demo";
import { markdownComponents } from "@/components/mdx-components";
import { MosaicDemo } from "@/components/mosaic-demo";
import { SpectrumShowcase } from "@/components/spectrum-showcase";
import { remarkBrands } from "@/lib/remark-brands";

const remarkPlugins = [remarkGfm, remarkBrands];

/**
 * Fenced blocks rendered as React between markdown chunks:
 *   :::evolution … :::   → archive strip
 *   :::mosaic            → the interactive MOSAIC demonstration (self-closing line)
 *   :::spectrum          → the interactive audio spectrum showcase (self-closing line)
 *   :::lyriks            → the interactive Lyriks demo (self-closing line)
 */
const BLOCK =
  /(?:^|\n):::evolution(?:[ \t]+([^\n]*))?\n([\s\S]*?)\n:::(?=\n|$)|(?:^|\n):::mosaic(?=\n|$)|(?:^|\n):::spectrum(?=\n|$)|(?:^|\n):::lyriks(?=\n|$)/g;

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
    } else if (match[0].includes(":::spectrum")) {
      nodes.push(<SpectrumShowcase key={`spectrum-${key++}`} />);
    } else if (match[0].includes(":::lyriks")) {
      nodes.push(<LyriksDemo key={`lyriks-${key++}`} />);
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
  const hasBlocks =
    source.includes(":::evolution") ||
    source.includes(":::mosaic") ||
    source.includes(":::spectrum") ||
    source.includes(":::lyriks");
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
