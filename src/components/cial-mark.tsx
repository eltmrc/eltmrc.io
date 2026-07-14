import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";

/**
 * Cial bubble mark — same pink→violet squishee as cial.app footer / sidebar.
 * `alive` enables jelly + specular drift (footer uses a calm static by default).
 */
export function CialMark({
  className,
  alive = false,
}: {
  className?: string;
  alive?: boolean;
}) {
  const uid = useId().replace(/:/g, "");
  const reduced = useReducedMotion();
  const animated = alive && !reduced;

  return (
    <motion.span
      className={cn("inline-flex", className)}
      aria-hidden
      style={{ transformOrigin: "center 70%" }}
      animate={
        alive
          ? { scaleX: [1, 1.06, 0.985, 1], scaleY: [1, 0.93, 1.025, 1] }
          : { scaleX: 1, scaleY: 1 }
      }
      transition={
        alive
          ? {
              duration: 1.9,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.4, 0.72, 1],
            }
          : { type: "spring", stiffness: 300, damping: 20 }
      }
    >
      <svg
        viewBox="0 0 32 32"
        className="h-full w-full"
        aria-hidden
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id={`${uid}-body`} cx="38%" cy="30%" r="80%">
            {animated ? (
              <>
                <animate
                  attributeName="cx"
                  dur="3.6s"
                  repeatCount="indefinite"
                  calcMode="spline"
                  keyTimes="0;0.35;0.7;1"
                  keySplines="0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1"
                  values="38%;58%;32%;38%"
                />
                <animate
                  attributeName="cy"
                  dur="3.6s"
                  repeatCount="indefinite"
                  calcMode="spline"
                  keyTimes="0;0.35;0.7;1"
                  keySplines="0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1"
                  values="30%;48%;26%;30%"
                />
              </>
            ) : null}
            <stop offset="0%" stopColor="#ffe3f6" />
            <stop offset="42%" stopColor="#ff8fd0" />
            <stop offset="100%" stopColor="#a855f7" />
          </radialGradient>
          <radialGradient id={`${uid}-aura`} cx="50%" cy="50%" r="50%">
            <stop offset="55%" stopColor="#ff5fa8" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#ff5fa8" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="16" cy="16" r="15" fill={`url(#${uid}-aura)`} />
        <circle cx="16" cy="16" r="11" fill={`url(#${uid}-body)`} />
        <motion.circle
          r="2.8"
          fill="#ffffff"
          animate={
            alive
              ? {
                  cx: [12.2, 13.8, 11.2, 12.8, 12.2],
                  cy: [12, 10.9, 12.7, 11.5, 12],
                  fillOpacity: [0.9, 0.6, 1, 0.75, 0.9],
                }
              : { cx: 12.2, cy: 12, fillOpacity: 0.9 }
          }
          transition={
            alive
              ? { duration: 2.6, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.4, ease: "easeOut" }
          }
        />
      </svg>
    </motion.span>
  );
}
