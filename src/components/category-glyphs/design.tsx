import { motion } from "motion/react";
import { G, type Reduce } from "./palette";

/** Color wheel / palette: rotating dashed ring + orbiting swatches. */
export function DesignArt({ uid, reduce }: { uid: string; reduce: Reduce }) {
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-ring`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={G.pink} />
          <stop offset="100%" stopColor={G.violet} />
        </linearGradient>
        <radialGradient id={`${uid}-core`} cx="38%" cy="30%" r="80%">
          <stop offset="0%" stopColor={G.blush} />
          <stop offset="45%" stopColor={G.rose} />
          <stop offset="100%" stopColor={G.violet} />
        </radialGradient>
        <linearGradient id={`${uid}-disc`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(168,85,247,0.28)" />
          <stop offset="100%" stopColor="rgba(255,95,168,0.12)" />
        </linearGradient>
      </defs>

      {/* outer rotating dashed pink→violet ring */}
      <motion.g
        style={{ transformBox: "view-box", transformOrigin: "32px 32px" }}
        animate={reduce ? {} : { rotate: 360 }}
        transition={
          reduce
            ? undefined
            : { duration: 10, repeat: Infinity, ease: "linear" }
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
      </motion.g>

      {/* reverse-orbit satellite color dots */}
      <motion.g
        style={{ transformBox: "view-box", transformOrigin: "32px 32px" }}
        animate={reduce ? {} : { rotate: -360 }}
        transition={
          reduce
            ? undefined
            : { duration: 8, repeat: Infinity, ease: "linear" }
        }
      >
        <circle cx="32" cy="8" r="3.2" fill={G.pink} />
        <circle cx="52" cy="42" r="2.6" fill={G.indigo} />
        <circle cx="12" cy="42" r="2.6" fill={G.cyan} />
      </motion.g>

      {/* soft mid disc */}
      <circle
        cx="32"
        cy="32"
        r="14"
        fill={`url(#${uid}-disc)`}
        stroke={G.violet}
        strokeOpacity="0.4"
        strokeWidth="1.3"
      />

      {/* center soft disc with Cial-like gradient */}
      <circle cx="32" cy="32" r="9" fill={`url(#${uid}-core)`} />
      <motion.circle
        cx="29.2"
        cy="29"
        r="2.2"
        fill="#fff"
        animate={reduce ? {} : { opacity: [0.9, 0.55, 0.9] }}
        transition={
          reduce
            ? undefined
            : { duration: 2.6, repeat: Infinity, ease: "easeInOut" }
        }
      />

      {/* tiny amber accent chip on the palette */}
      <motion.rect
        x="38"
        y="36"
        width="5"
        height="5"
        rx="1.4"
        fill={G.amber}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        animate={reduce ? {} : { scale: [1, 1.12, 1], rotate: [0, 8, 0] }}
        transition={
          reduce
            ? undefined
            : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
        }
      />
    </g>
  );
}
