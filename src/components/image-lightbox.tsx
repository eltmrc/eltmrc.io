import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";

type ImageLightboxProps = {
  open: boolean;
  src: string;
  alt?: string;
  caption?: string;
  onClose: () => void;
};

/**
 * Full-viewport image zoom. Backdrop + scale settle on the site curve;
 * Esc / backdrop click / × closes. Portaled to body for stacking.
 */
export function ImageLightbox({
  open,
  src,
  alt = "",
  caption,
  onClose,
}: ImageLightboxProps) {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          key="lightbox"
          className="image-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={caption || alt || "Image preview"}
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

          <motion.figure
            className="image-lightbox__figure"
            initial={reduce ? false : { opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, scale: 0.96, y: 8 }}
            transition={{
              duration: reduce ? 0.01 : 0.38,
              ease: [0.22, 1, 0.36, 1],
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={src}
              alt={alt}
              className={cn("image-lightbox__img")}
              draggable={false}
            />
            {caption ? (
              <figcaption className="image-lightbox__caption">
                {caption}
              </figcaption>
            ) : null}
          </motion.figure>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
