import { motion } from "motion/react";
import { G, type Reduce } from "./palette";

/** Soft wrench with amber bolt head and pink tip accent — gentle nudge/rotate. */
export function ToolsArt({ uid, reduce }: { uid: string; reduce: Reduce }) {
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(168,85,247,0.42)" />
          <stop offset="100%" stopColor="rgba(129,140,248,0.14)" />
        </linearGradient>
        <radialGradient id={`${uid}-bolt`} cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="55%" stopColor={G.amber} />
          <stop offset="100%" stopColor="#d97706" />
        </radialGradient>
      </defs>

      {/* soft ground shadow */}
      <ellipse cx="32" cy="54" rx="14" ry="3.2" fill={G.violet} opacity="0.12" />

      <motion.g
        style={{ transformBox: "view-box", transformOrigin: "32px 32px" }}
        animate={
          reduce
            ? {}
            : {
                rotate: [-6, 5, -4, 0, -6],
                x: [0, 1.2, -0.6, 0, 0],
                y: [0, -0.8, 0.4, 0, 0],
              }
        }
        transition={
          reduce
            ? undefined
            : {
                duration: 3.4,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.28, 0.55, 0.78, 1],
              }
        }
      >
        {/* wrench body — filled, not a thin line icon */}
        <path
          d="M40.5 11.5
             c-5.8-1.2-11.2 2.4-12.4 8.1
             c-0.4 1.8-0.2 3.6 0.5 5.2
             L16.8 36.6
             c-1.1 1.1-1.2 2.9-0.2 4.1
             l6.6 7.8
             c1.1 1.3 3 1.4 4.2 0.3
             L39.2 36.9
             c1.5 0.6 3.2 0.8 4.9 0.5
             c5.8-1.2 9.4-6.9 8.2-12.6
             c-0.6-2.7-2.2-5-4.4-6.5
             L42.2 24.5 40.5 11.5z"
          fill={`url(#${uid}-body)`}
          stroke={G.violet}
          strokeOpacity="0.55"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />

        {/* jaw cutout / open throat */}
        <path
          d="M38.2 18.5 L42 22.4 L38.8 25.6 L35 21.7 Z"
          fill={G.violet}
          fillOpacity="0.18"
          stroke={G.violet}
          strokeOpacity="0.35"
          strokeWidth="1"
          strokeLinejoin="round"
        />

        {/* pink accent stroke along handle tip */}
        <path
          d="M19.5 41.2 L24.8 47.4"
          stroke={G.pink}
          strokeWidth="3.2"
          strokeLinecap="round"
          opacity="0.9"
        />
        <path
          d="M17.8 39.6 L20.4 42.6"
          stroke={G.rose}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.55"
        />

        {/* amber bolt head at the open jaw */}
        <circle
          cx="43.5"
          cy="17.5"
          r="5.2"
          fill={`url(#${uid}-bolt)`}
          stroke={G.amber}
          strokeOpacity="0.5"
          strokeWidth="0.8"
        />
        <circle cx="42.2" cy="16" r="1.6" fill="#fff" opacity="0.55" />

        {/* hex detail on bolt */}
        <path
          d="M43.5 14.6 L45.4 15.7 L45.4 17.9 L43.5 19 L41.6 17.9 L41.6 15.7 Z"
          fill="#fff"
          opacity="0.22"
        />
      </motion.g>
    </g>
  );
}
