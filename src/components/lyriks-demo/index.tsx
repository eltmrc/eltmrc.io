import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./styles.css";

/* ------------------------------------------------------------------ *
 * Lyriks — a purely visual recreation of a 2018 interactive music
 * video / rhythm game. No audio is ever loaded or played; everything
 * is driven by an internal transport clock (performance.now) so the
 * reader can SEE syllables land in sync with an imagined vocal.
 *
 * Example: the opening of Eminem — "Lose Yourself" (~86 BPM feel).
 * ------------------------------------------------------------------ */

type View = "play" | "studio";

type Syllable = {
  text: string;
  /** hit time in ms (the beat the syllable lands on) */
  t: number;
  /** stage position, percent of the stage box */
  x: number;
  y: number;
  /** authored tilt in degrees */
  rot: number;
  /** relative type size (stressed syllables are bigger) */
  size: number;
  /** palette index */
  c: number;
  line: 1 | 2;
};

type Beat = { t: number; kind: "kick" | "snare" };
type Section = { t: number; label: string };

/* Palette — accent purple, hot pink, mint. */
const COLORS = ["#a855c8", "#e879b8", "#8fd4a8"] as const;
const HOT = "#e879b8";

/* Transport + animation envelope (ms). */
const LOOP = 9800;
const LEADIN = 700; // how long before the hit a syllable starts arriving
const POP = 320; // pop-in duration
const HOLD = 220; // "hit" hold
const BURST = 420; // ring-burst decay
const FADE = 900; // drift-out
const LIFE = LEADIN + HOLD + FADE;

/* Hand-authored syllable timeline for the two famous opening lines.
 * Timings accelerate slightly to mimic the real flow. */
const SYLLABLES: Syllable[] = [
  { text: "His", t: 750, x: 12, y: 30, rot: -6, size: 1.1, c: 0, line: 1 },
  { text: "palms", t: 1150, x: 31, y: 56, rot: 4, size: 1.3, c: 1, line: 1 },
  { text: "are", t: 1450, x: 20, y: 73, rot: -3, size: 0.9, c: 2, line: 1 },
  { text: "swea", t: 1700, x: 45, y: 24, rot: 8, size: 1.15, c: 0, line: 1 },
  { text: "ty", t: 1900, x: 59, y: 41, rot: -5, size: 0.95, c: 1, line: 1 },
  { text: "knees", t: 2300, x: 73, y: 21, rot: 6, size: 1.2, c: 2, line: 1 },
  { text: "weak", t: 2650, x: 82, y: 51, rot: -8, size: 1.3, c: 0, line: 1 },
  { text: "arms", t: 3050, x: 61, y: 66, rot: 5, size: 1.1, c: 1, line: 1 },
  { text: "are", t: 3300, x: 44, y: 80, rot: -4, size: 0.9, c: 2, line: 1 },
  { text: "hea", t: 3550, x: 30, y: 40, rot: 7, size: 1.15, c: 0, line: 1 },
  { text: "vy", t: 3750, x: 16, y: 54, rot: -6, size: 0.95, c: 1, line: 1 },
  { text: "There's", t: 4350, x: 52, y: 44, rot: -2, size: 1.35, c: 1, line: 2 },
  { text: "vo", t: 4700, x: 70, y: 26, rot: 7, size: 1.05, c: 2, line: 2 },
  { text: "mit", t: 4900, x: 82, y: 50, rot: -7, size: 1.0, c: 0, line: 2 },
  { text: "on", t: 5150, x: 66, y: 70, rot: 4, size: 0.95, c: 1, line: 2 },
  { text: "his", t: 5400, x: 50, y: 78, rot: -5, size: 0.95, c: 2, line: 2 },
  { text: "swea", t: 5700, x: 34, y: 70, rot: 6, size: 1.15, c: 0, line: 2 },
  { text: "ter", t: 5900, x: 22, y: 50, rot: -6, size: 0.95, c: 1, line: 2 },
  { text: "al", t: 6150, x: 30, y: 30, rot: 8, size: 1.0, c: 2, line: 2 },
  { text: "rea", t: 6350, x: 46, y: 22, rot: -4, size: 1.1, c: 0, line: 2 },
  { text: "dy", t: 6550, x: 62, y: 34, rot: 5, size: 0.95, c: 1, line: 2 },
  { text: "mom's", t: 7050, x: 40, y: 56, rot: -3, size: 1.45, c: 1, line: 2 },
  { text: "spa", t: 7400, x: 58, y: 60, rot: 6, size: 1.1, c: 2, line: 2 },
  { text: "ghet", t: 7650, x: 72, y: 73, rot: -6, size: 1.2, c: 0, line: 2 },
  { text: "ti", t: 7900, x: 84, y: 44, rot: 7, size: 1.0, c: 1, line: 2 },
];

