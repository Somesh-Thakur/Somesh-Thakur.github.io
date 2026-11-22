// Paper and pencil sounds, synthesised with Web Audio (no audio files to download).
// Off by default; the speaker button turns them on and the choice is remembered.

const KEY = "sketchbook-sound";
export const SOUND_EVENT = "sketchbook:sound";

let ctx: AudioContext | null = null;
let noise: AudioBuffer | null = null;

export function soundOn(): boolean {
  try {
    return localStorage.getItem(KEY) === "on";
  } catch {
    return false;
  }
}

export function setSound(on: boolean) {
  try {
    localStorage.setItem(KEY, on ? "on" : "off");
  } catch {}
  if (on) audio(); // create/resume inside the click that turned it on
  window.dispatchEvent(new CustomEvent(SOUND_EVENT, { detail: on }));
}

let graphite: AudioBuffer | null = null;
let master: GainNode | null = null;

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(ctx.destination);

    const n = ctx.sampleRate * 1.5;
    noise = ctx.createBuffer(1, n, ctx.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < n; i++) data[i] = Math.random() * 2 - 1;

    // Graphite dragging over paper tooth: mostly sparse little clicks (the grain of the
    // paper) on a quiet hiss, with the pressure wobbling a few times a second.
    const m = ctx.sampleRate * 3;
    graphite = ctx.createBuffer(1, m, ctx.sampleRate);
    const g = graphite.getChannelData(0);
    let pressure = 0.6, target = 0.6, prev = 0;
    for (let i = 0; i < m; i++) {
      if (i % 900 === 0) target = 0.35 + Math.random() * 0.65;
      pressure += (target - pressure) * 0.0015;
      let v = (Math.random() * 2 - 1) * 0.22;
      if (Math.random() < 0.06) v += (Math.random() * 2 - 1) * (0.6 + Math.random() * 0.9);
      // gentle one-pole high-pass keeps it papery instead of rumbly
      const hp = v - prev * 0.6;
      prev = v;
      g[i] = hp * pressure;
    }
    // fade the ends so loops and slices never click
    const f = 400;
    for (let i = 0; i < f; i++) {
      g[i] *= i / f;
      g[m - 1 - i] *= i / f;
    }
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

/** The shared pencil voice: graphite texture shaped to sound like a soft HB on paper. */
function pencilChain(a: AudioContext) {
  const hp = a.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 1400;
  const body = a.createBiquadFilter();
  body.type = "peaking";
  body.frequency.value = 3600;
  body.Q.value = 0.8;
  body.gain.value = 5;
  const lp = a.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 8500;
  hp.connect(body).connect(lp);
  return { input: hp, output: lp };
}

function burst(start: number, length: number, freq: number, q: number, gain: number) {
  const a = audio();
  if (!a || !noise || !master) return;
  const src = a.createBufferSource();
  src.buffer = noise;
  const filter = a.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = freq;
  filter.Q.value = q;
  const g = a.createGain();
  const t = a.currentTime + start;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + Math.min(0.02, length / 3));
  g.gain.exponentialRampToValueAtTime(0.0001, t + length);
  src.connect(filter).connect(g).connect(master);
  src.start(t, Math.random() * 1, length + 0.05);
}

/** One pencil stroke: quick touch-down, a drag that eases off, a soft lift. */
function stroke(at: number, length: number, level: number) {
  const a = audio();
  if (!a || !graphite || !master) return;
  const src = a.createBufferSource();
  src.buffer = graphite;
  src.playbackRate.value = 0.85 + Math.random() * 0.35; // faster strokes sound brighter
  const { input, output } = pencilChain(a);
  const g = a.createGain();
  const t = a.currentTime + at;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(level, t + 0.012);
  g.gain.setTargetAtTime(level * 0.55, t + 0.03, length / 2.5);
  g.gain.setTargetAtTime(0.0001, t + length, 0.025);
  src.connect(input);
  output.connect(g).connect(master);
  src.start(t, Math.random() * 2.5, length + 0.2);
}

let lastScratch = 0;
/** Sketching a drawing in: a run of short strokes with tiny pauses, like hand-lettering. */
export function scratch(seconds = 0.5) {
  if (!soundOn()) return;
  const now = performance.now();
  if (now - lastScratch < 350) return; // many lines start together; one sound is enough
  lastScratch = now;
  const total = Math.min(1.6, Math.max(0.25, seconds));
  let t = 0;
  while (t < total) {
    const len = 0.07 + Math.random() * 0.16;
    stroke(t, len, 0.16 + Math.random() * 0.12);
    t += len + 0.02 + Math.random() * 0.07;
  }
}

/* Free drawing: one looping pencil voice whose loudness follows how fast you move. */
let pen: { src: AudioBufferSourceNode; g: GainNode } | null = null;

export function penDown() {
  if (!soundOn() || pen) return;
  const a = audio();
  if (!a || !graphite || !master) return;
  const src = a.createBufferSource();
  src.buffer = graphite;
  src.loop = true;
  const { input, output } = pencilChain(a);
  const g = a.createGain();
  g.gain.value = 0.0001;
  src.connect(input);
  output.connect(g).connect(master);
  src.start(0, Math.random() * 2.5);
  pen = { src, g };
}

/** speed in CSS pixels per millisecond */
export function penMove(speed: number) {
  if (!pen || !ctx) return;
  const p = pen.g.gain as AudioParam & { cancelAndHoldAtTime?: (t: number) => void };
  if (p.cancelAndHoldAtTime) p.cancelAndHoldAtTime(ctx.currentTime);
  else p.cancelScheduledValues(ctx.currentTime);
  const level = Math.min(0.32, speed * 0.12);
  pen.g.gain.setTargetAtTime(Math.max(0.0001, level), ctx.currentTime, 0.03);
  pen.src.playbackRate.setTargetAtTime(0.8 + Math.min(0.5, speed * 0.25), ctx.currentTime, 0.05);
  // when the pointer stops, the sound should stop too
  pen.g.gain.setTargetAtTime(0.0001, ctx.currentTime + 0.08, 0.05);
}

export function penUp() {
  if (!pen || !ctx) return;
  const { src, g } = pen;
  g.gain.cancelScheduledValues(ctx.currentTime);
  g.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.03);
  src.stop(ctx.currentTime + 0.2);
  pen = null;
}

/** Paper being crushed: dense crackles. */
export function crunch() {
  if (!soundOn()) return;
  for (let i = 0; i < 16; i++) {
    burst(i * 0.022 + Math.random() * 0.015, 0.03 + Math.random() * 0.05, 1200 + Math.random() * 3000, 0.9, 0.2 + Math.random() * 0.15);
  }
}

/** A soft paper "pop" for achievements. */
export function pop() {
  if (!soundOn()) return;
  const a = audio();
  if (!a) return;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = "triangle";
  o.frequency.setValueAtTime(660, a.currentTime);
  o.frequency.exponentialRampToValueAtTime(990, a.currentTime + 0.12);
  g.gain.setValueAtTime(0.0001, a.currentTime);
  g.gain.exponentialRampToValueAtTime(0.08, a.currentTime + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + 0.35);
  o.connect(g).connect(master ?? a.destination);
  o.start();
  o.stop(a.currentTime + 0.4);
  burst(0, 0.08, 2500, 1, 0.06);
}
