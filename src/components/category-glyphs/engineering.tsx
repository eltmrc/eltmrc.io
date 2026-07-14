import { motion } from "motion/react";
import { G, type Reduce } from "./palette";

/** Soft gear: rotating cog + breathing pink core with blush specular. */
export function EngineeringArt({
  uid,
  reduce,
}: {
  uid: string;
  reduce: Reduce;
}) {
  // Soft 8-tooth cog as a filled path (rounded teeth, not stroke-only)
  const cogPath =
    "M32 10c1.4 0 2.6.9 3 2.2l1.1 3.4 3.2-1.6c1.2-.6 2.7-.2 3.5.9l2.1 2.9c.8 1.1.6 2.6-.4 3.5l-2.6 2.3 2.6 2.3c1 .9 1.2 2.4.4 3.5l-2.1 2.9c-.8 1.1-2.3 1.5-3.5.9l-3.2-1.6-1.1 3.4c-.4 1.3-1.6 2.2-3 2.2h-3.6c-1.4 0-2.6-.9-3-2.2l-1.1-3.4-3.2 1.6c-1.2.6-2.7.2-3.5-.9l-2.1-2.9c-.8-1.1-.6-2.6.4-3.5l2.6-2.3-2.6-2.3c-1-.9-1.2-2.4-.4-3.5l2.1-2.9c.8-1.1 2.3-1.5 3.5-.9l3.2 1.6 1.1-3.4c.4-1.3 1.6-2.2 3-2.2H32z";

  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(168,85,247,0.38)" />
          <stop offset="100%" stopColor="rgba(129,140,248,0.16)" />
        </linearGradient>
        <radialGradient id={`${uid}-core`} cx="38%" cy="30%" r="80%">
          <stop offset="0%" stopColor={G.blush} />
          <stop offset="42%" stopColor={G.rose} />
          <stop offset="100%" stopColor={G.pink} />
        </radialGradient>
        <radialGradient id={`${uid}-halo`} cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="rgba(168,85,247,0.2)" />
          <stop offset="100%" stopColor="rgba(168,85,247,0)" />
        </radialGradient>
      </defs>

      {/* soft ambient halo */}
      <circle cx="32" cy="32" r="28" fill={`url(#${uid}-halo)`} />

      {/* rotating cog body */}
      <motion.g
        style={{ transformBox: "view-box", transformOrigin: "32px 32px" }}
        animate={reduce ? {} : { rotate: 360 }}
        transition={
          reduce
            ? undefined
            : { duration: 8, repeat: Infinity, ease: "linear" }
        }
      >
        <path
          d={cogPath}
          fill={`url(#${uid}-body)`}
          stroke={G.violet}
          strokeOpacity="0.55"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        {/* inner ring cut suggestion */}
        <circle
          cx="32"
          cy="32"
          r="14"
          fill="none"
          stroke={G.indigo}
          strokeOpacity="0.25"
          strokeWidth="1.2"
        />
      </motion.g>

      {/* soft body disc under core */}
      <circle
        cx="32"
        cy="32"
        r="11"
        fill={G.violet}
        fillOpacity="0.22"
        stroke={G.violet}
        strokeOpacity="0.35"
        strokeWidth="1.2"
      />

      {/* pink core that breathes */}
      <motion.circle
        cx="32"
        cy="32"
        r="7.2"
        fill={`url(#${uid}-core)`}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        animate={reduce ? {} : { scale: [1, 1.08, 1] }}
        transition={
          reduce
            ? undefined
            : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
        }
      />

      {/* blush specular highlight */}
      <motion.circle
        cx="29.2"
        cy="29"
        r="2.2"
        fill={G.blush}
        animate={reduce ? {} : { opacity: [0.95, 0.55, 0.95], scale: [1, 0.9, 1] }}
        transition={
          reduce
            ? undefined
            : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
        }
      />

      {/* tiny amber bolt accent */}
      <circle cx="32" cy="32" r="2" fill={G.amber} opacity="0.85" />
    </g>
  );
}