const LINE_1 = "His palms are sweaty, knees weak, arms are heavy";
const LINE_2 = "There's vomit on his sweater already, mom's spaghetti";

/* 86 BPM grid → kick (●) and snare (✕) transients. */
const BEATS: Beat[] = [
  { t: 750, kind: "kick" },
  { t: 1150, kind: "kick" },
  { t: 1448, kind: "snare" },
  { t: 2145, kind: "kick" },
  { t: 2843, kind: "snare" },
  { t: 3541, kind: "kick" },
  { t: 3900, kind: "kick" },
  { t: 4238, kind: "snare" },
  { t: 4936, kind: "kick" },
  { t: 5634, kind: "snare" },
  { t: 6331, kind: "kick" },
  { t: 7029, kind: "snare" },
  { t: 7400, kind: "kick" },
  { t: 7727, kind: "kick" },
  { t: 8424, kind: "snare" },
];

const SECTIONS: Section[] = [
  { t: 650, label: "verse" },
  { t: 4250, label: "bar 2" },
];

/* ------------------------------ math ------------------------------ */

const clamp = (v: number, a: number, b: number) =>
  Math.min(b, Math.max(a, v));

function easeOutBack(x: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);

/** Shortest distance to a marker on the looping timeline. */
const loopDist = (a: number, b: number) => {
  const d = Math.abs(a - b);
  return Math.min(d, LOOP - d);
};

/* --------------------------- reduced motion ----------------------- */

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

/* ------------------------- syllable envelope ---------------------- */

type SylState = {
  opacity: number;
  scale: number;
  driftY: number;
  hot: boolean;
  near: boolean;
  ringScale: number;
  ringOpacity: number;
  burstScale: number;
  burstOpacity: number;
};

function envelope(tLocal: number): SylState | null {
  if (tLocal < 0 || tLocal > LIFE) return null;

  const popIn = clamp(tLocal / POP, 0, 1);
  const approach = clamp(tLocal / LEADIN, 0, 1);
  const hitLocal = tLocal - LEADIN;

  let opacity = clamp(tLocal / (POP * 0.6), 0, 1);
  let scale = easeOutBack(popIn);
  let driftY = 0;
  let hot = false;

  const ringActive = hitLocal < 0;
  const ringScale = 2.6 - 1.7 * approach;
  const ringOpacity = ringActive ? clamp(approach * 1.3, 0, 1) * 0.8 : 0;

  const burstActive = hitLocal >= 0 && hitLocal < BURST;
  const bp = clamp(hitLocal / BURST, 0, 1);
  const burstScale = 1 + 1.5 * easeOutCubic(bp);
  const burstOpacity = burstActive ? (1 - bp) * 0.85 : 0;

  if (hitLocal >= 0 && hitLocal < HOLD) {
    opacity = 1;
    scale = 1;
    hot = true;
  } else if (hitLocal >= HOLD) {
    const f = clamp((hitLocal - HOLD) / FADE, 0, 1);
    opacity = 1 - f;
    driftY = -40 * easeOutCubic(f);
    scale = 1 + 0.2 * easeOutCubic(f);
  }

  return {
    opacity,
    scale,
    driftY,
    hot,
    near: ringActive && approach > 0.25,
    ringScale,
    ringOpacity,
    burstScale,
    burstOpacity,
  };
}

/* ------------------------------ stage ----------------------------- */

function Stage({ now, reduced }: { now: number; reduced: boolean }) {
  return (
    <div className="lyriks-stage" aria-hidden="true">
      <div className="lyriks-stage__grain" />
      {SYLLABLES.map((syl, i) => {
        const base = COLORS[syl.c];

        if (reduced) {
          return (
            <span
              key={i}
              className="lyriks-syl"
              style={{ left: `${syl.x}%`, top: `${syl.y}%` }}
            >
              <span
                className="lyriks-syl__word"
                style={{
                  color: base,
                  opacity: 0.92,
                  transform: `translate(-50%, -50%) scale(${syl.size}) rotate(${syl.rot}deg)`,
                }}
              >
                {syl.text}
              </span>
            </span>
          );
        }

        const st = envelope(now - (syl.t - LEADIN));
        if (!st) return null;

        const color = st.hot ? HOT : base;
        const glow = st.hot
          ? `0 0 26px ${HOT}, 0 0 54px ${HOT}88`
          : st.near
            ? `0 0 18px ${base}66`
            : "none";

        return (
          <span
            key={i}
            className="lyriks-syl"
            style={{ left: `${syl.x}%`, top: `${syl.y}%` }}
          >
            {st.ringOpacity > 0.01 && (
              <span
                className="lyriks-syl__ring"
                style={{
                  borderColor: base,
                  opacity: st.ringOpacity,
                  transform: `translate(-50%, -50%) scale(${st.ringScale * syl.size})`,
                }}
              />
            )}
            {st.burstOpacity > 0.01 && (
              <span
                className="lyriks-syl__burst"
                style={{
                  borderColor: HOT,
                  opacity: st.burstOpacity,
                  transform: `translate(-50%, -50%) scale(${st.burstScale * syl.size})`,
                }}
              />
            )}
            <span
              className="lyriks-syl__word"
              style={{
                color,
                opacity: st.opacity,
                textShadow: glow,
                transform: `translate(-50%, -50%) translateY(${st.driftY}px) scale(${st.scale * syl.size}) rotate(${syl.rot + st.driftY * 0.12}deg)`,
              }}
            >
              {syl.text}
            </span>
          </span>
        );
      })}
    </div>
  );
}

