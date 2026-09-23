# Architecture

## Runtime shape

The site has two intentionally separate runtime boundaries:

1. Astro builds every public content route to static files in `dist/`.
2. Vercel loads the root `api/` directory as CommonJS serverless functions.

The root package remains CommonJS by omission: do not add `"type": "module"`.
Astro configuration uses `.mjs`, and source scripts use TypeScript where Astro/Vite
handles them.

## Route model

`src/layouts/WindowPageLayout.astro` emits the shared HTML head, structured data,
Aero shell, and exactly one initial `<main>`, `<h1>`, and window frame per content
route.
The current routes are:

- `/`, `/about`, `/cv`, `/photos`, `/testimonials`, `/contact`, `/thank-you`
- `/portfolio` and `/portfolio/<project-slug>`
- `/blog` and `/blog/<post-slug>`
- `/feed.xml`
- the static Aero `/404`

Navigation is ordinary `<a>` links, so URLs, browser history, Back/Forward, open in
new tab, and direct entry all work without a client router. On desktop, an ordinary
unmodified click on a shortcut, Start entry, pinned taskbar item, or marked home
action may progressively fetch that same static route and open its existing window
frame beside the current one. Modified clicks and mobile navigation retain native
browser behavior. The homepage still contains no hidden copies of other pages;
secondary windows are loaded only when requested.

The shared window manager also initializes the protected email challenge and
photo-gallery behavior inside requested secondary windows.
Those enhancements are idempotent, so direct-route and multi-window paths use the
same modules without duplicate listeners.

## Content model

Astro's current `glob()` loaders in `src/content.config.ts` define two typed
collections:

- `projects`: case-study identity, role, evidence, tools, optional demo media,
  awards, decisions, and order.
- `blog`: title, description, dates, author, slug, social image, draft state, and
  schema type.

Dynamic routes call `getStaticPaths()`. The blog index, RSS endpoint, and Astro
sitemap use the same collection data, so publishing does not require hand-editing
parallel lists. Smaller sources that span several pages live in `src/data/`.

## Aero shell

The established Windows Vista/7 Aero identity is implemented once in
`src/components/aero/` and `src/styles/`. Desktop and mobile share the same semantic
content and components. Directly entered content routes start maximized; `/` starts
with a centered, restored Welcome window. Desktop visitors can open several route
windows, move restored windows by their titlebars, focus and stack them, minimize
or restore them through the taskbar, maximize them, and close secondary windows.
The two-column Start menu and taskbar retain real route and social anchors. At
narrow widths the current route becomes the screen surface, desktop shortcuts and
secondary windows disappear, and the fixed taskbar remains an orientation surface.

Only the root route shows the session-scoped welcome sequence. Its original Aero
language returns through the luminous horizon, light fields, glass orb, bubbles,
status phrases, and live progress. It runs for roughly 4.6 seconds, is skippable,
and does not delay other routes. The skip affordance is a small text link to
`#main-content`; Escape triggers the same dismissal. Start → Replay welcome clears
the session marker and returns to `/`. Reduced-motion visitors bypass the sequence.
The background video is loaded only when motion and data preferences allow it and
pauses when the document is hidden. Long-form reading surfaces use an opaque bed.

## Media

Imported profile and gallery images use Astro's image pipeline for dimensions and
responsive WebP output. Direct public media is restricted to stable URL assets:
the downloadable CV, background, social preview, selected 64px local Aero icons,
and project demos. Project videos are H.264 MP4 with WebP posters,
`preload="none"`, controls, and no autoplay.

Raster origin or generation intent is embedded in PNG/JPEG metadata or stored in a
WebP `.json` sidecar. See [Asset provenance](ASSET_PROVENANCE.md).

## API boundary

`api/contact.js` preserves native and JSON submissions for backwards compatibility,
but no public route renders a form. A valid native post redirects with `303`; JSON
returns `{ "ok": true }`.
Invalid data returns a JSON `400` or redirects back with an error. Turnstile is
optional and deliberately fails open when the verification service itself fails.
Resend and Vercel KV are optional; their absence does not turn a valid visitor
submission into an error.

`api/ianos-inbox.js` is a separate authenticated pull boundary. It fails closed
when its token is absent and always sends `Cache-Control: no-store`.

## SEO and discovery

`BaseHead.astro` owns canonical URLs, description, Open Graph/Twitter metadata,
favicon, theme color, and RSS discovery. Route files pass JSON-LD to
`StructuredData.astro`. `@astrojs/sitemap` discovers statically generated routes;
`@astrojs/rss` emits the feed from the blog collection. `public/robots.txt` points
to the generated sitemap index.

## Verification layers

- `astro check`: source and template diagnostics.
- `scripts/validate-assets.mjs`: every generated local HTML/CSS/XML reference.
- Node tests: CommonJS API contracts and generated-route invariants.
- Playwright: five responsive widths, multi-window open/drag/focus/control flows,
  direct routes, welcome timing and skip behavior, Start menu, protected email,
  gallery focus, 404, console/network
  cleanliness, and axe serious/critical scans.
- Throttled Playwright: mobile LCP and CLS budgets on three representative routes.

The HTML comment beginning `AERO-MIGRATION-CONTRACT` in the shared layout is an
intentional design-direction contract and is asserted in generated output.
