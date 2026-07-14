import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";

export type RotatingPhrase = {
  text: string;
  /** Optional date shown after the phrase — muted, smaller (no parens). */
  when?: string;
  /** Substrings to wrap with prose-mark (first match each, case-sensitive). */
  marks?: readonly string[];
  /** Optional external link (opens in new tab). Marked words become the hit target. */
  href?: string;
};

type RotatingDropProps = {
  phrases: readonly (string | RotatingPhrase)[];
  /** ms between swaps (default 2400) */
  intervalMs?: number;
  className?: string;
};

function normalize(p: string | RotatingPhrase): RotatingPhrase {
  return typeof p === "string" ? { text: p } : p;
}

function fullLabel(p: RotatingPhrase): string {
  return p.when ? `${p.text} ${p.when}` : p.text;
}

function ExternalLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("link", className)}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </a>
  );
}

/** Highlight mark substrings; optional href wraps marks (or whole text if no marks). */
function renderMarked(
  text: string,
  marks: readonly string[] = [],
  href?: string,
): ReactNode {
  const wrapMark = (content: ReactNode, key: string) => {
    const inner = (
      <strong key={key} className="prose-mark font-medium">
        {content}
      </strong>
    );
    if (!href) return inner;
    return (
      <ExternalLink key={key} href={href} className="font-medium">
        <strong className="prose-mark font-medium">{content}</strong>
      </ExternalLink>
    );
  };

  if (marks.length === 0) {
    if (!href) return text;
    return <ExternalLink href={href}>{text}</ExternalLink>;
  }

  type Seg = { start: number; end: number };
  const segs: Seg[] = [];
  for (const m of marks) {
    if (!m) continue;
    let from = 0;
    while (from < text.length) {
      const i = text.indexOf(m, from);
      if (i === -1) break;
      const end = i + m.length;
      const overlap = segs.some((s) => !(end <= s.start || i >= s.end));
      if (!overlap) segs.push({ start: i, end });
      from = end;
    }
  }
  segs.sort((a, b) => a.start - b.start);

  if (segs.length === 0) {
    if (!href) return text;
    return <ExternalLink href={href}>{text}</ExternalLink>;
  }

  const out: ReactNode[] = [];
  let cursor = 0;
  segs.forEach((s, idx) => {
    if (cursor < s.start) out.push(text.slice(cursor, s.start));
    out.push(wrapMark(text.slice(s.start, s.end), `${s.start}-${idx}`));
    cursor = s.end;
  });
  if (cursor < text.length) out.push(text.slice(cursor));
  return out;
}

function PhraseBody({ item }: { item: RotatingPhrase }) {
  return (
    <>
      {renderMarked(item.text, item.marks, item.href)}
      {item.when ? (
        <>
          {" "}
          <span className="text-[0.72em] font-normal tracking-wide text-fg-subtle">
            {item.when}
          </span>
        </>
      ) : null}
    </>
  );
}

/**
 * One phrase at a time: current drops out, next drops in.
 * Width stays stable via the longest phrase as an invisible sizer.
 * Optional marks, subtle dates, external links; pauses on hover when linked.
 */
export function RotatingDrop({
  phrases,
  intervalMs = 2400,
  className,
}: RotatingDropProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const items = phrases.map(normalize);

  useEffect(() => {
    if (items.length < 2 || reduce || paused) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [items.length, intervalMs, reduce, paused]);

  const longest = items.reduce(
    (a, b) => (fullLabel(a).length >= fullLabel(b).length ? a : b),
    items[0] ?? { text: "" },
  );
  const current = items[index] ?? items[0] ?? { text: "" };

  const pauseHandlers = {
    onMouseEnter: () => setPaused(true),
    onMouseLeave: () => setPaused(false),
    onFocus: () => setPaused(true),
    onBlur: () => setPaused(false),
  };

  if (reduce || items.length < 2) {
    return (
      <span
        className={cn("inline whitespace-nowrap", className)}
        {...pauseHandlers}
      >
        <PhraseBody item={current} />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "rotating-drop relative inline-grid max-w-full align-baseline",
        className,
      )}
      {...pauseHandlers}
    >
      <span
        className="invisible col-start-1 row-start-1 whitespace-nowrap"
        aria-hidden
      >
        <PhraseBody item={longest} />
      </span>
      <span className="relative col-start-1 row-start-1 inline-flex overflow-hidden whitespace-nowrap">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={fullLabel(current)}
            className="inline-block whitespace-nowrap"
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-110%", opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <PhraseBody item={current} />
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}
