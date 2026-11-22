"use client";

import { useEffect, useRef } from "react";

/**
 * The mouse cursor becomes a pencil. Its tip sits exactly on the pointer, it leans
 * into the direction you move, presses down when you click, and leaves a faint
 * graphite line that fades. Touch screens and reduced-motion visitors keep the normal cursor.
 */
export function PencilTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pencilRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const pencil = pencilRef.current;
    if (!canvas || !pencil) return;
    const fine = matchMedia("(pointer: fine)").matches;
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || calm) return;

    const root = document.documentElement;
    root.classList.add("pencil-cursor");

    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => {
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    addEventListener("resize", resize);

    type Pt = { x: number; y: number; t: number };
    const pts: Pt[] = [];
    const LIFE = 700;

    let x = -100, y = -100, lastX = x, tilt = 0, targetTilt = 0;
    let press = 1, targetPress = 1, visible = false, overLink = false;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!visible) { visible = true; pencil.style.opacity = "1"; lastX = x; }
      pts.push({ x, y, t: performance.now() });
      if (pts.length > 80) pts.shift();
      const t = e.target as Element | null;
      overLink = !!t?.closest?.("a, button, [role='button']");
    };
    const onDown = () => (targetPress = 0.86);
    const onUp = () => (targetPress = 1);
    const onLeave = () => { visible = false; pencil.style.opacity = "0"; pts.length = 0; };
    // Scrolling moves the page under the pencil, so the trail is cleared.
    const onScroll = () => (pts.length = 0);

    addEventListener("pointermove", onMove, { passive: true });
    addEventListener("pointerdown", onDown);
    addEventListener("pointerup", onUp);
    document.addEventListener("pointerleave", onLeave);
    addEventListener("blur", onLeave);
    addEventListener("scroll", onScroll, { passive: true });

    let id = 0;
    const loop = () => {
      const now = performance.now();

      // Lean into horizontal movement, settle back when still.
      const vx = x - lastX;
      lastX = x;
      targetTilt = Math.max(-22, Math.min(22, vx * 1.4)) + (overLink ? -12 : 0);
      tilt += (targetTilt - tilt) * 0.18;
      press += (targetPress - press) * 0.3;
      pencil.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${tilt.toFixed(2)}deg) scale(${press.toFixed(3)})`;

      while (pts.length && now - pts[0].t > LIFE) pts.shift();
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], b = pts[i];
        const life = 1 - (now - b.t) / LIFE;
        ctx.strokeStyle = `rgba(60, 54, 48, ${0.32 * life})`;
        ctx.lineWidth = 1.1 + life * 0.7;
        ctx.beginPath();
        ctx.moveTo(a.x + (i % 3 ? 0.3 : -0.3), a.y);
        ctx.lineTo(b.x, b.y + (i % 2 ? 0.3 : -0.3));
        ctx.stroke();
      }
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(id);
      root.classList.remove("pencil-cursor");
      removeEventListener("resize", resize);
      removeEventListener("pointermove", onMove);
      removeEventListener("pointerdown", onDown);
      removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
      removeEventListener("blur", onLeave);
      removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="pencil-trail" aria-hidden="true" />
      <div ref={pencilRef} className="pencil" aria-hidden="true">
        {/* tip at (0, 52): the div is offset so this point sits on the pointer */}
        <svg viewBox="0 0 52 52" width="52" height="52">
          <g stroke="#1f1b17" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
            {/* sharpened wood */}
            <path d="M1 51 L9 35 L17 43 Z" fill="#ead8b5" />
            {/* graphite tip */}
            <path d="M1 51 L4.6 43.6 L8.4 47.4 Z" fill="#1f1b17" />
            {/* painted body */}
            <path d="M9 35 L38 6 L46 14 L17 43 Z" fill="#d4a537" />
            <path d="M13 39 L42 10" fill="none" strokeWidth="1" opacity=".45" />
            {/* metal ferrule */}
            <path d="M38 6 L42 2 L50 10 L46 14 Z" fill="#9b968c" />
            {/* eraser */}
            <path d="M42 2 L44 0.6 Q46.5 -0.6 48.6 1.6 L50.4 3.4 Q52.6 5.6 51.4 8 L50 10 Z" fill="#c8683a" />
          </g>
        </svg>
      </div>
    </>
  );
}
