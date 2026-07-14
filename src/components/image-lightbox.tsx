import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";

export type LightboxItem = {
  src: string;
  alt?: string;
  caption?: string;
};

type ImageLightboxProps = {
  open: boolean;
  /** Single-image mode (ignored when `items` is set). */
  src?: string;
  alt?: string;
  caption?: string;
  onClose: () => void;
  /** Gallery mode — prev/next when length > 1. */
  items?: LightboxItem[];
  index?: number;
  onIndexChange?: (index: number) => void;
};

/**
 * Full-viewport image zoom. Backdrop + scale settle on the site curve;
 * Esc / backdrop click / × closes. Arrow keys + side buttons when a
 * multi-item gallery is provided. Portaled to body for stacking.
 */
export function ImageLightbox({
  open,
  src = "",
  alt = "",
  caption,
  onClose,
  items,
  index = 0,
  onIndexChange,
}: ImageLightboxProps) {
  const reduce = useReducedMotion();
  const gallery = items && items.length > 0 ? items : null;
  const count = gallery?.length ?? 0;
  const safeIndex =
    gallery && count > 0
      ? ((index % count) + count) % count
      : 0;
  const current = gallery
    ? gallery[safeIndex]
    : { src, alt, caption };
  const showNav = Boolean(gallery && count > 1 && onIndexChange);
  const canPrev = showNav && safeIndex > 0;
  const canNext = showNav && safeIndex < count - 1;

  const go = (next: number) => {
    if (!onIndexChange || !gallery) return;
    const clamped = Math.max(0, Math.min(count - 1, next));
    if (clamped !== safeIndex) onIndexChange(clamped);
  };

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (!showNav) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(safeIndex - 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        go(safeIndex + 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- go closes over index
  }, [open, onClose, showNav, safeIndex, count]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && current.src ? (
        <motion.div
          key="lightbox"
          className="image-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={current.caption || current.alt || "Image preview"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: reduce ? 0.01 : 0.28,
            ease: [0.22, 1, 0.36, 1],
          }}
          onClick={onClose}
        >
          <button
            type="button"
            className="image-lightbox__close pressable"
            aria-label="Close"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          {canPrev ? (
            <button
              type="button"
              className="image-lightbox__nav image-lightbox__nav--prev"
              aria-label="Previous image"
              onClick={(e) => {
                e.stopPropagation();
                go(safeIndex - 1);
              }}
            >
              <Chevron dir="left" />
            </button>
          ) : null}

          {canNext ? (
            <button
              type="button"
              className="image-lightbox__nav image-lightbox__nav--next"
              aria-label="Next image"
              onClick={(e) => {
                e.stopPropagation();
                go(safeIndex + 1);
              }}
            >
              <Chevron dir="right" />
            </button>
          ) : null}

          <motion.figure
            key={current.src}
            className="image-lightbox__figure"
            initial={reduce ? false : { opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, scale: 0.97, y: 6 }}
            transition={{
              duration: reduce ? 0.01 : 0.32,
              ease: [0.22, 1, 0.36, 1],
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={current.src}
              alt={current.alt ?? ""}
              className={cn("image-lightbox__img")}
              draggable={false}
            />
            {current.caption || showNav ? (
              <figcaption className="image-lightbox__caption">
                {current.caption ? <span>{current.caption}</span> : null}
                {showNav ? (
                  <span className="image-lightbox__count" aria-hidden>
                    {safeIndex + 1} / {count}
                  </span>
                ) : null}
              </figcaption>
            ) : null}
          </motion.figure>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {dir === "left" ? (
        <path d="M14.5 6.5 9 12l5.5 5.5" />
      ) : (
        <path d="M9.5 6.5 15 12l-5.5 5.5" />
      )}
    </svg>
  );
}
