"use client";

import { useEffect } from "react";
import gsap from "gsap";
import type Lenis from "lenis";
import { tally } from "@/lib/achievements";
import { crunch } from "@/lib/sound";

/**
 * Clicking an inked button crumples it into a paper ball that drops and rolls away,
 * then the link goes where it says. The button smooths itself back out afterwards.
 * Ctrl/Cmd/Shift clicks, middle clicks and reduced-motion visitors skip the effect.
 */

const N = 12; // clip-path points; start and end shapes must match in count

// Points around the edge of the button, clockwise from the top-left.
function edgePoints(): string {
  const pts: string[] = [];
  for (let i = 0; i < N; i++) {
    const t = (i / N) * 4;
    const side = Math.floor(t), f = t - side;
    const [x, y] =
      side === 0 ? [f * 100, 0] : side === 1 ? [100, f * 100] : side === 2 ? [100 - f * 100, 100] : [0, 100 - f * 100];
    pts.push(`${x.toFixed(1)}% ${y.toFixed(1)}%`);
  }
  return `polygon(${pts.join(",")})`;
}

// The same points pulled into a jagged little wad around the centre.
function wadPoints(): string {
  const pts: string[] = [];
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2 - (3 * Math.PI) / 4;
    const r = 9 + Math.random() * 12;
    pts.push(`${(50 + Math.cos(a) * r * 0.9).toFixed(1)}% ${(50 + Math.sin(a) * r * 2.2).toFixed(1)}%`);
  }
  return `polygon(${pts.join(",")})`;
}

const BALL = 72;

// A crumpled paper wad: lumpy outline, faceted shading, crease lines and a bit of the ink border.
function ballSvg(fill: string): string {
  const c = BALL / 2;
  const k = 16;
  const rim: [number, number][] = [];
  for (let i = 0; i < k; i++) {
    const a = (i / k) * Math.PI * 2;
    const r = c * (0.62 + Math.random() * 0.22) * (i % 2 ? 0.9 : 1);
    rim.push([c + Math.cos(a) * r, c + Math.sin(a) * r * 0.92]);
  }
  const f = (n: number) => n.toFixed(1);
  // facets: triangles from an off-centre point to the rim, some shaded darker
  const hub: [number, number] = [c + (Math.random() - 0.5) * 8, c + (Math.random() - 0.5) * 8];
  const facets = rim
    .map((p, i) => {
      const q = rim[(i + 1) % k];
      const shade = i % 3 === 0 ? 0.16 : i % 3 === 1 ? 0.07 : 0;
      return shade
        ? `<polygon points="${f(hub[0])},${f(hub[1])} ${f(p[0])},${f(p[1])} ${f(q[0])},${f(q[1])}" fill="#1f1b17" opacity="${shade}"/>`
        : "";
    })
    .join("");
  const creases = rim
    .filter((_, i) => i % 2 === 0)
    .map((p) => `M${f(hub[0])} ${f(hub[1])} L${f(p[0])} ${f(p[1])}`)
    .join(" ");
  const scrap = `M${f(rim[2][0] - 4)} ${f(rim[2][1] - 6)} Q${f(c)} ${f(c - 4)} ${f(rim[9][0] + 4)} ${f(rim[9][1] + 2)}`;
  return `<svg viewBox="0 0 ${BALL} ${BALL}" width="${BALL}" height="${BALL}" aria-hidden="true">
    <polygon points="${rim.map((p) => `${f(p[0])},${f(p[1])}`).join(" ")}" fill="${fill}"/>
    ${facets}
    <path d="${creases}" stroke="#1f1b17" stroke-width="0.9" stroke-linecap="round" opacity=".5" fill="none"/>
    <path d="${scrap}" stroke="#1f1b17" stroke-width="2" stroke-linecap="round" fill="none"/>
    <polygon points="${rim.map((p) => `${f(p[0])},${f(p[1])}`).join(" ")}" fill="none" stroke="#1f1b17" stroke-width="2" stroke-linejoin="round"/>
  </svg>`;
}

