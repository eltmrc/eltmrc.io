import { motion } from "motion/react";
import { G, type Reduce } from "./palette";

/**
 * Soft metrics card with a rising sparkline. Pink polyline draws via
 * pathLength; amber peak node pulses; gauge tick rises behind the chart.
 */
export function PerformanceArt({
  uid,
  reduce,
}: {
  uid: string;
  reduce: Reduce;
}) {
  const spark = "M13 44 L22 34 L28 38 L36 22 L44 30 L51 16";
  const peak = { x: 51, y: 16 };

  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-card`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(168,85,247,0.32)" />
          <stop offset="100%" stopColor="rgba(129,140,248,0.12)" />
        </linearGradient>
        <linearGradient id={`${uid}-fill`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={G.pink} stopOpacity="0" />
          <stop offset="100%" stopColor={G.pink} stopOpacity="0.28" />
        </linearGradient>
        <linearGradient id={`${uid}-line`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={G.indigo} />
          <stop offset="55%" stopColor={G.pink} />
          <stop offset="100%" stopColor={G.amber} />
        </linearGradient>
        <linearGradient id={`${uid}-bar`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={G.violet} stopOpacity="0.15" />
          <stop offset="100%" stopColor={G.pink} stopOpacity="0.55" />
        </linearGradient>
      </defs>

      {/* soft card body */}
      <rect
        x="7"
        y="10"
        width="50"
        height="44"
        rx="10"
        fill={`url(#${uid}-card)`}
        stroke={G.violet}
        strokeOpacity="0.45"
        strokeWidth="1.35"
      />
      {/* top chrome dots */}
      <circle cx="14" cy="17.5" r="1.55" fill={G.pink} />
      <circle cx="19" cy="17.5" r="1.55" fill={G.indigo} opacity="0.75" />
      <circle cx="24" cy="17.5" r="1.55" fill={G.violet} opacity="0.5" />

      {/* subtle grid lines */}
      {[28, 36, 44].map((y) => (
        <line
          key={y}
          x1="12"
          y1={y}
          x2="52"
          y2={y}
          stroke={G.violet}
          strokeOpacity="0.12"
          strokeWidth="1"
          strokeDasharray="2 3"
        />
      ))}

      {/* mini rising bars (left of sparkline) */}
      {(
        [
          { x: 12, h: 8, d: 0 },
          { x: 17.5, h: 12, d: 0.15 },
          { x: 23, h: 16, d: 0.3 },
        ] as const
      ).map((b) => (
        <motion.rect
          key={b.x}
          x={b.x}
          width="3.6"
          rx="1.6"
          fill={`url(#${uid}-bar)`}
          style={{ transformBox: "fill-box", transformOrigin: "center bottom" }}
          // anchor from bottom of chart area (y=48)
          y={48 - b.h}
          height={b.h}
          animate={
            reduce
              ? undefined
              : {
                  scaleY: [0.55, 1, 0.75, 1],
                  opacity: [0.55, 1, 0.75, 1],
                }
          }
          transition={
            reduce
              ? undefined
              : {
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: b.d,
                }
          }
        />
      ))}

      {/* area under sparkline (soft fill) */}
      <motion.path
        d={`${spark} L51 48 L13 48 Z`}
        fill={`url(#${uid}-fill)`}
        animate={
          reduce
            ? { opacity: 0.7 }
            : { opacity: [0.35, 0.75, 0.35] }
        }
        transition={
          reduce
            ? undefined
            : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
        }
      />

      {/* sparkline stroke — pathLength draw */}
      <motion.path
        d={spark}
        fill="none"
        stroke={`url(#${uid}-line)`}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduce ? undefined : { pathLength: 0 }}
        animate={
          reduce
            ? { pathLength: 1 }
            : { pathLength: [0, 1, 1, 0.15] }
        }
        transition={
          reduce
            ? undefined
            : {
                duration: 3.2,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.4, 0.72, 1],
              }
        }
      />

      {/* intermediate nodes */}
      {(
        [
          { x: 22, y: 34, c: G.indigo },
          { x: 28, y: 38, c: G.pink },
          { x: 36, y: 22, c: G.rose },
          { x: 44, y: 30, c: G.pink },
        ] as const
      ).map((p, i) => (
        <motion.circle
          key={`${p.x}-${p.y}`}
          cx={p.x}
          cy={p.y}
          r="2"
          fill={p.c}
          animate={
            reduce
              ? { opacity: 0.85 }
              : { opacity: [0.3, 1, 1, 0.3], scale: [0.6, 1, 1, 0.6] }
          }
          transition={
            reduce
              ? undefined
              : {
                  duration: 3.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.12 * i,
                  times: [0, 0.35, 0.72, 1],
                }
          }
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
      ))}

      {/* amber peak — hero pulse */}
      <motion.circle
        cx={peak.x}
        cy={peak.y}
        r="5.5"
        fill={G.amber}
        opacity="0.2"
        animate={
          reduce
            ? {}
            : { scale: [0.8, 1.35, 0.8], opacity: [0.12, 0.32, 0.12] }
        }
        transition={
          reduce
            ? undefined
            : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
        }
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
      <motion.circle
        cx={peak.x}
        cy={peak.y}
        r="3.1"
        fill={G.amber}
        stroke="#fde68a"
        strokeWidth="1"
        animate={
          reduce
            ? {}
            : { scale: [1, 1.18, 1] }
        }
        transition={
          reduce
            ? undefined
            : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
        }
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
      <circle
        cx={peak.x - 0.7}
        cy={peak.y - 0.8}
        r="0.9"
        fill="#fff"
        opacity="0.85"
      />

      {/* tiny % badge top-right */}
      <motion.g
        animate={
          reduce
            ? {}
            : { y: [0, -1.2, 0] }
        }
        transition={
          reduce
            ? undefined
            : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <rect
          x="40"
          y="12"
          width="13"
          height="7"
          rx="3.5"
          fill={G.pink}
          fillOpacity="0.22"
          stroke={G.pink}
          strokeOpacity="0.55"
          strokeWidth="1"
        />
        <path
          d="M43.2 16.2 l1.6-2.4 1.5 1.4 2.2-2.6"
          fill="none"
          stroke={G.pink}
          strokeWidth="1.15"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.g>
    </g>
  );
}
