import type { ReactNode } from "react";
import { Sketch } from "./Sketch";
import type { Shape } from "@/lib/rough";

const INK = "var(--ink)";
const MUSTARD = "var(--mustard)";
const OLIVE = "var(--olive)";
const TERRA = "var(--terracotta)";
const GRAPHITE = "var(--graphite)";

function star(cx: number, cy: number, r1: number, r2: number, n = 8): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i <= n * 2; i++) {
    const a = (Math.PI * i) / n - Math.PI / 2;
    const r = i % 2 ? r2 : r1;
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  return pts;
}

/* ───── Blood Oath: two fighters on a screen, a phone as the controller ───── */
export function BloodOathSketch() {
  const shapes: Shape[] = [
    { type: "rect", x: 10, y: 12, w: 290, h: 228 },
    { type: "line", x1: 26, y1: 205, x2: 286, y2: 209, o: { stroke: GRAPHITE } },
    // fighter one
    { type: "ellipse", cx: 92, cy: 96, w: 28, h: 30 },
    { type: "line", x1: 92, y1: 111, x2: 89, y2: 161 },
    { type: "line", x1: 89, y1: 161, x2: 72, y2: 204 },
    { type: "line", x1: 89, y1: 161, x2: 108, y2: 204 },
    { type: "line", x1: 91, y1: 126, x2: 130, y2: 113 },
    { type: "line", x1: 91, y1: 126, x2: 70, y2: 147 },
    // fighter two
    { type: "ellipse", cx: 216, cy: 98, w: 28, h: 30, o: { stroke: TERRA } },
    { type: "line", x1: 216, y1: 113, x2: 218, y2: 161, o: { stroke: TERRA } },
    { type: "line", x1: 218, y1: 161, x2: 200, y2: 204, o: { stroke: TERRA } },
    { type: "line", x1: 218, y1: 161, x2: 236, y2: 204, o: { stroke: TERRA } },
    { type: "line", x1: 216, y1: 127, x2: 182, y2: 117, o: { stroke: TERRA } },
    { type: "line", x1: 216, y1: 127, x2: 240, y2: 148, o: { stroke: TERRA } },
    { type: "line", x1: 182, y1: 117, x2: 150, y2: 88, o: { stroke: TERRA, strokeWidth: 3.5 } },
    // clash
    { type: "poly", pts: star(144, 112, 22, 9), o: { stroke: MUSTARD, strokeWidth: 2.4 } },
    // health bars
    { type: "rect", x: 26, y: 28, w: 100, h: 12, o: { fill: OLIVE, fillStyle: "hachure", hachureGap: 4 } },
    { type: "rect", x: 184, y: 28, w: 100, h: 12, o: { stroke: TERRA, fill: TERRA, fillStyle: "hachure", hachureGap: 4 } },
    // phone controller
    { type: "rect", x: 324, y: 84, w: 62, h: 122 },
    { type: "line", x1: 336, y1: 174, x2: 352, y2: 174 },
    { type: "line", x1: 344, y1: 166, x2: 344, y2: 182 },
    { type: "ellipse", cx: 368, cy: 168, w: 10, h: 10, o: { stroke: TERRA } },
    { type: "ellipse", cx: 376, cy: 182, w: 10, h: 10, o: { stroke: MUSTARD } },
    { type: "rect", x: 333, y: 96, w: 44, h: 52, o: { stroke: GRAPHITE, strokeWidth: 1.4 } },
    // signal
    { type: "curve", pts: [[318, 112], [311, 122], [318, 134]], o: { stroke: GRAPHITE } },
    { type: "curve", pts: [[312, 104], [301, 122], [312, 142]], o: { stroke: GRAPHITE } },
  ];
  return (
    <Sketch
      w={400} h={250} shapes={shapes}
      opts={{ stroke: INK, strokeWidth: 2.2, seed: 21 }}
      label="Sketch of two stick fighters clashing on a screen, with a phone used as the controller"
    />
  );
}

