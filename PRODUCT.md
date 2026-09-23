# Product

<!-- impeccable:product-schema 1 -->

## Purpose and audiences

Ian Innovates is Ian McCallum's personal brand, portfolio, CV, and writing site.
Recruiters and employers use it to evaluate engineering and execution; general
visitors, potential collaborators, clients, and UIUC-adjacent readers use the same
URLs without a forced funnel.

The current canonical profile is: UIUC Gies College of Business student studying
Finance + Data Science; founder of Beat the Clock; architect and sole engineer of
Clockwork; based between Naperville and Champaign, Illinois. Do not describe Ian as
an incoming UIUC student.

## Positioning

Breadth is the pitch. Applied AI systems, business execution, shipped client sites,
award-winning entrepreneurship, and creative work coexist as evidence. Clockwork's
precise mechanism must remain intact: approval-gated AI behavior, deterministic
pricing outside model output, explicit retryable failures, an auditable outbox, and
role-separated multi-tenant access.

## Product surfaces

- Home, About, CV, Photos, Testimonials, Contact, and Thank You
- Explorer-style portfolio index and one evidence-led case study per project
- Markdown blog with automatic index, static article routes, RSS, and sitemap
- Protected email reveal for contact; the legacy CommonJS contact endpoint remains
  available but is not exposed by the public interface
- Downloadable CV and structured metadata for people, profile, projects, and posts
- Aero 404 with recovery actions

Every route is a real URL and reconstructs one primary semantic window. Desktop
visitors may then open additional route-backed windows without pre-rendered hidden
copies. Browser history, direct entry, open in new tab, keyboard navigation, and
JavaScript-off route navigation remain part of the product contract.

## Principles

1. Breadth is the evidence; do not collapse the site into one flagship funnel.
2. Preserve technical precision over generic marketing polish.
3. Ship only production-ready, factual content because links are used in live
   outreach and applications.
4. Make repeated content changes schema-driven and resilient to layout growth.
5. Keep the Aero identity sincere, functional, accessible, and responsive.
6. Prefer local, optimized, provenance-recorded media and no autoplaying project
   demos.

## Evidence constraints

Supported claims include Ian's UIUC Gies Finance + Data Science studies, 4.25 high
school GPA, Illinois State Scholar and Magna Cum Laude recognition, Luminate's VEI
regional and national first-place results, real shipped client websites, verified
testimonials, and the documented Clockwork implementation. Do not invent metrics,
customers, testimonials, pricing, or outcomes.

## Technical constraints

- Astro static output deployed by Vercel; no client-side router.
- Root `api/` remains CommonJS and the root package has no `"type": "module"`.
- Content collections are the canonical project and blog sources.
- No duplicated mobile content tree or hidden page copies.
- Serious/critical axe findings, missing local references, console errors, and
  network failures are release blockers.
- Mobile LCP budget is below 2.5 seconds under the repository's throttled test;
  CLS budget is at most 0.1.

## Accessibility

The release contract includes one `<main>` and `<h1>` per route, keyboard-visible
focus, a skip link, at least 44px touch targets, readable opaque long-form surfaces,
semantic labels, reduced-motion support, a focus-managed gallery dialog, and
non-color-only status communication.
