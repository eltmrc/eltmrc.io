import { motion } from "motion/react";
import { G, type Reduce } from "./palette";

/** App window: traffic lights, rewriting code lines, amber spark. */
export function ProductArt({ uid, reduce }: { uid: string; reduce: Reduce }) {
  const lines = [
    { y: 29, w: 20, c: G.pink },
    { y: 34, w: 14, c: G.indigo },
    { y: 39, w: 18, c: G.violet },
  ];

  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(168,85,247,0.28)" />
          <stop offset="100%" stopColor="rgba(129,140,248,0.12)" />
        </linearGradient>
        <linearGradient id={`${uid}-ring`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={G.pink} />
          <stop offset="100%" stopColor={G.violet} />
        </linearGradient>
      </defs>

      {/* rotating redeploy ring + chevron */}
      <motion.g
        style={{ transformBox: "view-box", transformOrigin: "32px 32px" }}
        animate={reduce ? {} : { rotate: 360 }}
        transition={
          reduce
            ? undefined
            : { duration: 7, repeat: Infinity, ease: "linear" }
        }
      >
        <circle
          cx="32"
          cy="32"
          r="26"
          stroke={`url(#${uid}-ring)`}
          strokeWidth="2"
          strokeDasharray="3 7"
          strokeLinecap="round"
          opacity="0.55"
        />
        <path
          d="M32 6 l-4 3.4 m4-3.4 l4 3.4"
          stroke={G.pink}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.g>

      {/* app window */}
      <rect
        x="15"
        y="17"
        width="34"
        height="30"
        rx="6.5"
        fill={`url(#${uid}-body)`}
        stroke={G.violet}
        strokeOpacity="0.55"
        strokeWidth="1.4"
      />

      {/* traffic lights */}
      <circle cx="20.5" cy="23" r="1.6" fill={G.pink} />
      <circle cx="25" cy="23" r="1.6" fill={G.indigo} opacity="0.7" />
      <circle cx="29.5" cy="23" r="1.6" fill={G.amber} opacity="0.55" />

      {/* code lines that rewrite (scaleX, staggered) */}
      {lines.map((l, i) => (
        <motion.rect
          key={l.y}
          x="20.5"
          y={l.y}
          height="2.6"
          rx="1.3"
          fill={l.c}
          width={l.w}
          style={{ transformBox: "fill-box", transformOrigin: "left center" }}
          initial={reduce ? undefined : { scaleX: 0.15 }}
          animate={reduce ? undefined : { scaleX: [0.15, 1, 1, 0.15] }}
          transition={
            reduce
              ? undefined
              : {
                  duration: 2.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.5,
                  times: [0, 0.35, 0.7, 1],
                }
          }
        />
      ))}

      {/* amber spark that pops each cycle */}
      <motion.path
        d="M47 13 l1.2 3 3 1.2 -3 1.2 -1.2 3 -1.2-3 -3-1.2 3-1.2 z"
        fill={G.amber}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        animate={
          reduce
            ? {}
            : { scale: [0, 1.1, 0], opacity: [0, 1, 0], rotate: [0, 90, 180] }
        }
        transition={
          reduce
            ? undefined
            : {
                duration: 2.8,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.5, 1],
              }
        }
      />
    </g>
  );
}
