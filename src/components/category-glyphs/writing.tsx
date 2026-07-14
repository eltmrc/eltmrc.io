import { motion } from "motion/react";
import { G, type Reduce } from "./palette";

/**
 * Writing — soft notebook page with rewriting lines + floating caret.
 * Cleaner than a polygon pen: reads as "writing" at a glance.
 */
export function WritingArt({ uid, reduce }: { uid: string; reduce: Reduce }) {
  const lines = [
    { y: 26, w: 28, c: G.violet, delay: 0 },
    { y: 32.5, w: 22, c: G.indigo, delay: 0.35 },
    { y: 39, w: 26, c: G.pink, delay: 0.7 },
    { y: 45.5, w: 16, c: G.rose, delay: 1.05 },
  ];

  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-page`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(168,85,247,0.26)" />
          <stop offset="100%" stopColor="rgba(129,140,248,0.1)" />
        </linearGradient>
        <linearGradient id={`${uid}-fold`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={G.rose} />
          <stop offset="100%" stopColor={G.pink} />
        </linearGradient>
        <radialGradient id={`${uid}-glow`} cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor={G.blush} />
          <stop offset="55%" stopColor={G.rose} />
          <stop offset="100%" stopColor={G.violet} />
        </radialGradient>
      </defs>

      {/* soft page */}
      <path
        d="M14 12h28l10 10v30a5 5 0 0 1-5 5H14a5 5 0 0 1-5-5V17a5 5 0 0 1 5-5z"
        fill={`url(#${uid}-page)`}
        stroke={G.violet}
        strokeOpacity="0.5"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />

      {/* dog-ear fold */}
      <path
        d="M42 12v10h10"
        fill={`url(#${uid}-fold)`}
        fillOpacity="0.55"
        stroke={G.pink}
        strokeOpacity="0.55"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {/* margin rule */}
      <line
        x1="18"
        y1="16"
        x2="18"
        y2="52"
        stroke={G.pink}
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.35"
      />

      {/* rewriting lines — same language as Product / SelfModifying */}
      {lines.map((l) => (
        <motion.rect
          key={l.y}
          x="21"
          y={l.y}
          height="3"
          rx="1.5"
          width={l.w}
          fill={l.c}
          opacity="0.85"
          style={{ transformBox: "fill-box", transformOrigin: "left center" }}
          initial={reduce ? undefined : { scaleX: 0.12 }}
          animate={
            reduce
              ? { scaleX: 1 }
              : { scaleX: [0.12, 1, 1, 0.12] }
          }
          transition={
            reduce
              ? undefined
              : {
                  duration: 2.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: l.delay,
                  times: [0, 0.35, 0.7, 1],
                }
          }
        />
      ))}

      {/* floating caret / cursor that tracks the writing */}
      <motion.g
        animate={
          reduce
            ? { x: 0, y: 0, opacity: 0.9 }
            : {
                x: [0, 10, 18, 6, 0],
                y: [0, 0, 6.5, 13, 19.5],
                opacity: [0.4, 1, 1, 1, 0.5],
              }
        }
        transition={
          reduce
            ? undefined
            : {
                duration: 2.8,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.25, 0.5, 0.75, 1],
              }
        }
      >
        <rect
          x="38"
          y="24"
          width="2.2"
          height="8"
          rx="1.1"
          fill={G.pink}
        />
        <circle cx="39.1" cy="22.5" r="2.4" fill={`url(#${uid}-glow)`} />
        <circle cx="38.2" cy="21.6" r="0.85" fill="#fff" opacity="0.85" />
      </motion.g>

      {/* amber insight spark */}
      <motion.path
        d="M50 18 l1 2.4 2.4 1 -2.4 1 -1 2.4 -1-2.4 -2.4-1 2.4-1 z"
        fill={G.amber}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        animate={
          reduce
            ? { opacity: 0.45 }
            : { scale: [0, 1.1, 0], opacity: [0, 1, 0], rotate: [0, 80, 160] }
        }
        transition={
          reduce
            ? undefined
            : {
                duration: 2.8,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.5, 1],
                delay: 0.4,
              }
        }
      />
    </g>
  );
}