/* ───── Boomtown Tycoon: a board, a skyline, dice ───── */
export function BoomtownSketch() {
  const tiles: Shape[] = [];
  const step = 260 / 6;
  for (let i = 1; i < 6; i++) {
    const p = 20 + i * step;
    tiles.push({ type: "line", x1: p, y1: 20, x2: p, y2: 60, o: { stroke: GRAPHITE, strokeWidth: 1.4 } });
    tiles.push({ type: "line", x1: p, y1: 200, x2: p, y2: 240, o: { stroke: GRAPHITE, strokeWidth: 1.4 } });
  }
  for (let i = 1; i < 4; i++) {
    const p = 60 + i * 35;
    tiles.push({ type: "line", x1: 20, y1: p, x2: 60, y2: p, o: { stroke: GRAPHITE, strokeWidth: 1.4 } });
    tiles.push({ type: "line", x1: 240, y1: p, x2: 280, y2: p, o: { stroke: GRAPHITE, strokeWidth: 1.4 } });
  }
  const shapes: Shape[] = [
    { type: "rect", x: 20, y: 20, w: 260, h: 220 },
    { type: "rect", x: 60, y: 60, w: 180, h: 140 },
    ...tiles,
    { type: "rect", x: 20, y: 20, w: 40, h: 40, o: { stroke: "none", fill: MUSTARD, fillStyle: "hachure", hachureGap: 5 } },
    { type: "rect", x: 240, y: 200, w: 40, h: 40, o: { stroke: "none", fill: OLIVE, fillStyle: "hachure", hachureGap: 5 } },
    { type: "rect", x: 20 + step * 3, y: 20, w: step, h: 40, o: { stroke: "none", fill: TERRA, fillStyle: "hachure", hachureGap: 5 } },
    // skyline
    {
      type: "poly",
      pts: [[78, 186], [78, 146], [98, 146], [98, 118], [122, 118], [122, 160], [136, 160], [136, 92], [160, 92], [160, 150], [180, 150], [180, 128], [204, 128], [204, 170], [222, 170], [222, 186]],
    },
    { type: "rect", x: 136, y: 92, w: 24, h: 94, o: { stroke: "none", fill: TERRA, fillStyle: "cross-hatch", hachureGap: 6, fillWeight: 1.2 } },
    { type: "line", x1: 70, y1: 187, x2: 230, y2: 187 },
    { type: "line", x1: 148, y1: 92, x2: 148, y2: 74 },
    { type: "poly", pts: [[148, 74], [164, 79], [148, 84]], o: { stroke: TERRA } },
    // dice
    { type: "rect", x: 302, y: 118, w: 58, h: 58 },
    { type: "ellipse", cx: 316, cy: 132, w: 8, h: 8 },
    { type: "ellipse", cx: 331, cy: 147, w: 8, h: 8 },
    { type: "ellipse", cx: 346, cy: 162, w: 8, h: 8 },
    { type: "poly", pts: [[318, 196], [366, 186], [376, 232], [328, 242], [318, 196]] },
    { type: "ellipse", cx: 335, cy: 206, w: 8, h: 8 },
    { type: "ellipse", cx: 358, cy: 224, w: 8, h: 8 },
    // coin
    { type: "ellipse", cx: 340, cy: 62, w: 48, h: 48, o: { stroke: MUSTARD } },
    { type: "ellipse", cx: 340, cy: 62, w: 32, h: 32, o: { stroke: MUSTARD, strokeWidth: 1.4 } },
  ];
  return (
    <Sketch
      w={400} h={250} shapes={shapes}
      opts={{ stroke: INK, strokeWidth: 2.2, seed: 44 }}
      label="Sketch of a board game with a city skyline in the middle, two dice and a coin"
    />
  );
}

