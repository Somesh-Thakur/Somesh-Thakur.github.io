// Tiny Supabase REST helpers for the public page (no SDK, so the page stays light).
// The URL and anon key are public by design; row level security in supabase/schema.sql
// decides what visitors can do (read visible notes, add a note, bump the counter).

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
export const hasSupabase = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

const headers = () => ({
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  "Content-Type": "application/json",
});

export type Note = {
  id: string;
  created_at: string;
  name: string;
  message: string;
  doodle: string | null;
  color: "mustard" | "olive" | "terracotta" | "paper";
  hidden?: boolean;
};

export async function listNotes(): Promise<Note[]> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/guestbook?select=id,created_at,name,message,doodle,color&order=created_at.desc&limit=60`,
    { headers: headers() },
  );
  if (!res.ok) throw new Error("Couldn't load the guestbook.");
  return res.json();
}

export async function addNote(n: Pick<Note, "name" | "message" | "doodle" | "color">): Promise<void> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/guestbook`, {
    method: "POST",
    headers: { ...headers(), Prefer: "return=minimal" },
    body: JSON.stringify(n),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message?.includes("Too many") ? body.message : "Couldn't save your note. Try again.");
  }
}

export async function visits(bump: boolean): Promise<number | null> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${bump ? "bump_visits" : "get_visits"}`, {
      method: "POST",
      headers: headers(),
      body: "{}",
    });
    if (!res.ok) return null;
    return Number(await res.json());
  } catch {
    return null;
  }
}
