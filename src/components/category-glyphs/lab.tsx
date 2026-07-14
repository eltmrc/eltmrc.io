import { motion } from "motion/react";
import { G, type Reduce } from "./palette";

/** Erlenmeyer flask — gradient body, sloshing liquid, rising bubbles. */
export function LabArt({ uid, reduce }: { uid: string; reduce: Reduce }) {
  const bubbles = [
    { cx: 28, baseY: 46, r: 2.1, c: G.cyan, delay: 0, dur: 2.4 },
    { cx: 34, baseY: 48, r: 1.6, c: G.amber, delay: 0.55, dur: 2.7 },
    { cx: 31, baseY: 44, r: 1.35, c: G.pink, delay: 1.1, dur: 2.2 },
  ];

  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-glass`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(168,85,247,0.28)" />
          <stop offset="100%" stopColor="rgba(129,140,248,0.10)" />
        </linearGradient>
        <linearGradient id={`${uid}-liquid`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={G.pink} stopOpacity="0.55" />
          <stop offset="55%" stopColor={G.violet} stopOpacity="0.72" />
          <stop offset="100%" stopColor={G.indigo} stopOpacity="0.85" />
        </linearGradient>
        <clipPath id={`${uid}-flask-clip`}>
          <path d="M28 22 L18 46 a6.5 6.5 0 0 0 5.8 8.5 h16.4 A6.5 6.5 0 0 0 46 46 L36 22 Z" />
        </clipPath>
      </defs>

      {/* soft base shadow */}
      <ellipse cx="32" cy="56.5" rx="13" ry="2.8" fill={G.violet} opacity="0.12" />

      {/* flask silhouette */}
      <path
        d="M26 9.5 h12
           M28 9.5 v12.5
           L18 46 a6.5 6.5 0 0 0 5.8 8.5 h16.4 A6.5 6.5 0 0 0 46 46
           L36 22 V9.5"
        fill={`url(#${uid}-glass)`}
        stroke={G.violet}
        strokeOpacity="0.55"
        strokeWidth="1.45"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* rim highlight */}
      <path
        d="M26 9.5 h12"
        stroke={G.rose}
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.55"
      />
      <rect x="27" y="9" width="10" height="3.2" rx="1.4" fill={G.violet} fillOpacity="0.2" />

      {/* liquid — sloshes via path morph / subtle x scale */}
      <g clipPath={`url(#${uid}-flask-clip)`}>
        <motion.path
          d="M17 40 Q24 37.5 32 39.5 T47 40 L46 55 H18 Z"
          fill={`url(#${uid}-liquid)`}
          animate={
            reduce
              ? {}
              : {
                  d: [
                    "M17 40 Q24 37.5 32 39.5 T47 40 L46 55 H18 Z",
                    "M17 40 Q24 41.5 32 38.5 T47 41 L46 55 H18 Z",
                    "M17 40 Q25 38 32 41 T47 39 L46 55 H18 Z",
                    "M17 40 Q24 37.5 32 39.5 T47 40 L46 55 H18 Z",
                  ],
                }
          }
          transition={
            reduce
              ? undefined
              : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
          }
        />
        {/* surface sheen */}
        <motion.ellipse
          cx="32"
          cy="40"
          rx="11"
          ry="2.2"
          fill="#fff"
          opacity={reduce ? 0.12 : undefined}
          animate={reduce ? undefined : { opacity: [0.08, 0.18, 0.1, 0.08], cy: [40, 39.2, 40.6, 40] }}
          transition={reduce ? undefined : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </g>

      {/* rising bubbles */}
      {bubbles.map((b, i) => (
        <motion.circle
          key={i}
          cx={b.cx}
          r={b.r}
          fill={b.c}
          initial={false}
          animate={
            reduce
              ? { cy: b.baseY - 4, opacity: 0.55 }
              : {
                  cy: [b.baseY, b.baseY - 10, b.baseY - 16],
                  opacity: [0, 0.9, 0],
                  scale: [0.7, 1, 1.15],
                }
          }
          transition={
            reduce
              ? undefined
              : {
                  duration: b.dur,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: b.delay,
                  times: [0, 0.55, 1],
                }
          }
          style={{ transformOrigin: `${b.cx}px ${b.baseY}px` }}
        />
      ))}

      {/* glass specular */}
      <path
        d="M22.5 44 Q24 36 27 30"
        stroke="#fff"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.22"
      />
    </g>
  );
}
