"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/cn";

type FadeInProps = HTMLMotionProps<"div"> & {
  delay?: number;
  y?: number;
};

/**
 * Quiet entrance — Cial-level polish without noise.
 * Respects reduced motion via CSS; spring is subtle.
 */
export function FadeIn({
  children,
  className,
  delay = 0,
  y = 12,
  ...props
}: FadeInProps) {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 380,
        damping: 28,
        mass: 0.9,
        delay,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
