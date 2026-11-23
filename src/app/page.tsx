import { InkEngine } from "@/components/InkEngine";
import { PencilTrail } from "@/components/PencilTrail";
import { Crumple } from "@/components/Crumple";
import { Mark, Sketch } from "@/components/Sketch";
import {
  Arrow, BloodOathSketch, BoomtownSketch, Icon, InkButton, RecordSketch, ReelSketch, Sparkle, Squiggle, Tick,
} from "@/components/Doodles";
import { GamePlayer } from "@/components/GamePlayer";
import { LoopClip } from "@/components/LoopClip";
import { BookmarkTabs } from "@/components/BookmarkTabs";
import { DrawMode } from "@/components/DrawMode";
import { Achievements, AchievementCount, SoundToggle } from "@/components/Achievements";
import { Guestbook, VisitorCount } from "@/components/Guestbook";
import { games, moreProjects, socials, workbench } from "@/lib/content";
import { getActivity } from "@/lib/github";
import { fmtCount, getStats } from "@/lib/stats";
import { hasSupabase } from "@/lib/supabase";
import "./page.css";

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });

const spindleFeatures = [
  "Full songs, not previews",
  "Live lyrics, Hinglish included",
  "Karaoke mode",
  "Playlists that sync across phone, PC and web",
];

const toonreelFeatures = [
  "Write a skit, get a 1080×1920 reel",
  "Blocky 3D or flat 2D characters, lip-synced",
  "Free voices in 400+ languages, Hindi and Hinglish too",
  "Word-by-word captions, crowds and quizzes",
  "No subscription, no watermark",
];

const tools = ["Godot 4", "GDScript", "three.js", "TypeScript", "WebRTC", "React", "Supabase", "Tauri", "Python"];

/** "The hard part" note under a project: what was actually difficult to build. */
function HardPart({ children, href }: { children: React.ReactNode; href?: string | null }) {
  return (
    <div className="hard-part">
      <p className="note hard-kicker">the hard part</p>
      <p>{children}</p>
      {href && <a className="hard-link" href={href}>Read how I built it</a>}
    </div>
  );
}

