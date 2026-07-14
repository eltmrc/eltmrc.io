import { motion } from "motion/react";
import { G, type Reduce } from "./palette";

/**
 * Three server racks / rising bars of different heights —
 * soft fills indigo / violet / pink, staggered status LED blinks.
 */
export function InfrastructureArt({
  uid,
  reduce,
}: {
  uid: string;
  reduce: Reduce;
}) {
  const racks = [
    {
      x: 9,
      y: 34,
      w: 14,
      h: 20,
      fill: G.indigo,
      led: G.cyan,
      delay: 0,
      slots: 2,
    },
    {
      x: 25,
      y: 22,
      w: 14,
      h: 32,
      fill: G.violet,
      led: G.amber,
      delay: 0.35,
      slots: 3,
    },
    {
      x: 41,
      y: 12,
      w: 14,
      h: 42,
      fill: G.pink,
      led: G.emerald,
      delay: 0.7,
      slots: 4,
    },
  ] as const;

  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-r0`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={G.indigo} stopOpacity="0.95" />
          <stop offset="100%" stopColor={G.indigo} stopOpacity="0.45" />
        </linearGradient>
        <linearGradient id={`${uid}-r1`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={G.violet} stopOpacity="0.95" />
          <stop offset="100%" stopColor={G.violet} stopOpacity="0.45" />
        </linearGradient>
        <linearGradient id={`${uid}-r2`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={G.pink} stopOpacity="0.95" />
          <stop offset="100%" stopColor={G.pink} stopOpacity="0.42" />
        </linearGradient>
      </defs>

      {/* floor plane */}
      <ellipse cx="32" cy="56.5" rx="24" ry="3.2" fill={G.violet} opacity="0.12" />
      <path
        d="M8 54.5 H56"
        stroke={G.violet}
        strokeOpacity="0.18"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {racks.map((r, i) => (
        <motion.g
          key={i}
          style={{ transformBox: "fill-box", transformOrigin: "center bottom" }}
          initial={reduce ? undefined : { scaleY: 0.55, opacity: 0.5 }}
          animate={
            reduce
              ? {}
              : {
                  scaleY: [1, 1.03, 0.98, 1],
                  opacity: 1,
                }
          }
          transition={
            reduce
              ? undefined
              : {
                  scaleY: {
                    duration: 2.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: r.delay,
                    times: [0, 0.35, 0.7, 1],
                  },
                  opacity: { duration: 0.4, delay: r.delay * 0.3 },
                }
          }
        >
          {/* chassis */}
          <rect
            x={r.x}
            y={r.y}
            width={r.w}
            height={r.h}
            rx="3.2"
            fill={`url(#${uid}-r${i})`}
            stroke={r.fill}
            strokeOpacity="0.45"
            strokeWidth="1.15"
          />

          {/* top cap highlight */}
          <rect
            x={r.x + 1.2}
            y={r.y + 1.4}
            width={r.w - 2.4}
            height="2.4"
            rx="1.2"
            fill="#fff"
            opacity="0.14"
          />

          {/* drive / bay slots */}
          {Array.from({ length: r.slots }).map((_, s) => {
            const sy = r.y + 6 + s * ((r.h - 14) / Math.max(r.slots, 1));
            return (
              <rect
                key={s}
                x={r.x + 2.4}
                y={sy}
                width={r.w - 7.5}
                height="3.2"
                rx="1.2"
                fill="#0f0a1a"
                opacity="0.22"
              />
            );
          })}

          {/* status LED — blinks staggered */}
          <motion.circle
            cx={r.x + r.w - 3.6}
            cy={r.y + 5.2}
            r="1.55"
            fill={r.led}
            animate={
              reduce
                ? { opacity: 0.85 }
                : { opacity: [0.25, 1, 0.35, 1, 0.25] }
            }
            transition={
              reduce
                ? undefined
                : {
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: r.delay,
                    times: [0, 0.2, 0.45, 0.7, 1],
                  }
            }
          />
          {/* LED glow bloom */}
          {!reduce ? (
            <motion.circle
              cx={r.x + r.w - 3.6}
              cy={r.y + 5.2}
              r="3.2"
              fill={r.led}
              animate={{ opacity: [0, 0.35, 0.05, 0.3, 0] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: r.delay,
                times: [0, 0.2, 0.45, 0.7, 1],
              }}
            />
          ) : null}
        </motion.g>
      ))}
    </g>
  );
}
