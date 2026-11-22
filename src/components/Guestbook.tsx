"use client";

import { useEffect, useRef, useState } from "react";
import { addNote, listNotes, visits, type Note } from "@/lib/supabase";
import { unlock } from "@/lib/achievements";
import { penDown, penMove, penUp } from "@/lib/sound";

const NOTE_COLORS: Note["color"][] = ["mustard", "olive", "terracotta", "paper"];
const PAD_W = 240, PAD_H = 120;
const COOLDOWN_KEY = "sketchbook-last-note";

/* ───── doodle pad: strokes stored as [[x,y,x,y...], ...] rounded to whole numbers ───── */
function DoodlePad({ onChange }: { onChange: (json: string | null) => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const strokes = useRef<number[][]>([]);

  const draw = () => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    ctx.setTransform(2, 0, 0, 2, 0, 0);
    ctx.clearRect(0, 0, PAD_W, PAD_H);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 2.2;
    ctx.strokeStyle = "#1f1b17";
    for (const s of strokes.current) {
      ctx.beginPath();
      ctx.moveTo(s[0], s[1]);
      for (let i = 2; i < s.length; i += 2) ctx.lineTo(s[i], s[i + 1]);
      ctx.stroke();
    }
  };

  useEffect(() => {
    const c = ref.current!;
    let cur: number[] | null = null;
    let last = { x: 0, y: 0, t: 0 };
    const pos = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      return [Math.round(((e.clientX - r.left) / r.width) * PAD_W), Math.round(((e.clientY - r.top) / r.height) * PAD_H)];
    };
    const total = () => strokes.current.reduce((n, s) => n + s.length, 0);
    const down = (e: PointerEvent) => {
      e.preventDefault();
      c.setPointerCapture(e.pointerId);
      cur = pos(e);
      strokes.current.push(cur);
      last = { x: e.clientX, y: e.clientY, t: e.timeStamp };
      penDown();
    };
    const move = (e: PointerEvent) => {
      if (!cur || total() > 1400) return;
      const [x, y] = pos(e);
      const lx = cur[cur.length - 2], ly = cur[cur.length - 1];
      if (Math.abs(x - lx) + Math.abs(y - ly) < 2) return;
      cur.push(x, y);
      penMove(Math.hypot(e.clientX - last.x, e.clientY - last.y) / Math.max(1, e.timeStamp - last.t));
      last = { x: e.clientX, y: e.clientY, t: e.timeStamp };
      draw();
    };
    const up = () => {
      penUp();
      if (!cur) return;
      cur = null;
      const kept = strokes.current.filter((s) => s.length >= 4);
      onChange(kept.length ? JSON.stringify(kept) : null);
    };
    c.addEventListener("pointerdown", down);
    c.addEventListener("pointermove", move);
    c.addEventListener("pointerup", up);
    c.addEventListener("pointercancel", up);
    const reset = () => {
      strokes.current = [];
      draw();
      onChange(null);
    };
    c.addEventListener("pad:reset", reset);
    return () => {
      c.removeEventListener("pointerdown", down);
      c.removeEventListener("pointermove", move);
      c.removeEventListener("pointerup", up);
      c.removeEventListener("pointercancel", up);
      c.removeEventListener("pad:reset", reset);
    };
  }, [onChange]);

  return (
    <div className="pad">
      <canvas ref={ref} width={PAD_W * 2} height={PAD_H * 2} aria-label="Doodle pad: draw something small (optional)" role="img" />
      <button type="button" className="tool-text" onClick={() => ref.current?.dispatchEvent(new Event("pad:reset"))}>
        Clear doodle
      </button>
    </div>
  );
}

