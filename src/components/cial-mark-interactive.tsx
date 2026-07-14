/**
 * Cial mark with jelly pulse + spark burst — ported from instance
 * Sidebar/CialMarkInteractive (⌘K mascot + sidebar brand).
 * Click (and imperative `pulse()`) fire the same effect.
 */
import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { motion, useAnimationControls, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";
import { CialMark } from "@/components/cial-mark";
import { TypeBurstLayer } from "@/components/type-burst-layer";

export type CialMarkInteractiveHandle = {
  pulse: () => void;
};

type Props = {
  readonly className?: string;
  readonly alive?: boolean;
  readonly "aria-label"?: string;
  readonly shellClassName?: string;
  readonly onClick?: (event: MouseEvent<HTMLSpanElement>) => void;
  readonly portalBurst?: boolean;
  readonly burstScale?: number;
  readonly children?: ReactNode;
  /** When true, mark is a button-like interactive; when false, still can pulse via ref */
  readonly interactive?: boolean;
};

const PULSE_PRESETS: Array<{
  scaleX: number[];
  scaleY: number[];
  y: number[];
  rotate: number[];
}> = [
  {
    scaleX: [1, 1.14, 0.92, 1.05, 1],
    scaleY: [1, 0.88, 1.1, 0.97, 1],
    y: [0, -5, 1, -1, 0],
    rotate: [0, -2, 1.5, -0.5, 0],
  },
  {
    scaleX: [1, 1.1, 0.94, 1.03, 1],
    scaleY: [1, 0.9, 1.08, 0.98, 1],
    y: [0, -4, 0.5, 0, 0],
    rotate: [0, -6, 2, -1, 0],
  },
  {
    scaleX: [1, 1.1, 0.94, 1.03, 1],
    scaleY: [1, 0.9, 1.08, 0.98, 1],
    y: [0, -4, 0.5, 0, 0],
    rotate: [0, 6, -2, 1, 0],
  },
  {
    scaleX: [1, 1.18, 0.88, 1.06, 1],
    scaleY: [1, 0.84, 1.14, 0.96, 1],
    y: [0, -6, 2, -0.5, 0],
    rotate: [0, 1, -1.5, 0.5, 0],
  },
  {
    scaleX: [1, 1.08, 0.96, 1.02, 1],
    scaleY: [1, 0.92, 1.06, 0.99, 1],
    y: [0, -3, 0, 0, 0],
    rotate: [0, -3, 2, 0, 0],
  },
];

export const CialMarkInteractive = forwardRef<CialMarkInteractiveHandle, Props>(
  function CialMarkInteractive(
    {
      className,
      alive = true,
      shellClassName,
      onClick,
      portalBurst = true,
      burstScale = 1,
      "aria-label": ariaLabel,
      interactive = true,
    },
    ref,
  ) {
    const mascotPulse = useAnimationControls();
    const preferReducedMotion = useReducedMotion();
    const [burstTick, setBurstTick] = useState(0);
    const pulseIdxRef = useRef(0);
    const shellRef = useRef<HTMLSpanElement>(null);

    function pulse() {
      if (preferReducedMotion) return;
      setBurstTick((n) => n + 1);
      const idx = pulseIdxRef.current % PULSE_PRESETS.length;
      pulseIdxRef.current += 1;
      const p = PULSE_PRESETS[idx]!;
      void mascotPulse.start({
        scaleX: p.scaleX,
        scaleY: p.scaleY,
        y: p.y,
        rotate: p.rotate,
        transition: {
          duration: 0.34 + (idx % 3) * 0.03,
          ease: [0.22, 1, 0.36, 1],
          times: [0, 0.2, 0.45, 0.72, 1],
        },
      });
    }

    useImperativeHandle(ref, () => ({ pulse }), [preferReducedMotion]);

    return (
      <span
        ref={shellRef}
        className={cn("cial-mark-interactive", shellClassName)}
        role="img"
        tabIndex={interactive ? 0 : undefined}
        aria-label={ariaLabel ?? "Cial"}
        onClick={(event) => {
          if (!interactive) return;
          pulse();
          onClick?.(event);
        }}
        onKeyDown={(event) => {
          if (!interactive) return;
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            pulse();
          }
        }}
      >
        <TypeBurstLayer
          tick={burstTick}
          portal={portalBurst}
          anchorRef={shellRef}
          scale={burstScale}
        />
        <motion.span
          className="cial-mark-interactive__pulse"
          animate={mascotPulse}
          style={{ transformOrigin: "center 70%", display: "inline-flex" }}
        >
          <CialMark className={className} alive={alive} />
        </motion.span>
      </span>
    );
  },
);
