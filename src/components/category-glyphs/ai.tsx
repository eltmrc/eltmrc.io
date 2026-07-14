import { motion } from "motion/react";
import { G, type Reduce } from "./palette";

/** Model-agnostic socket: orbiting satellites + cross-fading model chips. */
export function AiArt({ uid, reduce }: { uid: string; reduce: Reduce }) {
  const chips = [G.amber, G.violet];
  const N = chips.length;

  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(168,85,247,0.22)" />
          <stop offset="100%" stopColor="rgba(129,140,248,0.10)" />
        </linearGradient>
        <radialGradient id={`${uid}-glow`} cx="38%" cy="30%" r="80%">
          <stop offset="0%" stopColor={G.blush} />
          <stop offset="42%" stopColor={G.rose} />
          <stop offset="100%" stopColor={G.violet} />
        </radialGradient>
      </defs>

      {/* orbiting satellite dots */}
      <motion.g
        style={{ transformBox: "view-box", transformOrigin: "32px 32px" }}
        animate={reduce ? {} : { rotate: 360 }}
        transition={
          reduce
            ? undefined
            : { duration: 9, repeat: Infinity, ease: "linear" }
        }
      >
        <circle cx="32" cy="6.5" r="2.4" fill={G.pink} />
        <circle cx="55" cy="38" r="2" fill={G.cyan} />
        <circle cx="11" cy="40" r="2" fill={G.violet} />
      </motion.g>

      {/* soft socket body */}
      <rect
        x="17"
        y="19"
        width="30"
        height="26"
        rx="7"
        fill={`url(#${uid}-body)`}
        stroke={G.violet}
        strokeOpacity="0.5"
        strokeWidth="1.4"
      />

      {/* optional central Cial-like bubble (behind chips) */}
      <circle cx="32" cy="32" r="7" fill={`url(#${uid}-glow)`} opacity="0.18" />

      {/* model chips, cross-fading one at a time */}
      {chips.map((c, i) => (
        <motion.g
          key={c}
          animate={
            reduce
              ? { opacity: i === 0 ? 1 : 0 }
              : { opacity: [0, 1, 1, 0] }
          }
          transition={
            reduce
              ? undefined
              : {
                  duration: N * 1.1,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 1.1,
                  times: [0, 0.08, 0.25, 0.33],
                }
          }
        >
          <rect
            x="22"
            y="26"
            width="20"
            height="12"
            rx="3.5"
            fill={c}
            fillOpacity="0.16"
            stroke={c}
            strokeOpacity="0.7"
            strokeWidth="1.2"
          />
          <circle cx="27" cy="32" r="2.6" fill={c} />
          <rect
            x="31.5"
            y="29.4"
            width="8"
            height="2"
            rx="1"
            fill={c}
            opacity="0.85"
          />
          <rect
            x="31.5"
            y="33"
            width="6"
            height="2"
            rx="1"
            fill={c}
            opacity="0.5"
          />
        </motion.g>
      ))}

      {/* socket prongs */}
      <rect
        x="27"
        y="45.5"
        width="3"
        height="3.5"
        rx="1"
        fill={G.violet}
        opacity="0.6"
      />
      <rect
        x="34"
        y="45.5"
        width="3"
        height="3.5"
        rx="1"
        fill={G.violet}
        opacity="0.6"
      />
    </g>
  );
}
