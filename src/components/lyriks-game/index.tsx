import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ACCURACY_WEIGHT,
  HEALTH_DELTA,
  HIT_WINDOW,
  LABEL,
  SCORE_VALUE,
  clamp,
  easeOutCubic,
  fmtTime,
  gradeFor,
  judge,
} from "./engine";
import type { Beatmap, Judgment } from "./engine";
import { DEMO_BEATMAP } from "./demo-beatmap";
import { SynthTrack } from "./synth";
import "./styles.css";

/* Re-export the data contract so a real beatmap can be generated later. */
export type { Beatmap, Syllable, BeatEvent, Judgment } from "./engine";
export { DEMO_BEATMAP } from "./demo-beatmap";

/* ------------------------------ config ---------------------------- */

const APPROACH = 1700; // ms a syllable takes to fall to the hit line
const HITLINE = 74; // % of stage height where the hit window sits
const LANES = 4;

const LANE_COLOR = ["#a855c8", "#e879b8", "#8fd4a8", "#e8c27a"];

const JUDGE_COLOR: Record<Judgment, string> = {
  perfect: "#8fd4a8",
  good: "#a855c8",
  early: "#e8c27a",
  late: "#e8c27a",
  miss: "#d9636b",
};

type View = "play" | "studio";
type Status = "idle" | "countin" | "playing" | "paused" | "finished";

type SylResult = {
  state: "pending" | "hit" | "miss" | "skip";
  judgment?: Judgment;
  delta?: number;
  at?: number;
};

interface Stats {
  score: number;
  combo: number;
  maxCombo: number;
  health: number;
  perfect: number;
  good: number;
  early: number;
  late: number;
  miss: number;
  resolved: number;
  weight: number;
}

interface FloatLabel {
  id: number;
  lane: number;
  judgment: Judgment;
}

interface Spark {
  id: number;
  lane: number;
  dx: number;
  dy: number;
  color: string;
}

function freshStats(): Stats {
  return {
    score: 0,
    combo: 0,
    maxCombo: 0,
    health: 100,
    perfect: 0,
    good: 0,
    early: 0,
    late: 0,
    miss: 0,
    resolved: 0,
    weight: 0,
  };
}

/* --------------------------- reduced motion ----------------------- */

function useSystemReducedMotion(): boolean {
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

/* ------------------------------ icons ----------------------------- */

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path d="M8 5.5v13l11-6.5-11-6.5z" fill="currentColor" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <rect x="6" y="5" width="4" height="14" rx="1.2" fill="currentColor" />
      <rect x="14" y="5" width="4" height="14" rx="1.2" fill="currentColor" />
    </svg>
  );
}
function RestartIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
      <path
        d="M12 5V2L7 6l5 4V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z"
        fill="currentColor"
      />
    </svg>
  );
}

/* ------------------------------ root ------------------------------ */

