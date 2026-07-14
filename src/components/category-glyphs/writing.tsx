import { motion } from "motion/react";
import { G, type Reduce } from "./palette";

/** Pen/nib with soft body — tip leaves a pink stroke that grows; amber tip + nudge. */
export function WritingArt({ uid, reduce }: { uid: string; reduce: Reduce }) {
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-body`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(168,85,247,0.38)" />
          <stop offset="100%" stopColor="rgba(129,140,248,0.16)" />
        </linearGradient>
        <linearGradient id={`${uid}-ink`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={G.pink} />
          <stop offset="100%" stopColor={G.rose} />
        </linearGradient>
      </defs>

      {/* written baseline (soft rail) */}
      <line
        x1="10"
        y1="50"
        x2="54"
        y2="50"
        stroke={G.violet}
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.22"
      />

      {/* pink stroke growing from the tip — pathLength or scaleX from left */}
      <motion.rect
        x="12"
        y="47.5"
        height="3.2"
        rx="1.6"
        width="30"
        fill={`url(#${uid}-ink)`}
        style={{ transformBox: "fill-box", transformOrigin: "left center" }}
        initial={reduce ? undefined : { scaleX: 0.08 }}
        animate={
          reduce
            ? { scaleX: 1, opacity: 0.85 }
            : { scaleX: [0.08, 1, 1, 0.08], opacity: [0.4, 0.95, 0.95, 0.4] }
        }
        transition={
          reduce
            ? undefined
            : {
                duration: 2.6,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.45, 0.72, 1],
              }
        }
      />

      {/* pen group — gentle nudge / write motion */}
      <motion.g
        style={{ transformBox: "view-box", transformOrigin: "30px 36px" }}
        animate={
          reduce
            ? {}
            : {
                x: [0, 1.2, 0, -0.6, 0],
                y: [0, -0.8, 0, 0.4, 0],
                rotate: [0, -3, 0, 2, 0],
              }
        }
        transition={
          reduce
            ? undefined
            : { duration: 2.6, repeat: Infinity, ease: "easeInOut" }
        }
      >
        {/* barrel */}
        <path
          d="M20 46 L42 16 l7.5 6.5 L27.5 52.5 H20 Z"
          fill={`url(#${uid}-body)`}
          stroke={G.violet}
          strokeOpacity="0.6"
          strokeWidth="1.35"
          strokeLinejoin="round"
        />
        {/* metal band */}
        <path
          d="M36.5 21.5 l6.2 5.4"
          stroke={G.pink}
          strokeWidth="2.4"
          strokeLinecap="round"
          opacity="0.85"
        />
        {/* grip stripe */}
        <path
          d="M24 42 l10 -14"
          stroke={G.indigo}
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.35"
        />
        {/* nib point */}
        <path
          d="M20 46 L18 52 L24 50 Z"
          fill={G.violet}
          opacity="0.85"
        />
        {/* amber tip highlight */}
        <motion.circle
          cx="43.5"
          cy="17"
          r="3.2"
          fill={G.amber}
          animate={
            reduce
              ? { opacity: 1 }
              : { opacity: [0.75, 1, 0.75], scale: [0.92, 1.08, 0.92] }
          }
          transition={
            reduce
              ? undefined
              : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
          }
        />
        <circle cx="42.4" cy="15.8" r="1.1" fill={G.blush} opacity="0.9" />
      </motion.g>
    </g>
  );
}
