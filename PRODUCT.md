# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two primary audiences, both landing on the same URL with no separate funnel:

- **Recruiters and employers** evaluating Ian as a candidate — reading the CV, the Beat the Clock / Clockwork work, and the freelance portfolio as evidence of engineering and execution ability.
- **General personal-brand visitors** arriving from a shared link, LinkedIn, or search, with no single presumed intent.

Freelance prospective clients and college/UIUC-adjacent readers may also land here, but are not the primary design audience.

## Product Purpose

A personal brand and CV site for Ian McCallum — Naperville, IL, incoming UIUC Gies College of Business student (Finance & Data Science), founder of Beat the Clock. It exists to give any of the above audiences a complete, credible picture of what Ian has built and can do, from one URL.

## Positioning

Breadth, not a single flagship narrative. The site's core claim is that Ian moves credibly across AI/engineering (Clockwork), freelance web development (real shipped client sites), and creative work (video, YouTube/Twitch), with entrepreneurship (Beat the Clock, VEI/Luminate) running through all of it. No one track is asked to carry the whole pitch; the range itself is the evidence.

## Operating Context

- Static site: Home, About, Portfolio, CV, Contact, Testimonials, Photos, Thank You — routed via Vercel rewrites (`/about`, `/cv`, `/photos`, `/portfolio`, `/testimonials`, `/contact`, `/thank-you`).
- Actively linked from live outreach and applications right now — treat the deployed site as always potentially in front of a recruiter or client. No work-in-progress or placeholder states should ship.
- Content changes (CV entries, portfolio cards) happen relatively often as Ian's work history updates; the design system needs to absorb new entries without redesign.

## Capabilities and Constraints

- Static HTML/CSS/JS, no framework, no backend, no build dependencies (`package.json` has zero `dependencies`/`devDependencies`).
- Single-source-of-truth build: everything is authored in `src/`, and `npm run build` (`scripts/build.js`) copies/flattens it into the deployed root — HTML from `src/pages/`, CSS flattened to `css/`, JS flattened to `js/`, assets to `assets/`/`img/`/`fonts/`. An edit made only to the root copy is silently overwritten by the next build.
- Deployed on Vercel, which also runs `npm run build` itself at deploy time (per `vercel.json`) — so `src/` is authoritative for production, not just for local dev.
- Desktop rendering emulates a Windows Vista/7 "Aero" desktop shell (taskbar, draggable glass windows, start menu, lock-screen boot sequence); a separate iOS-style mobile shell renders the same content as app panels below roughly 768px. New surfaces need to fit one of these two shells.

## Brand Commitments

- Name: Ian McCallum. Site: ianmccallum.com.
- Beat the Clock is the umbrella brand for Ian's automation/AI consulting; Clockwork is the specific AI operations product under it (beatyourclock.com). The language describing Clockwork's mechanism — approval-gated AI agent, deterministic pricing separated from model output, auditable outbox with retryable states — was written for factual precision and must not be softened or genericized by future copy or design passes.
- LinkedIn: linkedin.com/in/mccallumian (the correct, current URL; an older numeric-slug URL was retired site-wide).
- Visual identity: Windows Vista / Frutiger Aero aesthetic, formalized as the "Aero" design token system (`src/css/base/aero-system.css`) — light-source-driven glass, a six-hue palette with fill/ink twins, a six-step radius scale, and Segoe UI Semilight for display type. This is an existing, deliberately documented system, not a placeholder.

## Evidence on Hand

- Flagship project: Beat the Clock / Clockwork, an AI operations platform for trades businesses (missed-call handling, drafted replies, rate-card-driven quoting, scheduling, invoicing), described in detail on the home page and CV.
- Freelance client portfolio, each with a real shipped site and (all but one) a demo video: Imanol VillaGomez (concert videographer), TMM Photography, Nics Marketing, Fortivus Academy (rugby academy).
- Luminate — a Virtual Enterprise International e-commerce project that won 1st place at both the Midwest regional and national competitions; live at luminate-eta.vercel.app.
- Real testimonials, including one from Nick Evans (Founder & CEO, Fortivus Academy).
- Work history: Target (Food Department Team Member), Coldwell Banker Dan Firks (Real Estate Runner, summer 2025), Youth Soccer Referee (2021–2024).
- A photo gallery of Ian's own photography/creative work.
- No fabricated testimonials, benchmarks, or pricing exist or should be invented; "References available upon request" on the CV is a real statement, not a placeholder to fill in.

## Product Principles

1. Breadth is the pitch — every surface should let AI/engineering, freelance work, and creative range coexist rather than forcing one to dominate.
2. Precision over polish in technical claims — Clockwork's mechanism (approval gating, deterministic pricing, auditability) is real engineering detail; never let a design pass round it off into vaguer marketing language.
3. Always production-ready — because the site is actively linked from live outreach, no surface should ship in a half-finished or placeholder state.
4. Content changes constantly, design should absorb it — CV entries and portfolio cards get added or edited often; new work should make future content edits easy rather than requiring layout rework each time.
5. One URL, multiple audiences, no forced funnel — recruiters, general visitors, and secondarily clients or academic readers all land on the same pages; don't optimize so hard for one audience that it alienates the others.

## Accessibility & Inclusion

No product-specific accessibility requirement has been established by the user. The existing Aero design token system already documents WCAG contrast ratios for its ink/text colors (AA minimum, several AAA) — treat this as an existing constraint to preserve, not a fresh requirement to design against.
