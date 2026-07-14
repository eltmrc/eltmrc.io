import { motion } from "motion/react";
import { G, type Reduce } from "./palette";

/**
 * Hub-and-spoke collaboration mark: central violet disc with blush core,
 * three orbiting nodes (pink / cyan / indigo) on a rotating group,
 * soft connecting spokes — open collaboration energy.
 */
export function OpenSourceArt({
  uid,
  reduce,
}: {
  uid: string;
  reduce: Reduce;
}) {
  const nodes = [
    { cx: 32, cy: 10, r: 5.2, fill: G.pink, stroke: G.rose },
    { cx: 50.5, cy: 43, r: 4.6, fill: G.cyan, stroke: "#67e8f9" },
    { cx: 13.5, cy: 43, r: 4.6, fill: G.indigo, stroke: "#a5b4fc" },
  ] as const;

  return (
    <g>
      <defs>
        <radialGradient id={`${uid}-core`} cx="38%" cy="30%" r="80%">
          <stop offset="0%" stopColor={G.blush} />
          <stop offset="42%" stopColor={G.rose} />
          <stop offset="100%" stopColor={G.violet} />
        </radialGradient>
        <radialGradient id={`${uid}-halo`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={G.violet} stopOpacity="0.28" />
          <stop offset="100%" stopColor={G.violet} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-ring`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={G.pink} />
          <stop offset="50%" stopColor={G.violet} />
          <stop offset="100%" stopColor={G.cyan} />
        </linearGradient>
      </defs>

      {/* ambient halo */}
      <circle cx="32" cy="32" r="28" fill={`url(#${uid}-halo)`} />

      {/* dashed orbit track */}
      <circle
        cx="32"
        cy="32"
        r="22"
        stroke={`url(#${uid}-ring)`}
        strokeWidth="1.4"
        strokeDasharray="3.5 6"
        strokeLinecap="round"
        opacity="0.4"
      />

      {/* static soft spokes (under the orbit) */}
      {nodes.map((n, i) => (
        <line
          key={`spoke-${i}`}
          x1="32"
          y1="32"
          x2={n.cx}
          y2={n.cy}
          stroke={G.violet}
          strokeWidth="1.5"
          strokeOpacity="0.28"
          strokeLinecap="round"
        />
      ))}

      {/* pulses travelling outward along spokes */}
      {!reduce
        ? nodes.map((n, i) => (
            <motion.circle
              key={`pulse-${i}`}
              r="1.7"
              fill={n.fill}
              animate={{
                cx: [32, n.cx],
                cy: [32, n.cy],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
                delay: i * 0.55,
                times: [0, 0.55, 1],
              }}
            />
          ))
        : null}

      {/* orbiting nodes + their spokes as a rigid group */}
      <motion.g
        style={{ transformBox: "view-box", transformOrigin: "32px 32px" }}
        animate={reduce ? {} : { rotate: 360 }}
        transition={
          reduce
            ? undefined
            : { duration: 10, repeat: Infinity, ease: "linear" }
        }
      >
        {nodes.map((n, i) => (
          <g key={`node-${i}`}>
            <line
              x1="32"
              y1="32"
              x2={n.cx}
              y2={n.cy}
              stroke={n.fill}
              strokeWidth="1.35"
              strokeOpacity="0.45"
              strokeLinecap="round"
            />
            {/* soft node glow */}
            <circle
              cx={n.cx}
              cy={n.cy}
              r={n.r + 2.4}
              fill={n.fill}
              opacity="0.18"
            />
            <circle
              cx={n.cx}
              cy={n.cy}
              r={n.r}
              fill={n.fill}
              stroke={n.stroke}
              strokeWidth="1.1"
              strokeOpacity="0.65"
            />
            {/* highlight speck */}
            <circle
              cx={n.cx - n.r * 0.28}
              cy={n.cy - n.r * 0.32}
              r={n.r * 0.28}
              fill="#fff"
              opacity="0.75"
            />
          </g>
        ))}
      </motion.g>

      {/* central hub */}
      <circle
        cx="32"
        cy="32"
        r="13"
        fill={G.violet}
        opacity="0.16"
      />
      <motion.circle
        cx="32"
        cy="32"
        r="9.5"
        fill={`url(#${uid}-core)`}
        animate={
          reduce
            ? {}
            : { scale: [1, 1.06, 1] }
        }
        transition={
          reduce
            ? undefined
            : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
        }
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
      <circle
        cx="29.2"
        cy="29"
        r="2.3"
        fill="#fff"
        opacity="0.88"
      />

      {/* tiny freestanding collab spark */}
      <motion.path
        d="M52 14 l0.9 2.15 2.15 0.9 -2.15 0.9 -0.9 2.15 -0.9-2.15 -2.15-0.9 2.15-0.9 z"
        fill={G.amber}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        animate={
          reduce
            ? { opacity: 0.7 }
            : {
                scale: [0.5, 1.1, 0.5],
                opacity: [0.25, 1, 0.25],
                rotate: [0, 60, 120],
              }
        }
        transition={
          reduce
            ? undefined
            : { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }
      />
    </g>
  );
}
