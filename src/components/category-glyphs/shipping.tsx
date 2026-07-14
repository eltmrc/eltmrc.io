import { motion } from "motion/react";
import { G, type Reduce } from "./palette";

/**
 * Soft delivery truck: violet cargo body, pink cabin, blush highlights.
 * Slides slightly on a loop; wheels spin. Package tag on the box.
 */
export function ShippingArt({
  uid,
  reduce,
}: {
  uid: string;
  reduce: Reduce;
}) {
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(168,85,247,0.42)" />
          <stop offset="100%" stopColor="rgba(129,140,248,0.16)" />
        </linearGradient>
        <linearGradient id={`${uid}-cab`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,95,168,0.55)" />
          <stop offset="100%" stopColor="rgba(255,143,208,0.28)" />
        </linearGradient>
        <radialGradient id={`${uid}-wheel`} cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor={G.blush} />
          <stop offset="55%" stopColor={G.indigo} />
          <stop offset="100%" stopColor={G.violet} />
        </radialGradient>
        <linearGradient id={`${uid}-road`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={G.violet} stopOpacity="0" />
          <stop offset="35%" stopColor={G.violet} stopOpacity="0.22" />
          <stop offset="65%" stopColor={G.pink} stopOpacity="0.18" />
          <stop offset="100%" stopColor={G.violet} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* soft road / ground shadow */}
      <ellipse
        cx="32"
        cy="54.5"
        rx="22"
        ry="3.2"
        fill={`url(#${uid}-road)`}
      />

      <motion.g
        style={{ transformBox: "view-box", transformOrigin: "32px 40px" }}
        animate={reduce ? {} : { x: [-1.6, 1.6, -1.6] }}
        transition={
          reduce
            ? undefined
            : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
        }
      >
        {/* cargo box */}
        <rect
          x="8"
          y="22"
          width="28"
          height="22"
          rx="5"
          fill={`url(#${uid}-body)`}
          stroke={G.violet}
          strokeOpacity="0.55"
          strokeWidth="1.35"
        />
        {/* box highlight strip */}
        <rect
          x="11"
          y="25"
          width="10"
          height="3.2"
          rx="1.6"
          fill={G.blush}
          opacity="0.55"
        />
        {/* package tape / stripe */}
        <rect
          x="8"
          y="31.5"
          width="28"
          height="3"
          fill={G.pink}
          opacity="0.28"
        />
        {/* small package emblem */}
        <rect
          x="17"
          y="27.5"
          width="10"
          height="9"
          rx="2"
          fill={G.violet}
          fillOpacity="0.18"
          stroke={G.pink}
          strokeOpacity="0.55"
          strokeWidth="1.1"
        />
        <path
          d="M17 31h10M22 27.5v9"
          stroke={G.pink}
          strokeWidth="1"
          strokeOpacity="0.55"
          strokeLinecap="round"
        />

        {/* cabin */}
        <path
          d="M36 30 h10.5 l5.5 7.5 V44 a4 4 0 0 1-4 4 H36 V30z"
          fill={`url(#${uid}-cab)`}
          stroke={G.pink}
          strokeOpacity="0.65"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        {/* windshield */}
        <path
          d="M38.5 31.8 h6.2 l3.6 5 H38.5 z"
          fill={G.indigo}
          fillOpacity="0.45"
          stroke={G.blush}
          strokeOpacity="0.5"
          strokeWidth="0.9"
        />
        {/* headlight */}
        <circle cx="50.2" cy="41.5" r="1.7" fill={G.amber} opacity="0.9" />
        <motion.circle
          cx="50.2"
          cy="41.5"
          r="3.2"
          fill={G.amber}
          animate={
            reduce
              ? { opacity: 0.15 }
              : { opacity: [0.08, 0.28, 0.08], scale: [0.85, 1.15, 0.85] }
          }
          transition={
            reduce
              ? undefined
              : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
          }
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />

        {/* undercarriage bar */}
        <rect
          x="12"
          y="43.5"
          width="36"
          height="2.2"
          rx="1.1"
          fill={G.violet}
          opacity="0.28"
        />

        {/* wheels — outer + hub, rotate */}
        {(
          [
            { cx: 18, cy: 48 },
            { cx: 42, cy: 48 },
          ] as const
        ).map((w, i) => (
          <g key={i}>
            <circle
              cx={w.cx}
              cy={w.cy}
              r="5.2"
              fill={`url(#${uid}-wheel)`}
              stroke={G.violet}
              strokeOpacity="0.45"
              strokeWidth="1.1"
            />
            <motion.g
              style={{
                transformBox: "view-box",
                transformOrigin: `${w.cx}px ${w.cy}px`,
              }}
              animate={reduce ? {} : { rotate: 360 }}
              transition={
                reduce
                  ? undefined
                  : {
                      duration: 1.4,
                      repeat: Infinity,
                      ease: "linear",
                      delay: i * 0.05,
                    }
              }
            >
              <path
                d={`M${w.cx} ${w.cy - 3.2} v6.4 M${w.cx - 3.2} ${w.cy} h6.4`}
                stroke={G.blush}
                strokeWidth="1.15"
                strokeLinecap="round"
                opacity="0.85"
              />
              <circle cx={w.cx} cy={w.cy} r="1.55" fill={G.blush} />
            </motion.g>
          </g>
        ))}
      </motion.g>

      {/* exhaust puff / motion dots behind */}
      {!reduce
        ? [0, 1, 2].map((i) => (
            <motion.circle
              key={i}
              cy={38 + i * 1.2}
              r={1.4 - i * 0.25}
              fill={G.pink}
              animate={{
                cx: [10, 4],
                opacity: [0, 0.55, 0],
                scale: [0.6, 1.2],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeOut",
                delay: i * 0.35,
                times: [0, 0.4, 1],
              }}
            />
          ))
        : null}
    </g>
  );
}
