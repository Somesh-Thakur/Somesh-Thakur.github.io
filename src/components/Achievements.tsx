"use client";

import { useEffect, useState } from "react";
import { ACHIEVEMENTS, UNLOCK_EVENT, unlock, unlocked } from "@/lib/achievements";
import { pop, soundOn, setSound, SOUND_EVENT } from "@/lib/sound";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

/** Toasts for unlocked achievements, the Konami secret, and the sound toggle. */
export function Achievements() {
  const [toast, setToast] = useState<string | null>(null);
  const [burst, setBurst] = useState(0);

  useEffect(() => {
    let timer = 0;
    const onUnlock = (e: Event) => {
      const a = ACHIEVEMENTS.find((x) => x.id === (e as CustomEvent).detail);
      if (!a) return;
      pop();
      setToast(a.title);
      clearTimeout(timer);
      timer = window.setTimeout(() => setToast(null), 3600);
    };
    addEventListener(UNLOCK_EVENT, onUnlock);

    let pos = 0;
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      pos = k === KONAMI[pos] ? pos + 1 : k === KONAMI[0] ? 1 : 0;
      if (pos === KONAMI.length) {
        pos = 0;
        setBurst((b) => b + 1);
        unlock("secret");
      }
    };
    addEventListener("keydown", onKey);
    return () => {
      removeEventListener(UNLOCK_EVENT, onUnlock);
      removeEventListener("keydown", onKey);
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <div className="toast-wrap" aria-live="polite">
        {toast && (
          <div className="toast" key={toast}>
            <svg viewBox="0 0 40 40" width="34" height="34" aria-hidden="true">
              <path d="M20 3 L24.5 14 L36 14.6 L27 22 L30.2 33.6 L20 27 L9.8 33.6 L13 22 L4 14.6 L15.5 14 Z" fill="#d4a537" stroke="#1f1b17" strokeWidth="2" strokeLinejoin="round" />
            </svg>
            <div>
              <span className="toast-kicker">Achievement unlocked</span>
              <strong>{toast}</strong>
            </div>
          </div>
        )}
      </div>
      {burst > 0 && <Confetti key={burst} />}
    </>
  );
}

/** Hand-drawn stars and squiggles that tumble down the screen (the Konami secret). */
function Confetti() {
  const bits = Array.from({ length: 36 }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 0.6,
    dur: 1.8 + Math.random() * 1.4,
    rot: Math.random() * 720 - 360,
    color: ["#d4a537", "#c8683a", "#8f9a4e", "#1f1b17"][i % 4],
    shape: i % 3,
  }));
  return (
    <div className="confetti" aria-hidden="true">
      {bits.map((b, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          width="20"
          height="20"
          style={{ left: `${b.left}%`, animationDelay: `${b.delay}s`, animationDuration: `${b.dur}s`, ["--rot" as string]: `${b.rot}deg` }}
        >
          {b.shape === 0 && <path d="M10 1 L12 8 L19 10 L12 12 L10 19 L8 12 L1 10 L8 8 Z" fill={b.color} />}
          {b.shape === 1 && <path d="M2 12 Q6 2 10 10 T18 8" stroke={b.color} strokeWidth="2.4" fill="none" strokeLinecap="round" />}
          {b.shape === 2 && <circle cx="10" cy="10" r="5" fill="none" stroke={b.color} strokeWidth="2.4" />}
        </svg>
      ))}
    </div>
  );
}

/** "3 of 6 found" line for the footer, with the list of what's left as hints. */
export function AchievementCount() {
  const [got, setGot] = useState<Set<string> | null>(null);
  useEffect(() => {
    const update = () => setGot(unlocked());
    update();
    addEventListener(UNLOCK_EVENT, update);
    return () => removeEventListener(UNLOCK_EVENT, update);
  }, []);
  if (!got) return null;
  return (
    <details className="achievements">
      <summary>
        {got.size} of {ACHIEVEMENTS.length} achievements found
      </summary>
      <ul>
        {ACHIEVEMENTS.map((a) => (
          <li key={a.id} className={got.has(a.id) ? "got" : ""}>
            <span aria-hidden="true">{got.has(a.id) ? "★" : "☆"}</span> {got.has(a.id) ? a.title : `${a.title}? ${a.hint}`}
          </li>
        ))}
      </ul>
    </details>
  );
}

/** Speaker button: paper and pencil sounds, off until the visitor turns them on. */
export function SoundToggle() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    setOn(soundOn());
    const sync = (e: Event) => setOn((e as CustomEvent).detail);
    addEventListener(SOUND_EVENT, sync);
    return () => removeEventListener(SOUND_EVENT, sync);
  }, []);
  return (
    <button type="button" className="fab fab-sound" aria-pressed={on} onClick={() => setSound(!on)} title="Paper sounds">
      <svg viewBox="0 0 32 32" width="22" height="22" aria-hidden="true">
        <path d="M5 12 L10 12 L17 6 L17 26 L10 20 L5 20 Z" fill="#f9f6ee" stroke="#1f1b17" strokeWidth="1.8" strokeLinejoin="round" />
        {on ? (
          <path d="M21 11 Q24 16 21 21 M24 8 Q29 16 24 24" stroke="#c8683a" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        ) : (
          <path d="M21 12 L28 20 M28 12 L21 20" stroke="#c8683a" strokeWidth="1.8" strokeLinecap="round" />
        )}
      </svg>
      <span>{on ? "Sound on" : "Sound off"}</span>
    </button>
  );
}
