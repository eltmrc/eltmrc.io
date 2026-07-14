import { motion } from "motion/react";
import { G, type Reduce } from "./palette";

/**
 * Central hub with four branches — pulses travel outward;
 * endpoints are unique shapes (square / circle / triangle / diamond).
 */
export function SystemsArt({ uid, reduce }: { uid: string; reduce: Reduce }) {
  const C = { x: 32, y: 33 };
  const ends = [
    { x: 13, y: 15 },
    { x: 51, y: 15 },
    { x: 13, y: 51 },
    { x: 51, y: 51 },
  ];

  return (
    <g>
      <defs>
        <radialGradient id={`${uid}-core`} cx="38%" cy="30%" r="80%">
          <stop offset="0%" stopColor={G.blush} />
          <stop offset="42%" stopColor={G.rose} />
          <stop offset="100%" stopColor={G.violet} />
        </radialGradient>
        <radialGradient id={`${uid}-glow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={G.violet} stopOpacity="0.28" />
          <stop offset="100%" stopColor={G.violet} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ambient hub glow */}
      <circle cx={C.x} cy={C.y} r="18" fill={`url(#${uid}-glow)`} />

      {/* branches */}
      {ends.map((e, i) => (
        <line
          key={`l${i}`}
          x1={C.x}
          y1={C.y}
          x2={e.x}
          y2={e.y}
          stroke={G.violet}
          strokeWidth="1.5"
          strokeOpacity="0.32"
          strokeLinecap="round"
        />
      ))}

      {/* secondary soft branch glow */}
      {ends.map((e, i) => (
        <line
          key={`lg${i}`}
          x1={C.x}
          y1={C.y}
          x2={e.x}
          y2={e.y}
          stroke={G.pink}
          strokeWidth="3.5"
          strokeOpacity="0.06"
          strokeLinecap="round"
        />
      ))}

      {/* pulses travelling outward along each branch */}
      {!reduce
        ? ends.map((e, i) => (
            <motion.circle
              key={`p${i}`}
              r="1.9"
              fill={G.pink}
              animate={{
                cx: [C.x, e.x],
                cy: [C.y, e.y],
                opacity: [0, 1, 0],
                scale: [0.6, 1, 0.8],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeOut",
                delay: i * 0.45,
                times: [0, 0.6, 1],
              }}
            />
          ))
        : null}

      {/* four unique endpoint shapes */}
      {ends.map((e, i) => (
        <motion.g
          key={`s${i}`}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          animate={
            reduce
              ? {}
              : {
                  scale: [1, 1.08, 1],
                  opacity: [0.92, 1, 0.92],
                }
          }
          transition={
            reduce
              ? undefined
              : {
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.2 + i * 0.35,
                }
          }
        >
          {i === 0 ? (
            <rect
              x={e.x - 4.2}
              y={e.y - 4.2}
              width="8.4"
              height="8.4"
              rx="2.2"
              fill={G.indigo}
            />
          ) : null}
          {i === 1 ? (
            <circle cx={e.x} cy={e.y} r="4.6" fill={G.cyan} />
          ) : null}
          {i === 2 ? (
            <path
              d={`M${e.x} ${e.y - 4.8} L${e.x + 4.5} ${e.y + 3.5} L${e.x - 4.5} ${e.y + 3.5} Z`}
              fill={G.amber}
            />
          ) : null}
          {i === 3 ? (
            <path
              d={`M${e.x} ${e.y - 5.2} L${e.x + 5.2} ${e.y} L${e.x} ${e.y + 5.2} L${e.x - 5.2} ${e.y} Z`}
              fill={G.emerald}
            />
          ) : null}
        </motion.g>
      ))}

      {/* central Cial bubble */}
      <circle cx={C.x} cy={C.y} r="11.5" fill={`url(#${uid}-core)`} opacity="0.2" />
      <circle cx={C.x} cy={C.y} r="8.2" fill={`url(#${uid}-core)`} />
      <motion.circle
        cx={C.x - 2.7}
        cy={C.y - 2.9}
        r="2.1"
        fill="#fff"
        animate={reduce ? {} : { opacity: [0.9, 0.55, 0.9] }}
        transition={
          reduce
            ? undefined
            : { duration: 2.6, repeat: Infinity, ease: "easeInOut" }
        }
      />
    </g>
  );
}
