import type { CSSProperties, ReactNode } from "react";
import type { Options } from "roughjs/bin/core";
import { strokes, type Shape } from "@/lib/rough";

type DrawMode = "scroll" | "load" | "none";

function groupByPen(paths: { d: string; color: string; width: number }[]) {
  const groups: { color: string; width: number; ds: string[] }[] = [];
  for (const p of paths) {
    const last = groups[groups.length - 1];
    if (last && last.color === p.color && last.width === p.width) last.ds.push(p.d);
    else groups.push({ color: p.color, width: p.width, ds: [p.d] });
  }
  return groups;
}

type SketchProps = {
  w: number;
  h: number;
  shapes: Shape[];
  opts?: Options;
  className?: string;
  style?: CSSProperties;
  draw?: DrawMode;
  /** seconds to wait after the trigger before the pen starts */
  delay?: number;
  /** stretch to the box (for marks around text); keeps line width constant */
  stretch?: boolean;
  label?: string;
};

/** A hand-drawn SVG, rendered at build time, that inks itself in when it scrolls into view. */
export function Sketch({
  w, h, shapes, opts, className, style, draw = "scroll", delay = 0, stretch, label,
}: SketchProps) {
  const paths = strokes(shapes, opts);
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio={stretch ? "none" : undefined}
      className={className}
      style={style}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      data-draw={draw === "none" ? undefined : draw}
      data-delay={delay || undefined}
      focusable="false"
    >
      {/* consecutive strokes with the same pen share one <g>, keeping the HTML small */}
      {groupByPen(paths).map((g, gi) => (
        <g key={gi} style={{ stroke: g.color }} strokeWidth={g.width}>
          {g.ds.map((d, i) => (
            <path key={i} className="ink" d={d} pathLength={1} />
          ))}
        </g>
      ))}
    </svg>
  );
}

type MarkKind = "underline" | "circle" | "highlight" | "box" | "strike";

/** Pen marks around inline text: underline, circle, highlighter, box, strike-through. */
export function Mark({
  kind = "underline",
  color = "var(--mustard)",
  seed = 3,
  delay = 0.2,
  children,
}: {
  kind?: MarkKind;
  color?: string;
  seed?: number;
  delay?: number;
  children: ReactNode;
}) {
  const o: Options = { stroke: color, strokeWidth: 2.4, seed, roughness: 1.6 };
  const shapes: Record<MarkKind, { w: number; h: number; s: Shape[] }> = {
    underline: { w: 100, h: 10, s: [{ type: "curve", pts: [[1, 5], [40, 7], [99, 4]] }] },
    strike: { w: 100, h: 10, s: [{ type: "line", x1: 0, y1: 6, x2: 100, y2: 4 }] },
    circle: { w: 100, h: 40, s: [{ type: "ellipse", cx: 50, cy: 20, w: 98, h: 37 }] },
    box: { w: 100, h: 40, s: [{ type: "rect", x: 2, y: 2, w: 96, h: 36 }] },
    highlight: {
      w: 100, h: 40,
      s: [{ type: "rect", x: 0, y: 6, w: 100, h: 30,
        o: { stroke: "none", fill: color, fillStyle: "zigzag", hachureGap: 2.2, hachureAngle: -20, fillWeight: 5, roughness: 2.4 } }],
    },
  };
  const { w, h, s } = shapes[kind];
  return (
    <span className={`mark mark-${kind}`}>
      <Sketch w={w} h={h} shapes={s} opts={o} stretch delay={delay} className="mark-svg" />
      <span className="mark-text">{children}</span>
    </span>
  );
}
