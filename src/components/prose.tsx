import { Fragment, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  EvolutionStrip,
  parseEvolutionBlock,
} from "@/components/evolution-strip";
import { markdownComponents } from "@/components/mdx-components";

/** :::evolution … ::: blocks become an EvolutionStrip between markdown chunks. */
const EVOLUTION_BLOCK =
  /(?:^|\n):::evolution(?:[ \t]+([^\n]*))?\n([\s\S]*?)\n:::(?=\n|$)/g;

function splitWithEvolution(source: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  const re = new RegExp(EVOLUTION_BLOCK.source, "g");
  let key = 0;

  while ((match = re.exec(source)) !== null) {
    const before = source.slice(last, match.index);
    if (before.trim()) {
      nodes.push(
        <ReactMarkdown
          key={`md-${key++}`}
          remarkPlugins={[remarkGfm]}
          components={markdownComponents}
        >
          {before}
        </ReactMarkdown>,
      );
    }

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

    last = match.index + match[0].length;
  }

  const tail = source.slice(last);
  if (tail.trim() || nodes.length === 0) {
    nodes.push(
      <ReactMarkdown
        key={`md-${key++}`}
        remarkPlugins={[remarkGfm]}
        components={markdownComponents}
      >
        {tail || source}
      </ReactMarkdown>,
    );
  }

  return nodes;
}

export function Prose({ source }: { source: string }) {
  const hasEvolution = source.includes(":::evolution");
  const children = hasEvolution ? (
    splitWithEvolution(source)
  ) : (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
      {source}
    </ReactMarkdown>
  );

  return (
    <article className="prose-shell">
      {hasEvolution ? <Fragment>{children}</Fragment> : children}
    </article>
  );
}
