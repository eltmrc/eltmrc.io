import { motion } from "motion/react";
import { G, type Reduce } from "./palette";

/**
 * Open book: indigo left page, violet right page, soft blush spine glow.
 * Pages gently breathe; pink bookmark; floating amber spark of insight.
 */
export function LearningArt({
  uid,
  reduce,
}: {
  uid: string;
  reduce: Reduce;
}) {
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-left`} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(129,140,248,0.85)" />
          <stop offset="100%" stopColor="rgba(129,140,248,0.35)" />
        </linearGradient>
        <linearGradient id={`${uid}-right`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(168,85,247,0.9)" />
          <stop offset="100%" stopColor="rgba(168,85,247,0.38)" />
        </linearGradient>
        <radialGradient id={`${uid}-glow`} cx="50%" cy="55%" r="55%">
          <stop offset="0%" stopColor={G.blush} stopOpacity="0.55" />
          <stop offset="100%" stopColor={G.violet} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* soft under-glow */}
      <ellipse
        cx="32"
        cy="48"
        rx="24"
        ry="10"
        fill={`url(#${uid}-glow)`}
      />

      {/* back cover shadow */}
      <path
        d="M11 20 c7-3.5 12-3.5 21 0 v28 c-9-3.2-14-3.2-21 0 V20z"
        fill={G.violet}
        opacity="0.12"
        transform="translate(1.5 1.5)"
      />
      <path
        d="M32 20 c9-3.5 14-3.5 21 0 v28 c-7-3.2-12-3.2-21 0 V20z"
        fill={G.violet}
        opacity="0.12"
        transform="translate(1.5 1.5)"
      />

      {/* left page — breathes open slightly */}
      <motion.g
        style={{ transformBox: "view-box", transformOrigin: "32px 34px" }}
        animate={
          reduce
            ? {}
            : { scaleX: [1, 0.97, 1], scaleY: [1, 1.02, 1] }
        }
        transition={
          reduce
            ? undefined
            : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <path
          d="M10 18.5 c8-3.4 13-3.4 22 0 v29 c-9-3.3-14-3.3-22 0 V18.5z"
          fill={`url(#${uid}-left)`}
          stroke={G.indigo}
          strokeOpacity="0.55"
          strokeWidth="1.25"
          strokeLinejoin="round"
        />
        {/* text lines */}
        {[26, 31, 36, 41].map((y, i) => (
          <motion.rect
            key={y}
            x="15"
            y={y}
            height="1.8"
            rx="0.9"
            fill={G.blush}
            opacity={0.55 - i * 0.08}
            width={14 - i * 1.5}
            animate={
              reduce
                ? undefined
                : { opacity: [0.35, 0.65, 0.35] }
            }
            transition={
              reduce
                ? undefined
                : {
                    duration: 2.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.18,
                  }
            }
          />
        ))}
      </motion.g>

      {/* right page */}
      <motion.g
        style={{ transformBox: "view-box", transformOrigin: "32px 34px" }}
        animate={
          reduce
            ? {}
            : { scaleX: [1, 1.03, 1], scaleY: [1, 0.985, 1] }
        }
        transition={
          reduce
            ? undefined
            : {
                duration: 3.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.15,
              }
        }
      >
        <path
          d="M32 18.5 c9-3.4 14-3.4 22 0 v29 c-8-3.3-13-3.3-22 0 V18.5z"
          fill={`url(#${uid}-right)`}
          stroke={G.violet}
          strokeOpacity="0.55"
          strokeWidth="1.25"
          strokeLinejoin="round"
        />
        {[26, 31, 36, 41].map((y, i) => (
          <motion.rect
            key={y}
            x="36"
            y={y}
            height="1.8"
            rx="0.9"
            fill={G.blush}
            opacity={0.5 - i * 0.07}
            width={12 - i * 1.2}
            animate={
              reduce
                ? undefined
                : { opacity: [0.3, 0.6, 0.3] }
            }
            transition={
              reduce
                ? undefined
                : {
                    duration: 2.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.3 + i * 0.18,
                  }
            }
          />
        ))}
      </motion.g>

      {/* spine highlight */}
      <path
        d="M32 18.5 v29"
        stroke={G.blush}
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M32 18.5 v29"
        stroke="#fff"
        strokeWidth="0.6"
        strokeLinecap="round"
        opacity="0.35"
      />

      {/* pink bookmark ribbon */}
      <motion.path
        d="M29 14.5 v12 l3 3.2 3-3.2 V14.5"
        fill={G.pink}
        fillOpacity="0.85"
        stroke={G.rose}
        strokeWidth="0.8"
        strokeLinejoin="round"
        animate={
          reduce
            ? {}
            : { y: [0, 1.2, 0] }
        }
        transition={
          reduce
            ? undefined
            : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
        }
      />
      <circle cx="32" cy="14" r="2.4" fill={G.pink} />
      <circle cx="31.2" cy="13.2" r="0.7" fill="#fff" opacity="0.75" />

      {/* insight spark */}
      <motion.path
        d="M48 12 l1.15 2.8 2.85 1.15 -2.85 1.15 -1.15 2.8 -1.15-2.8 -2.85-1.15 2.85-1.15 z"
        fill={G.amber}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        animate={
          reduce
            ? { opacity: 0.85, scale: 1 }
            : {
                scale: [0.4, 1.15, 0.4],
                opacity: [0.2, 1, 0.2],
                rotate: [0, 45, 90],
              }
        }
        transition={
          reduce
            ? undefined
            : {
                duration: 2.8,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.45, 1],
              }
        }
      />

      {/* tiny floating dots of knowledge */}
      {!reduce
        ? (
          [
            { x: 14, y: 14, c: G.cyan, d: 0 },
            { x: 52, y: 28, c: G.pink, d: 0.6 },
          ] as const
        ).map((d) => (
          <motion.circle
            key={d.x}
            cx={d.x}
            cy={d.y}
            r="1.5"
            fill={d.c}
            animate={{
              y: [0, -3, 0],
              opacity: [0.35, 0.9, 0.35],
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: d.d,
            }}
          />
        ))
        : null}
    </g>
  );
}
