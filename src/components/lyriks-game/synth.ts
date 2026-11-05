/* ------------------------------------------------------------------ *
 * SynthTrack: a zero-asset Web Audio backing track.
 *
 * When a Beatmap has no `audioSrc`, this synthesizes the whole bed at
 * runtime (kick / snare / hat drums from the beatmap + a bassline and
 * an arp derived from the bpm and a small chord progression). Crucially
 * `getTime()` is the game clock: it is derived from AudioContext time so
 * the visuals can never drift away from the sound.
 * ------------------------------------------------------------------ */

import type { Beatmap, BeatEvent } from "./engine";

interface Voice {
  t: number;
  freq: number;
  dur: number;
  gain: number;
  type: OscillatorType;
}

const LOOKAHEAD_MS = 140;
const TICK_MS = 25;
const START_PAD_S = 0.08;

/** Minor-key progression (Am, F, C, G) as root + three chord tones, Hz. */
const PROGRESSION = [
  { root: 110.0, tones: [220.0, 261.63, 329.63] },
  { root: 87.31, tones: [174.61, 220.0, 261.63] },
  { root: 130.81, tones: [261.63, 329.63, 392.0] },
  { root: 98.0, tones: [196.0, 246.94, 293.66] },
] as const;

function buildVoices(map: Beatmap): Voice[] {
  const beat = 60000 / map.bpm;
  const bar = beat * 4;
  const eighth = beat / 2;
  const voices: Voice[] = [];
  const steps = Math.ceil(map.duration / eighth);

  for (let i = 0; i < steps; i++) {
    const t = i * eighth;
    const barIndex = Math.floor(t / bar);
    const chord = PROGRESSION[barIndex % PROGRESSION.length];
    const inBar = t - barIndex * bar;
    const beatPos = inBar / beat;
    const onBeat = Math.abs(beatPos - Math.round(beatPos)) < 0.01;

    // Bassline: root note on each quarter, with a fifth-ish lift mid-bar.
    if (onBeat) {
      const quarter = Math.round(beatPos);
      const bassFreq = quarter === 2 ? chord.root * 1.5 : chord.root;
      voices.push({
        t,
        freq: bassFreq,
        dur: beat * 0.82,
        gain: 0.16,
        type: "triangle",
      });
    }

    // Arp: a chord tone on every eighth, soft and plucky.
    const step = Math.round(inBar / eighth);
    const tone = chord.tones[step % chord.tones.length];
    voices.push({
      t,
      freq: onBeat ? tone : tone * 1.0,
      dur: eighth * 0.9,
      gain: onBeat ? 0.06 : 0.045,
      type: "triangle",
    });
  }
  return voices;
}

export class SynthTrack {
  readonly duration: number;

  private ctx: AudioContext;
  private master: GainNode;
  private noise: AudioBuffer;

  private drums: BeatEvent[];
  private voices: Voice[];

  private playing = false;
  private baseSongMs = 0;
  private baseAudioTime = 0;
  // Wall-clock fallback: if the AudioContext can't run (autoplay blocked,
  // no audio device), the game still advances off performance.now().
  private baseWallMs = 0;
  private scheduledUntil = 0;
  private timer: number | null = null;
  private active = new Set<AudioScheduledSourceNode>();

  constructor(map: Beatmap) {
    this.ctx = new AudioContext();
    this.duration = map.duration;

    const comp = this.ctx.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.ratio.value = 4;
    comp.attack.value = 0.003;
    comp.release.value = 0.2;

    this.master = this.ctx.createGain();
    this.master.gain.value = 0.85;
    this.master.connect(comp);
    comp.connect(this.ctx.destination);

    this.noise = this.makeNoise();
    this.drums = map.beats
      .filter((b) => b.kind !== "section")
      .sort((a, b) => a.t - b.t);
    this.voices = buildVoices(map);
  }

  /** Song time in ms. This is the authoritative game clock. */
  getTime(): number {
    if (!this.playing) return this.baseSongMs;
    // Prefer the audio clock (drift-free) once it is actually live, i.e. it
    // has advanced past the start anchor. If the context is suspended or its
    // clock is stalled (autoplay blocked, no audio device), fall back to the
    // wall clock so the game keeps playing instead of freezing.
    const audioLive =
      this.ctx.state === "running" && this.ctx.currentTime > this.baseAudioTime;
    if (audioLive) {
      return this.baseSongMs + (this.ctx.currentTime - this.baseAudioTime) * 1000;
    }
    return this.baseSongMs + (performance.now() - this.baseWallMs);
  }

  isPlaying(): boolean {
    return this.playing;
  }

  async start(fromMs: number): Promise<void> {
    // Start the clock synchronously so the game never hangs waiting on audio.
    // resume() can be slow or never settle when autoplay is blocked or there
    // is no audio device; the wall-clock fallback keeps the game playing until
    // (and if) the audio clock comes alive.
    this.baseSongMs = fromMs;
    this.baseAudioTime = this.ctx.currentTime + START_PAD_S;
    this.baseWallMs = performance.now() + START_PAD_S * 1000;
    this.scheduledUntil = fromMs - 1;
    this.playing = true;
    if (this.timer == null) {
      this.timer = window.setInterval(this.tick, TICK_MS);
    }
    this.tick();
    if (this.ctx.state === "suspended") {
      try {
        await this.ctx.resume();
        // Re-anchor so the (now live) audio clock lines up with elapsed wall time.
        this.baseAudioTime =
          this.ctx.currentTime - (performance.now() - this.baseWallMs) / 1000;
      } catch {
        /* resume can reject if the context was closed mid-gesture */
      }
    }
  }