/* ───── Spindle: a record (spins with the scroll) and a tonearm ───── */
export function RecordSketch() {
  const grooves: Shape[] = [262, 238, 214, 190, 166].map((d, i) => ({
    type: "ellipse", cx: 150, cy: 150, w: d, h: d,
    o: { stroke: i === 0 ? INK : GRAPHITE, strokeWidth: i === 0 ? 2.4 : 1.1, roughness: 0.9 },
  }));
  return (
    <div className="record">
      <div data-spin className="record-disc">
        <Sketch
          w={300} h={300}
          shapes={[
            ...grooves,
            { type: "ellipse", cx: 150, cy: 150, w: 96, h: 96, o: { stroke: TERRA, fill: TERRA, fillStyle: "hachure", hachureGap: 5, fillWeight: 1.6 } },
            { type: "ellipse", cx: 150, cy: 150, w: 12, h: 12, o: { stroke: INK } },
            { type: "curve", pts: [[112, 88], [150, 74], [190, 86]], o: { stroke: MUSTARD, strokeWidth: 1.6 } },
          ]}
          opts={{ seed: 5 }}
          label="Sketch of a vinyl record"
        />
      </div>
      <Sketch
        className="record-arm" w={300} h={300} delay={0.6}
        shapes={[
          { type: "ellipse", cx: 278, cy: 30, w: 26, h: 26 },
          { type: "curve", pts: [[278, 30], [270, 110], [236, 176], [214, 196]], o: { strokeWidth: 3 } },
          { type: "rect", x: 200, y: 192, w: 20, h: 14, o: { fill: INK, fillStyle: "solid" } },
        ]}
        opts={{ stroke: INK, seed: 9 }}
      />
    </div>
  );
}

/** A phone held upright, playing a cartoon reel: blocky character, speech bubble, captions. */
export function ReelSketch() {
  return (
    <div className="reel">
      <Sketch
        w={300} h={420}
        shapes={[
          // film strip running out from both sides of the phone
          { type: "poly", pts: [[78, 150], [12, 154], [10, 222], [78, 220]], o: { stroke: GRAPHITE, strokeWidth: 1.2 } },
          { type: "poly", pts: [[226, 150], [290, 146], [292, 216], [226, 220]], o: { stroke: GRAPHITE, strokeWidth: 1.2 } },
          ...[0, 1].flatMap((i): Shape[] => [
            { type: "rect", x: 22 + i * 30, y: 160, w: 14, h: 9, o: { stroke: GRAPHITE, strokeWidth: 1 } },
            { type: "rect", x: 22 + i * 30, y: 204, w: 14, h: 9, o: { stroke: GRAPHITE, strokeWidth: 1 } },
            { type: "rect", x: 238 + i * 30, y: 156, w: 14, h: 9, o: { stroke: GRAPHITE, strokeWidth: 1 } },
            { type: "rect", x: 238 + i * 30, y: 200, w: 14, h: 9, o: { stroke: GRAPHITE, strokeWidth: 1 } },
          ]),
          // phone
          { type: "rect", x: 82, y: 22, w: 140, h: 268, o: { stroke: INK, strokeWidth: 2.6, fill: "var(--paper)", fillStyle: "solid" } },
          { type: "line", x1: 136, y1: 36, x2: 168, y2: 36, o: { stroke: INK, strokeWidth: 2 } },
          // the character: blocky head, eyes, talking mouth, body
          { type: "rect", x: 122, y: 118, w: 52, h: 48, o: { stroke: INK, fill: MUSTARD, fillStyle: "hachure", hachureGap: 5 } },
          { type: "ellipse", cx: 138, cy: 136, w: 7, h: 7, o: { stroke: INK, fill: INK, fillStyle: "solid" } },
          { type: "ellipse", cx: 158, cy: 136, w: 7, h: 7, o: { stroke: INK, fill: INK, fillStyle: "solid" } },
          { type: "ellipse", cx: 148, cy: 153, w: 14, h: 8, o: { stroke: TERRA, strokeWidth: 2 } },
          { type: "rect", x: 116, y: 168, w: 64, h: 62, o: { stroke: INK, fill: OLIVE, fillStyle: "hachure", hachureGap: 6 } },
          { type: "line", x1: 116, y1: 180, x2: 100, y2: 160, o: { stroke: INK, strokeWidth: 2.2 } },
          { type: "line", x1: 180, y1: 180, x2: 198, y2: 196, o: { stroke: INK, strokeWidth: 2.2 } },
          // speech bubble
          { type: "ellipse", cx: 168, cy: 76, w: 82, h: 44, o: { stroke: INK, strokeWidth: 1.8 } },
          { type: "poly", pts: [[150, 96], [142, 112], [162, 97]], o: { stroke: INK, strokeWidth: 1.8 } },
          { type: "line", x1: 146, y1: 72, x2: 190, y2: 72, o: { stroke: GRAPHITE, strokeWidth: 1.2 } },
          { type: "line", x1: 150, y1: 82, x2: 182, y2: 82, o: { stroke: GRAPHITE, strokeWidth: 1.2 } },
          // captions
          { type: "line", x1: 104, y1: 252, x2: 200, y2: 252, o: { stroke: TERRA, strokeWidth: 3 } },
          { type: "line", x1: 118, y1: 266, x2: 186, y2: 266, o: { stroke: INK, strokeWidth: 2.2 } },
          // play button below the phone
          { type: "ellipse", cx: 152, cy: 350, w: 64, h: 64, o: { stroke: INK, strokeWidth: 2 } },
          { type: "poly", pts: [[142, 334], [142, 366], [168, 350], [142, 334]], o: { stroke: TERRA, fill: TERRA, fillStyle: "hachure", hachureGap: 4 } },
        ]}
        opts={{ seed: 21 }}
        label="Sketch of a phone playing a cartoon reel"
      />
    </div>
  );
}

