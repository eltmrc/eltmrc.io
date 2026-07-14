/**
 * Cial bubble mark — ported from instance Sidebar/CialMark (⌘K / sidebar).
 * Idle life is pure CSS/SMIL so parent Motion trees cannot suppress it.
 * Click/type pulse + particle burst live on CialMarkInteractive.
 */
import { useId } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";

export function CialMark({
  className,
  alive,
}: {
  className?: string;
  alive?: boolean;
}) {
  const reduced = useReducedMotion();
  const animated = !!alive && !reduced;
  const uid = useId().replace(/:/g, "");
  const bodyId = `cial-mark-body-${uid}`;
  const auraId = `cial-mark-aura-${uid}`;

  return (
    <span
      className={cn("cial-mark", animated && "cial-mark--alive", className)}
      aria-hidden
    >
      <svg
        viewBox="0 0 32 32"
        className="h-full w-full"
        aria-hidden
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id={bodyId} cx="38%" cy="30%" r="80%">
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
          <radialGradient id={auraId} cx="50%" cy="50%" r="50%">
            <stop offset="55%" stopColor="#ff5fa8" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#ff5fa8" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="16" cy="16" r="15" fill={`url(#${auraId})`} />
        <circle cx="16" cy="16" r="11" fill={`url(#${bodyId})`} />
        <g className="cial-mark__highlight">
          <circle cx="12.2" cy="12" r="2.8" fill="#ffffff" />
        </g>
      </svg>
    </span>
  );
}
