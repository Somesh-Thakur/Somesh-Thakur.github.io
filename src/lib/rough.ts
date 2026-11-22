import { RoughGenerator } from "roughjs/bin/generator";
import type { Options } from "roughjs/bin/core";

// rough.js runs at build time (server components), so every wobbly line ships
// as plain SVG. A fixed seed per shape keeps the output identical between builds.
const gen = new RoughGenerator();

export type Shape =
  | { type: "rect"; x: number; y: number; w: number; h: number; o?: Options }
  | { type: "ellipse"; cx: number; cy: number; w: number; h: number; o?: Options }
  | { type: "line"; x1: number; y1: number; x2: number; y2: number; o?: Options }
  | { type: "curve"; pts: [number, number][]; o?: Options }
  | { type: "poly"; pts: [number, number][]; o?: Options }
  | { type: "path"; d: string; o?: Options };

export type Stroke = { d: string; color: string; width: number };

export function strokes(shapes: Shape[], base: Options = {}): Stroke[] {
  const out: Stroke[] = [];
  shapes.forEach((s, i) => {
    const o: Options = {
      roughness: 1.3,
      bowing: 1.2,
      strokeWidth: 2,
      stroke: "currentColor",
      ...base,
      seed: (base.seed ?? 7) + i * 13,
      ...s.o,
    };
    let d;
    switch (s.type) {
      case "rect": d = gen.rectangle(s.x, s.y, s.w, s.h, o); break;
      case "ellipse": d = gen.ellipse(s.cx, s.cy, s.w, s.h, o); break;
      case "line": d = gen.line(s.x1, s.y1, s.x2, s.y2, o); break;
      case "curve": d = gen.curve(s.pts, o); break;
      case "poly": d = gen.linearPath(s.pts, o); break;
      case "path": d = gen.path(s.d, o); break;
    }
    for (const p of gen.toPaths(d)) {
      const isFill = p.fill && p.fill !== "none";
      const color = isFill ? (p.fill as string) : p.stroke;
      // Split compound paths so each pen stroke animates on its own.
      // One decimal is plenty for a wobbly pencil line and keeps the page small
      // (rough.js's own rounding option isn't applied by toPaths).
      const d = p.d.replace(/-?\d+\.\d+/g, (n) => String(Math.round(Number(n) * 10) / 10));
      for (const sub of d.split(/(?=M)/)) {
        if (sub.trim().length < 4) continue;
        out.push({ d: sub, color, width: p.strokeWidth });
      }
    }
  });
  return out;
}