/* --------------------------- beat strip --------------------------- */

function BeatStrip({ now, reduced }: { now: number; reduced: boolean }) {
  return (
    <div className="lyriks-beats" aria-hidden="true">
      <div className="lyriks-beats__track">
        {SECTIONS.map((sec, i) => (
          <div
            key={`sec-${i}`}
            className="lyriks-beats__section"
            style={{ left: `${(sec.t / LOOP) * 100}%` }}
          >
            <span className="lyriks-beats__section-label">{sec.label}</span>
          </div>
        ))}
        {BEATS.map((b, i) => {
          const near = !reduced && loopDist(now, b.t) < 70;
          return (
            <span
              key={`b-${i}`}
              className={`lyriks-beats__mark lyriks-beats__mark--${b.kind}${
                near ? " is-hit" : ""
              }`}
              style={{ left: `${(b.t / LOOP) * 100}%` }}
            >
              {b.kind === "kick" ? "●" : "✕"}
            </span>
          );
        })}
        {!reduced && (
          <div
            className="lyriks-beats__head"
            style={{ left: `${(now / LOOP) * 100}%` }}
          />
        )}
      </div>
      <div className="lyriks-beats__legend">
        <span>
          <b className="lyriks-dot lyriks-dot--kick">●</b> kick
        </span>
        <span>
          <b className="lyriks-dot lyriks-dot--snare">✕</b> snare
        </span>
        <span className="lyriks-beats__legend-note">syllables · beats · sections</span>
      </div>
    </div>
  );
}

/* ---------------------------- studio ------------------------------ */

const WAVE = Array.from({ length: 150 }, (_, i) => {
  const v =
    Math.sin(i * 0.5) * 0.5 +
    Math.sin(i * 0.17 + 1.3) * 0.32 +
    Math.sin(i * 1.1 + 0.6) * 0.18;
  return 0.18 + 0.82 * Math.abs(v);
});

function Studio({ now, reduced }: { now: number; reduced: boolean }) {
  const seconds = Math.ceil(LOOP / 1000);
  const headPct = (now / LOOP) * 100;

  return (
    <div className="lyriks-studio">
      <div className="lyriks-studio__head">
        <span className="lyriks-studio__dot" />
        <span className="lyriks-studio__dot" />
        <span className="lyriks-studio__dot" />
        <span className="lyriks-studio__title">lyriks · sync editor</span>
        <span className="lyriks-studio__rate">0.25× slow-mo</span>
      </div>

      <div className="lyriks-studio__lyrics">
        <span className="lyriks-studio__lyrics-label">pasted lyrics</span>
        <p>{LINE_1}</p>
        <p>{LINE_2}</p>
      </div>

      <div className="lyriks-studio__timeline">
        <div className="lyriks-studio__ruler">
          {Array.from({ length: seconds + 1 }, (_, s) => (
            <span
              key={s}
              className="lyriks-studio__tick"
              style={{ left: `${((s * 1000) / LOOP) * 100}%` }}
            >
              <i />
              {s}s
            </span>
          ))}
        </div>

        <div className="lyriks-studio__wave" aria-hidden="true">
          {WAVE.map((h, i) => (
            <span key={i} style={{ height: `${h * 100}%` }} />
          ))}
        </div>

        <div className="lyriks-studio__lanes">
          {([1, 2] as const).map((line) => (
            <div key={line} className="lyriks-studio__lane">
              {SYLLABLES.filter((s) => s.line === line).map((syl, i) => {
                const active = !reduced && loopDist(now, syl.t) < 150;
                return (
                  <span
                    key={i}
                    className={`lyriks-chip${active ? " is-active" : ""}`}
                    style={{
                      left: `${(syl.t / LOOP) * 100}%`,
                      borderColor: COLORS[syl.c],
                      color: COLORS[syl.c],
                    }}
                  >
                    {syl.text}
                  </span>
                );
              })}
            </div>
          ))}
        </div>

        {!reduced && (
          <div className="lyriks-studio__head-line" style={{ left: `${headPct}%` }}>
            <span className="lyriks-studio__hint">tap to mark ↵</span>
          </div>
        )}
      </div>

      <p className="lyriks-studio__note">
        Paste the lyrics once, slow the track down, and tap each syllable as you
        hear it. Lyriks records a timestamp per syllable plus the kicks, snares
        and section markers.
      </p>
    </div>
  );
}