export function DoodleSvg({ json }: { json: string | null }) {
  if (!json) return null;
  let strokes: number[][] = [];
  try {
    strokes = JSON.parse(json);
    if (!Array.isArray(strokes)) return null;
  } catch {
    return null;
  }
  return (
    <svg viewBox={`0 0 ${PAD_W} ${PAD_H}`} className="note-doodle" aria-hidden="true">
      {strokes.filter(Array.isArray).map((s, i) => (
        <polyline
          key={i}
          points={s.filter((n) => typeof n === "number").join(" ")}
          fill="none" stroke="#1f1b17" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}

export function StickyNote({ note, children }: { note: Note; children?: React.ReactNode }) {
  const tilt = ((parseInt(note.id.slice(0, 2), 16) % 7) - 3) * 0.9;
  return (
    <li className={`sticky sticky-${note.color}`} style={{ ["--tilt" as string]: `${tilt}deg` }}>
      <p className="sticky-msg">{note.message}</p>
      <DoodleSvg json={note.doodle} />
      <p className="sticky-from">
        {note.name ? `— ${note.name}` : "— a visitor"}
        <time dateTime={note.created_at}>
          {new Date(note.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
        </time>
      </p>
      {children}
    </li>
  );
}

/* ───── the guestbook page body ───── */
export function Guestbook() {
  const [notes, setNotes] = useState<Note[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [color, setColor] = useState<Note["color"]>("mustard");
  const [doodle, setDoodle] = useState<string | null>(null);
  const [status, setStatus] = useState<{ kind: "idle" | "saving" | "done" | "error"; text?: string }>({ kind: "idle" });
  const trap = useRef<HTMLInputElement>(null);

  const load = () =>
    listNotes()
      .then((n) => {
        setNotes(n);
        setLoadError(false);
      })
      .catch(() => setLoadError(true));

  useEffect(() => {
    load();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (trap.current?.value) return; // bots fill the hidden field; people never see it
    if (!message.trim()) {
      setStatus({ kind: "error", text: "Write a short note first." });
      return;
    }
    let last = 0;
    try {
      last = Number(localStorage.getItem(COOLDOWN_KEY) ?? 0);
    } catch {}
    if (Date.now() - last < 60_000) {
      setStatus({ kind: "error", text: "You just signed. Wait a minute before adding another note." });
      return;
    }
    setStatus({ kind: "saving" });
    try {
      await addNote({ name: name.trim().slice(0, 40), message: message.trim().slice(0, 240), doodle, color });
      try {
        localStorage.setItem(COOLDOWN_KEY, String(Date.now()));
      } catch {}
      setMessage("");
      setName("");
      setStatus({ kind: "done", text: "Signed. Thanks for leaving a note!" });
      unlock("guest");
      load();
    } catch (err) {
      setStatus({ kind: "error", text: (err as Error).message });
    }
  };

  return (
    <div className="guestbook">
      <form className="sign" onSubmit={submit}>
        <label>
          <span>Your name <em>(optional)</em></span>
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={40} autoComplete="nickname" />
        </label>
        <label>
          <span>Your note</span>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} maxLength={240} rows={3} required />
          <small>{240 - message.length} characters left</small>
        </label>
        <div className="sign-row">
          <div>
            <span className="field-label">Doodle something <em>(optional)</em></span>
            <DoodlePad onChange={setDoodle} />
          </div>
          <fieldset className="note-colors">
            <legend className="field-label">Sticky note colour</legend>
            {NOTE_COLORS.map((c) => (
              <label key={c} className={`chip sticky-${c}`}>
                <input type="radio" name="note-color" value={c} checked={color === c} onChange={() => setColor(c)} />
                <span className="visually-hidden">{c}</span>
              </label>
            ))}
          </fieldset>
        </div>
        <input ref={trap} className="trap" tabIndex={-1} autoComplete="off" aria-hidden="true" name="website" />
        <div className="sign-actions">
          <button type="submit" className="player-btn" disabled={status.kind === "saving"}>
            {status.kind === "saving" ? "Sticking it on…" : "Stick my note"}
          </button>
          <p className={`form-status ${status.kind}`} role="status">{status.text}</p>
        </div>
      </form>

      {loadError && (
        <p className="form-status error">
          The guestbook didn&apos;t load. <button type="button" className="tool-text" onClick={load}>Try again</button>
        </p>
      )}
      {notes && notes.length === 0 && <p className="note">no notes yet. be the first one!</p>}
      {notes && notes.length > 0 && (
        <ul className="stickies">
          {notes.map((n) => <StickyNote key={n.id} note={n} />)}
        </ul>
      )}
    </div>
  );
}

/* ───── visitor count for the footer ───── */
export function VisitorCount() {
  const [n, setN] = useState<number | null>(null);
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    let seenToday = false;
    try {
      seenToday = localStorage.getItem("sketchbook-visit") === today;
      localStorage.setItem("sketchbook-visit", today);
    } catch {}
    visits(!seenToday).then(setN);
  }, []);
  if (n === null) return null;
  return (
    <p className="visits">
      This sketchbook has been opened <strong>{n.toLocaleString("en-IN")}</strong> {n === 1 ? "time" : "times"}.
    </p>
  );
}
