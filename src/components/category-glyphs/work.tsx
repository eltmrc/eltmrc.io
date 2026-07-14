import { motion } from "motion/react";
import { G, type Reduce } from "./palette";

/** Briefcase: soft filled body, handle, clasp, gentle float + pink stripe pulse. */
export function WorkArt({ uid, reduce }: { uid: string; reduce: Reduce }) {
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(168,85,247,0.30)" />
          <stop offset="100%" stopColor="rgba(129,140,248,0.12)" />
        </linearGradient>
        <linearGradient id={`${uid}-lid`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(168,85,247,0.38)" />
          <stop offset="100%" stopColor="rgba(168,85,247,0.14)" />
        </linearGradient>
      </defs>

      <motion.g
        animate={reduce ? {} : { y: [0, -1.6, 0] }}
        transition={
          reduce
            ? undefined
            : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
        }
      >
        {/* handle */}
        <path
          d="M23 22 V17.5 a5 5 0 0 1 5-5 h8 a5 5 0 0 1 5 5 V22"
          stroke={G.pink}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* body */}
        <rect
          x="10"
          y="22"
          width="44"
          height="28"
          rx="7"
          fill={`url(#${uid}-body)`}
          stroke={G.violet}
          strokeOpacity="0.55"
          strokeWidth="1.4"
        />
        {/* lid seam */}
        <rect
          x="10"
          y="22"
          width="44"
          height="11"
          rx="7"
          fill={`url(#${uid}-lid)`}
        />
        <line
          x1="10"
          y1="33"
          x2="54"
          y2="33"
          stroke={G.violet}
          strokeOpacity="0.35"
          strokeWidth="1.2"
        />
        {/* pink accent stripe — opacity breathe */}
        <motion.rect
          x="10"
          y="34.5"
          width="44"
          height="4.5"
          fill={G.pink}
          animate={reduce ? { opacity: 0.45 } : { opacity: [0.22, 0.72, 0.22] }}
          transition={
            reduce
              ? undefined
              : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
          }
        />
        {/* clasp */}
        <rect
          x="28"
          y="30"
          width="8"
          height="6.5"
          rx="2"
          fill={G.amber}
          opacity="0.95"
        />
        <rect
          x="30"
          y="31.5"
          width="4"
          height="2"
          rx="1"
          fill={G.blush}
          opacity="0.85"
        />
        {/* corner studs */}
        <circle cx="16" cy="44" r="1.5" fill={G.indigo} opacity="0.55" />
        <circle cx="48" cy="44" r="1.5" fill={G.indigo} opacity="0.55" />
      </motion.g>
    </g>
  );
}
