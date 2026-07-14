import { motion } from "motion/react";
import { G, type Reduce } from "./palette";

/**
 * Mountain peak + flag mast with Cial bubble core (blush→rose→violet).
 * Gentle bob; soft shadow base.
 */
export function FoundingArt({ uid, reduce }: { uid: string; reduce: Reduce }) {
  return (
    <g>
      <defs>
        <radialGradient id={`${uid}-core`} cx="38%" cy="30%" r="80%">
          <stop offset="0%" stopColor={G.blush} />
          <stop offset="42%" stopColor={G.rose} />
          <stop offset="100%" stopColor={G.violet} />
        </radialGradient>
        <linearGradient id={`${uid}-peak`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,95,168,0.55)" />
          <stop offset="55%" stopColor="rgba(168,85,247,0.28)" />
          <stop offset="100%" stopColor="rgba(129,140,248,0.12)" />
        </linearGradient>
        <linearGradient id={`${uid}-flag`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={G.pink} />
          <stop offset="100%" stopColor={G.violet} />
        </linearGradient>
        <linearGradient id={`${uid}-base`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(129,140,248,0.35)" />
          <stop offset="100%" stopColor="rgba(168,85,247,0.12)" />
        </linearGradient>
      </defs>

      {/* soft shadow base */}
      <ellipse cx="32" cy="56" rx="18" ry="3.4" fill={G.violet} opacity="0.14" />

      <motion.g
        style={{ transformBox: "view-box", transformOrigin: "32px 48px" }}
        animate={
          reduce
            ? {}
            : { y: [0, -1.6, 0.4, 0], rotate: [0, -0.8, 0.5, 0] }
        }
        transition={
          reduce
            ? undefined
            : {
                duration: 3.2,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.4, 0.75, 1],
              }
        }
      >
        {/* mountain body */}
        <path
          d="M10 52
             L24 30
             L32 40
             L42 22
             L54 52
             Z"
          fill={`url(#${uid}-base)`}
          stroke={G.violet}
          strokeOpacity="0.4"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />

        {/* sunlit face of peak */}
        <path
          d="M32 40 L42 22 L48 40 Z"
          fill={`url(#${uid}-peak)`}
          opacity="0.9"
        />

        {/* snow cap accent */}
        <path
          d="M39.5 27 L42 22 L44.8 28.5 Z"
          fill={G.blush}
          opacity="0.75"
        />

        {/* mast */}
        <rect
          x="31.1"
          y="8"
          width="1.8"
          height="22"
          rx="0.9"
          fill={G.indigo}
          opacity="0.85"
        />

        {/* flag — soft filled, not a line */}
        <motion.path
          d="M33 9.5
             L48 13.5
             L33 18.5
             Z"
          fill={`url(#${uid}-flag)`}
          opacity="0.92"
          animate={
            reduce
              ? {}
              : {
                  d: [
                    "M33 9.5 L48 13.5 L33 18.5 Z",
                    "M33 9.5 L47 12.2 L33 18.5 Z",
                    "M33 9.5 L48.5 14.2 L33 18.5 Z",
                    "M33 9.5 L48 13.5 L33 18.5 Z",
                  ],
                }
          }
          transition={
            reduce
              ? undefined
              : { duration: 2.6, repeat: Infinity, ease: "easeInOut" }
          }
        />
        <path
          d="M34.2 12.2 L42 13.6 L34.2 15.4 Z"
          fill="#fff"
          opacity="0.18"
        />

        {/* Cial bubble core at summit */}
        <circle cx="32" cy="7.5" r="6.2" fill={`url(#${uid}-core)`} opacity="0.22" />
        <circle cx="32" cy="7.5" r="4.6" fill={`url(#${uid}-core)`} />
        <motion.circle
          cx="30.4"
          cy="6"
          r="1.45"
          fill="#fff"
          animate={reduce ? {} : { opacity: [0.9, 0.55, 0.9] }}
          transition={
            reduce
              ? undefined
              : { duration: 2.6, repeat: Infinity, ease: "easeInOut" }
          }
        />
      </motion.g>
    </g>
  );
}
