import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type FadeInProps = {
  children: ReactNode;
  className?: string;
  /** Stagger delay in seconds — overrides `index` when set */
  delay?: number;
  /** List position; applies the canonical stagger (50ms/item, capped at 7) */
  index?: number;
};

/**
 * CSS-only entrance (`.animate-fade-up` + motion tokens).
 * Content stays visible if JS fails — unlike motion
 * `initial={{ opacity: 0 }}` which can leave a blank page.
 * Reduced-motion: CSS kills the animation and forces opacity 1.
 */
export function FadeIn({ children, className, delay, index }: FadeInProps) {
  const computedDelay =
    delay !== undefined
      ? delay
      : index !== undefined
        ? 0.05 + Math.min(index, 7) * 0.05
        : 0;
  return (
    <div
      className={cn("animate-fade-up", className)}
      style={
        computedDelay > 0
          ? { animationDelay: `${computedDelay}s` }
          : undefined
      }
    >
      {children}
    </div>
  );
}
