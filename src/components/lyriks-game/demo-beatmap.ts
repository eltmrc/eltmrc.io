/* ------------------------------------------------------------------ *
 * Built-in demo beatmap.
 *
 * The lyrics below are an ORIGINAL verse written for this demo (not a
 * real/commercial song), themed around the act of syncing to a beat so
 * it fits the blog post. It is hand-synced to the synthesized backing
 * track (100 bpm, A-minor groove) so the demo is fun to play out of the
 * box and carries zero copyright.
 * ------------------------------------------------------------------ */

import type { Beatmap, BeatEvent, Syllable } from "./engine";

const BPM = 100;
const BEAT = 60000 / BPM; // 600ms
const DURATION = 16800;

const LINES = [
  { id: 0, text: "Count it in, let the little lights align" },
  { id: 1, text: "Tap the beat, every syllable on time" },
  { id: 2, text: "Hold the line, watch the ripple when you glow" },
  { id: 3, text: "Miss or hit, it is the rhythm that you know" },
] as const;

/**
 * Each entry: [text, tHit(ms), emphasis]. Syllables mostly sit on the
 * eighth-note grid (300ms) with short rests between phrases.
 */
const RAW: Array<[string, number, boolean?]> = [
  // Line 0
  ["Count", 1200, true],
  ["it", 1500],
  ["in", 1800],
  ["let", 2400],
  ["the", 2700],
  ["lit", 3000, true],
  ["tle", 3300],
  ["lights", 3600, true],
  ["a", 3900],
  ["lign", 4200, true],
  // Line 1
  ["Tap", 4800, true],
  ["the", 5100],
  ["beat", 5400, true],
  ["ev", 6000],
  ["ery", 6300],
  ["syl", 6600],
  ["la", 6900],
  ["ble", 7200],
  ["on", 7500],
  ["time", 7800, true],
  // Line 2
  ["Hold", 8400, true],
  ["the", 8700],
  ["line", 9000, true],
  ["watch", 9600],
  ["the", 9900],
  ["rip", 10200],
  ["ple", 10500],
  ["when", 10800],
  ["you", 11100],
  ["glow", 11400, true],
  // Line 3
  ["Miss", 12000, true],
  ["or", 12300],
  ["hit", 12600, true],
  ["it", 13200],
  ["is", 13500],
  ["the", 13800],
  ["rhy", 14100],
  ["thm", 14400],
  ["that", 14700],
  ["you", 15000],
  ["know", 15300, true],
];

/** Wavy lane pattern so consecutive syllables never stack. */
const LANE_PATTERN = [0, 1, 2, 3, 2, 1];

function buildSyllables(): Syllable[] {
  let lineId = 0;
  let count = 0;
  const perLine = RAW.length / LINES.length;
  return RAW.map(([text, tHit, emphasis], i) => {
    if (count >= perLine) {
      count = 0;
      lineId = Math.min(lineId + 1, LINES.length - 1);
    }
    count++;
    return {
      text,
      tHit,
      lane: LANE_PATTERN[i % LANE_PATTERN.length],
      emphasis: Boolean(emphasis),
      lineId,
    };
  });
}

function buildBeats(): BeatEvent[] {
  const beats: BeatEvent[] = [];
  const eighth = BEAT / 2;
  const steps = Math.ceil(DURATION / eighth);
  for (let i = 0; i < steps; i++) {
    const t = Math.round(i * eighth);
    beats.push({ t, kind: "hat" });
    if (i % 2 === 0) {
      const beatIndex = i / 2;
      const inBar = beatIndex % 4;
      beats.push({ t, kind: inBar === 0 || inBar === 2 ? "kick" : "snare" });
    }
  }
  beats.push({ t: 0, kind: "section", label: "intro" });
  beats.push({ t: 1200, kind: "section", label: "verse" });
  beats.push({ t: 8400, kind: "section", label: "lift" });
  beats.push({ t: 15300, kind: "section", label: "out" });
  return beats.sort((a, b) => a.t - b.t);
}

export const DEMO_BEATMAP: Beatmap = {
  id: "lyriks-demo-align",
  title: "On Time",
  artist: "Lyriks demo",
  bpm: BPM,
  duration: DURATION,
  offset: 0,
  lines: LINES.map((l) => ({ id: l.id, text: l.text })),
  syllables: buildSyllables(),
  beats: buildBeats(),
};
