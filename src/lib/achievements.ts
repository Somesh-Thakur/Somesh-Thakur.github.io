// Little hand-drawn achievements, remembered in this browser only.

export const ACHIEVEMENTS = [
  { id: "every-page", title: "Flipped through every page", hint: "Scroll all the way through" },
  { id: "crumpler", title: "Crumpled 5 buttons", hint: "Click some buttons" },
  { id: "doodler", title: "Drew in the sketchbook", hint: "Press D, or use the pencil button" },
  { id: "player", title: "Pressed play", hint: "Start a game on page 2" },
  { id: "guest", title: "Signed the guestbook", hint: "Leave a note in the guestbook" },
  { id: "secret", title: "Found the secret", hint: "↑ ↑ ↓ ↓ ← → ← → B A" },
] as const;

export type AchievementId = (typeof ACHIEVEMENTS)[number]["id"];

const KEY = "sketchbook-achievements";
export const UNLOCK_EVENT = "sketchbook:unlock";

export function unlocked(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(KEY) ?? "[]"));
  } catch {
    return new Set();
  }
}

export function unlock(id: AchievementId) {
  const got = unlocked();
  if (got.has(id)) return;
  got.add(id);
  try {
    localStorage.setItem(KEY, JSON.stringify([...got]));
  } catch {
    /* private mode: the toast still shows, it just won't be remembered */
  }
  window.dispatchEvent(new CustomEvent(UNLOCK_EVENT, { detail: id }));
}

/** Counts something (e.g. crumpled buttons) and unlocks once it reaches `goal`. */
export function tally(id: AchievementId, goal: number) {
  const k = `${KEY}:${id}`;
  let n = 0;
  try {
    n = Number(localStorage.getItem(k) ?? 0) + 1;
    localStorage.setItem(k, String(n));
  } catch {
    n = goal;
  }
  if (n >= goal) unlock(id);
}
