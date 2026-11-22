"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient, type Session } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL, hasSupabase, type Note } from "@/lib/supabase";
import { StickyNote } from "@/components/Guestbook";
import "../page.css";
import "./admin.css";

const ADMIN_EMAIL = "someshrthakur@gmail.com";

/**
 * Somesh's guestbook controls: sign in with a magic link, then hide, show or delete
 * any note, and choose whether new notes need approval before they appear.
 * The database itself only lets this one email do any of that (see supabase/schema.sql).
 */
export default function Admin() {
  const supabase = useMemo(() => (hasSupabase ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null), []);
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [sent, setSent] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [approval, setApproval] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!supabase) return setReady(true);
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, [supabase]);

  const isAdmin = session?.user.email === ADMIN_EMAIL;

  const load = async () => {
    if (!supabase) return;
    const [{ data: n, error: e1 }, { data: s }] = await Promise.all([
      supabase.from("guestbook").select("*").order("created_at", { ascending: false }).limit(300),
      supabase.from("site_settings").select("require_approval").eq("id", 1).single(),
    ]);
    if (e1) setError(e1.message);
    setNotes((n as Note[]) ?? []);
    setApproval(Boolean(s?.require_approval));
  };

  useEffect(() => {
    if (isAdmin) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  if (!ready) return null;

  if (!supabase) {
    return (
      <main className="admin">
        <h1>Guestbook admin</h1>
        <p>The guestbook isn&apos;t connected yet. Add the Supabase URL and anon key to the build, then reload.</p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="admin">
        <h1>Guestbook admin</h1>
        <button
          type="button"
          className="player-btn"
          onClick={async () => {
            setError("");
            const { error } = await supabase.auth.signInWithOAuth({
              provider: "github",
              options: { redirectTo: `${location.origin}/admin/` },
            });
            if (error) setError(error.message);
          }}
        >
          Sign in with GitHub
        </button>
        <p className="admin-or">or</p>
        {sent ? (
          <p>Check {email} for a sign-in link, then come back to this page.</p>
        ) : (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setError("");
              const { error } = await supabase.auth.signInWithOtp({
                email,
                options: { emailRedirectTo: `${location.origin}/admin/`, shouldCreateUser: true },
              });
              if (error) setError(error.message);
              else setSent(true);
            }}
          >
            <label>
              <span>Email</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <button type="submit" className="player-btn">Email me a sign-in link</button>
          </form>
        )}
        {error && <p className="form-status error">{error}</p>}
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="admin">
        <h1>Guestbook admin</h1>
        <p>You&apos;re signed in as {session.user.email}, which isn&apos;t the admin account.</p>
        <button type="button" className="player-btn" onClick={() => supabase.auth.signOut()}>Sign out</button>
      </main>
    );
  }

  const act = async (fn: () => PromiseLike<{ error: { message: string } | null }>) => {
    setError("");
    const { error } = await fn();
    if (error) setError(error.message);
    load();
  };

  return (
    <main className="admin">
      <header className="admin-head">
        <h1>Guestbook admin</h1>
        <button type="button" className="tool-text" onClick={() => supabase.auth.signOut()}>Sign out</button>
      </header>

      <label className="toggle">
        <input
          type="checkbox"
          checked={approval}
          onChange={(e) => act(() => supabase.from("site_settings").update({ require_approval: e.target.checked }).eq("id", 1))}
        />
        <span>Approve new notes before they appear on the site</span>
      </label>
      {error && <p className="form-status error">{error}</p>}

      <p>
        {notes.length} notes, {notes.filter((n) => n.hidden).length} hidden.
      </p>
      <ul className="stickies">
        {notes.map((n) => (
          <StickyNote key={n.id} note={n}>
            <div className={`admin-actions${n.hidden ? " is-hidden" : ""}`}>
              {n.hidden && <span className="badge">Hidden</span>}
              <button
                type="button"
                onClick={() => act(() => supabase.from("guestbook").update({ hidden: !n.hidden }).eq("id", n.id))}
              >
                {n.hidden ? "Show on site" : "Hide"}
              </button>
              <button
                type="button"
                className="danger"
                onClick={() => {
                  if (confirm("Delete this note for good? This can't be undone.")) {
                    act(() => supabase.from("guestbook").delete().eq("id", n.id));
                  }
                }}
              >
                Delete
              </button>
            </div>
          </StickyNote>
        ))}
      </ul>
    </main>
  );
}
