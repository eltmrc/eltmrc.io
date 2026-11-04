import { useCallback, useEffect, useRef, useState } from "react";
import "./styles.css";

/* ------------------------------------------------------------------ *
 * SpectrumShowcase — a self-contained, procedurally-driven audio
 * spectrum visualizer. No audio files, no network: a tiny synthetic
 * "track" (kicks, snares, hats, a build-up/drop structure + noise)
 * feeds ~72 frequency bands that drive four canvas visual modes.
 * ------------------------------------------------------------------ */

type VisMode = "bars" | "radial" | "wave" | "bloom";

interface Transport {
  kick: number;
  snare: number;
  hat: number;
  energy: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  color: [number, number, number];
}

const N = 72; // frequency bands
const BPM = 128;
const BPS = BPM / 60; // beats per second
const TAU = Math.PI * 2;

const ASPECT = 720 / 340;
const MAX_W = 880;

// ---- palette (matches the site) ----------------------------------
const PANEL: [number, number, number] = [20, 16, 24]; // #141018
const PURPLE: [number, number, number] = [168, 85, 200]; // #a855c8
const PINK: [number, number, number] = [232, 121, 184]; // #e879b8
const MINT: [number, number, number] = [143, 212, 168]; // #8fd4a8

type RGB = [number, number, number];