export function LyriksGame({ beatmap = DEMO_BEATMAP }: { beatmap?: Beatmap }) {
  const systemReduced = useSystemReducedMotion();
  const [userMotion, setUserMotion] = useState<boolean | null>(null);
  const reduced = userMotion == null ? systemReduced : !userMotion;

  const [view, setView] = useState<View>("play");
  const [status, setStatus] = useState<Status>("idle");
  const [now, setNow] = useState(0);
  const [countNum, setCountNum] = useState(3);
  const [noFail, setNoFail] = useState(false);
  const [muted, setMuted] = useState(false);
  const [failed, setFailed] = useState(false);

  const [results, setResults] = useState<SylResult[]>(() =>
    beatmap.syllables.map(() => ({ state: "pending" })),
  );
  const [stats, setStats] = useState<Stats>(freshStats);
  const [floats, setFloats] = useState<FloatLabel[]>([]);
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [shake, setShake] = useState(false);

  const resultsRef = useRef<SylResult[]>(results);
  const statsRef = useRef<Stats>(stats);
  const synthRef = useRef<SynthTrack | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const reducedRef = useRef(reduced);
  const noFailRef = useRef(noFail);
  const mutedRef = useRef(muted);
  const startFromRef = useRef(0);
  const idRef = useRef(0);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    reducedRef.current = reduced;
  }, [reduced]);
  useEffect(() => {
    noFailRef.current = noFail;
  }, [noFail]);
  useEffect(() => {
    mutedRef.current = muted;
    synthRef.current?.setMuted(muted);
  }, [muted]);

  const kickTimes = useMemo(
    () => beatmap.beats.filter((b) => b.kind === "kick").map((b) => b.t),
    [beatmap.beats],
  );

  /* --------------------------- clock --------------------------- */

  const readClock = useCallback((): number => {
    if (beatmap.audioSrc && audioRef.current) {
      return audioRef.current.currentTime * 1000;
    }
    if (synthRef.current) return synthRef.current.getTime();
    return 0;
  }, [beatmap.audioSrc]);

  /* ------------------------- visual bursts --------------------- */

  const spawnFloat = useCallback((lane: number, j: Judgment) => {
    const id = idRef.current++;
    setFloats((f) => [...f, { id, lane, judgment: j }]);
    const to = window.setTimeout(() => {
      setFloats((f) => f.filter((x) => x.id !== id));
    }, 650);
    timersRef.current.push(to);
  }, []);

  const spawnSparks = useCallback((lane: number, color: string) => {
    if (reducedRef.current) return;
    const batch: Spark[] = [];
    const count = 9;
    for (let i = 0; i < count; i++) {
      const a = (Math.PI * 2 * i) / count + Math.random() * 0.6;
      const r = 26 + Math.random() * 40;
      batch.push({
        id: idRef.current++,
        lane,
        dx: Math.cos(a) * r,
        dy: Math.sin(a) * r,
        color,
      });
    }
    setSparks((s) => [...s, ...batch]);
    const ids = new Set(batch.map((b) => b.id));
    const to = window.setTimeout(() => {
      setSparks((s) => s.filter((x) => !ids.has(x.id)));
    }, 600);
    timersRef.current.push(to);
  }, []);

  const triggerShake = useCallback(() => {
    if (reducedRef.current) return;
    setShake(true);
    const to = window.setTimeout(() => setShake(false), 300);
    timersRef.current.push(to);
  }, []);

  /* --------------------------- finish -------------------------- */

  const finish = useCallback(
    (didFail: boolean) => {
      if (beatmap.audioSrc) audioRef.current?.pause();
      else synthRef.current?.pause();
      setFailed(didFail);
      setStatus("finished");
    },
    [beatmap.audioSrc],
  );

  /* -------------------------- resolving ------------------------ */

  const applyResolve = useCallback(
    (i: number, j: Judgment, delta: number, t: number) => {
      const res = resultsRef.current;
      if (res[i].state !== "pending") return;
      res[i] = {
        state: j === "miss" ? "miss" : "hit",
        judgment: j,
        delta,
        at: t,
      };
      resultsRef.current = res;
      setResults(res.slice());

      const s = statsRef.current;
      s[j] += 1;
      s.resolved += 1;
      s.weight += ACCURACY_WEIGHT[j];
      if (j === "miss") {
        s.combo = 0;
      } else {
        s.combo += 1;
        s.maxCombo = Math.max(s.maxCombo, s.combo);
        s.score += Math.round(
          SCORE_VALUE[j] * (1 + Math.min(s.combo, 50) * 0.02),
        );
      }
      s.health = clamp(s.health + HEALTH_DELTA[j], 0, 100);
      setStats({ ...s });

      const lane = beatmap.syllables[i].lane ?? 0;
      spawnFloat(lane, j);
      if (j === "perfect" || j === "good") {
        spawnSparks(lane, JUDGE_COLOR[j]);
      }
      if (j === "perfect" && s.combo > 0 && s.combo % 8 === 0) {
        triggerShake();
      }
      if (j === "miss" && s.health <= 0 && !noFailRef.current) {
        finish(true);
      }
    },
    [beatmap.syllables, spawnFloat, spawnSparks, triggerShake, finish],
  );

  /* --------------------------- hitting ------------------------- */

  const registerHit = useCallback(
    (targetIndex?: number) => {
      if (status !== "playing") return;
      const t = readClock();
      const syls = beatmap.syllables;
      const res = resultsRef.current;

      let idx = targetIndex ?? -1;
      if (targetIndex == null) {
        let bestAbs = Infinity;
        for (let i = 0; i < syls.length; i++) {
          if (res[i].state !== "pending") continue;
          const d = Math.abs(t - syls[i].tHit);
          if (d < bestAbs) {
            bestAbs = d;
            idx = i;
          }
        }
        if (idx < 0 || bestAbs > HIT_WINDOW) return;
      } else if (res[idx].state !== "pending") {
        return;
      }

      const delta = t - syls[idx].tHit;
      const j = judge(delta);
      if (j === "miss") return; // too far from the beat to commit a tap
      applyResolve(idx, j, delta, t);
    },
    [status, readClock, beatmap.syllables, applyResolve],
  );

  /* ---------------------- run lifecycle ------------------------ */

  const ensureSynth = useCallback(() => {
    if (!beatmap.audioSrc && !synthRef.current) {
      synthRef.current = new SynthTrack(beatmap);
      synthRef.current.setMuted(mutedRef.current);
    }
  }, [beatmap]);

  const resetRun = useCallback(() => {
    resultsRef.current = beatmap.syllables.map(() => ({
      state: "pending" as const,
    }));
    setResults(resultsRef.current.slice());
    statsRef.current = freshStats();
    setStats(freshStats());
    setFloats([]);
    setSparks([]);
    setShake(false);
    setFailed(false);
    setNow(0);
  }, [beatmap.syllables]);

  const startPlayback = useCallback(
    (fromMs: number) => {
      if (beatmap.audioSrc && audioRef.current) {
        audioRef.current.currentTime = fromMs / 1000;
        void audioRef.current.play();
      } else {
        void synthRef.current?.start(fromMs);
      }
      setStatus("playing");
    },
    [beatmap.audioSrc],
  );

  const beginCountIn = useCallback(
    (fromMs: number) => {
      ensureSynth();
      startFromRef.current = fromMs;
      setCountNum(3);
      setStatus("countin");
    },
    [ensureSynth],
  );

  // Count-in sequencer: 3 . 2 . 1 . go.
  useEffect(() => {
    if (status !== "countin") return;
    const stepMs = reducedRef.current ? 420 : 520;
    synthRef.current?.click(true);
    let n = 3;
    const local: number[] = [];
    const step = () => {
      const id = window.setTimeout(() => {
        n -= 1;
        if (n >= 1) {
          setCountNum(n);
          synthRef.current?.click(n === 1);
          step();
        } else {
          startPlayback(startFromRef.current);
        }
      }, stepMs);
      local.push(id);
      timersRef.current.push(id);
    };
    step();
    return () => {
      for (const id of local) clearTimeout(id);
    };
  }, [status, startPlayback]);

  // Main transport loop: advance clock, auto-miss, end-of-song.
  useEffect(() => {
    if (status !== "playing") return;
    let raf = 0;
    const frame = () => {
      const t = readClock();
      setNow(t);
      const res = resultsRef.current;
      const syls = beatmap.syllables;
      for (let i = 0; i < syls.length; i++) {
        if (res[i].state === "pending" && t - syls[i].tHit > HIT_WINDOW) {
          applyResolve(i, "miss", t - syls[i].tHit, t);
        }
      }
      if (t >= beatmap.duration) {
        finish(false);
        return;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [status, readClock, beatmap, applyResolve, finish]);

  // Keyboard taps while playing.
  useEffect(() => {
    if (status !== "playing") return;
    const keys = new Set([
      " ",
      "Spacebar",
      "j",
      "J",
      "f",
      "F",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
    ]);
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (!keys.has(e.key)) return;
      e.preventDefault();
      registerHit();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [status, registerHit]);

  // Unmount cleanup: no dangling nodes, loops or timers.
  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      synthRef.current?.dispose();
      synthRef.current = null;
      for (const id of timers) clearTimeout(id);
    };
  }, []);

  /* --------------------------- controls ------------------------ */

  const onPlayPause = useCallback(() => {
    if (status === "playing") {
      if (beatmap.audioSrc) audioRef.current?.pause();
      else synthRef.current?.pause();
      setStatus("paused");
      return;
    }
    if (status === "paused") {
      startPlayback(readClock());
      return;
    }
    // idle or finished: fresh run with count-in
    resetRun();
    beginCountIn(0);
  }, [status, beatmap.audioSrc, startPlayback, readClock, resetRun, beginCountIn]);

  const onRestart = useCallback(() => {
    if (beatmap.audioSrc) audioRef.current?.pause();
    else synthRef.current?.pause();
    resetRun();
    beginCountIn(0);
  }, [beatmap.audioSrc, resetRun, beginCountIn]);

  const onSeek = useCallback(
    (ms: number) => {
      if (status === "countin") return;
      ensureSynth();
      const to = clamp(ms, 0, beatmap.duration);
      if (beatmap.audioSrc) audioRef.current?.pause();
      else synthRef.current?.pause();

      resultsRef.current = beatmap.syllables.map((s) =>
        s.tHit < to - HIT_WINDOW
          ? { state: "skip" as const }
          : { state: "pending" as const },
      );
      setResults(resultsRef.current.slice());
      statsRef.current = freshStats();
      setStats(freshStats());
      setFloats([]);
      setSparks([]);
      setFailed(false);

      if (beatmap.audioSrc && audioRef.current) {
        audioRef.current.currentTime = to / 1000;
      } else {
        synthRef.current?.seek(to);
      }
      setNow(to);
      setStatus((st) => (st === "idle" ? "idle" : "paused"));
    },
    [status, ensureSynth, beatmap.audioSrc, beatmap.duration, beatmap.syllables],
  );

  const onStageDown = useCallback(() => registerHit(), [registerHit]);

  /* --------------------------- derived ------------------------- */

  const accuracy = stats.resolved > 0 ? (stats.weight / stats.resolved) * 100 : 100;
  const grade = gradeFor(accuracy);
  const progress = beatmap.duration > 0 ? now / beatmap.duration : 0;

  const kickFlash = useMemo(() => {
    if (reduced || status !== "playing") return 0;
    let best = Infinity;
    for (const kt of kickTimes) {
      const d = Math.abs(now - kt);
      if (d < best) best = d;
    }
    return best < 60 ? (1 - best / 60) * 0.5 : 0;
  }, [now, kickTimes, reduced, status]);

  /* ----------------------------- render ------------------------ */

  const playing = status === "playing";
  const showStage =
    status === "playing" || status === "paused" || status === "finished";

  return (
    <div className={`lyg${reduced ? " lyg--reduced" : ""}`}>
      {beatmap.audioSrc ? (
        <audio
          ref={audioRef}
          src={beatmap.audioSrc}
          preload="auto"
          onEnded={() => finish(false)}
        />
      ) : null}

      <div className="lyg__frame">
        <div className="lyg__topbar">
          <div className="lyg__brand">
            <span className="lyg__brand-mark">◖◗</span>
            <span className="lyg__brand-name">Lyriks</span>
            <span className="lyg__brand-track">
              {beatmap.title} · {beatmap.artist}
            </span>
          </div>

          <div className="lyg-seg" role="group" aria-label="View">
            <button
              type="button"
              className={`lyg-seg__btn${view === "play" ? " is-on" : ""}`}
              aria-pressed={view === "play"}
              onClick={() => setView("play")}
            >
              Play
            </button>
            <button
              type="button"
              className={`lyg-seg__btn${view === "studio" ? " is-on" : ""}`}
              aria-pressed={view === "studio"}
              onClick={() => setView("studio")}
            >
              Studio
            </button>
          </div>
        </div>

        {view === "play" ? (
          <>
            {/* HUD */}
            <div className="lyg-hud">
              <div className="lyg-hud__stat">
                <span className="lyg-hud__label">score</span>
                <span className="lyg-hud__score">
                  {stats.score.toLocaleString()}
                </span>
              </div>
              <div className="lyg-hud__stat lyg-hud__stat--combo">
                <span className="lyg-hud__label">combo</span>
                <span className="lyg-hud__combo" key={stats.combo}>
                  {stats.combo}
                  <i>x</i>
                </span>
              </div>
              <div className="lyg-hud__stat">
                <span className="lyg-hud__label">accuracy</span>
                <span className="lyg-hud__acc">{accuracy.toFixed(1)}%</span>
              </div>
              <div className="lyg-hud__health">
                <span className="lyg-hud__label">energy</span>
                <div className="lyg-hud__bar">
                  <div
                    className={`lyg-hud__fill${stats.health <= 25 ? " is-low" : ""}`}
                    style={{ width: `${stats.health}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Stage */}
            <div
              className={`lyg-stage${shake ? " is-shake" : ""}`}
              onPointerDown={onStageDown}
            >
              {!reduced && (
                <div
                  className="lyg-stage__flash"
                  style={{ opacity: kickFlash }}
                  aria-hidden="true"
                />
              )}
              <div className="lyg-stage__grid" aria-hidden="true">
                {Array.from({ length: LANES }, (_, l) => (
                  <span key={l} className="lyg-stage__lane" />
                ))}
              </div>
              <div
                className="lyg-stage__hitline"
                style={{ top: `${HITLINE}%` }}
                aria-hidden="true"
              />

              {showStage &&
                beatmap.syllables.map((syl, i) => {
                  const res = results[i];
                  if (res.state === "skip") return null;
                  const lane = syl.lane ?? 0;
                  const left = ((lane + 0.5) / LANES) * 100;
                  const appear = syl.tHit - APPROACH;
                  const resolvedAt = res.at;

                  if (res.state === "hit" || res.state === "miss") {
                    const since = now - (resolvedAt ?? syl.tHit);
                    if (since > 440 || since < 0) return null;
                  } else {
                    if (now < appear - 40) return null;
                    if (now > syl.tHit + HIT_WINDOW + 40) return null;
                  }

                  const prog = clamp((now - appear) / APPROACH, 0, 1.25);
                  const top = reduced ? HITLINE : prog * HITLINE;
                  const ringScale = 1 + (1 - clamp(prog, 0, 1)) * 2.3;
                  const active =
                    res.state === "pending" &&
                    Math.abs(now - syl.tHit) <= HIT_WINDOW;
                  const color =
                    res.judgment != null
                      ? JUDGE_COLOR[res.judgment]
                      : LANE_COLOR[lane % LANE_COLOR.length];

                  const hit = res.state === "hit";
                  const miss = res.state === "miss";
                  const since = hit || miss ? now - (resolvedAt ?? syl.tHit) : 0;
                  const pop = hit ? 1 + 0.5 * (1 - easeOutCubic(since / 440)) : 1;
                  const fade =
                    hit || miss ? clamp(1 - since / 440, 0, 1) : 1;

                  return (
                    <div
                      key={i}
                      role="button"
                      tabIndex={-1}
                      aria-label={`Tap syllable ${syl.text}`}
                      className={`lyg-syl${syl.emphasis ? " is-emph" : ""}${
                        active ? " is-active" : ""
                      }${hit ? " is-hit" : ""}${miss ? " is-miss" : ""}`}
                      style={{
                        left: `${left}%`,
                        top: `${top}%`,
                        color,
                        opacity: fade,
                      }}
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        registerHit(i);
                      }}
                    >
                      {!reduced && res.state === "pending" && (
                        <span
                          className="lyg-syl__ring"
                          style={{
                            transform: `translate(-50%, -50%) scale(${ringScale})`,
                            opacity: clamp(prog * 1.3, 0, 1) * 0.65,
                          }}
                        />
                      )}
                      {active && reduced && (
                        <span className="lyg-syl__ring is-static" />
                      )}
                      <span
                        className="lyg-syl__word"
                        style={{
                          transform: `translate(-50%, -50%) scale(${pop})`,
                        }}
                      >
                        {syl.text}
                      </span>
                    </div>
                  );
                })}

              {/* floating judgments */}
              {floats.map((f) => (
                <span
                  key={f.id}
                  className={`lyg-float lyg-float--${f.judgment}`}
                  style={{
                    left: `${((f.lane + 0.5) / LANES) * 100}%`,
                    top: `${HITLINE}%`,
                    color: JUDGE_COLOR[f.judgment],
                  }}
                >
                  {LABEL[f.judgment]}
                </span>
              ))}

              {/* particles */}
              {sparks.map((s) => (
                <span
                  key={s.id}
                  className="lyg-spark"
                  style={
                    {
                      left: `${((s.lane + 0.5) / LANES) * 100}%`,
                      top: `${HITLINE}%`,
                      background: s.color,
                      "--dx": `${s.dx}px`,
                      "--dy": `${s.dy}px`,
                    } as React.CSSProperties
                  }
                />
              ))}

              {/* idle hint */}
              {status === "idle" && (
                <div className="lyg-overlay">
                  <div className="lyg-overlay__card">
                    <p className="lyg-overlay__kicker">Lyriks · tap the beat</p>
                    <h3 className="lyg-overlay__title">{beatmap.title}</h3>
                    <p className="lyg-overlay__sub">
                      Tap each syllable as it lands on the line. Use the pad,
                      click a word, or press Space · J · F.
                    </p>
                    <button
                      type="button"
                      className="lyg-btn lyg-btn--primary"
                      onClick={onPlayPause}
                    >
                      <PlayIcon /> Play
                    </button>
                  </div>
                </div>
              )}

              {/* count-in */}
              {status === "countin" && (
                <div className="lyg-overlay lyg-overlay--count" aria-hidden="true">
                  <span className="lyg-count" key={countNum}>
                    {countNum}
                  </span>
                </div>
              )}

              {/* results */}
              {status === "finished" && (
                <div className="lyg-overlay">
                  <div className="lyg-results">
                    <div
                      className={`lyg-results__grade lyg-grade--${grade}`}
                      style={{ color: failed ? JUDGE_COLOR.miss : undefined }}
                    >
                      {grade}
                    </div>
                    <div className="lyg-results__body">
                      <p className="lyg-results__head">
                        {failed ? "Song failed" : "Cleared"} · {beatmap.title}
                      </p>
                      <div className="lyg-results__row">
                        <span>Score</span>
                        <b>{stats.score.toLocaleString()}</b>
                      </div>
                      <div className="lyg-results__row">
                        <span>Max combo</span>
                        <b>{stats.maxCombo}x</b>
                      </div>
                      <div className="lyg-results__row">
                        <span>Accuracy</span>
                        <b>{accuracy.toFixed(1)}%</b>
                      </div>
                      <div className="lyg-results__break">
                        <span className="lyg-tag lyg-tag--perfect">
                          Perfect {stats.perfect}
                        </span>
                        <span className="lyg-tag lyg-tag--good">
                          Good {stats.good}
                        </span>
                        <span className="lyg-tag lyg-tag--ok">
                          Early {stats.early} · Late {stats.late}
                        </span>
                        <span className="lyg-tag lyg-tag--miss">
                          Miss {stats.miss}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="lyg-btn lyg-btn--primary"
                        onClick={onRestart}
                      >
                        <RestartIcon /> Retry
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* hit pad */}
            <div
              className="lyg-pad"
              role="button"
              tabIndex={0}
              aria-label="Tap pad: hit the active syllable"
              onPointerDown={() => registerHit()}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  registerHit();
                }
              }}
            >
              <span className="lyg-pad__text">
                TAP · Space · J · F · ↑ ↓ ← →
              </span>
            </div>

            {/* beat strip */}
            <div className="lyg-beats" aria-hidden="true">
              <div className="lyg-beats__track">
                {beatmap.beats.map((b, i) => {
                  const x = (b.t / beatmap.duration) * 100;
                  if (b.kind === "section") {
                    return (
                      <span
                        key={`s-${i}`}
                        className="lyg-beats__section"
                        style={{ left: `${x}%` }}
                      >
                        <i />
                        <em>{b.label}</em>
                      </span>
                    );
                  }
                  if (b.kind === "hat") {
                    return (
                      <span
                        key={`h-${i}`}
                        className="lyg-beats__hat"
                        style={{ left: `${x}%` }}
                      />
                    );
                  }
                  const near = playing && !reduced && Math.abs(now - b.t) < 70;
                  return (
                    <span
                      key={`b-${i}`}
                      className={`lyg-beats__mark lyg-beats__mark--${b.kind}${
                        near ? " is-hit" : ""
                      }`}
                      style={{ left: `${x}%` }}
                    >
                      {b.kind === "kick" ? "●" : "✕"}
                    </span>
                  );
                })}
                <div
                  className="lyg-beats__head"
                  style={{ left: `${clamp(progress * 100, 0, 100)}%` }}
                />
              </div>
            </div>

            {/* transport */}
            <div className="lyg-transport">
              <button
                type="button"
                className="lyg-btn lyg-btn--round"
                aria-label={playing ? "Pause" : "Play"}
                onClick={onPlayPause}
              >
                {playing ? <PauseIcon /> : <PlayIcon />}
              </button>
              <button
                type="button"
                className="lyg-btn lyg-btn--ghost"
                aria-label="Restart"
                onClick={onRestart}
              >
                <RestartIcon />
              </button>

              <input
                className="lyg-scrub"
                type="range"
                min={0}
                max={beatmap.duration}
                step={50}
                value={clamp(now, 0, beatmap.duration)}
                aria-label="Seek"
                onChange={(e) => onSeek(Number(e.target.value))}
              />
              <span className="lyg-clock">
                {fmtTime(now)} / {fmtTime(beatmap.duration)}
              </span>
            </div>

            <div className="lyg-toggles">
              <button
                type="button"
                className={`lyg-toggle${noFail ? " is-on" : ""}`}
                aria-pressed={noFail}
                onClick={() => setNoFail((v) => !v)}
              >
                No-fail {noFail ? "on" : "off"}
              </button>
              <button
                type="button"
                className={`lyg-toggle${muted ? " is-on" : ""}`}
                aria-pressed={muted}
                onClick={() => setMuted((v) => !v)}
              >
                {muted ? "Muted" : "Sound on"}
              </button>
              <button
                type="button"
                className={`lyg-toggle${reduced ? " is-on" : ""}`}
                aria-pressed={reduced}
                onClick={() => setUserMotion(reduced)}
              >
                Motion {reduced ? "reduced" : "on"}
              </button>
            </div>
          </>
        ) : (
          <Studio beatmap={beatmap} now={now} reduced={reduced} />
        )}
      </div>
    </div>
  );
}

/* ----------------------------- studio ----------------------------- */

const WAVE = Array.from({ length: 160 }, (_, i) => {
  const v =
    Math.sin(i * 0.5) * 0.5 +
    Math.sin(i * 0.17 + 1.3) * 0.32 +
    Math.sin(i * 1.1 + 0.6) * 0.18;
  return 0.16 + 0.84 * Math.abs(v);
});

function Studio({
  beatmap,
  now,
  reduced,
}: {
  beatmap: Beatmap;
  now: number;
  reduced: boolean;
}) {
  const seconds = Math.ceil(beatmap.duration / 1000);
  const headPct = clamp((now / beatmap.duration) * 100, 0, 100);

  return (
    <div className="lyg-studio">
      <div className="lyg-studio__head">
        <span className="lyg-studio__dot" />
        <span className="lyg-studio__dot" />
        <span className="lyg-studio__dot" />
        <span className="lyg-studio__title">lyriks · sync editor</span>
        <span className="lyg-studio__rate">0.25x slow-mo</span>
      </div>

      <div className="lyg-studio__lyrics">
        <span className="lyg-studio__lyrics-label">pasted lyrics</span>
        {beatmap.lines.map((l) => (
          <p key={l.id}>{l.text}</p>
        ))}
      </div>

      <div className="lyg-studio__timeline">
        <div className="lyg-studio__ruler">
          {Array.from({ length: seconds + 1 }, (_, s) => (
            <span
              key={s}
              className="lyg-studio__tick"
              style={{ left: `${((s * 1000) / beatmap.duration) * 100}%` }}
            >
              <i />
              {s}s
            </span>
          ))}
        </div>

        <div className="lyg-studio__wave" aria-hidden="true">
          {WAVE.map((h, i) => (
            <span key={i} style={{ height: `${h * 100}%` }} />
          ))}
        </div>

        <div className="lyg-studio__lanes">
          {beatmap.lines.map((line) => (
            <div key={line.id} className="lyg-studio__lane">
              {beatmap.syllables
                .filter((s) => s.lineId === line.id)
                .map((syl, i) => {
                  const active =
                    !reduced && Math.abs(now - syl.tHit) < 150;
                  const color =
                    LANE_COLOR[(syl.lane ?? 0) % LANE_COLOR.length];
                  return (
                    <span
                      key={i}
                      className={`lyg-chip${active ? " is-active" : ""}`}
                      style={{
                        left: `${(syl.tHit / beatmap.duration) * 100}%`,
                        borderColor: color,
                        color,
                      }}
                    >
                      {syl.text}
                    </span>
                  );
                })}
            </div>
          ))}
        </div>

        <div className="lyg-studio__head-line" style={{ left: `${headPct}%` }}>
          <span className="lyg-studio__hint">tap to mark ↵</span>
        </div>
      </div>

      <p className="lyg-studio__note">
        Paste the lyrics once, slow the track down, and tap each syllable as you
        hear it. Lyriks records a timestamp per syllable plus the kicks, snares
        and section markers. Those timestamps are exactly the data the Play mode
        scores against.
      </p>
    </div>
  );
}
