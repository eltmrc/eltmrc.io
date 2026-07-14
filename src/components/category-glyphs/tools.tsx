import { motion } from "motion/react";
import { G, type Reduce } from "./palette";

/**
 * Tools — open kit: soft tray + screwdriver + hex bolt.
 * Clean geometric shapes instead of a messy wrench silhouette.
 */
export function ToolsArt({ uid, reduce }: { uid: string; reduce: Reduce }) {
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-tray`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(168,85,247,0.3)" />
          <stop offset="100%" stopColor="rgba(129,140,248,0.12)" />
        </linearGradient>
        <linearGradient id={`${uid}-shaft`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={G.indigo} />
          <stop offset="100%" stopColor={G.violet} />
        </linearGradient>
        <radialGradient id={`${uid}-bolt`} cx="38%" cy="32%" r="70%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="55%" stopColor={G.amber} />
          <stop offset="100%" stopColor="#d97706" />
        </radialGradient>
        <linearGradient id={`${uid}-grip`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={G.rose} />
          <stop offset="100%" stopColor={G.pink} />
        </linearGradient>
      </defs>

      {/* soft tray / kit body */}
      <rect
        x="10"
        y="18"
        width="44"
        height="32"
        rx="9"
        fill={`url(#${uid}-tray)`}
        stroke={G.violet}
        strokeOpacity="0.5"
        strokeWidth="1.4"
      />
      {/* tray lip */}
      <rect
        x="10"
        y="18"
        width="44"
        height="9"
        rx="9"
        fill={G.violet}
        fillOpacity="0.14"
      />
      <circle cx="16.5" cy="22.5" r="1.5" fill={G.pink} />
      <circle cx="21.5" cy="22.5" r="1.5" fill={G.indigo} opacity="0.75" />
      <circle cx="26.5" cy="22.5" r="1.5" fill={G.cyan} opacity="0.55" />

      {/* hex bolt — left, gentle spin */}
      <motion.g
        style={{ transformBox: "view-box", transformOrigin: "22px 40px" }}
        animate={reduce ? {} : { rotate: [0, 12, -8, 0] }}
        transition={
          reduce
            ? undefined
            : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <circle
          cx="22"
          cy="40"
          r="8"
          fill={`url(#${uid}-bolt)`}
          stroke={G.amber}
          strokeOpacity="0.45"
          strokeWidth="1"
        />
        {/* hex face */}
        <path
          d="M22 34.4 L26.2 36.8 V41.6 L22 44 L17.8 41.6 V36.8 Z"
          fill="#fff"
          opacity="0.28"
        />
        <circle cx="20.6" cy="38.2" r="1.4" fill="#fff" opacity="0.55" />
      </motion.g>

      {/* screwdriver — right, soft nudge */}
      <motion.g
        style={{ transformBox: "view-box", transformOrigin: "42px 38px" }}
        animate={
          reduce
            ? {}
            : { y: [0, -1.5, 0], rotate: [8, 4, 8] }
        }
        transition={
          reduce
            ? undefined
            : { duration: 2.6, repeat: Infinity, ease: "easeInOut" }
        }
      >
        {/* shaft */}
        <rect
          x="40"
          y="30"
          width="4"
          height="18"
          rx="2"
          fill={`url(#${uid}-shaft)`}
          transform="rotate(-28 42 39)"
        />
        {/* grip */}
        <rect
          x="36.5"
          y="42"
          width="7"
          height="11"
          rx="3.2"
          fill={`url(#${uid}-grip)`}
          transform="rotate(-28 40 47.5)"
        />
        {/* tip */}
        <path
          d="M46.5 28.5 L49 25.2 L50.2 28.8 Z"
          fill={G.cyan}
          opacity="0.95"
          transform="rotate(-28 48 27)"
        />
        {/* grip rings */}
        <rect
          x="37.5"
          y="45"
          width="5"
          height="1.4"
          rx="0.7"
          fill="#fff"
          opacity="0.25"
          transform="rotate(-28 40 45.7)"
        />
      </motion.g>

      {/* tiny spark when tools "work" */}
      <motion.path
        d="M34 32 l0.9 2.2 2.2 0.9 -2.2 0.9 -0.9 2.2 -0.9-2.2 -2.2-0.9 2.2-0.9 z"
        fill={G.amber}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        animate={
          reduce
            ? { opacity: 0.35 }
            : { scale: [0, 1.15, 0], opacity: [0, 1, 0], rotate: [0, 60, 120] }
        }
        transition={
          reduce
            ? undefined
            : { duration: 2.6, repeat: Infinity, ease: "easeInOut", times: [0, 0.45, 1] }
        }
      />
    </g>
  );
}
