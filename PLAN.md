# someshthakur.tech — "Player One" Portfolio Plan

## Concept
The site plays like a game boot sequence, not a résumé.
Visitor = new player. Somesh = the character they're inspecting.

| Section | Game metaphor | Content |
|---|---|---|
| Boot / loader | BIOS + "PRESS START" | Real asset-loading %, skippable, remembers return visitors |
| Hero | Title screen | 3D scene (R3F), name in glitch type, class: "Full-Stack · AI · Game Dev", SRM KTR CSE (Gaming Tech) '29 |
| About | Character select / stat sheet | Avatar, level = year, XP bars for skills, "lore" bio |
| Skills | Skill tree | Interactive node graph: Web / AI-Automation / Game Dev / Desktop |
| Games (first) | Arcade cabinet | Blood Oath + Boomtown Tycoon, playable itch.io embeds |
| Spindle (second) | Boss level / featured quest | Full-width showcase, live link to /spindle/ |
| Projects (rest) | Level select / inventory | Rarity-tiered cards (Legendary/Epic/Rare), tilt, filter by type |
| GitHub | Live telemetry HUD | Contribution heatmap + repo stats pulled at build time |
| Contact | Multiplayer lobby / "Join party" | Insta, LinkedIn, GitHub, itch.io, YouTube, Discord, email form |
| Easter eggs | Secrets | Konami code → mini-game, achievement toasts for exploring |

## Featured projects (from GitHub + itch.io)
- **Legendary:** Spindle (React+Supabase+Tauri, live at /spindle/), TabDeck (Python, Android-tablet command center), Blood Oath (browser fighting game, phone-as-controller)
- **Epic:** Boomtown Tycoon, Tactical Armory e-commerce (Next 16 + Stripe test), GitPulse, RPC-Master (Electron)
- **Rare:** Maina, Velmora.Ai, Pro-Invoice-Gen, Jumpee, gaming-themed dashboard/todo/weather set

## Stack (as built, sketchbook direction)
- Next.js 16 static export, plain CSS tokens (no Tailwind), rough.js rendered at build time, GSAP ScrollTrigger + Lenis for the ink-in, Shantell Sans + Nanum Pen Script self-hosted via Fontsource. No 3D.

## Stack (original idea, superseded)
- **Next.js 16 (App Router, `output: 'export'`)** + TypeScript — static build for GitHub Pages
- **Tailwind CSS v4** for styling, design tokens in CSS vars
- **React Three Fiber + drei + postprocessing** — hero scene, bloom, chromatic aberration
- **GSAP + ScrollTrigger** for scroll choreography; **Motion (Framer Motion)** for UI micro-interactions
- **Lenis** smooth scroll
- **Howler.js** optional UI SFX (off by default, toggle in HUD)
- Fonts: a pixel/display face for headings + a clean mono + readable sans for body

## Quality bar (what makes it "big-company grade")
- Lighthouse ≥ 90 perf, 100 a11y/SEO/best-practices on mobile
- 3D lazy-loaded; static fallback for low-end devices; `prefers-reduced-motion` respected
- Keyboard navigable, visible focus, real alt text, contrast checked
- OG images, JSON-LD Person schema, sitemap, robots, llms.txt
- No layout shift; LCP < 2.5s on 4G

## Hosting
- Keep GitHub Pages: repo `Somesh-Thakur.github.io` already serves someshthakur.tech (CNAME + HTTPS done)
- GitHub Actions builds Next export → Pages
- `/spindle/`, `/GitPulse/`, `/Jumpee/` keep working (they are separate project-Pages repos)

## Tooling for Claude Code
| Tool | Status | Used for |
|---|---|---|
| `frontend-design` skill | enabled | Aesthetic direction, avoiding template look |
| Design plugin (`design-critique`, `accessibility-review`, `ux-copy`, `design-system`) | enabled | Critique passes, a11y audit, copy |
| Context7 MCP | added in `.mcp.json` | Up-to-date docs for Next 16, R3F, GSAP, Tailwind v4 |
| Chrome DevTools MCP | added in `.mcp.json` | Lighthouse, perf traces, console errors |
| Built-in browser pane | available | Visual check while building, mobile viewport |
| Playwright plugin | enabled but failing to connect | E2E smoke tests (retry later) |
| Figma MCP | enabled | Optional: moodboard / mockups before coding |
| `/code-review`, `/simplify`, `security-review` | built in | Review before each deploy |
| SEO plugin (SearchFit) | suggested | Schema, meta, sitemap audit |

## Build phases
1. **Design system** — palette, type, HUD components, motion rules
2. **Scaffold** — Next + Tailwind + R3F + GSAP + Lenis, Actions deploy to Pages (preview first)
3. **Core sections** — boot, hero, stats, projects, contact
4. **3D + motion pass** — hero scene, scroll choreography, rarity card FX
5. **Arcade + GitHub HUD** — itch embeds, build-time GitHub stats
6. **Polish** — sound, easter eggs, achievements
7. **Ship** — Lighthouse/a11y/SEO audits, code review, deploy to someshthakur.tech

## Inputs from Somesh (received 2026-11-22)
- **Instagram (business / game dev):** https://instagram.com/mark60a2
- **Instagram (personal):** https://instagram.com/itz__somesh_thakur
- **LinkedIn:** https://www.linkedin.com/in/somesh-thakur-30r07/
- **GitHub:** https://github.com/Somesh-Thakur · **itch.io:** https://mark60a2.itch.io · **YouTube:** https://www.youtube.com/@Mark60a2 · **Discord:** https://discord.gg/kr4euTBVzt
- **Avatar:** `assets/pfp.webp` — hand-drawn sketch, black hoodie + round glasses, mustard / olive / terracotta wash on cream paper
- **Resume:** none — drop the "download save file" button
- **Order:** 1) Games (Blood Oath, Boomtown Tycoon) → 2) Spindle → 3) everything else

## Avatar-derived palette
| Token | Hex (approx) | From |
|---|---|---|
| paper | #F6F1E7 | background |
| ink | #1E1B18 | linework / hoodie |
| mustard | #D4A537 | left wash + ring |
| olive | #9CA35A | middle wash |
| terracotta | #C8683A | right wash |
