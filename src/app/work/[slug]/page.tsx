import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InkEngine } from "@/components/InkEngine";
import { PencilTrail } from "@/components/PencilTrail";
import { Crumple } from "@/components/Crumple";
import { Mark, Sketch } from "@/components/Sketch";
import { Arrow, InkButton } from "@/components/Doodles";
import { LoopClip } from "@/components/LoopClip";
import { caseStudies, type CaseStudy, type DiagramLane } from "@/lib/caseStudies";
import { fmtCount, getStats } from "@/lib/stats";
import "../../page.css";
import "./case.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

const find = (slug: string) => caseStudies.find((c) => c.slug === slug);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = find((await params).slug);
  if (!c) return {};
  const title = `How I built ${c.title}: ${c.headline.toLowerCase()}`;
  return {
    title,
    description: c.summary,
    alternates: { canonical: `https://someshthakur.tech/work/${c.slug}/` },
    openGraph: { title, description: c.summary, url: `https://someshthakur.tech/work/${c.slug}/`, images: ["/og.png"] },
  };
}

/** A hand-drawn flow: boxes in a row joined by labelled arrows (stacked on phones). */
function Diagram({ lanes }: { lanes: DiagramLane[] }) {
  return (
    <div className="diagram" role="img" aria-label={lanes.map((l) => l.nodes.map((n) => n.title).join(" to ")).join("; ")}>
      {lanes.map((lane, li) => (
        <div key={li} className="lane">
          {lane.label && <p className="note lane-label">{lane.label}</p>}
          <div className="lane-row" aria-hidden="true">
            {lane.nodes.map((n, i) => (
              <div key={n.title} className="lane-cell">
                <div className="node">
                  <Sketch
                    w={200} h={90} stretch className="node-box"
                    shapes={[{ type: "rect", x: 3, y: 3, w: 194, h: 84 }]}
                    opts={{ stroke: i === 0 ? "var(--terracotta)" : "var(--ink)", strokeWidth: 1.8, seed: 40 + li * 7 + i }}
                  />
                  <strong>{n.title}</strong>
                  {n.sub && <span>{n.sub}</span>}
                </div>
                {i < lane.nodes.length - 1 && (
                  <div className="link">
                    <Arrow d="right" className="link-arrow link-across" />
                    <Arrow d="down" className="link-arrow link-down" />
                    <span className="note">{lane.links[i]}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Bug({ b, n }: { b: NonNullable<CaseStudy["bug2"]>; n: number }) {
  return (
    <article className="bug">
      <h3>{n === 1 ? "The hardest bug: " : "Another one: "}{b.title}</h3>
      <dl>
        <div><dt>What I saw</dt><dd>{b.symptom}</dd></div>
        <div><dt>Why it happened</dt><dd>{b.cause}</dd></div>
        <div><dt>The fix</dt><dd>{b.fix}</dd></div>
      </dl>
    </article>
  );
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const c = find((await params).slug);
  if (!c) notFound();
  const stats = c.itchSlug ? await getStats() : null;
  const it = c.itchSlug ? stats?.itch[c.itchSlug] : undefined;
  const facts = it && it.views > 0 ? [{ n: fmtCount(it.views), label: "views on itch.io" }, ...c.facts] : c.facts;
  const others = caseStudies.filter((o) => o.slug !== c.slug);

  return (
    <>
      <div className="binding" aria-hidden="true" />
      <PencilTrail />
      <InkEngine />
      <Crumple />
      <main className="case">
        <section className="page case-head" aria-labelledby="case-title">
          <a className="note case-back" href="/#games">back to the sketchbook</a>
          <p className="note case-kicker" data-write="load" data-delay="0.1">case study</p>
          <h1 id="case-title" data-write="load" data-delay="0.3">
            <Mark kind="underline" color="var(--terracotta)" delay={1} seed={12}>{c.title}</Mark>
          </h1>
          <p className="case-headline">{c.headline}</p>
          <p className="lede">{c.summary}</p>
          <dl className="case-meta">
            <div><dt>My role</dt><dd>{c.role}</dd></div>
            <div><dt>Built with</dt><dd>{c.stack}</dd></div>
          </dl>

          <div className={`case-media${c.media.kind === "video" && c.media.h > c.media.w ? " is-tall" : ""}`}>
            <figure className="shot" style={{ ["--tilt" as string]: "-1deg" }}>
              <span className="tape tape-sm" />
              {c.media.kind === "video" ? (
                <LoopClip src={c.media.src} poster={c.media.poster} label={c.media.alt} />
              ) : (
                <img src={c.media.src} alt={c.media.alt} width={c.media.w} height={c.media.h} />
              )}
            </figure>
            <ul className="facts">
              {facts.map((f) => (
                <li key={f.label}><strong>{f.n}</strong><span>{f.label}</span></li>
              ))}
            </ul>
          </div>
        </section>

        <section className="page case-body" aria-label={`How ${c.title} was built`}>
          <h2 data-write>The problem</h2>
          {c.problem.map((p) => <p key={p}>{p}</p>)}

          <h2 data-write>How it fits together</h2>
          <Diagram lanes={c.diagram} />
          {c.how.map((p) => <p key={p}>{p}</p>)}

          <h2 data-write>What went wrong</h2>
          <Bug b={c.bug} n={1} />
          {c.bug2 && <Bug b={c.bug2} n={2} />}

          <h2 data-write>What I&apos;d change</h2>
          <ul className="change">
            {c.change.map((p) => <li key={p}>{p}</li>)}
          </ul>

          <div className="btns">
            {c.links.map((l, i) => (
              <InkButton key={l.href} href={l.href} fill={i === 0} seed={30 + i} external>{l.label}</InkButton>
            ))}
          </div>

          <nav className="case-next" aria-label="Other case studies">
            <p className="note">read another</p>
            <ul>
              {others.map((o) => (
                <li key={o.slug}><a href={`/work/${o.slug}/`}>{o.title}: {o.headline.toLowerCase()}</a></li>
              ))}
            </ul>
          </nav>
        </section>
      </main>
    </>
  );
}
