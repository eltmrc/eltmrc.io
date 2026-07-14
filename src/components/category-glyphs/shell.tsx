import type { ReactNode } from "react";
import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";

type ShellProps = {
  className?: string;
  title?: string;
  children: (uid: string, reduce: boolean) => ReactNode;
};

/**
 * Cial-style glyph shell: jelly squash on the whole mark (always on, unless
 * reduced motion). viewBox 64×64 — same scale as landing pillar art.
 */
export function GlyphShell({ className, title, children }: ShellProps) {
  const uid = useId().replace(/:/g, "");
  const reduceMotion = useReducedMotion();
  const reduce = Boolean(reduceMotion);

  return (
    <motion.span
      className={cn("cat-icon inline-flex", className)}
      style={{ transformOrigin: "center 66%" }}
      animate={
        reduce
          ? { scaleX: 1, scaleY: 1 }
          : { scaleX: [1, 1.05, 0.975, 1], scaleY: [1, 0.95, 1.03, 1] }
      }
      transition={
        reduce
          ? undefined
          : {
              duration: 2.6,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.4, 0.72, 1],
            }
      }
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <svg viewBox="0 0 64 64" className="h-full w-full" fill="none">
        {children(uid, reduce)}
      </svg>
    </motion.span>
  );
}
