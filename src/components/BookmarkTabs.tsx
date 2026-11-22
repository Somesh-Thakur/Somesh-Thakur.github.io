"use client";

import { useEffect, useState } from "react";
import { unlock } from "@/lib/achievements";

type Tab = { id: string; label: string };

/** Paper bookmark tabs sticking out of the right edge; the current page's tab sticks out further. */
export function BookmarkTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const seen = new Set<string>();
    const all = ["hello", ...tabs.map((t) => t.id)];
    const els = all.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          setActive(e.target.id);
          seen.add(e.target.id);
          if (els.every((el) => seen.has(el.id))) unlock("every-page");
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [tabs]);

  return (
    <nav className="tabs" aria-label="Sketchbook pages">
      <ul>
        {tabs.map((t, i) => (
          <li key={t.id} style={{ ["--i" as string]: i }}>
            <a href={`#${t.id}`} aria-current={active === t.id ? "true" : undefined}>
              {t.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
