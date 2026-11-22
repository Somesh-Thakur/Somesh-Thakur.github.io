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

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    noise = ctx.createBuffer(1, ctx.sampleRate * 1.5, ctx.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function burst(start: number, length: number, freq: number, q: number, gain: number) {
  const a = audio();
  if (!a || !noise) return;
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
  src.connect(filter).connect(g).connect(a.destination);
  src.start(t, Math.random() * 1, length + 0.05);
}

let lastScratch = 0;
/** Pencil on paper: a few soft, uneven strokes. */
export function scratch(seconds = 0.5) {
  if (!soundOn()) return;
  const now = performance.now();
  if (now - lastScratch < 250) return; // many lines start together; one sound is enough
  lastScratch = now;
  const strokes = Math.max(2, Math.round(seconds * 5));
  for (let i = 0; i < strokes; i++) {
    burst(i * (seconds / strokes) + Math.random() * 0.03, 0.09 + Math.random() * 0.08, 3800 + Math.random() * 1800, 1.4, 0.05);
  }
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
  o.connect(g).connect(a.destination);
  o.start();
  o.stop(a.currentTime + 0.4);
  burst(0, 0.08, 2500, 1, 0.06);
}
