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
Aero shell, and exactly one `<main>`, `<h1>`, and window frame per content route.
The current routes are:

- `/`, `/about`, `/cv`, `/photos`, `/testimonials`, `/contact`, `/thank-you`
- `/portfolio` and `/portfolio/<project-slug>`
- `/blog` and `/blog/<post-slug>`
- `/feed.xml`
- the static Aero `/404`

Navigation is ordinary `<a>` links, so URLs, browser history, Back/Forward, open in
new tab, and direct entry all work without a client router. Desktop shortcuts,
Start menu entries, and taskbar state are alternate controls for the same routes,
not hidden duplicate pages.

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
content and components. At narrow widths the same maximized window becomes the
screen surface; desktop shortcuts are hidden and the fixed taskbar remains an
orientation/control surface.

Only the root route shows the brief, session-scoped boot treatment. It is
skippable, removed immediately for reduced motion, and does not delay other routes.
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

`api/contact.js` preserves native and enhanced submissions. With no JavaScript, a
valid form posts and redirects with `303`; enhanced JSON returns `{ "ok": true }`.
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
- Playwright: five responsive widths, window controls, history, form recovery,
  gallery focus, 404, console/network cleanliness, axe serious/critical scans.
- Throttled Playwright: mobile LCP and CLS budgets on three representative routes.

The HTML comment beginning `AERO-MIGRATION-CONTRACT` in the shared layout is an
intentional design-direction contract and is asserted in generated output.