/* --------------------------- controls ----------------------------- */

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path d="M8 5.5v13l11-6.5-11-6.5z" fill="currentColor" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <rect x="6" y="5" width="4" height="14" rx="1.2" fill="currentColor" />
      <rect x="14" y="5" width="4" height="14" rx="1.2" fill="currentColor" />
    </svg>
  );
}

function RestartIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M12 5V2L7 6l5 4V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z"
        fill="currentColor"
      />
    </svg>
  );
}

/* ------------------------------ root ------------------------------ */

export function LyriksDemo() {
  const reduced = usePrefersReducedMotion();
  const [view, setView] = useState<View>("play");
  const [playing, setPlaying] = useState(false);
  const [now, setNow] = useState(0);

  const rafRef = useRef<number | null>(null);
  const tRef = useRef(0);
  const lastRef = useRef(0);

  useEffect(() => {
    if (reduced || !playing) return;
    lastRef.current = performance.now();
    const frame = () => {
      const n = performance.now();
      const dt = n - lastRef.current;
      lastRef.current = n;
      let t = tRef.current + dt;
      while (t >= LOOP) t -= LOOP;
      tRef.current = t;
      setNow(t);
      rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [playing, reduced]);

  const toggle = useCallback(() => {
    if (reduced) return;
    setPlaying((p) => !p);
  }, [reduced]);

  const restart = useCallback(() => {
    tRef.current = 0;
    lastRef.current = performance.now();
    setNow(0);
  }, []);

  const progress = reduced ? 0 : now / LOOP;
  const clock = useMemo(() => {
    const total = LOOP / 1000;
    const cur = (reduced ? 0 : now) / 1000;
    return `${cur.toFixed(1)} / ${total.toFixed(1)}s`;
  }, [now, reduced]);

  return (
    <div className="lyriks">
      <div className="lyriks__frame">
        <div className="lyriks__topbar">
          <div className="lyriks__brand">
            <span className="lyriks__brand-mark">◖◗</span>
            <span className="lyriks__brand-name">Lyriks</span>
            <span className="lyriks__brand-track">Lose Yourself · intro</span>
          </div>

          <div className="lyriks-seg" role="group" aria-label="View">
            <button
              type="button"
              className={`lyriks-seg__btn${view === "play" ? " is-on" : ""}`}
              aria-pressed={view === "play"}
              onClick={() => setView("play")}
            >
              Play
            </button>
            <button
              type="button"
              className={`lyriks-seg__btn${view === "studio" ? " is-on" : ""}`}
              aria-pressed={view === "studio"}
              onClick={() => setView("studio")}
            >
              Studio
            </button>
          </div>
        </div>

        {view === "play" ? (
          <Stage now={now} reduced={reduced} />
        ) : (
          <Studio now={now} reduced={reduced} />
        )}

        {view === "play" && <BeatStrip now={now} reduced={reduced} />}

        <div className="lyriks__controls">
          <button
            type="button"
            className="lyriks__play"
            onClick={toggle}
            disabled={reduced}
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? <PauseIcon /> : <PlayIcon />}
          </button>

          <button
            type="button"
            className="lyriks__restart"
            onClick={restart}
            aria-label="Restart"
          >
            <RestartIcon />
          </button>

          <div
            className="lyriks__progress"
            role="progressbar"
            aria-label="Playhead"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
          >
            <div
              className="lyriks__progress-fill"
              style={{ width: `${progress * 100}%` }}
            />
            <div
              className="lyriks__progress-head"
              style={{ left: `${progress * 100}%` }}
            />
          </div>

          <span className="lyriks__clock">{clock}</span>
        </div>

        {reduced && (
          <p className="lyriks__reduced-note">
            Reduced-motion is on. Showing a composed still of the level.
            Switch between Play and Studio to explore.
          </p>
        )}
      </div>
    </div>
  );
}
