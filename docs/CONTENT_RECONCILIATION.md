# Astro Migration Content Reconciliation

Recorded before removal of the legacy HTML/CSS/JavaScript build at commit
`362da3fbad0d463a3aa59f3188244cf4dab0c3f6`.

## Source precedence

1. The current executable source in `src/pages/` is the baseline for public copy,
   routes, metadata, links, media, and form behavior.
2. The August 26, 2026 article is the newest maintained source for time-sensitive
   biography facts. It says Ian has moved to Champaign to start at UIUC; the new
   canonical profile therefore says he is a UIUC Gies student studying Finance and
   Data Science, not an incoming student who will start "this fall."
3. `PRODUCT.md` controls positioning and product truth. `DESIGN.md` controls the
   established Aero identity.
4. The CommonJS modules under `api/` control the contact/API contract.
5. Repeated homepage mobile and hidden-window copies are not independent sources.
   Where they add substantiated detail, that detail is folded into the canonical
   data below; otherwise the standalone route is authoritative.

## Canonical mapping

| Legacy source | Meaningful content | New canonical source |
| --- | --- | --- |
| `src/pages/index.html` welcome and hidden windows | Positioning, primary actions, overview evidence | `src/pages/index.astro`, shared data in `src/data/` and project collection |
| `src/pages/about.html` plus newer article biography | Identity, location, biography, education, interests, skills | `src/data/profile.ts`, `src/pages/about.astro` |
| `src/pages/cv.html` | Summary, education, work history, skills, achievements, downloadable PDF | `src/data/profile.ts`, `src/pages/cv.astro` |
| `src/pages/portfolio.html` and richer homepage copies | Beat the Clock, Clockwork, client work, Luminate, Vokel, verified links, media, engineering decisions | validated `projects` content collection; generated `/portfolio/[slug]` routes and `/portfolio` index |
| `src/pages/testimonials.html` | Quotes from Timmy Miller, Nicolas Villalobos, and Nick Evans with roles and verified destinations | `src/data/testimonials.ts`, `src/pages/testimonials.astro` |
| `src/pages/photos.html` | Four published gallery images and Instagram link | `src/data/photos.ts`, `src/pages/photos.astro`; source images imported through Astro |
| `src/pages/contact.html` | Contact copy and EmailShield fallback; the old form and redundant social list were intentionally removed from this route | `src/pages/contact.astro`, `src/scripts/email-shield.ts`; social links remain in shared desktop chrome |
| `src/pages/thank-you.html` | Submission confirmation and onward navigation | `src/pages/thank-you.astro` |
| `src/pages/blog.html` | Documents-folder index | generated from the `blog` content collection |
| `src/pages/blog-2007-thought-the-future-would-be-beautiful.html` | Complete essay, metadata, publication date, author, structured-data facts | `src/content/blog/2007-thought-the-future-would-be-beautiful.md` |
| repeated page heads | Titles, descriptions, canonicals, OG/Twitter, JSON-LD, RSS discovery | shared `BaseHead.astro` and route props |
| repeated taskbar, Start menu, background, titlebar, controls | Shared Aero desktop chrome | `AeroShell.astro` and components under `src/components/aero/` |
| duplicated iPhone panels | Mobile copies of all route content | removed; the same route component responds as an Aero handheld surface |
| `config/sitemap.xml` and `config/feed.xml` | Manually maintained discovery files | `@astrojs/sitemap` and generated `src/pages/feed.xml.ts` |
| `scripts/build.js`, `scripts/clean-build.js`, root HTML/CSS/JS/images | Copy/flatten build and checked-in output | Astro build to ignored `dist/`; only `src/`, `public/`, and `api/` remain authoritative |

## Reconciled facts

- Ian McCallum is 18 and a University of Illinois Urbana-Champaign Gies College
  of Business student studying Finance and Data Science. Naperville remains his
  home/base identity; the newer article's move to Champaign is retained in the
  article rather than used to erase that connection.
- Metea Valley High School: Class of 2026, 4.25 GPA, Illinois State Scholar,
  magna cum laude, National Honor Society, AP Scholar with Distinction, Seal of
  Biliteracy, and Soccer Sportsmanship Award.
- Beat the Clock is the umbrella company. Clockwork is its AI operations product.
  Clockwork remains approval-gated; deterministic pricing is separated from model
  output; failures are explicit and retryable; sends are recorded in an auditable
  outbox; the core promise is "Tock drafts, you send."
- Work history remains Beat the Clock (December 2024-present), Target (June
  2024-present), Coldwell Banker Dan Firks (June-August 2025), and Youth Soccer
  Referee (2021-2024, present in older/home CV copy and retained as verified).
- Luminate won first place for the VEI Midwest Regional E-Commerce Website and
  first place for the VEI National E-Commerce Website.
- Project and social destinations remain the exact URLs found in current source,
  including LinkedIn at `https://www.linkedin.com/in/mccallumian`.
- No skill-percentage meters are retained. The percentages in the hidden homepage
  window are self-ratings without evidence and are replaced with an unranked,
  factual skill list.
- The Vokel subscriber count and Twitch Affiliate claim appear only in duplicated
  mobile markup, not the maintained portfolio route. They are omitted rather than
  elevated into canonical claims.

## Asset decisions

- Keep the approximately 400 KB `aero-bg.mp4` and its poster as the one ambient
  background request. Do not publish the 8.6 MB legacy GIF or `src/assets/archive/`.
- Convert project `.mov` demonstrations to broadly supported MP4 with poster
  frames; project media is opt-in, `preload="none"`, and never all-autoplaying.
- Publish only images used by a route. Astro supplies dimensions and optimized
  responsive outputs for gallery photographs.
- The Segoe UI Semilight file and Microsoft/Vista-style icon archive have unclear
  redistribution provenance in this repository. The migration preserves the font
  only as an existing local asset pending owner review and uses a small, explicit
  subset of existing icons. No legal conclusion is asserted; provenance remains a
  manual pre-deployment check.

## API contract preserved

`api/contact.js`, `api/_email.js`, `api/_ianos-store.js`, `api/_turnstile.js`, and
`api/ianos-inbox.js` remain CommonJS. The root package does not gain
`"type": "module"`. Environment variable names, honeypot behavior, optional and
fail-open Turnstile policy, Resend notification, KV holding queue, authenticated
no-store ianOS inbox, native 303 redirects, JSON responses, and the deliberate lack
of autoresponse are unchanged.
