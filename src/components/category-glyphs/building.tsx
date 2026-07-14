import { motion } from "motion/react";
import { G, type Reduce } from "./palette";

/** Skyline that rises: soft rounded towers with window dots. */
export function BuildingArt({ uid, reduce }: { uid: string; reduce: Reduce }) {
  const towers = [
    {
      x: 12,
      y: 28,
      w: 12,
      h: 26,
      rx: 3,
      fill: G.indigo,
      op: 0.88,
      delay: 0,
      windows: [
        { cx: 16, cy: 34 },
        { cx: 20, cy: 34 },
        { cx: 16, cy: 40 },
        { cx: 20, cy: 40 },
        { cx: 16, cy: 46 },
      ],
    },
    {
      x: 26,
      y: 18,
      w: 14,
      h: 36,
      rx: 3.5,
      fill: G.violet,
      op: 0.92,
      delay: 0.25,
      windows: [
        { cx: 30.5, cy: 26 },
        { cx: 35.5, cy: 26 },
        { cx: 30.5, cy: 33 },
        { cx: 35.5, cy: 33 },
        { cx: 30.5, cy: 40 },
        { cx: 35.5, cy: 40 },
      ],
    },
    {
      x: 42,
      y: 24,
      w: 11,
      h: 30,
      rx: 3,
      fill: G.pink,
      op: 0.88,
      delay: 0.5,
      windows: [
        { cx: 45.5, cy: 31 },
        { cx: 49.5, cy: 31 },
        { cx: 45.5, cy: 38 },
        { cx: 49.5, cy: 38 },
        { cx: 47.5, cy: 45 },
      ],
    },
  ] as const;

  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(168,85,247,0.18)" />
          <stop offset="100%" stopColor="rgba(129,140,248,0.06)" />
        </linearGradient>
        <linearGradient id={`${uid}-mid`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(168,85,247,0.32)" />
          <stop offset="100%" stopColor="rgba(255,95,168,0.14)" />
        </linearGradient>
      </defs>

      {/* soft ground / plaza */}
      <rect
        x="8"
        y="52"
        width="48"
        height="4"
        rx="2"
        fill={G.violet}
        opacity="0.18"
      />

      {/* ambient sky wash */}
      <rect
        x="10"
        y="10"
        width="44"
        height="44"
        rx="10"
        fill={`url(#${uid}-sky)`}
        opacity="0.7"
      />

      {towers.map((t, i) => (
        <motion.g
          key={i}
          style={{ transformBox: "fill-box", transformOrigin: "center bottom" }}
          animate={
            reduce
              ? {}
              : {
                  scaleY: [0.92, 1.02, 0.97, 1],
                  y: [2, -1, 0.5, 0],
                }
          }
          transition={
            reduce
              ? undefined
              : {
                  duration: 3.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: t.delay,
                  times: [0, 0.4, 0.72, 1],
                }
          }
        >
          <rect
            x={t.x}
            y={t.y}
            width={t.w}
            height={t.h}
            rx={t.rx}
            fill={t.fill}
            opacity={t.op}
          />
          {/* soft roof cap */}
          <rect
            x={t.x + 1}
            y={t.y - 2.5}
            width={t.w - 2}
            height="4"
            rx="1.5"
            fill={t.fill}
            opacity="0.55"
          />
          {t.windows.map((w, wi) => (
            <circle
              key={wi}
              cx={w.cx}
              cy={w.cy}
              r="1.35"
              fill={i === 1 ? G.blush : i === 2 ? G.amber : G.cyan}
              opacity={0.85}
            />
          ))}
        </motion.g>
      ))}

      {/* amber door on center tower */}
      <rect
        x="30.5"
        y="46"
        width="5"
        height="8"
        rx="1.2"
        fill={G.amber}
        opacity="0.9"
      />

      {/* subtle mid glow behind skyline */}
      <ellipse
        cx="33"
        cy="48"
        rx="18"
        ry="4"
        fill={`url(#${uid}-mid)`}
        opacity="0.35"
      />
    </g>
  );
}
