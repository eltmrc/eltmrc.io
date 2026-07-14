import { motion } from "motion/react";
import { G, type Reduce } from "./palette";

/**
 * Engineering — dual soft cogs meshing (clean circles + tooth dots),
 * not a single noisy gear path. Same squishee language as cial.app pillars.
 */
export function EngineeringArt({
  uid,
  reduce,
}: {
  uid: string;
  reduce: Reduce;
}) {
  // Evenly spaced tooth positions around a center (unit circle)
  const teeth = (cx: number, cy: number, r: number, n: number, phase = 0) =>
    Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2 + phase;
      return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r };
    });

  const bigTeeth = teeth(26, 34, 16.5, 8, 0.2);
  const smallTeeth = teeth(42, 24, 11.5, 6, 0.1);

  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-big`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(168,85,247,0.42)" />
          <stop offset="100%" stopColor="rgba(129,140,248,0.18)" />
        </linearGradient>
        <linearGradient id={`${uid}-small`} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,95,168,0.38)" />
          <stop offset="100%" stopColor="rgba(168,85,247,0.2)" />
        </linearGradient>
        <radialGradient id={`${uid}-core`} cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor={G.blush} />
          <stop offset="50%" stopColor={G.rose} />
          <stop offset="100%" stopColor={G.pink} />
        </radialGradient>
      </defs>

      {/* soft floor wash */}
      <ellipse cx="32" cy="54" rx="18" ry="3.5" fill={G.violet} opacity="0.1" />

      {/* big violet cog — clockwise */}
      <motion.g
        style={{ transformBox: "view-box", transformOrigin: "26px 34px" }}
        animate={reduce ? {} : { rotate: 360 }}
        transition={
          reduce
            ? undefined
            : { duration: 10, repeat: Infinity, ease: "linear" }
        }
      >
        {bigTeeth.map((t, i) => (
          <circle
            key={`bt${i}`}
            cx={t.x}
            cy={t.y}
            r="3.4"
            fill={G.violet}
            opacity="0.55"
          />
        ))}
        <circle
          cx="26"
          cy="34"
          r="13.5"
          fill={`url(#${uid}-big)`}
          stroke={G.violet}
          strokeOpacity="0.55"
          strokeWidth="1.4"
        />
        <circle
          cx="26"
          cy="34"
          r="6.5"
          fill={G.violet}
          fillOpacity="0.15"
          stroke={G.indigo}
          strokeOpacity="0.35"
          strokeWidth="1.1"
        />
        <circle cx="26" cy="34" r="3.6" fill={`url(#${uid}-core)`} />
        <circle cx="24.6" cy="32.4" r="1.2" fill="#fff" opacity="0.75" />
      </motion.g>

      {/* small pink cog — counter-rotate so they mesh */}
      <motion.g
        style={{ transformBox: "view-box", transformOrigin: "42px 24px" }}
        animate={reduce ? {} : { rotate: -360 }}
        transition={
          reduce
            ? undefined
            : { duration: 7.5, repeat: Infinity, ease: "linear" }
        }
      >
        {smallTeeth.map((t, i) => (
          <circle
            key={`st${i}`}
            cx={t.x}
            cy={t.y}
            r="2.6"
            fill={G.pink}
            opacity="0.7"
          />
        ))}
        <circle
          cx="42"
          cy="24"
          r="9.2"
          fill={`url(#${uid}-small)`}
          stroke={G.pink}
          strokeOpacity="0.55"
          strokeWidth="1.3"
        />
        <circle cx="42" cy="24" r="3.2" fill={G.amber} opacity="0.9" />
        <circle cx="40.8" cy="22.8" r="1" fill="#fff" opacity="0.7" />
      </motion.g>

      {/* meshing spark where teeth meet */}
      <motion.circle
        cx="36"
        cy="28"
        r="2"
        fill={G.cyan}
        animate={
          reduce
            ? { opacity: 0.5 }
            : { opacity: [0.15, 0.95, 0.15], scale: [0.7, 1.15, 0.7] }
        }
        transition={
          reduce
            ? undefined
            : { duration: 1.25, repeat: Infinity, ease: "easeInOut" }
        }
      />
    </g>
  );
}
