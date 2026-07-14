import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import type { TocHeading } from "@/lib/headings";

type PostMinimapProps = {
  headings: TocHeading[];
};

/**
 * Notion-style document outline: bars on the right edge; titles fade in
 * inline on hover (no card chrome). Click jumps; active tracks scroll.
 */
export function PostMinimap({ headings }: PostMinimapProps) {
  const [activeId, setActiveId] = useState<string | null>(
    headings[0]?.id ?? null,
  );
  const [open, setOpen] = useState(false);

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

      // Prose mounts after first paint — retry a few frames.
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
      className="pointer-events-none fixed top-1/2 right-3 z-30 hidden -translate-y-1/2 xl:block 2xl:right-6"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setOpen(false);
        }
      }}
    >
      <ul className="pointer-events-auto flex flex-col items-end gap-2 py-1">
        {headings.map((heading) => {
          const active = heading.id === activeId;
          return (
            <li key={heading.id} className="flex w-full justify-end">
              <button
                type="button"
                onClick={() => jump(heading.id)}
                className={cn(
                  "group flex max-w-[15rem] cursor-pointer items-center justify-end gap-2.5 text-left outline-none",
                  "transition-transform duration-[var(--dur-fast)] ease-[var(--ease-out-quart)]",
                  "hover:-translate-x-0.5 active:translate-x-0",
                )}
                aria-current={active ? "location" : undefined}
                title={heading.title}
              >
                <span
                  className={cn(
                    "min-w-0 truncate text-[12px] leading-snug",
                    "transition-[opacity,color,transform,text-shadow] duration-[var(--dur-base)] ease-[var(--ease-out-quart)]",
                    open
                      ? "translate-x-0 opacity-100"
                      : "pointer-events-none translate-x-1.5 opacity-0",
                    active
                      ? "font-medium text-fg"
                      : "text-fg-muted group-hover:text-accent",
                    heading.level === 3 && "text-[11.5px]",
                    // Soft accent wash on hover — no box, just the type.
                    "group-hover:[text-shadow:0_0_18px_color-mix(in_srgb,var(--accent)_35%,transparent)]",
                  )}
                >
                  <span className="hover-underline">{heading.title}</span>
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "block shrink-0 rounded-full transition-[width,height,background-color,box-shadow] duration-[var(--dur-base)] ease-[var(--ease-out-quart)]",
                    active
                      ? "h-[3px] w-4 bg-accent shadow-[0_0_0_3px_var(--accent-soft)]"
                      : "h-[2px] w-2.5 bg-fg-subtle/45 group-hover:w-3.5 group-hover:bg-accent/70",
                    heading.level === 3 && !active && "w-2",
                    heading.level === 3 && active && "w-3",
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
