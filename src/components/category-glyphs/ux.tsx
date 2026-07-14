import { motion } from "motion/react";
import { G, type Reduce } from "./palette";

/** Soft device/frame mini UI kit — circle + square controls pulse / cross-fade. */
export function UxArt({ uid, reduce }: { uid: string; reduce: Reduce }) {
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(168,85,247,0.28)" />
          <stop offset="100%" stopColor="rgba(129,140,248,0.12)" />
        </linearGradient>
        <linearGradient id={`${uid}-chrome`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(168,85,247,0.32)" />
          <stop offset="100%" stopColor="rgba(168,85,247,0.08)" />
        </linearGradient>
      </defs>

      {/* device frame */}
      <rect
        x="11"
        y="12"
        width="42"
        height="40"
        rx="9"
        fill={`url(#${uid}-body)`}
        stroke={G.violet}
        strokeOpacity="0.55"
        strokeWidth="1.4"
      />
      {/* top chrome bar */}
      <rect
        x="11"
        y="12"
        width="42"
        height="9"
        rx="9"
        fill={`url(#${uid}-chrome)`}
      />
      <rect x="11" y="18" width="42" height="3" fill={`url(#${uid}-chrome)`} />
      {/* window dots */}
      <circle cx="17.5" cy="17" r="1.5" fill={G.pink} />
      <circle cx="22.5" cy="17" r="1.5" fill={G.indigo} opacity="0.75" />
      <circle cx="27.5" cy="17" r="1.5" fill={G.cyan} opacity="0.65" />

      {/* interactive circle button — pulse */}
      <motion.circle
        cx="24"
        cy="32"
        r="6.2"
        fill={G.pink}
        fillOpacity="0.22"
        stroke={G.pink}
        strokeWidth="1.4"
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        animate={
          reduce
            ? { scale: 1, opacity: 1 }
            : { scale: [1, 1.12, 1], opacity: [0.75, 1, 0.75] }
        }
        transition={
          reduce
            ? undefined
            : { duration: 1.9, repeat: Infinity, ease: "easeInOut" }
        }
      />
      <motion.circle
        cx="24"
        cy="32"
        r="3.4"
        fill={G.pink}
        animate={
          reduce
            ? {}
            : { scale: [1, 0.88, 1], opacity: [0.95, 0.7, 0.95] }
        }
        transition={
          reduce
            ? undefined
            : { duration: 1.9, repeat: Infinity, ease: "easeInOut" }
        }
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />

      {/* square control — cross-fade with alternate state */}
      <motion.rect
        x="35"
        y="26.5"
        width="12"
        height="11"
        rx="3.2"
        fill={G.indigo}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        animate={
          reduce
            ? { opacity: 0.9, scale: 1 }
            : {
                opacity: [0.9, 0.25, 0.9],
                scale: [1, 0.94, 1],
              }
        }
        transition={
          reduce
            ? undefined
            : {
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.5, 1],
              }
        }
      />
      {/* alternate square (cyan) cross-fades in opposite phase */}
      <motion.rect
        x="35"
        y="26.5"
        width="12"
        height="11"
        rx="3.2"
        fill={G.cyan}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        animate={
          reduce
            ? { opacity: 0 }
            : {
                opacity: [0.15, 0.9, 0.15],
                scale: [0.94, 1, 0.94],
              }
        }
        transition={
          reduce
            ? undefined
            : {
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.5, 1],
              }
        }
      />
      {/* square inner glyph */}
      <rect
        x="38"
        y="30"
        width="6"
        height="2.2"
        rx="1.1"
        fill={G.blush}
        opacity="0.85"
      />

      {/* bottom bar controls */}
      <rect
        x="17"
        y="43"
        width="11"
        height="3.4"
        rx="1.7"
        fill={G.cyan}
        opacity="0.75"
      />
      <motion.rect
        x="31"
        y="43"
        width="16"
        height="3.4"
        rx="1.7"
        fill={G.violet}
        animate={reduce ? { opacity: 0.5 } : { opacity: [0.35, 0.7, 0.35] }}
        transition={
          reduce
            ? undefined
            : { duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.35 }
        }
      />
    </g>
  );
}
