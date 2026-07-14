import { motion } from "motion/react";
import { G, type Reduce } from "./palette";

/** Folded paper note: soft fill, pink dog-ear, two lines that rewrite (scaleX). */
export function NotesArt({ uid, reduce }: { uid: string; reduce: Reduce }) {
  const lines = [
    { y: 32, w: 22, c: G.pink },
    { y: 40, w: 15, c: G.indigo },
  ];

  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(168,85,247,0.28)" />
          <stop offset="100%" stopColor="rgba(129,140,248,0.12)" />
        </linearGradient>
        <linearGradient id={`${uid}-fold`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={G.rose} />
          <stop offset="100%" stopColor={G.pink} />
        </linearGradient>
      </defs>

      {/* paper body */}
      <path
        d="M17 11 h23 l11 11 v30 a5 5 0 0 1 -5 5 H17 a5 5 0 0 1 -5 -5 V16 a5 5 0 0 1 5 -5 z"
        fill={`url(#${uid}-body)`}
        stroke={G.violet}
        strokeOpacity="0.55"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />

      {/* dog-ear fold (pink) */}
      <path
        d="M40 11 v11 h11 Z"
        fill={`url(#${uid}-fold)`}
        opacity="0.9"
      />
      <path
        d="M40 11 v11 h11"
        stroke={G.pink}
        strokeWidth="1.2"
        strokeLinejoin="round"
        fill="none"
        opacity="0.85"
      />

      {/* soft page highlight */}
      <rect
        x="18"
        y="26"
        width="20"
        height="2"
        rx="1"
        fill={G.blush}
        opacity="0.35"
      />

      {/* writing lines that rewrite — same language as SelfModifyingArt */}
      {lines.map((l, i) => (
        <motion.rect
          key={l.y}
          x="18"
          y={l.y}
          height="2.8"
          rx="1.4"
          fill={l.c}
          width={l.w}
          style={{ transformBox: "fill-box", transformOrigin: "left center" }}
          initial={reduce ? undefined : { scaleX: 0.15 }}
          animate={
            reduce
              ? { scaleX: 1 }
              : { scaleX: [0.15, 1, 1, 0.15] }
          }
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

      {/* tiny amber spark on rewrite peak */}
      <motion.circle
        cx="44"
        cy="34"
        r="1.6"
        fill={G.amber}
        animate={
          reduce
            ? { opacity: 0 }
            : { opacity: [0, 1, 0], scale: [0.4, 1.15, 0.4] }
        }
        transition={
          reduce
            ? undefined
            : {
                duration: 2.8,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.4, 1],
              }
        }
      />
    </g>
  );
}