function mix(a: RGB, b: RGB, t: number): RGB {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

function rgb(c: RGB, alpha = 1): string {
  return `rgba(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])},${alpha})`;
}

// Precompute a smooth purple -> pink -> mint ramp across the bands.
const BAND_COLORS: RGB[] = Array.from({ length: N }, (_, i) => {
  const f = i / (N - 1);
  return f < 0.5 ? mix(PURPLE, PINK, f / 0.5) : mix(PINK, MINT, (f - 0.5) / 0.5);
});

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

// ---- signal engine ------------------------------------------------
// Fills `out` with per-band magnitudes for transport time `t` (seconds)
// and returns the current drum/energy transport state.
function computeSignal(t: number, out: Float32Array): Transport {
  const beatFloat = t * BPS;
  const beatIndex = Math.floor(beatFloat);
  const beatFrac = beatFloat - beatIndex;
  const sinceBeat = beatFrac / BPS; // seconds since the last beat

  // Four-on-the-floor kick, snappy exponential decay.
  const kick = Math.exp(-sinceBeat * 13);

  // Backbeat snare on beats 2 and 4.
  const snare =
    beatIndex % 2 === 1 ? Math.exp(-sinceBeat * 15) * 0.9 : 0;

  // Hats on the 8th notes.
  const eighth = beatFloat * 2;
  const sinceHat = (eighth - Math.floor(eighth)) / (BPS * 2);
  const hat = Math.exp(-sinceHat * 42) * 0.55;

  // Song structure over 32-beat sections: swell, 8-beat riser, then drop.
  const sectionBeat = beatFloat % 32;
  let energy = 0.55 + 0.18 * Math.sin(t * 0.3);
  let riser = 0;
  if (sectionBeat > 24) {
    riser = (sectionBeat - 24) / 8; // 0 -> 1 build
    energy = 0.4 + riser * 0.12;
  }
  if (sectionBeat < 2) {
    energy = 0.98 - sectionBeat * 0.18; // the drop
  }

  const lead = 0.46 + 0.4 * Math.sin(t * 0.9); // sweeping lead formant

  for (let i = 0; i < N; i++) {
    const f = i / (N - 1);
    // Spectral tilt — lots of low-end, gentle high roll-off.
    let m = (0.32 + 0.6 * energy) * Math.pow(1 - f, 0.82);
    // Two moving melodic combs.
    m += 0.16 * energy * Math.max(0, Math.sin(f * Math.PI * 5 - t * 1.3));
    m += 0.1 * energy * Math.max(0, Math.sin(f * Math.PI * 9 + t * 0.8));
    // A bright lead that sweeps across the band range.
    m += 0.24 * energy * Math.exp(-(((f - lead) / 0.08) ** 2));
    // Kick drives the sub / low bands.
    if (f < 0.14) m += kick * (1 - f / 0.14) * 0.95;
    if (f < 0.05) m += kick * 0.3;
    // Snare = broadband mid-high crack.
    m += snare * 0.55 * Math.exp(-(((f - 0.55) / 0.34) ** 2));
    // Hats = top-end shimmer.
    if (f > 0.78) m += hat * ((f - 0.78) / 0.22) * 0.7;
    // Riser = noisy sweep climbing the spectrum.
    if (riser > 0) {
      const sweep = 0.3 + riser * 0.6;
      m +=
        riser *
        0.5 *
        Math.exp(-(((f - sweep) / 0.2) ** 2)) *
        (0.5 + 0.5 * Math.random());
    }
    // A touch of air/noise.
    m += (Math.random() - 0.25) * 0.05 * energy;
    out[i] = clamp(m, 0, 1.35);
  }

  return { kick, snare, hat, energy };
}

// Fast attack / slow decay smoothing — the classic lively-bar feel.
function smooth(target: Float32Array, levels: Float32Array): void {
  for (let i = 0; i < N; i++) {
    const t = target[i];
    const c = levels[i];
    levels[i] = t > c ? c + (t - c) * 0.55 : c + (t - c) * 0.14;
  }
}

// ---- canvas helpers ----------------------------------------------
function paintBg(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
  ctx.fillStyle = rgb(PANEL);
  ctx.fillRect(0, 0, w, h);
  const g = ctx.createRadialGradient(
    w / 2,
    h / 2,
    0,
    w / 2,
    h / 2,
    Math.max(w, h) * 0.62,
  );
  g.addColorStop(0, rgb(mix(PANEL, PURPLE, 0.14)));
  g.addColorStop(1, rgb(PANEL));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

function roundBar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  const rr = Math.min(r, w / 2, Math.abs(h) / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function drawBars(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  levels: Float32Array,
  trans: Transport,
): void {
  paintBg(ctx, w, h);
  const midY = h * 0.5;
  const slot = w / N;
  const gap = Math.max(1, slot * 0.22);
  const bw = slot - gap;
  const maxH = h * 0.44;

  for (let i = 0; i < N; i++) {
    const lv = levels[i];
    const bh = Math.max(2, lv * maxH);
    const x = i * slot + gap / 2;
    const tip = BAND_COLORS[i];
    const g = ctx.createLinearGradient(0, midY - bh, 0, midY + bh);
    g.addColorStop(0, rgb(tip, 0.95));
    g.addColorStop(0.5, rgb(mix(tip, [255, 255, 255], 0.35)));
    g.addColorStop(1, rgb(tip, 0.95));
    ctx.fillStyle = g;
    ctx.shadowColor = rgb(tip, 0.9);
    ctx.shadowBlur = 8 + lv * 16;
    roundBar(ctx, x, midY - bh, bw, bh * 2, bw * 0.5);
    ctx.fill();
  }
  ctx.shadowBlur = 0;

  // Glossy reflection line through the mirror axis.
  ctx.globalCompositeOperation = "lighter";
  ctx.fillStyle = rgb([255, 255, 255], 0.05 + trans.kick * 0.08);
  ctx.fillRect(0, midY - 1, w, 2);
  ctx.globalCompositeOperation = "source-over";
}

function drawRadial(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  levels: Float32Array,
  trans: Transport,
  t: number,
): void {
  paintBg(ctx, w, h);
  const cx = w / 2;
  const cy = h / 2;
  const baseR = Math.min(w, h) * 0.17;
  const maxLen = Math.min(w, h) * 0.3;
  const rot = t * 0.12;
  const lw = Math.max(2, (TAU * baseR) / N * 0.62);

  // Pulsing core.
  const coreR = baseR * 0.58 + trans.kick * baseR * 0.65;
  ctx.globalCompositeOperation = "lighter";
  const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR);
  core.addColorStop(0, rgb(PINK, 0.9));
  core.addColorStop(0.4, rgb(PURPLE, 0.5));
  core.addColorStop(1, rgb(PURPLE, 0));
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(cx, cy, coreR, 0, TAU);
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";

  // Inner ring outline.
  ctx.strokeStyle = rgb(mix(PURPLE, [255, 255, 255], 0.3), 0.35);
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy, baseR - 3, 0, TAU);
  ctx.stroke();

  // Symmetric radiating bars (mirrored left/right).
  ctx.lineCap = "round";
  ctx.lineWidth = lw;
  for (let j = 0; j < N; j++) {
    const sym = Math.abs(j - N / 2);
    const band = Math.min(N - 1, Math.floor((sym / (N / 2)) * (N - 1)));
    const lv = levels[band];
    const ang = rot + (j / N) * TAU - Math.PI / 2;
    const r1 = baseR + lv * maxLen + 3;
    const ca = Math.cos(ang);
    const sa = Math.sin(ang);
    const color = BAND_COLORS[band];
    ctx.strokeStyle = rgb(color, 0.95);
    ctx.shadowColor = rgb(color, 0.9);
    ctx.shadowBlur = 6 + lv * 18;
    ctx.beginPath();
    ctx.moveTo(cx + ca * baseR, cy + sa * baseR);
    ctx.lineTo(cx + ca * r1, cy + sa * r1);
    ctx.stroke();
    // Glowing tip dot.
    ctx.fillStyle = rgb(mix(color, [255, 255, 255], 0.5), 0.9);
    ctx.beginPath();
    ctx.arc(cx + ca * r1, cy + sa * r1, lw * 0.55, 0, TAU);
    ctx.fill();
  }
  ctx.shadowBlur = 0;
}

function drawWave(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  levels: Float32Array,
  trans: Transport,
  t: number,
): void {
  paintBg(ctx, w, h);
  const midY = h * 0.5;
  const amp = h * 0.33;
  const steps = 160;
  const pulse = 0.6 + trans.kick * 0.9;

  const ys: number[] = new Array(steps + 1);
  for (let p = 0; p <= steps; p++) {
    const fx = p / steps;
    const band = Math.floor(fx * (N - 1));
    const lv = levels[band];
    let s = Math.sin(fx * Math.PI * 8 - t * 6) * (0.2 + trans.energy * 0.3);
    s += Math.sin(fx * Math.PI * 17 + t * 4) * 0.12 * trans.energy;
    s += (lv - 0.3) * 0.5;
    // Fade the ends toward the center line.
    const edge = Math.sin(fx * Math.PI);
    ys[p] = midY + s * amp * pulse * edge;
  }

  // Filled area under the waveform.
  const fill = ctx.createLinearGradient(0, 0, w, 0);
  fill.addColorStop(0, rgb(PURPLE, 0.18));
  fill.addColorStop(0.5, rgb(PINK, 0.22));
  fill.addColorStop(1, rgb(MINT, 0.18));
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(0, midY);
  for (let p = 0; p <= steps; p++) ctx.lineTo((p / steps) * w, ys[p]);
  ctx.lineTo(w, midY);
  ctx.closePath();
  ctx.fill();

  // The glowing line itself.
  const line = ctx.createLinearGradient(0, 0, w, 0);
  line.addColorStop(0, rgb(PURPLE));
  line.addColorStop(0.5, rgb(PINK));
  line.addColorStop(1, rgb(MINT));
  ctx.strokeStyle = line;
  ctx.lineWidth = 2.6;
  ctx.lineJoin = "round";
  ctx.shadowColor = rgb(PINK, 0.8);
  ctx.shadowBlur = 14;
  ctx.beginPath();
  for (let p = 0; p <= steps; p++) {
    const x = (p / steps) * w;
    if (p === 0) ctx.moveTo(x, ys[p]);
    else ctx.lineTo(x, ys[p]);
  }
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Faint center guide.
  ctx.strokeStyle = rgb([255, 255, 255], 0.06);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, midY);
  ctx.lineTo(w, midY);
  ctx.stroke();
}