export function Crumple() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const btn = (e.target as Element | null)?.closest?.<HTMLAnchorElement>("a.btn");
      if (!btn || btn.dataset.crumpling) return;

      e.preventDefault();
      e.stopImmediatePropagation();
      btn.dataset.crumpling = "1";
      crunch();
      tally("crumpler", 5);

      const href = btn.getAttribute("href") ?? "";
      const newTab = btn.target === "_blank";
      const rect = btn.getBoundingClientRect();
      const filled = btn.classList.contains("btn-fill");

      // the paper ball, dropped where the button was
      const ball = document.createElement("div");
      ball.className = "paper-ball";
      ball.innerHTML = ballSvg(filled ? "#d4a537" : "#f9f6ee");
      // placed on the page (not the screen) so it scrolls away with the paper
      const cx = rect.left + scrollX + rect.width / 2, cy = rect.top + scrollY + rect.height / 2;
      ball.style.left = `${cx - BALL / 2}px`;
      ball.style.top = `${cy - BALL / 2}px`;
      document.body.appendChild(ball);

      // a few torn flecks
      const flecks = Array.from({ length: 6 }, () => {
        const f = document.createElement("span");
        f.className = "paper-fleck";
        f.style.left = `${cx}px`;
        f.style.top = `${cy}px`;
        f.style.background = Math.random() > 0.5 && filled ? "#d4a537" : "#f9f6ee";
        document.body.appendChild(f);
        return f;
      });

      const dir = Math.random() > 0.5 ? 1 : -1;
      const tl = gsap.timeline();
      tl.set(btn, { clipPath: edgePoints() })
        // squeeze in the fist
        .to(btn, { scaleX: 0.9, scaleY: 1.08, rotate: -3 * dir, duration: 0.1, ease: "power2.out" })
        // crush into a wad
        .to(btn, { clipPath: wadPoints(), scale: 0.45, rotate: 28 * dir, duration: 0.3, ease: "power3.in" })
        .set(btn, { opacity: 0 })
        .fromTo(ball, { scale: 0.4, opacity: 1, rotate: -40 * dir }, { scale: 1, rotate: 0, duration: 0.16, ease: "back.out(3)", immediateRender: false }, "<-0.06")
        .to(flecks, {
          x: () => (Math.random() - 0.5) * 120,
          y: () => -20 - Math.random() * 60,
          rotate: () => Math.random() * 360,
          duration: 0.35, ease: "power2.out",
        }, "<")
        .to(flecks, { y: "+=70", opacity: 0, duration: 0.4, ease: "power1.in" })
        // drop, bounce, roll off
        .to(ball, { y: 46, duration: 0.32, ease: "bounce.out" }, "<-0.3")
        .to(ball, { x: 90 * dir, rotate: 280 * dir, opacity: 0, duration: 0.55, ease: "power1.in" });

      // follow the link once it is crumpled
      tl.call(() => {
        if (href.startsWith("#")) {
          const target = document.querySelector(href);
          const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
          if (target && lenis) lenis.scrollTo(target as HTMLElement, { offset: -16 });
          else target?.scrollIntoView({ behavior: "smooth" });
          history.replaceState(null, "", href);
        } else if (newTab) {
          // window.open with "noopener" always returns null, so it can't tell us whether
          // the tab opened. Clicking a throwaway link opens it in a new tab only, never here.
          const a = document.createElement("a");
          a.href = btn.href;
          a.target = "_blank";
          a.rel = "noopener noreferrer";
          a.click();
        } else {
          location.href = btn.href;
        }
      }, [], 0.45);

      // smooth the button back out
      tl.call(() => {
        ball.remove();
        flecks.forEach((f) => f.remove());
        gsap.fromTo(
          btn,
          { opacity: 1, scale: 0.6, rotate: 10 * dir, clipPath: wadPoints() },
          {
            scale: 1, rotate: 0, clipPath: edgePoints(), duration: 0.5, ease: "back.out(1.6)",
            onComplete: () => {
              gsap.set(btn, { clearProps: "clipPath,transform,scale,rotate,opacity" });
              delete btn.dataset.crumpling;
            },
          },
        );
      }, [], "+=0.15");
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
