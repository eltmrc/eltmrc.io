import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";

type RotatingDropProps = {
  phrases: readonly string[];
  /** ms between swaps (default 2400) */
  intervalMs?: number;
  className?: string;
};

/**
 * One phrase at a time: current drops out, next drops in.
 * Width stays roughly stable via the longest phrase as an invisible sizer.
 */
export function RotatingDrop({
  phrases,
  intervalMs = 2400,
  className,
}: RotatingDropProps) {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (phrases.length < 2 || reduce) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % phrases.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [phrases.length, intervalMs, reduce]);

  const longest = phrases.reduce((a, b) => (a.length >= b.length ? a : b), "");
  const current = phrases[index] ?? phrases[0] ?? "";

  // Always one line — phrases must be short enough for the layout width.
  if (reduce || phrases.length < 2) {
    return (
      <span className={cn("inline whitespace-nowrap", className)}>
        {current}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "rotating-drop relative inline-grid max-w-full align-baseline",
        className,
      )}
    >
      {/* Reserve width for the longest phrase so the line doesn't jump */}
      <span
        className="invisible col-start-1 row-start-1 whitespace-nowrap"
        aria-hidden
      >
        {longest}
      </span>
      <span className="relative col-start-1 row-start-1 inline-flex overflow-hidden whitespace-nowrap">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={current}
            className="inline-block whitespace-nowrap"
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-110%", opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {current}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}