function spawnBurst(
  particles: Particle[],
  cx: number,
  cy: number,
  strength: number,
  spread: boolean,
): void {
  const count = 34 + Math.floor(strength * 26);
  for (let k = 0; k < count; k++) {
    if (particles.length > 620) break;
    const ang = Math.random() * TAU;
    const speed = (0.6 + Math.random() * 1.4) * (0.5 + strength);
    const r0 = spread ? Math.random() * 2.2 : 0;
    const color = mix(mix(PURPLE, PINK, Math.random()), MINT, Math.random() * 0.5);
    particles.push({
      x: cx + Math.cos(ang) * r0 * 40,
      y: cy + Math.sin(ang) * r0 * 40,
      vx: Math.cos(ang) * speed,
      vy: Math.sin(ang) * speed,
      life: spread ? 0.3 + Math.random() * 1.1 : 1,
      max: 1.1 + Math.random() * 0.7,
      size: 1.4 + Math.random() * 3.4,
      color: [color[0], color[1], color[2]],
    });
  }
}

function drawBloom(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  trans: Transport,
  dt: number,
  particles: Particle[],
  spawn: boolean,
  staticFill: boolean,
): void {
  const cx = w / 2;
  const cy = h / 2;

  if (staticFill) {
    paintBg(ctx, w, h);
    particles.length = 0;
    spawnBurst(particles, cx, cy, 1, true);
    // Push each particle out to a resting radius for the frozen frame.
    for (const p of particles) {
      const d = 20 + Math.random() * Math.min(w, h) * 0.34;
      const a = Math.atan2(p.vy, p.vx);
      p.x = cx + Math.cos(a) * d;
      p.y = cy + Math.sin(a) * d;
    }
  } else {
    // Trail fade instead of a hard clear.
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    ctx.fillStyle = rgb(PANEL, 0.28);
    ctx.fillRect(0, 0, w, h);
    if (spawn) spawnBurst(particles, cx, cy, trans.kick, false);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life -= dt / p.max;
      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.975;
      p.vy *= 0.975;
    }
  }

  // Central pulsing core.
  const coreR = Math.min(w, h) * 0.08 + trans.kick * Math.min(w, h) * 0.2;
  ctx.globalCompositeOperation = "lighter";
  const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR);
  core.addColorStop(0, rgb(PINK, 0.85));
  core.addColorStop(0.5, rgb(PURPLE, 0.4));
  core.addColorStop(1, rgb(PURPLE, 0));
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(cx, cy, coreR, 0, TAU);
  ctx.fill();

  for (const p of particles) {
    const a = clamp(p.life, 0, 1);
    ctx.fillStyle = rgb(p.color, a);
    ctx.shadowColor = rgb(p.color, a);
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * (0.5 + a * 0.5), 0, TAU);
    ctx.fill();
  }
  ctx.shadowBlur = 0;
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
}

