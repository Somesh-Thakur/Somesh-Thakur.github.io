"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { scratch } from "@/lib/sound";

/**
 * One engine drives the whole sketchbook:
 *  - [data-draw] SVGs ink their strokes in (on load, or when scrolled into view)
 *  - [data-write] text is revealed left-to-right like handwriting
 *  - [data-spin] spins with the scroll (the Spindle record)
 * If the visitor prefers reduced motion, the inline script in <head> never adds
 * `draw-ready`, so everything is simply already drawn.
 */
export function InkEngine() {
  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("draw-ready")) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({ lerp: 0.11, anchors: { offset: -16 } });
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis; // used by the crumple buttons
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Each element is animated once, the first time it nears the screen. One shared
    // IntersectionObserver is far cheaper than a ScrollTrigger per drawing.
    const animate = (el: Element, onLoad: boolean) => {
      if (el instanceof SVGSVGElement && el.dataset.draw) {
        const paths = el.querySelectorAll<SVGPathElement>("path.ink");
        if (!paths.length) return;
        const duration = Math.min(1.8, 0.35 + paths.length * 0.05);
        gsap.to(paths, {
          strokeDashoffset: 0,
          duration: duration / Math.max(1, paths.length / 6),
          stagger: { amount: duration * 0.75 },
          ease: "power1.inOut",
          delay: Number(el.dataset.delay ?? 0) + (onLoad ? 0.15 : 0),
          onStart: () => scratch(duration),
        });
      } else if (el instanceof HTMLElement && el.dataset.write !== undefined) {
        gsap.to(el, {
          clipPath: "inset(-20% -2% -30% -2%)",
          duration: Math.min(1.4, 0.4 + (el.textContent?.length ?? 10) * 0.025),
          ease: "power2.out",
          delay: Number(el.dataset.delay ?? 0) + (onLoad ? 0.1 : 0),
        });
      } else if (el instanceof HTMLElement && el.dataset.appear !== undefined) {
        gsap.to(el, {
          opacity: 1, filter: "blur(0px)", scale: 1, duration: 1.1, ease: "power2.out",
          delay: Number(el.dataset.delay ?? 0),
        });
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          io.unobserve(e.target);
          animate(e.target, false);
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );

    const ctx = gsap.context(() => {
      document.querySelectorAll("svg[data-draw], [data-write], [data-appear]").forEach((el) => {
        const d = (el as HTMLElement).dataset;
        const onLoad = d.draw === "load" || d.write === "load" || d.appear === "load";
        if (onLoad) animate(el, true);
        else io.observe(el);
      });

      document.querySelectorAll<HTMLElement>("[data-spin]").forEach((el) => {
        gsap.to(el, {
          rotate: 720,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    });

    return () => {
      io.disconnect();
      ctx.revert();
      gsap.ticker.remove(raf);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return null;
}
