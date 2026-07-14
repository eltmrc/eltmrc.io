import { motion } from "motion/react";
import { G, type Reduce } from "./palette";

/**
 * Soft shield with violet→pink gradient fill, lock shackle, and a checkmark
 * that draws / pulses — trust without the hard outline-icon look.
 */
export function SecurityArt({
  uid,
  reduce,
}: {
  uid: string;
  reduce: Reduce;
}) {
  const checkPath = "M23.5 33.5 l5.2 5.2 12-13.5";

  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-shield`} x1="0.2" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor="rgba(168,85,247,0.48)" />
          <stop offset="55%" stopColor="rgba(255,95,168,0.28)" />
          <stop offset="100%" stopColor="rgba(129,140,248,0.18)" />
        </linearGradient>
        <linearGradient id={`${uid}-rim`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={G.pink} />
          <stop offset="100%" stopColor={G.violet} />
        </linearGradient>
        <radialGradient id={`${uid}-sheen`} cx="35%" cy="28%" r="70%">
          <stop offset="0%" stopColor={G.blush} stopOpacity="0.65" />
          <stop offset="55%" stopColor={G.rose} stopOpacity="0.12" />
          <stop offset="100%" stopColor={G.violet} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* soft outer glow */}
      <motion.path
        d="M32 7.5 L51 16.5 v13.5c0 13.2-8.5 21.5-19 25.5C21.5 51.5 13 43.2 13 30 V16.5 L32 7.5z"
        fill={G.violet}
        opacity="0.12"
        animate={
          reduce
            ? {}
            : { scale: [1, 1.04, 1], opacity: [0.1, 0.18, 0.1] }
        }
        transition={
          reduce
            ? undefined
            : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
        }
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />

      {/* shield body */}
      <path
        d="M32 9 L49.5 17.2 v12.8c0 12-7.8 19.8-17.5 23.6C22.3 49.8 14.5 42 14.5 30 V17.2 L32 9z"
        fill={`url(#${uid}-shield)`}
        stroke={`url(#${uid}-rim)`}
        strokeWidth="1.55"
        strokeLinejoin="round"
        strokeOpacity="0.75"
      />
      {/* inner sheen */}
      <path
        d="M32 12.5 L46 19.2 v10.5c0 10-6.5 16.5-14 20 -7.5-3.5-14-10-14-20 V19.2 L32 12.5z"
        fill={`url(#${uid}-sheen)`}
      />

      {/* lock shackle */}
      <motion.path
        d="M26.5 26.5 V23.2 a5.5 5.5 0 0 1 11 0 V26.5"
        fill="none"
        stroke={G.pink}
        strokeWidth="2.2"
        strokeLinecap="round"
        animate={
          reduce
            ? {}
            : { opacity: [0.7, 1, 0.7] }
        }
        transition={
          reduce
            ? undefined
            : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
        }
      />
      {/* lock body */}
      <rect
        x="24.5"
        y="26"
        width="15"
        height="11.5"
        rx="3.2"
        fill={G.violet}
        fillOpacity="0.22"
        stroke={G.violet}
        strokeOpacity="0.55"
        strokeWidth="1.2"
      />
      <circle cx="32" cy="30.5" r="1.7" fill={G.pink} opacity="0.9" />
      <rect
        x="31.15"
        y="31.5"
        width="1.7"
        height="3.2"
        rx="0.85"
        fill={G.pink}
        opacity="0.75"
      />

      {/* checkmark — pathLength draw loop, then soft pulse */}
      <motion.path
        d={checkPath}
        fill="none"
        stroke={G.pink}
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduce ? undefined : { pathLength: 0, opacity: 0.4 }}
        animate={
          reduce
            ? { pathLength: 1, opacity: 1 }
            : {
                pathLength: [0, 1, 1, 0],
                opacity: [0.35, 1, 1, 0.35],
              }
        }
        transition={
          reduce
            ? undefined
            : {
                duration: 3.2,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.35, 0.72, 1],
              }
        }
      />
      {/* secondary soft check ghost for depth */}
      <path
        d={checkPath}
        fill="none"
        stroke={G.rose}
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.15"
      />

      {/* trust spark at crown */}
      <motion.circle
        cx="32"
        cy="9"
        r="2"
        fill={G.amber}
        animate={
          reduce
            ? { opacity: 0.85 }
            : { scale: [0.7, 1.2, 0.7], opacity: [0.4, 1, 0.4] }
        }
        transition={
          reduce
            ? undefined
            : { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
    </g>
  );
}