/* ───── tiny doodles ───── */

export function Arrow({ d = "down", className, delay }: { d?: "down" | "left" | "right" | "curl"; className?: string; delay?: number }) {
  const paths: Record<string, Shape[]> = {
    down: [
      { type: "curve", pts: [[40, 6], [32, 40], [44, 70], [38, 104]] },
      { type: "poly", pts: [[24, 88], [38, 106], [52, 90]] },
    ],
    left: [
      { type: "curve", pts: [[114, 40], [80, 22], [40, 36], [10, 30]] },
      { type: "poly", pts: [[24, 16], [8, 30], [26, 42]] },
    ],
    right: [
      { type: "curve", pts: [[6, 30], [40, 22], [80, 44], [112, 30]] },
      { type: "poly", pts: [[96, 16], [114, 30], [96, 44]] },
    ],
    curl: [
      { type: "curve", pts: [[110, 10], [60, 6], [30, 40], [56, 62], [80, 46], [50, 30], [20, 70], [12, 100]] },
      { type: "poly", pts: [[2, 84], [12, 102], [26, 88]] },
    ],
  };
  const size = d === "down" ? { w: 80, h: 110 } : d === "curl" ? { w: 120, h: 110 } : { w: 120, h: 60 };
  return <Sketch {...size} shapes={paths[d]} opts={{ stroke: GRAPHITE, strokeWidth: 2, seed: 17 }} className={className} delay={delay} />;
}

export function Tick({ delay }: { delay?: number }) {
  return (
    <Sketch
      w={40} h={40} className="tick" delay={delay}
      shapes={[
        { type: "rect", x: 4, y: 8, w: 26, h: 26, o: { stroke: INK, strokeWidth: 1.8 } },
        { type: "poly", pts: [[8, 20], [16, 30], [36, 2]], o: { stroke: OLIVE, strokeWidth: 3.2 } },
      ]}
      opts={{ seed: 31 }}
    />
  );
}

export function Squiggle({ className, color = MUSTARD }: { className?: string; color?: string }) {
  return (
    <Sketch
      w={220} h={24} className={className}
      shapes={[{ type: "curve", pts: [[2, 12], [24, 4], [46, 18], [70, 6], [94, 18], [118, 6], [142, 18], [166, 6], [190, 16], [218, 10]] }]}
      opts={{ stroke: color, strokeWidth: 2.6, seed: 12 }}
    />
  );
}

