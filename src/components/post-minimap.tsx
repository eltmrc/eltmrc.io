import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import type { TocHeading } from "@/lib/headings";

type PostMinimapProps = {
  headings: TocHeading[];
};

/**
 * Notion-style document outline: a thin column of bars on the right edge.
 * Hover expands labels; click jumps to the section. Active section tracks
 * scroll. Desktop-only — not enough room beside max-w-2xl under xl.
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

      // Honor deep-link hash once headings exist.
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

          // Prefer the topmost heading currently in the observation band.
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
          // Band around the upper third of the viewport — matches "where am I reading".
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
    // Keep the hash out of the history stack so back still leaves the post.
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
      <div
        className={cn(
          "pointer-events-auto flex flex-col items-end gap-1.5 rounded-2xl py-2.5 transition-[padding,background-color,box-shadow,border-color] duration-[var(--dur-base)] ease-[var(--ease-out-quart)]",
          open
            ? "border border-border bg-[color-mix(in_srgb,var(--card-base)_92%,var(--accent-soft))] px-3 shadow-[var(--shadow-soft)] backdrop-blur-md"
            : "border border-transparent bg-transparent px-1.5",
        )}
      >
        <p
          className={cn(
            "mb-0.5 self-stretch text-[10px] font-medium uppercase tracking-[0.16em] text-fg-subtle transition-[opacity,max-height,margin] duration-[var(--dur-fast)] ease-[var(--ease-std)]",
            open
              ? "mb-1 max-h-4 opacity-100"
              : "mb-0 max-h-0 overflow-hidden opacity-0",
          )}
        >
          On this page
        </p>
        <ul className="flex flex-col items-end gap-1.5">
          {headings.map((heading) => {
            const active = heading.id === activeId;
            return (
              <li key={heading.id} className="flex w-full justify-end">
                <button
                  type="button"
                  onClick={() => jump(heading.id)}
                  className={cn(
                    "group pressable flex max-w-[14rem] items-center justify-end gap-2.5 text-left",
                    heading.level === 3 && "pr-0",
                  )}
                  aria-current={active ? "location" : undefined}
                  title={heading.title}
                >
                  <span
                    className={cn(
                      "min-w-0 truncate text-[12px] leading-snug transition-[opacity,color,transform] duration-[var(--dur-base)] ease-[var(--ease-out-quart)]",
                      open
                        ? "translate-x-0 opacity-100"
                        : "pointer-events-none translate-x-1 opacity-0",
                      active
                        ? "font-medium text-fg"
                        : "text-fg-muted group-hover:text-fg",
                      heading.level === 3 && "text-[11.5px]",
                    )}
                  >
                    {heading.title}
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      "block shrink-0 rounded-full transition-[width,height,background-color,box-shadow] duration-[var(--dur-base)] ease-[var(--ease-out-quart)]",
                      active
                        ? "h-[3px] w-4 bg-accent shadow-[0_0_0_3px_var(--accent-soft)]"
                        : "h-[2px] w-2.5 bg-fg-subtle/45 group-hover:bg-fg-muted",
                      heading.level === 3 && !active && "w-2",
                      heading.level === 3 && active && "w-3",
                    )}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