// BPM readout + a beat flash that pops on every kick.
function drawHud(
  ctx: CanvasRenderingContext2D,
  w: number,
  trans: Transport,
): void {
  const pad = 14;
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
  ctx.font =
    "600 11px ui-monospace, Menlo, monospace";
  ctx.textBaseline = "middle";

  const dotR = 3.5 + trans.kick * 4;
  const dx = pad + dotR;
  const dy = pad + 4;
  ctx.shadowColor = rgb(PINK, 0.9);
  ctx.shadowBlur = trans.kick * 16;
  ctx.fillStyle = rgb(mix(PINK, [255, 255, 255], trans.kick * 0.6), 0.95);
  ctx.beginPath();
  ctx.arc(dx, dy, dotR, 0, TAU);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.fillStyle = rgb([255, 255, 255], 0.72);
  ctx.fillText("BPM ~128", dx + dotR + 8, dy);

  // Top edge flash on the kick.
  ctx.globalCompositeOperation = "lighter";
  const flash = ctx.createLinearGradient(0, 0, 0, 40);
  flash.addColorStop(0, rgb(PINK, trans.kick * 0.1));
  flash.addColorStop(1, rgb(PINK, 0));
  ctx.fillStyle = flash;
  ctx.fillRect(0, 0, w, 40);
  ctx.globalCompositeOperation = "source-over";
}

// ---- reduced-motion hook -----------------------------------------
function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