export function Sparkle({ className, color = MUSTARD }: { className?: string; color?: string }) {
  return (
    <Sketch
      w={60} h={60} className={className}
      shapes={[
        { type: "line", x1: 30, y1: 4, x2: 30, y2: 56 },
        { type: "line", x1: 4, y1: 30, x2: 56, y2: 30 },
        { type: "line", x1: 12, y1: 12, x2: 48, y2: 48, o: { strokeWidth: 1.4 } },
        { type: "line", x1: 48, y1: 12, x2: 12, y2: 48, o: { strokeWidth: 1.4 } },
      ]}
      opts={{ stroke: color, strokeWidth: 2.4, seed: 8 }}
    />
  );
}

/* ───── contact icons (generic doodles, not brand logos) ───── */
export function Icon({ name, seed = 2 }: { name: string; seed?: number }) {
  const s: Record<string, Shape[]> = {
    camera: [
      { type: "rect", x: 6, y: 12, w: 40, h: 32 },
      { type: "ellipse", cx: 26, cy: 28, w: 16, h: 16, o: { stroke: TERRA } },
      { type: "ellipse", cx: 39, cy: 18, w: 3, h: 3 },
    ],
    envelope: [
      { type: "rect", x: 6, y: 14, w: 40, h: 28 },
      { type: "poly", pts: [[6, 14], [26, 31], [46, 14]], o: { stroke: TERRA } },
    ],
    briefcase: [
      { type: "rect", x: 6, y: 18, w: 40, h: 26 },
      { type: "poly", pts: [[19, 18], [19, 10], [33, 10], [33, 18]] },
      { type: "line", x1: 6, y1: 29, x2: 46, y2: 29, o: { stroke: MUSTARD } },
    ],
    brackets: [
      { type: "curve", pts: [[20, 8], [12, 12], [14, 26], [6, 28], [14, 30], [12, 44], [20, 48]] },
      { type: "curve", pts: [[32, 8], [40, 12], [38, 26], [46, 28], [38, 30], [40, 44], [32, 48]] },
      { type: "line", x1: 29, y1: 18, x2: 23, y2: 38, o: { stroke: OLIVE } },
    ],
    gamepad: [
      { type: "path", d: "M10 20 Q26 14 42 20 Q50 40 44 44 Q38 46 34 36 L18 36 Q14 46 8 44 Q2 40 10 20 Z" },
      { type: "line", x1: 13, y1: 27, x2: 21, y2: 27 },
      { type: "line", x1: 17, y1: 23, x2: 17, y2: 31 },
      { type: "ellipse", cx: 36, cy: 26, w: 4, h: 4, o: { stroke: TERRA } },
    ],
    play: [
      { type: "rect", x: 6, y: 12, w: 40, h: 30 },
      { type: "poly", pts: [[22, 20], [34, 27], [22, 34], [22, 20]], o: { stroke: TERRA } },
    ],
    bubble: [
      { type: "path", d: "M8 12 L44 12 L44 36 L22 36 L12 44 L14 36 L8 36 Z" },
      { type: "ellipse", cx: 19, cy: 24, w: 4, h: 4, o: { stroke: OLIVE } },
      { type: "ellipse", cx: 33, cy: 24, w: 4, h: 4, o: { stroke: OLIVE } },
    ],
  };
  return <Sketch w={52} h={52} shapes={s[name] ?? s.bubble} opts={{ stroke: INK, strokeWidth: 2, seed }} className="icon" />;
}

/* ───── inked button / link ───── */
export function InkButton({ href, children, fill, seed = 4, external }: { href: string; children: ReactNode; fill?: boolean; seed?: number; external?: boolean }) {
  return (
    <a
      className={`btn${fill ? " btn-fill" : ""}`}
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <Sketch
        w={200} h={56} stretch className="btn-box"
        shapes={[
          ...(fill ? [{ type: "rect", x: 3, y: 5, w: 194, h: 46, o: { stroke: "none", fill: MUSTARD, fillStyle: "zigzag", hachureGap: 3.2, fillWeight: 4, roughness: 2 } } as Shape] : []),
          { type: "rect", x: 3, y: 3, w: 194, h: 50 },
        ]}
        opts={{ stroke: INK, strokeWidth: 2, seed }}
      />
      <span>{children}</span>
    </a>
  );
}
