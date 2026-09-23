# Ian Innovates

Ian McCallum's static personal site, portfolio, CV, and blog. Astro supplies the
content system and route generation; the interface is a deliberately sincere
Windows Vista/7 Aero desktop that works as one responsive shell rather than a
separate mobile site.

## Start here

Requires Node.js 22.12 or newer.

```bash
npm install
npm run dev
```

The development server prints its local URL. Production output is generated in
`dist/`:

```bash
npm run build
npm run preview
```

Do not edit `dist/`; it is generated and ignored by Git.

## Verification

```bash
npm test                 # Astro check, build, asset validation, API and site contracts
npm run test:browser     # responsive, interaction, console and axe-core QA
npm run test:performance # throttled mobile LCP/CLS budget
```

Browser QA uses Google Chrome when it is available at the standard macOS path and
otherwise uses Playwright's Chromium. Install that fallback once with:

```bash
npx playwright install chromium
```

Run `npm run preview -- --host 127.0.0.1` before either browser command. Generated
screenshots and reports live in `.impeccable/review/` and are not committed.

## Architecture

- `src/pages/` owns static routes. Deep links render one maximized Aero window;
  `/` restores the personal Welcome window so the desktop remains explorable.
- `src/layouts/WindowPageLayout.astro` is the shared document, SEO, and shell
  boundary.
- `src/components/aero/` owns the desktop, window chrome, taskbar, Start menu,
  controls, and authentic local icon treatment.
- `src/scripts/aero-window.ts` progressively turns same-origin desktop links into
  movable route windows. Anchors remain real links, and mobile continues to use
  direct navigation.
- `src/components/content/` owns the contact form, protected email, gallery, and
  project media.
- `src/content/projects/` and `src/content/blog/` are typed Astro content
  collections configured in `src/content.config.ts`.
- `src/data/` contains small structured sources shared by routes.
- `src/styles/` is the unified Aero token and component layer.
- `public/` contains only directly shipped files: downloads, font, selected icons,
  background media, social image, and opt-in project demos.
- `api/` remains Vercel CommonJS. The root package deliberately has no
  `"type": "module"`.

See [Architecture](docs/ARCHITECTURE.md), [Deployment](docs/DEPLOYMENT.md), and
[Content reconciliation](docs/CONTENT_RECONCILIATION.md) for the detailed contracts.

## Content authoring

### Add a project

Create `src/content/projects/<slug>.md` and satisfy the schema in
`src/content.config.ts`. The collection automatically publishes the Explorer row
and `/portfolio/<slug>` case-study route. Optional demos belong in
`public/media/projects/` as H.264 MP4 with a WebP poster; media stays
`preload="none"` and must never autoplay.

### Add a blog post

Create `src/content/blog/<slug>.md` with the required frontmatter and Markdown
body. Non-draft posts automatically appear at `/blog/<slug>`, in the blog index,
RSS at `/feed.xml`, and the generated sitemap. No manual route, feed, or sitemap
edit is required.

### Update profile content

Edit the structured modules in `src/data/`. Keep time-sensitive facts aligned
across Home, About, CV, metadata, and schema. The current canonical description is
UIUC Gies student studying Finance + Data Science, not "incoming student."

### Add a raster asset

Use a local, right-sized source and include dimensions through Astro's image
pipeline where possible. Record source or generation provenance with:

```bash
node /Users/ianmccallum/.agents/skills/impeccable/scripts/embed-prompt.mjs path/to/image --prompt "Origin or generation prompt"
```

For WebP the helper creates a `.json` sidecar. Scan shipping sources before a
release; see [Asset provenance](docs/ASSET_PROVENANCE.md).

## Contact and ianOS APIs

`POST /api/contact` accepts JSON or native form data. JavaScript enhances the form,
but a native valid submission still returns `303` to `/thank-you`. The honeypot and
optional Turnstile gate remain in place; Turnstile fails open on service failure and
closed only on an explicit bot verdict. No autoresponse is sent.

If configured, Resend sends Ian a notification and Vercel KV holds a record for
ianOS. `GET /api/ianos-inbox` is authenticated, fails closed when unconfigured, and
always returns `Cache-Control: no-store`.

| Variable | Unset behavior |
| --- | --- |
| `RESEND_API_KEY` | Notification email is skipped. |
| `NOTIFY_TO` | Falls back to `contact@beatyourclock.com`. |
| `TURNSTILE_SECRET` | Verification is skipped. |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | ianOS queueing is skipped. |
| `IANOS_SYNC_TOKEN` | Inbox endpoint returns `503`. |

## Deployment and rollback

Vercel detects Astro, runs the normal static build, serves `dist/`, and keeps the
root `api/` functions. `vercel.json` contains redirects only; do not reintroduce
legacy HTML rewrites.

The immutable pre-migration reference is commit
`362da3fbad0d463a3aa59f3188244cf4dab0c3f6`, retained by branch
`codex/pre-astro-backup-2026-09-23` and tag `pre-astro-migration-2026-09-23`.
Never move or overwrite those refs. Full release and rollback steps are in
[Deployment](docs/DEPLOYMENT.md).
