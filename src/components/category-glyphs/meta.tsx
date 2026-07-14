import { motion } from "motion/react";
import { G, type Reduce } from "./palette";

/**
 * Meta / brand-adjacent: recursive rings + rotating dashed pink→violet orbit,
 * Cial bubble core (blush→rose→violet) with specular opacity breathe.
 */
export function MetaArt({ uid, reduce }: { uid: string; reduce: Reduce }) {
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-ring`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={G.pink} />
          <stop offset="100%" stopColor={G.violet} />
        </linearGradient>
        <radialGradient id={`${uid}-core`} cx="38%" cy="30%" r="80%">
          <stop offset="0%" stopColor={G.blush} />
          <stop offset="42%" stopColor={G.rose} />
          <stop offset="100%" stopColor={G.violet} />
        </radialGradient>
      </defs>

      {/* outer dashed orbit — rotates */}
      <motion.g
        style={{ transformBox: "view-box", transformOrigin: "32px 32px" }}
        animate={reduce ? {} : { rotate: 360 }}
        transition={
          reduce
            ? undefined
            : { duration: 8, repeat: Infinity, ease: "linear" }
        }
      >
        <circle
          cx="32"
          cy="32"
          r="25"
          stroke={`url(#${uid}-ring)`}
          strokeWidth="2"
          strokeDasharray="4 7"
          strokeLinecap="round"
          opacity="0.55"
        />
        {/* rider dots on the orbit */}
        <circle cx="32" cy="7" r="2.3" fill={G.pink} />
        <circle cx="54" cy="40" r="1.8" fill={G.indigo} opacity="0.85" />
      </motion.g>

      {/* counter-rotating inner dashed ring */}
      <motion.g
        style={{ transformBox: "view-box", transformOrigin: "32px 32px" }}
        animate={reduce ? {} : { rotate: -360 }}
        transition={
          reduce
            ? undefined
            : { duration: 11, repeat: Infinity, ease: "linear" }
        }
      >
        <circle
          cx="32"
          cy="32"
          r="18"
          stroke={G.indigo}
          strokeWidth="1.4"
          strokeDasharray="3 6"
          strokeLinecap="round"
          opacity="0.4"
        />
        <circle cx="32" cy="14" r="1.6" fill={G.cyan} opacity="0.9" />
      </motion.g>

      {/* soft latitude ellipse (globe hint) */}
      <ellipse
        cx="32"
        cy="32"
        rx="12"
        ry="20"
        stroke={G.violet}
        strokeWidth="1.15"
        opacity="0.28"
      />
      <ellipse
        cx="32"
        cy="32"
        rx="20"
        ry="8"
        stroke={G.pink}
        strokeWidth="1.1"
        opacity="0.22"
      />

      {/* Cial bubble core — closest to brand mark */}
      <circle cx="32" cy="32" r="11" fill={`url(#${uid}-core)`} opacity="0.22" />
      <circle cx="32" cy="32" r="8.2" fill={`url(#${uid}-core)`} />

      {/* specular highlight — opacity breathe (TrulyYoursArt language) */}
      <motion.circle
        cx="29.2"
        cy="29"
        r="2.1"
        fill="#fff"
        animate={reduce ? { opacity: 0.85 } : { opacity: [0.9, 0.55, 0.9] }}
        transition={
          reduce
            ? undefined
            : { duration: 2.6, repeat: Infinity, ease: "easeInOut" }
        }
      />
    </g>
  );
}
