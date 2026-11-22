import { InkEngine } from "@/components/InkEngine";
import { PencilTrail } from "@/components/PencilTrail";
import { Crumple } from "@/components/Crumple";
import { Mark, Sketch } from "@/components/Sketch";
import {
  Arrow, BloodOathSketch, BoomtownSketch, Icon, InkButton, RecordSketch, Sparkle, Squiggle, Tick,
} from "@/components/Doodles";
import { GamePlayer } from "@/components/GamePlayer";
import { BookmarkTabs } from "@/components/BookmarkTabs";
import { DrawMode } from "@/components/DrawMode";
import { Achievements, AchievementCount, SoundToggle } from "@/components/Achievements";
import { Guestbook, VisitorCount } from "@/components/Guestbook";
import { drawers, games, socials } from "@/lib/content";
import { getActivity } from "@/lib/github";
import { hasSupabase } from "@/lib/supabase";
import "./page.css";

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" });

const spindleFeatures = [
  "Full songs, not previews",
  "Live lyrics, Hinglish included",
  "Karaoke mode",
  "Playlists that sync across phone, PC and web",
];

const tools = ["TypeScript", "React", "Next.js", "Tailwind", "Python", "Supabase", "Tauri", "Electron", "GSAP"];

function Tally({ n }: { n: number }) {
  // Hand-counted tally marks: groups of four strokes with a slash through.
  const groups = Math.floor(n / 5);
  const rest = n % 5;
  const shapes: Parameters<typeof Sketch>[0]["shapes"] = [];
  let x = 4;
  for (let g = 0; g < groups + (rest ? 1 : 0); g++) {
    const count = g < groups ? 4 : rest;
    for (let i = 0; i < count; i++) shapes.push({ type: "line", x1: x + i * 8, y1: 6, x2: x + i * 8 + 1, y2: 34 });
    if (g < groups) shapes.push({ type: "line", x1: x - 4, y1: 28, x2: x + 30, y2: 10, o: { stroke: "var(--terracotta)" } });
    x += 46;
  }
  return <Sketch w={Math.max(60, x)} h={40} shapes={shapes} opts={{ stroke: "var(--ink)", strokeWidth: 2, seed: n }} className="tally" label={`${n}`} />;
}