export default async function Home() {
  const [activity, stats] = await Promise.all([getActivity(), getStats()]);
  const itchViews = Object.values(stats.itch).reduce((n, g) => n + g.views, 0);
  const counts = [
    stats.contributions != null && { n: stats.contributions, label: "GitHub contributions in the past year" },
    itchViews > 0 && { n: itchViews, label: "views of my games on itch.io" },
    stats.publicRepos != null && { n: stats.publicRepos, label: "public repos" },
    { n: games.length + workbench.length, label: "games released or in development" },
    stats.stars != null && stats.stars > 0 && { n: stats.stars, label: "stars on GitHub" },
  ].filter(Boolean) as { n: number; label: string }[];

  const tabs = [
    { id: "games", label: "Games" },
    { id: "workbench", label: "Workbench" },
    { id: "spindle", label: "Spindle" },
    { id: "toonreel", label: "ToonReel" },
    { id: "about", label: "About me" },
    ...(hasSupabase ? [{ id: "guestbook", label: "Guestbook" }] : []),
    { id: "contact", label: "Say hi" },
  ];
  const contactPage = hasSupabase ? 9 : 8;

  return (
    <>
      <a className="skip" href="#games">Skip to games</a>
      <div className="binding" aria-hidden="true" />
      <PencilTrail />
      <InkEngine />
      <Crumple />
      <BookmarkTabs tabs={tabs} />
      <DrawMode />
      <SoundToggle />
      <Achievements />

      <main>
        {/* ───────── p.1 hello ───────── */}
        <section className="page hello" id="hello" aria-labelledby="hello-title">
          <span className="folio">p. 1</span>
          <div className="hello-grid">
            <div className="hello-copy">
              <p className="note hello-kicker" data-write="load" data-delay="0.2">property of Somesh</p>
              <h1 id="hello-title" className="hello-title">
                <span data-write="load" data-delay="0.5">Hi, I&apos;m</span>{" "}
                <span className="hello-name" data-write="load" data-delay="1.0">
                  <Mark kind="underline" color="var(--terracotta)" delay={1.7} seed={8}>Somesh.</Mark>
                </span>
              </h1>
              <p className="lede hello-lede" data-appear="load" data-delay="1.6">
                I make games: a browser fighting game where your phone is the controller, an online
                shooter in Godot with real netcode, and my own game engine. First-year CSE (Gaming
                Tech) student at SRM KTR.
              </p>
              <div className="btns" data-appear="load" data-delay="2.0">
                <InkButton href="#games" fill seed={3}>Play my games</InkButton>
                <InkButton href="/Somesh-Thakur-Resume.pdf" seed={6} external>Resume (PDF)</InkButton>
              </div>
            </div>

            <figure className="hello-portrait">
              <img
                src="/pfp-640.webp"
                srcSet="/pfp-640.webp 640w, /pfp.webp 1024w"
                sizes="(max-width: 820px) 300px, 440px"
                alt="Hand-drawn portrait of Somesh in glasses and a black hoodie"
                width={1024}
                height={1024}
                fetchPriority="high"
              />
              <figcaption className="note hello-caption">
                <Arrow d="curl" className="hello-arrow" />
                <span data-write="load" data-delay="2.2">me, probably debugging</span>
              </figcaption>
            </figure>
          </div>
          <a href="#games" className="turn note">
            <span>turn the page</span>
            <Arrow d="down" className="turn-arrow" delay={2.4} />
          </a>
        </section>

        {/* ───────── p.2 games ───────── */}
        <section className="page games" id="games" aria-labelledby="games-title">
          <span className="folio">p. 2</span>
          <h2 id="games-title" data-write>Games you can play right now</h2>
          <p className="games-intro">
            Both run in the browser. No downloads, no accounts, <Mark kind="highlight">no ads</Mark>.
          </p>
          <div className="game-list">
            {games.map((g, i) => {
              const it = stats.itch[g.href.split("/").pop()!];
              return (
                <article key={g.id} className={`game game-${i}`}>
                  <div className="game-side">
                    <div className="game-art">
                      <span className="tape" style={{ top: -12, left: i ? "auto" : 24, right: i ? 24 : "auto", transform: `rotate(${i ? 5 : -6}deg)` }} />
                      <GamePlayer uploadId={g.uploadId} title={g.title} href={g.href} note={g.playNote} label={g.playLabel}>
                        {g.id === "blood-oath" ? <BloodOathSketch /> : <BoomtownSketch />}
                      </GamePlayer>
                    </div>
                    {g.clip ? (
                      <figure className="shot clip" style={{ ["--tilt" as string]: "-1.2deg" }}>
                        <span className="tape tape-sm" />
                        <LoopClip src={g.clip.src} poster={g.clip.poster} label={`${g.title} gameplay: two fighters trading weapon strikes`} />
                      </figure>
                    ) : (
                      <div className="shots">
                        {g.shots.map((s, k) => (
                          <figure key={s} className="shot" style={{ ["--tilt" as string]: `${(k ? 3 : -2.5) * (i ? -1 : 1)}deg` }}>
                            <span className="tape tape-sm" />
                            <img src={s} alt={`${g.title} screenshot ${k + 1}`} width={347} height={195} loading="lazy" decoding="async" />
                          </figure>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="game-copy">
                    <h3 data-write>{g.title}</h3>
                    <p>{g.line}</p>
                    <ul className="tags" aria-label="Tags">
                      {g.tags.map((t, k) => (
                        <li key={t}><Mark kind="circle" color={["var(--olive)", "var(--mustard)", "var(--terracotta)"][k % 3]} seed={k + i * 5} delay={0.3 + k * 0.2}>{t}</Mark></li>
                      ))}
                    </ul>
                    {it && it.views > 0 && (
                      <p className="game-stat"><strong>{fmtCount(it.views)}</strong> views on itch.io</p>
                    )}
                    {g.built && <HardPart href={g.caseStudy}>{g.built}</HardPart>}
                    <InkButton href={g.href} fill seed={10 + i} external>Play on itch.io</InkButton>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ───────── p.3 workbench: bigger games in development ───────── */}
        <section className="page workbench" id="workbench" aria-labelledby="workbench-title">
          <span className="folio">p. 3</span>
          <h2 id="workbench-title" data-write>On the workbench</h2>
          <p className="lede workbench-intro">
            Bigger games I&apos;m building in Godot and in my own engine. They&apos;re still in development,
            so the code is private for now. Ask me and I&apos;ll show you.
          </p>
          <div className="bench">
            {workbench.map((w, i) => (
              <article key={w.id} className="bench-item">
                <figure className="shot bench-shot" style={{ ["--tilt" as string]: `${i % 2 ? 1.6 : -1.8}deg` }}>
                  <span className="tape tape-sm" />
                  <img src={w.shot} alt={w.alt} width={960} height={540} loading="lazy" decoding="async" />
                </figure>
                <div className="bench-copy">
                  <h3>{w.title}</h3>
                  <p className="card-stack">{w.engine}</p>
                  <p>{w.what}</p>
                  <HardPart>{w.hard}</HardPart>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ───────── p.4 spindle ───────── */}
        <section className="page spindle" id="spindle" aria-labelledby="spindle-title">
          <span className="folio">p. 4</span>
          <div className="spindle-grid">
            <div>
              <h2 id="spindle-title" data-write>Spindle</h2>
              <p className="lede">
                I built Spindle because I wanted a music player that works my way. It runs on your phone,
                your PC and the web, and your songs, lyrics and playlists follow you everywhere.
              </p>
              <ul className="checklist">
                {spindleFeatures.map((f, i) => (
                  <li key={f}><Tick delay={i * 0.25} /><span>{f}</span></li>
                ))}
              </ul>
              <p className="note stack-note">made with React, Supabase and Tauri</p>
              <HardPart href="/work/spindle/">
                Keeping one library in sync across a phone, a browser and a desktop app. Each device sends only
                what changed, the database merges entry by entry, and the other devices get told to pull.
              </HardPart>
              <div className="btns">
                <InkButton href="https://someshthakur.tech/spindle/" fill seed={14} external>Open Spindle</InkButton>
                <InkButton href="https://github.com/Somesh-Thakur/spindle" seed={15} external>Read the code</InkButton>
              </div>
            </div>
            <RecordSketch />
          </div>
        </section>

        {/* ───────── p.5 toonreel ───────── */}
        <section className="page spindle toonreel" id="toonreel" aria-labelledby="toonreel-title">
          <span className="folio">p. 5</span>
          <div className="spindle-grid">
            <ReelSketch />
            <div>
              <h2 id="toonreel-title" data-write>ToonReel</h2>
              <p className="lede">
                Write a skit, get a cartoon reel. ToonReel is a free, open-source skill for AI agents like
                Claude Code that turns a script into a lip-synced 3D or 2D cartoon for Instagram Reels,
                YouTube Shorts and TikTok. It runs on your own computer.
              </p>
              <ul className="checklist">
                {toonreelFeatures.map((f, i) => (
                  <li key={f}><Tick delay={i * 0.25} /><span>{f}</span></li>
                ))}
              </ul>
              <p className="note stack-note">works with Claude Code, Codex, Gemini CLI and Cursor</p>
              <HardPart href="/work/toonreel/">
                Text-to-speech mangles Hindi and English mixed together. So before rendering, every line is
                voiced and transcribed back with Whisper, and any word that comes back wrong gets reworded.
              </HardPart>
              <div className="btns">
                <InkButton href="https://someshthakur.tech/toonreel/" fill seed={16} external>Try the studio</InkButton>
                <InkButton href="https://github.com/Somesh-Thakur/toonreel" seed={17} external>Read the code</InkButton>
              </div>
            </div>
          </div>
        </section>

        {/* ───────── p.6 smaller things ───────── */}
        <section className="page drawer" id="projects" aria-labelledby="projects-title">
          <span className="folio">p. 6</span>
          <div className="drawer-head">
            <div>
              <h2 id="projects-title" data-write>Smaller things</h2>
              <p className="lede">Tools I made because I needed them.</p>
            </div>
            <aside className="sticky sticky-mustard now-note" aria-label="What I'm working on right now">
              <span className="tape tape-sm" />
              <p className="now-kicker">Right now</p>
              <p>
                Working on{" "}
                <a href={activity?.repoUrl ?? "https://github.com/Somesh-Thakur/spindle"} target="_blank" rel="noopener noreferrer">
                  {activity?.repo ?? "spindle"}
                </a>
              </p>
              {activity?.message && <p className="now-msg">&ldquo;{activity.message}&rdquo;</p>}
              {activity ? (
                <p className="now-meta">
                  last push {fmtDate(activity.when)}
                  {activity.pushesThisWeek > 1 && `, ${activity.pushesThisWeek} pushes this week`}
                </p>
              ) : (
                <p className="now-meta">updated every morning from GitHub</p>
              )}
            </aside>
          </div>
          <ul className="more-list">
            {moreProjects.map((p) => (
              <li key={p.title}>
                <a href={p.href} target="_blank" rel="noopener noreferrer">{p.title}</a>
                <span>{p.what}</span>
              </li>
            ))}
          </ul>
          <div className="btns">
            <InkButton href="https://github.com/Somesh-Thakur?tab=repositories" seed={19} external>Everything else on GitHub</InkButton>
          </div>
        </section>

        {/* ───────── p.7 character sheet ───────── */}
        <section className="page sheet" id="about" aria-labelledby="about-title">
          <span className="folio">p. 7</span>
          <h2 id="about-title" data-write>About me: character sheet</h2>
          <div className="sheet-box">
            <Sketch
              w={1000} h={600} stretch className="sheet-frame"
              shapes={[{ type: "rect", x: 4, y: 4, w: 992, h: 592 }]}
              opts={{ stroke: "var(--ink)", strokeWidth: 2, seed: 61 }}
            />
            <dl className="sheet-top">
              <div><dt>Name</dt><dd>Somesh Sanjay Thakur</dd></div>
              <div><dt>Also known as</dt><dd>Mark60a2</dd></div>
              <div><dt>Class</dt><dd>Game developer</dd></div>
              <div><dt>Level</dt><dd>1st year</dd></div>
            </dl>
            <Sketch
              w={1000} h={12} stretch className="sheet-rule"
              shapes={[{ type: "line", x1: 0, y1: 6, x2: 1000, y2: 7 }]}
              opts={{ stroke: "var(--ink)", strokeWidth: 2, seed: 62, roughness: 2 }}
            />
            <div className="sheet-body">
              <div>
                <h3>Guild</h3>
                <p>SRM Institute of Science and Technology, Kattankulathur. B.Tech CSE with a specialisation in Gaming Technology.</p>
                <h3>Usually found</h3>
                <p>
                  Making games for game night, and the hard parts underneath them: netcode, physics,
                  shaders and engines. When I need a tool that doesn&apos;t exist, I build that too.
                </p>
              </div>
              <div>
                <h3>Inventory</h3>
                <ul className="inventory">
                  {tools.map((t, i) => (
                    <li key={t} style={{ ["--tilt" as string]: `${(i % 3 - 1) * 2}deg` }}>{t}</li>
                  ))}
                </ul>
                <h3>Counted so far</h3>
                <ul className="counts">
                  {counts.map((c) => (
                    <li key={c.label}>
                      <strong className="count-n">{fmtCount(c.n)}</strong>
                      <span>{c.label}</span>
                    </li>
                  ))}
                </ul>
                <p className="counts-note">updated every morning from GitHub{itchViews > 0 && " and itch.io"}</p>
              </div>
            </div>
            <Sparkle className="sheet-spark" />
          </div>
        </section>

        {/* ───────── p.8 guestbook (only when Supabase is connected) ───────── */}
        {hasSupabase && (
          <section className="page guest" id="guestbook" aria-labelledby="guest-title">
            <span className="folio">p. 8</span>
            <h2 id="guest-title" data-write>Sign the guestbook</h2>
            <p className="lede">
              Leave a note, a doodle, or both. It sticks to this page for everyone to see. I read every
              note, and anything rude gets taken down.
            </p>
            <Guestbook />
          </section>
        )}

        {/* ───────── contact ───────── */}
        <section className="page contact" id="contact" aria-labelledby="contact-title">
          <span className="folio">p. {contactPage}</span>
          <h2 id="contact-title" data-write>Come say hi</h2>
          <p className="lede">
            Playtesting, collabs, internships, or just a game you think I&apos;d like. Pick a door, or grab
            my <a href="/Somesh-Thakur-Resume.pdf" target="_blank" rel="noopener noreferrer">resume (PDF)</a>.
          </p>
          <ul className="doors">
            {socials.map((s, i) => (
              <li key={s.id}>
                <a href={s.href} {...(s.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                  <Icon name={s.icon} seed={i + 3} />
                  <span className="door-label">{s.label}</span>
                  <span className="door-handle">{s.handle}</span>
                </a>
              </li>
            ))}
          </ul>
          <Squiggle className="end-squiggle" />
          <footer className="colophon">
            <p className="note">thanks for flipping through.</p>
            {hasSupabase && <VisitorCount />}
            <AchievementCount />
            <p className="colophon-small">
              Drawn by Somesh, 2026. Every line is rough.js, inked in with GSAP as you scroll.
              Press <kbd>D</kbd> to draw on the page.
            </p>
            <a href="#hello-title" className="note back">back to page 1</a>
          </footer>
        </section>
      </main>
    </>
  );
}