  pause(): void {
    if (!this.playing) return;
    this.baseSongMs = this.getTime();
    this.playing = false;
    this.stopTimer();
    this.stopActive();
  }

  seek(ms: number): void {
    const wasPlaying = this.playing;
    this.stopActive();
    this.baseSongMs = ms;
    this.baseAudioTime = this.ctx.currentTime + START_PAD_S;
    this.baseWallMs = performance.now() + START_PAD_S * 1000;
    this.scheduledUntil = ms - 1;
    if (wasPlaying) this.tick();
  }

  setMuted(muted: boolean): void {
    const target = muted ? 0 : 0.85;
    this.master.gain.setTargetAtTime(target, this.ctx.currentTime, 0.02);
  }

  /** A short metronome click, for the count-in. */
  click(accent: boolean): void {
    void (this.ctx.state === "suspended" && this.ctx.resume());
    const now = this.ctx.currentTime + 0.01;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = "square";
    osc.frequency.value = accent ? 1320 : 880;
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(accent ? 0.22 : 0.14, now + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
    osc.connect(g);
    g.connect(this.master);
    this.track(osc, now, now + 0.1);
  }

  dispose(): void {
    this.playing = false;
    this.stopTimer();
    this.stopActive();
    try {
      this.master.disconnect();
    } catch {
      /* already disconnected */
    }
    void this.ctx.close();
  }

  /* ----------------------------- internals ----------------------- */

  private tick = (): void => {
    if (!this.playing) return;
    const horizon = this.getTime() + LOOKAHEAD_MS;
    for (const d of this.drums) {
      if (d.t > this.scheduledUntil && d.t <= horizon) {
        this.scheduleDrum(d.kind, this.audioTimeFor(d.t));
      }
    }
    for (const v of this.voices) {
      if (v.t > this.scheduledUntil && v.t <= horizon) {
        this.scheduleVoice(v, this.audioTimeFor(v.t));
      }
    }
    this.scheduledUntil = horizon;
  };

  private audioTimeFor(songMs: number): number {
    return this.baseAudioTime + (songMs - this.baseSongMs) / 1000;
  }

  private scheduleDrum(kind: BeatEvent["kind"], at: number): void {
    const t = Math.max(at, this.ctx.currentTime + 0.001);
    if (kind === "kick") this.kick(t);
    else if (kind === "snare") this.snare(t);
    else if (kind === "hat") this.hat(t);
  }

  private scheduleVoice(v: Voice, at: number): void {
    const t = Math.max(at, this.ctx.currentTime + 0.001);
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = v.type;
    osc.frequency.value = v.freq;
    const dur = v.dur / 1000;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(v.gain, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g);
    g.connect(this.master);
    this.track(osc, t, t + dur + 0.02);
  }

  private kick(t: number): void {
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(155, t);
    osc.frequency.exponentialRampToValueAtTime(48, t + 0.12);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.9, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
    osc.connect(g);
    g.connect(this.master);
    this.track(osc, t, t + 0.22);
  }

  private snare(t: number): void {
    const src = this.ctx.createBufferSource();
    src.buffer = this.noise;
    const hp = this.ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 1500;
    const ng = this.ctx.createGain();
    ng.gain.setValueAtTime(0.5, t);
    ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
    src.connect(hp);
    hp.connect(ng);
    ng.connect(this.master);

    const osc = this.ctx.createOscillator();
    const og = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = 185;
    og.gain.setValueAtTime(0.3, t);
    og.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
    osc.connect(og);
    og.connect(this.master);

    this.track(src, t, t + 0.18);
    this.track(osc, t, t + 0.12);
  }

  private hat(t: number): void {
    const src = this.ctx.createBufferSource();
    src.buffer = this.noise;
    const hp = this.ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 7000;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.18, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);
    src.connect(hp);
    hp.connect(g);
    g.connect(this.master);
    this.track(src, t, t + 0.06);
  }

  private makeNoise(): AudioBuffer {
    const len = Math.floor(this.ctx.sampleRate * 0.4);
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    return buf;
  }

  private track(node: AudioScheduledSourceNode, start: number, stop: number): void {
    node.onended = () => {
      this.active.delete(node);
      try {
        node.disconnect();
      } catch {
        /* already gone */
      }
    };
    this.active.add(node);
    node.start(start);
    node.stop(stop);
  }

  private stopActive(): void {
    for (const node of this.active) {
      try {
        node.stop();
      } catch {
        /* may not have started */
      }
      try {
        node.disconnect();
      } catch {
        /* already gone */
      }
    }
    this.active.clear();
  }

  private stopTimer(): void {
    if (this.timer != null) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