export default async function Home() {
  const activity = await getActivity();
  const tabs = [
    { id: "games", label: "Games" },
    { id: "spindle", label: "Spindle" },
    { id: "projects", label: "Projects" },
    { id: "about", label: "Me" },
    ...(hasSupabase ? [{ id: "guestbook", label: "Guestbook" }] : []),
    { id: "contact", label: "Say hi" },
  ];
  const contactPage = hasSupabase ? 7 : 6;

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
                I make free games that run in your browser, on a PC or a phone, and the apps I wish
                already existed. First-year CSE (Gaming Tech) student at SRM KTR.
              </p>
              <div className="btns" data-appear="load" data-delay="2.0">
                <InkButton href="#games" fill seed={3}>Play my games</InkButton>
                <InkButton href="#contact" seed={6}>Say hi</InkButton>
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
            {games.map((g, i) => (
              <article key={g.id} className={`game game-${i}`}>
                <div className="game-side">
                  <div className="game-art">
                    <span className="tape" style={{ top: -12, left: i ? "auto" : 24, right: i ? 24 : "auto", transform: `rotate(${i ? 5 : -6}deg)` }} />
                    <GamePlayer uploadId={g.uploadId} title={g.title} href={g.href} note={g.playNote}>
                      {g.id === "blood-oath" ? <BloodOathSketch /> : <BoomtownSketch />}
                    </GamePlayer>
                  </div>
                  <div className="shots">
                    {g.shots.map((s, k) => (
                      <figure key={s} className="shot" style={{ ["--tilt" as string]: `${(k ? 3 : -2.5) * (i ? -1 : 1)}deg` }}>
                        <span className="tape tape-sm" />
                        <img src={s} alt={`${g.title} screenshot ${k + 1}`} width={347} height={195} loading="lazy" decoding="async" />
                      </figure>
                    ))}
                  </div>
                </div>
                <div className="game-copy">
                  <h3 data-write>{g.title}</h3>
                  <p>{g.line}</p>
                  <ul className="tags" aria-label="Tags">
                    {g.tags.map((t, k) => (
                      <li key={t}><Mark kind="circle" color={["var(--olive)", "var(--mustard)", "var(--terracotta)"][k % 3]} seed={k + i * 5} delay={0.3 + k * 0.2}>{t}</Mark></li>
                    ))}
                  </ul>
                  <InkButton href={g.href} fill seed={10 + i} external>Play on itch.io</InkButton>
                </div>
              </article>
            ))}
          </div>
          <p className="note games-more">
            more on the way. follow along on{" "}
            <a href="https://www.youtube.com/@Mark60a2" target="_blank" rel="noopener noreferrer">YouTube</a> and{" "}
            <a href="https://discord.gg/kr4euTBVzt" target="_blank" rel="noopener noreferrer">Discord</a>
          </p>
        </section>

        {/* ───────── p.3 spindle ───────── */}
        <section className="page spindle" id="spindle" aria-labelledby="spindle-title">
          <span className="folio">p. 3</span>
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
              <div className="btns">
                <InkButton href="https://someshthakur.tech/spindle/" fill seed={14} external>Open Spindle</InkButton>
                <InkButton href="https://github.com/Somesh-Thakur/spindle" seed={15} external>Read the code</InkButton>
              </div>
            </div>
            <RecordSketch />
          </div>
        </section>

        {/* ───────── p.4 everything else ───────── */}
        <section className="page drawer" id="projects" aria-labelledby="projects-title">
          <span className="folio">p. 4</span>
          <div className="drawer-head">
            <h2 id="projects-title" data-write>Everything else in the drawer</h2>
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
          {drawers.map((d, di) => (
            <div key={d.name} className="shelf">
              <div className="shelf-head">
                <h3 data-write>{d.name}</h3>
                <span className="note">{d.note}</span>
              </div>
              <div className="cards">
                {d.items.map((p, i) => (
                  <article key={p.title} className="card" style={{ ["--tilt" as string]: `${((i + di) % 3 - 1) * 0.8}deg` }}>
                    <h4>{p.title}</h4>
                    <p>{p.what}</p>
                    <p className="card-stack">{p.stack}</p>
                    <p className="card-links">
                      {p.live && <a href={p.live} target="_blank" rel="noopener noreferrer">Open it</a>}
                      {p.code && <a href={p.code} target="_blank" rel="noopener noreferrer">Code</a>}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* ───────── p.5 character sheet ───────── */}
        <section className="page sheet" id="about" aria-labelledby="about-title">
          <span className="folio">p. 5</span>
          <h2 id="about-title" data-write>Character sheet</h2>
          <div className="sheet-box">
            <Sketch
              w={1000} h={600} stretch className="sheet-frame"
              shapes={[{ type: "rect", x: 4, y: 4, w: 992, h: 592 }]}
              opts={{ stroke: "var(--ink)", strokeWidth: 2, seed: 61 }}
            />
            <dl className="sheet-top">
              <div><dt>Name</dt><dd>Somesh Sanjay Thakur</dd></div>
              <div><dt>Also known as</dt><dd>Mark60a2</dd></div>
              <div><dt>Class</dt><dd>Full-stack dev, game maker</dd></div>
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
                <p>Somewhere between UX and LLMs: reactive web apps, small automations that run on their own, and games for game night.</p>
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
                  <li><Tally n={activity?.publicRepos ?? 24} /><span>public repos</span></li>
                  <li><Tally n={2} /><span>games on itch.io</span></li>
                  <li><Tally n={3} /><span>platforms Spindle runs on</span></li>
                </ul>
              </div>
            </div>
            <Sparkle className="sheet-spark" />
          </div>
        </section>

        {/* ───────── p.6 guestbook (only when Supabase is connected) ───────── */}
        {hasSupabase && (
          <section className="page guest" id="guestbook" aria-labelledby="guest-title">
            <span className="folio">p. 6</span>
            <h2 id="guest-title" data-write>Sign the guestbook</h2>
            <p className="lede">Leave a note, a doodle, or both. It sticks to this page for everyone to see.</p>
            <Guestbook />
          </section>
        )}

        {/* ───────── contact ───────── */}
        <section className="page contact" id="contact" aria-labelledby="contact-title">
          <span className="folio">p. {contactPage}</span>
          <h2 id="contact-title" data-write>Come say hi</h2>
          <p className="lede">Playtesting, collabs, internships, or just a game you think I&apos;d like. Pick a door.</p>
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