const MODES: { id: VisMode; label: string }[] = [
  { id: "bars", label: "Bars" },
  { id: "radial", label: "Radial" },
  { id: "wave", label: "Wave" },
  { id: "bloom", label: "Bloom" },
];

export function SpectrumShowcase() {
  const reduced = usePrefersReducedMotion();
  const [mode, setMode] = useState<VisMode>("radial");
  const [playing, setPlaying] = useState(!reduced);
  const [dims, setDims] = useState({ w: MAX_W, h: Math.round(MAX_W / ASPECT) });

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const levelsRef = useRef<Float32Array>(new Float32Array(N));
  const outRef = useRef<Float32Array>(new Float32Array(N));
  const particlesRef = useRef<Particle[]>([]);
  const elapsedRef = useRef(0);
  const lastTsRef = useRef<number | null>(null);
  const prevKickRef = useRef(0);

  // Track container width -> keep the fixed aspect ratio.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const cw = Math.min(MAX_W, Math.max(240, entries[0].contentRect.width));
      const w = Math.round(cw);
      const h = Math.round(cw / ASPECT);
      setDims((d) => (d.w === w && d.h === h ? d : { w, h }));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Main render effect: sizes the canvas, then either animates or
  // paints a single static frame.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(dims.w * dpr);
    canvas.height = Math.round(dims.h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const levels = levelsRef.current;
    const out = outRef.current;
    const particles = particlesRef.current;

    const draw = (t: number, dt: number, isStatic: boolean) => {
      const trans = computeSignal(t, out);
      smooth(out, levels);
      const m = mode;
      if (m === "bloom") {
        const spawn = !isStatic && trans.kick > 0.5 && prevKickRef.current <= 0.5;
        prevKickRef.current = trans.kick;
        drawBloom(ctx, dims.w, dims.h, trans, dt, particles, spawn, isStatic);
      } else {
        prevKickRef.current = trans.kick;
        if (m === "bars") drawBars(ctx, dims.w, dims.h, levels, trans);
        else if (m === "radial") drawRadial(ctx, dims.w, dims.h, levels, trans, t);
        else drawWave(ctx, dims.w, dims.h, levels, trans, t);
      }
      drawHud(ctx, dims.w, trans);
    };

    if (!playing) {
      // Settle the smoothing so the frozen frame looks full, not sparse.
      for (let i = 0; i < 24; i++) draw(2.1, 0.016, true);
      return;
    }

    let raf = 0;
    lastTsRef.current = null;
    const loop = (ts: number) => {
      const last = lastTsRef.current ?? ts;
      let dt = (ts - last) / 1000;
      if (dt > 0.05) dt = 0.05;
      if (dt < 0) dt = 0;
      lastTsRef.current = ts;
      elapsedRef.current += dt;
      draw(elapsedRef.current, dt, false);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [dims, playing, mode]);

  const togglePlay = useCallback(() => setPlaying((p) => !p), []);

  return (
    <div className="spectrum-root" ref={containerRef}>
      <div className="spectrum-toolbar">
        <div
          className="spectrum-seg"
          role="group"
          aria-label="Visualizer mode"
        >
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              className="spectrum-seg-btn"
              aria-pressed={mode === m.id}
              onClick={() => setMode(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="spectrum-play"
          aria-pressed={playing}
          aria-label={playing ? "Pause visualizer" : "Play visualizer"}
          onClick={togglePlay}
        >
          <span className="spectrum-play-ico" aria-hidden="true">
            {playing ? "❚❚" : "▶"}
          </span>
          <span>{playing ? "Pause" : "Play"}</span>
        </button>
      </div>

      <div className="spectrum-stage">
        <canvas
          ref={canvasRef}
          className="spectrum-canvas"
          style={{ height: `${dims.h}px` }}
          role="img"
          aria-label="Animated audio frequency spectrum visualizer running at roughly 128 BPM"
        />
      </div>

      {reduced && !playing ? (
        <p className="spectrum-note">
          Motion is paused because your system prefers reduced motion. Press
          Play to animate.
        </p>
      ) : null}
    </div>
  );
}
