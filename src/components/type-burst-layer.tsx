/**
 * Firework spark bursts for the Cial mark — ported from instance
 * Sidebar/TypeBurstLayer (same pop as ⌘K / sidebar mark click).
 */
import { useEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { useReducedMotion } from "motion/react";

type Spark = {
  readonly id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  dur: number;
  size: number;
  color: string;
};

type Props = {
  readonly tick: number;
  readonly portal?: boolean;
  readonly anchorRef?: RefObject<Element | null>;
  readonly scale?: number;
};

const GRAVITY = 520;
const COLORS = [
  "#ffffff",
  "#ffe3f6",
  "#ff8fd0",
  "#ff5fa8",
  "#c4b5fd",
  "#a855f7",
];

export function TypeBurstLayer({
  tick,
  portal = false,
  anchorRef,
  scale = 1,
}: Props) {
  const reduced = useReducedMotion();
  const [, setFrame] = useState(0);
  const sparksRef = useRef<Spark[]>([]);
  const idRef = useRef(0);
  const lastTick = useRef(0);
  const rafRef = useRef(0);
  const lastTRef = useRef(0);
  const originRef = useRef({ x: 0, y: 0 });
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const s = Math.max(0.15, scale);

  const ensureLoop = () => {
    if (rafRef.current || reduced) return;
    lastTRef.current = 0;
    const step = (now: number) => {
      const last = lastTRef.current || now;
      lastTRef.current = now;
      let dt = (now - last) / 1000;
      if (dt > 0.05) dt = 0.05;

      const next: Spark[] = [];
      for (const spark of sparksRef.current) {
        spark.age += dt;
        spark.vy += GRAVITY * dt;
        spark.x += spark.vx * dt;
        spark.y += spark.vy * dt;
        spark.vx *= 0.985;
        if (spark.age < spark.dur) next.push(spark);
      }
      sparksRef.current = next;
      setFrame((n) => n + 1);

      if (next.length > 0) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        rafRef.current = 0;
        lastTRef.current = 0;
      }
    };
    rafRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    if (tick === 0 || tick === lastTick.current) return;
    lastTick.current = tick;
    if (reduced) return;

    if (portal && anchorRef?.current) {
      const r = anchorRef.current.getBoundingClientRect();
      const nextOrigin = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      originRef.current = nextOrigin;
      setOrigin(nextOrigin);
    }

    const n = Math.round(
      (14 + Math.floor(Math.random() * 10)) * Math.min(2.2, 0.7 + s * 0.6),
    );
    const batch: Spark[] = [];
    for (let i = 0; i < n; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = (120 + Math.random() * 260) * (0.85 + s * 0.35);
      batch.push({
        id: ++idRef.current,
        x: (Math.random() - 0.5) * 5 * s,
        y: (Math.random() - 0.5) * 5 * s,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd - 30 * s,
        age: 0,
        dur: 0.28 + Math.random() * 0.32 + (s - 1) * 0.06,
        size: (0.85 + Math.random() * 1.1) * s,
        color: COLORS[Math.floor(Math.random() * COLORS.length)]!,
      });
    }
    sparksRef.current = [...sparksRef.current.slice(-60), ...batch];
    ensureLoop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, reduced, portal, anchorRef, s]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    };
  }, []);

  if (reduced) return null;

  const sparks = sparksRef.current;
  const half = Math.round(90 * Math.max(1, s));
  const box = half * 2;
  const svg = (
    <svg
      className="cial-mark-burst__svg"
      viewBox={`${-half} ${-half} ${box} ${box}`}
      width={box}
      height={box}
    >
      {sparks.map((spark) => {
        const t = spark.age / spark.dur;
        const opacity = Math.max(0, 1 - t * t);
        const r = spark.size * (1 + 0.12 * t);
        return (
          <circle
            key={spark.id}
            cx={spark.x}
            cy={spark.y}
            r={r}
            fill={spark.color}
            opacity={opacity}
          />
        );
      })}
    </svg>
  );

  if (portal) {
    if (typeof document === "undefined" || sparks.length === 0) return null;
    return createPortal(
      <div
        className="cial-mark-burst cial-mark-burst--portal"
        aria-hidden="true"
        style={{ left: origin.x, top: origin.y, width: box, height: box }}
      >
        {svg}
      </div>,
      document.body,
    );
  }

  return (
    <div
      className="cial-mark-burst"
      aria-hidden="true"
      style={
        s !== 1
          ? { width: box, height: box, margin: `${-half}px 0 0 ${-half}px` }
          : undefined
      }
    >
      {svg}
    </div>
  );
}
