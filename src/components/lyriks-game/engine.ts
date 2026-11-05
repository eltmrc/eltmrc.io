/* ------------------------------------------------------------------ *
 * Lyriks game engine: the data model + pure scoring / timing logic.
 *
 * Everything the game does is driven by a `Beatmap` data object, so a
 * real forced-aligned song can be swapped in later without touching any
 * game logic. The types below are the contract.
 * ------------------------------------------------------------------ */

export interface Syllable {
  text: string;
  /** ms, the exact beat the player must tap */
  tHit: number;
  /** 0..n optional column */
  lane?: number;
  /** stressed syllable */
  emphasis?: boolean;
  lineId: number;
}

export interface BeatEvent {
  t: number;
  kind: "kick" | "snare" | "hat" | "section";
  label?: string;
}

export interface Beatmap {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  /** ms */
  duration: number;
  offset?: number;
  /** optional URL; when absent, use the built-in synthesized backing track */
  audioSrc?: string;
  lines: { id: number; text: string }[];
  syllables: Syllable[];
  beats: BeatEvent[];
}

/* ------------------------------ judging --------------------------- */

export type Judgment = "perfect" | "good" | "early" | "late" | "miss";

/** Absolute timing windows in ms, measured as |now - tHit|. */
export const WINDOW = {
  perfect: 45,
  good: 90,
  ok: 140,
} as const;

/** Widest window a tap can still land a syllable. */
export const HIT_WINDOW = WINDOW.ok;

/**
 * Classify a tap. `delta = now - tHit`; negative means the player was
 * early, positive means late. Returns "miss" when outside every window.
 */
export function judge(delta: number): Judgment {
  const a = Math.abs(delta);
  if (a <= WINDOW.perfect) return "perfect";
  if (a <= WINDOW.good) return "good";
  if (a <= WINDOW.ok) return delta < 0 ? "early" : "late";
  return "miss";
}

export const SCORE_VALUE: Record<Judgment, number> = {
  perfect: 300,
  good: 200,
  early: 100,
  late: 100,
  miss: 0,
};

/** Weight used for the live accuracy percentage (max 1 per syllable). */
export const ACCURACY_WEIGHT: Record<Judgment, number> = {
  perfect: 1,
  good: 0.66,
  early: 0.33,
  late: 0.33,
  miss: 0,
};

/** Health delta applied per resolved syllable. */
export const HEALTH_DELTA: Record<Judgment, number> = {
  perfect: 1.6,
  good: 1,
  early: -1.5,
  late: -1.5,
  miss: -11,
};

export const LABEL: Record<Judgment, string> = {
  perfect: "Perfect",
  good: "Good",
  early: "Early",
  late: "Late",
  miss: "Miss",
};

export type Grade = "S" | "A" | "B" | "C" | "D";

export function gradeFor(accuracyPct: number): Grade {
  if (accuracyPct >= 95) return "S";
  if (accuracyPct >= 90) return "A";
  if (accuracyPct >= 80) return "B";
  if (accuracyPct >= 70) return "C";
  return "D";
}

/* ------------------------------ math ------------------------------ */

export const clamp = (v: number, a: number, b: number) =>
  Math.min(b, Math.max(a, v));

export const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);

export function easeOutBack(x: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

/** mm:ss.d readout for a ms value. */
export function fmtTime(ms: number): string {
  const safe = Math.max(0, ms);
  const total = safe / 1000;
  const m = Math.floor(total / 60);
  const s = Math.floor(total % 60);
  const d = Math.floor((safe % 1000) / 100);
  return `${m}:${s.toString().padStart(2, "0")}.${d}`;
}
