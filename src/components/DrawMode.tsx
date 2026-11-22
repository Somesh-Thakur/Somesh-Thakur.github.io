"use client";

import { useEffect, useRef, useState } from "react";
import { unlock } from "@/lib/achievements";
import { penDown, penMove, penUp } from "@/lib/sound";

type Stroke = { color: string; pts: number[] }; // x,y pairs in page coordinates

const COLORS = [
  { name: "Ink", value: "#1f1b17" },
  { name: "Terracotta", value: "#c8683a" },
  { name: "Olive", value: "#7d8840" },
  { name: "Mustard", value: "#d4a537" },
];

/**
 * Press D (or the pencil button) and draw anywhere on the sketchbook. Lines are stored
 * in page coordinates so they scroll with the paper. Nothing is saved or sent anywhere.
 */
export function DrawMode() {
  const [on, setOn] = useState(false);
  const [color, setColor] = useState(COLORS[0].value);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokes = useRef<Stroke[]>([]);
  const colorRef = useRef(color);
  colorRef.current = color;

  // keyboard: D toggles, Escape leaves
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as Element | null;
      if (t?.closest?.("input, textarea, select, [contenteditable]") || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "d" || e.key === "D") setOn((v) => !v);
      if (e.key === "Escape") setOn(false);
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(2, devicePixelRatio || 1);

    const redraw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = 2.6;
      for (const s of strokes.current) {
        if (s.pts.length < 4) continue;
        ctx.strokeStyle = s.color;
        ctx.beginPath();
        ctx.moveTo(s.pts[0] - scrollX, s.pts[1] - scrollY);
        for (let i = 2; i < s.pts.length; i += 2) ctx.lineTo(s.pts[i] - scrollX, s.pts[i + 1] - scrollY);
        ctx.stroke();
      }
    };
    const resize = () => {
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      redraw();
    };
    resize();
    addEventListener("resize", resize);
    addEventListener("scroll", redraw, { passive: true });

    let current: Stroke | null = null;
    let last = { x: 0, y: 0, t: 0 };
    const down = (e: PointerEvent) => {
      if (!on) return;
      canvas.setPointerCapture(e.pointerId);
      current = { color: colorRef.current, pts: [e.clientX + scrollX, e.clientY + scrollY] };
      strokes.current.push(current);
      last = { x: e.clientX, y: e.clientY, t: e.timeStamp };
      penDown();
      unlock("doodler");
    };
    const move = (e: PointerEvent) => {
      if (!current) return;
      current.pts.push(e.clientX + scrollX, e.clientY + scrollY);
      const dt = Math.max(1, e.timeStamp - last.t);
      penMove(Math.hypot(e.clientX - last.x, e.clientY - last.y) / dt);
      last = { x: e.clientX, y: e.clientY, t: e.timeStamp };
      redraw();
    };
    const up = () => {
      current = null;
      penUp();
    };
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);

    const clear = () => {
      strokes.current = [];
      redraw();
    };
    addEventListener("sketchbook:clear-drawing", clear);

    return () => {
      removeEventListener("resize", resize);
      removeEventListener("scroll", redraw);
      removeEventListener("sketchbook:clear-drawing", clear);
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
      penUp();
    };
  }, [on]);

  return (
    <>
      <canvas ref={canvasRef} className={`draw-layer${on ? " is-on" : ""}`} aria-hidden="true" />
      <div className="draw-dock" role="group" aria-label="Draw on the page">
        {on && (
          <div className="draw-tools">
            {COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                className="swatch"
                style={{ background: c.value }}
                aria-label={`${c.name} pencil`}
                aria-pressed={color === c.value}
                onClick={() => setColor(c.value)}
              />
            ))}
            <button type="button" className="tool-text" onClick={() => dispatchEvent(new Event("sketchbook:clear-drawing"))}>
              Erase all
            </button>
          </div>
        )}
        <button
          type="button"
          className={`fab${on ? " is-on" : ""}`}
          aria-pressed={on}
          onClick={() => setOn((v) => !v)}
          title="Draw on the page (D)"
        >
          <svg viewBox="0 0 32 32" width="22" height="22" aria-hidden="true">
            <path d="M5 27 L8 19 L22 5 L27 10 L13 24 Z" fill="#d4a537" stroke="#1f1b17" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M5 27 L8 19 L13 24 Z" fill="#ead8b5" stroke="#1f1b17" strokeWidth="1.8" strokeLinejoin="round" />
          </svg>
          <span>{on ? "Done drawing" : "Draw"}</span>
        </button>
      </div>
    </>
  );
}
