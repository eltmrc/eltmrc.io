import { useState } from "react";
import { ImageLightbox } from "@/components/image-lightbox";
import { asset } from "@/lib/asset";
import { cn } from "@/lib/cn";

export type EvolutionFrame = {
  src: string;
  /** Short step label under the when-badge (e.g. "Telegram"). */
  title: string;
  /** Timeline chip (e.g. "Week 0", "~2 weeks"). */
  when: string;
  /** Optional longer caption. */
  caption?: string;
};

type EvolutionStripProps = {
  frames: EvolutionFrame[];
  /** Shared strip caption under the row. */
  caption?: string;
  className?: string;
};

/**
 * Horizontal archive strip: same-row phone/desk shots that read left→right
 * as weeks of evolution. Each frame zooms in the shared lightbox.
 */
export function EvolutionStrip({ frames, caption, className }: EvolutionStripProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const open = openIdx !== null ? frames[openIdx] : null;
  const openSrc = open ? asset(open.src) : "";

  return (
    <figure className={cn("prose-evo mt-8", className)}>
      <ol className="prose-evo__row" aria-label="Evolution over weeks">
        {frames.map((frame, i) => {
          const src = asset(frame.src);
          return (
            <li key={frame.src} className="prose-evo__cell">
              <button
                type="button"
                className="prose-evo__zoom group"
                onClick={() => setOpenIdx(i)}
                aria-label={`View larger: ${frame.title}`}
              >
                <span className="prose-evo__when">{frame.when}</span>
                <span className="prose-evo__frame">
                  <img
                    src={src}
                    alt={frame.caption ?? frame.title}
                    loading="lazy"
                    draggable={false}
                    className="prose-evo__img img-fade is-loaded"
                  />
                </span>
                <span className="prose-evo__title">{frame.title}</span>
              </button>
              {i < frames.length - 1 ? (
                <span className="prose-evo__arrow" aria-hidden>
                  →
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
      {caption ? <figcaption className="prose-evo__caption">{caption}</figcaption> : null}

      <ImageLightbox
        open={openIdx !== null}
        src={openSrc}
        alt={open?.caption ?? open?.title ?? ""}
        caption={
          open
            ? [open.when, open.title, open.caption].filter(Boolean).join(" · ")
            : undefined
        }
        onClose={() => setOpenIdx(null)}
      />
    </figure>
  );
}

/** Parse:
 *  :::evolution Optional shared caption
 *  Week 0 | Telegram · first try | /images/story/foo.png
 *  :::
 */
export function parseEvolutionBlock(body: string): {
  caption?: string;
  frames: EvolutionFrame[];
} | null {
  const lines = body
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return null;

  let caption: string | undefined;
  let start = 0;
  // First line is shared caption if it has no pipe path.
  if (!lines[0].includes("|") || !lines[0].includes("/")) {
    caption = lines[0];
    start = 1;
  }

  const frames: EvolutionFrame[] = [];
  for (let i = start; i < lines.length; i++) {
    const parts = lines[i].split("|").map((p) => p.trim());
    if (parts.length < 3) continue;
    const [when, title, src, ...rest] = parts;
    if (!when || !title || !src) continue;
    frames.push({
      when,
      title,
      src,
      caption: rest.length ? rest.join(" | ") : undefined,
    });
  }
  if (frames.length === 0) return null;
  return { caption, frames };
}
