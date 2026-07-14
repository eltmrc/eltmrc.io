import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import type { TocHeading } from "@/lib/headings";

type PostMinimapProps = {
  headings: TocHeading[];
};

/**
 * Notion-style document outline: bars on the right edge; titles fade in
 * via pure CSS :hover (no React open-state — avoids re-render flicker).
 */
export function PostMinimap({ headings }: PostMinimapProps) {
  const [activeId, setActiveId] = useState<string | null>(
    headings[0]?.id ?? null,
  );

  useEffect(() => {
    if (headings.length === 0) return;

    let observer: IntersectionObserver | null = null;
    let raf = 0;
    let tries = 0;
    const visible = new Map<string, IntersectionObserverEntry>();

    const connect = () => {
      const elements = headings
        .map((h) => document.getElementById(h.id))
        .filter((el): el is HTMLElement => Boolean(el));

      if (elements.length < headings.length && tries < 24) {
        tries += 1;
        raf = requestAnimationFrame(connect);
        return;
      }
      if (elements.length === 0) return;

      const hash = decodeURIComponent(window.location.hash.replace(/^#/, ""));
      if (hash && elements.some((el) => el.id === hash)) {
        setActiveId(hash);
      }

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) visible.set(entry.target.id, entry);
            else visible.delete(entry.target.id);
          }

          let best: string | null = null;
          let bestTop = Number.POSITIVE_INFINITY;
          for (const el of elements) {
            if (!visible.has(el.id)) continue;
            const top = el.getBoundingClientRect().top;
            if (top < bestTop) {
              bestTop = top;
              best = el.id;
            }
          }
          if (best) setActiveId(best);
        },
        {
          rootMargin: "-12% 0px -68% 0px",
          threshold: [0, 0.25, 0.5, 1],
        },
      );

      for (const el of elements) observer.observe(el);
    };

    connect();
    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
    };
  }, [headings]);

  if (headings.length < 2) return null;

  function jump(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    setActiveId(id);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  }

  return (
    <nav
      aria-label="On this page"
      className="post-minimap fixed top-1/2 right-3 z-30 hidden -translate-y-1/2 xl:block 2xl:right-6"
    >
      {/* Continuous hit pad (no gaps) so hover never drops mid-list. */}
      <ul className="flex flex-col items-end py-2 pl-10">
        {headings.map((heading) => {
          const active = heading.id === activeId;
          return (
            <li key={heading.id} className="flex w-full justify-end">
              <button
                type="button"
                onClick={() => jump(heading.id)}
                className={cn(
                  "group post-minimap__item flex max-w-[15rem] cursor-pointer items-center justify-end gap-2.5 py-1.5 pl-2 text-left outline-none",
                )}
                aria-current={active ? "location" : undefined}
                title={heading.title}
              >
                <span
                  className={cn(
                    "post-minimap__label min-w-0 truncate text-[12px] leading-snug",
                    active
                      ? "post-minimap__label--active font-medium text-fg"
                      : "text-fg-muted",
                    heading.level === 3 && "text-[11.5px]",
                  )}
                >
                  <span className="hover-underline">{heading.title}</span>
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "post-minimap__bar block shrink-0 rounded-full",
                    active && "post-minimap__bar--active",
                    heading.level === 3 && "post-minimap__bar--sub",
                  )}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
