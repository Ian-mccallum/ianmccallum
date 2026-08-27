# Deployment Guide

## How this actually deploys

Vercel runs the build itself. `vercel.json` sets:

```json
"buildCommand": "npm run build",
"outputDirectory": "."
```

So on every push to `main`, Vercel checks out the repo, runs `npm run build`,
and serves the repo root. The build copies `src/` over the root.

**This has one consequence that matters more than anything else in this file:**

> Anything that exists only in the root and not in `src/` is deleted by the
> next deploy. The build overwrites root HTML from `src/pages/`, root CSS from
> `src/css/`, root JS from `src/js/`, and root config from `config/`.

This has already bitten the project once: the contact form was committed to
root `contact.html` and `js/contact-form.js` only, and would have vanished on
the following deploy. Always author in `src/` (or `config/`), then build.

```bash
# 1. Edit in src/ or config/
# 2. Build so the root copy matches
npm run build
# 3. Commit both the source and the build output
git add -A && git commit -m "..." && git push
```

Committing the build output is not strictly required, since Vercel rebuilds
anyway, but keeping root in sync means the committed tree always matches what
ships, and `diff` between `src/pages/x.html` and `x.html` is a useful check.

## Routing

Rewrites live in `config/vercel.json` and are copied to root by the build.
Because Vercel reads `vercel.json` from the repo root at deploy time, **the
root copy is the one that takes effect** — a stale root copy silently ignores
changes made only in `config/`.

| Source | Destination |
|---|---|
| `/` | `/index.html` |
| `/about` | `/about.html` |
| `/cv` | `/cv.html` |
| `/photos` | `/photos.html` |
| `/portfolio` | `/portfolio.html` |
| `/testimonials` | `/testimonials.html` |
| `/contact` | `/contact.html` |
| `/thank-you` | `/thank-you.html` |
| `/blog` | `/blog.html` |
| `/blog/:slug` | `/blog-:slug` |

### cleanUrls and the `.html` trap

`cleanUrls: true` is enabled. It does two things:

1. serves `foo.html` at `/foo`, and
2. **308-redirects `/foo.html` to `/foo`**.

Point 2 is the trap. A rewrite whose *destination* ends in `.html` resolves to
a redirect rather than a file, and Vercel answers `NOT_FOUND`. The blog post
rewrite originally pointed at `/blog-:slug.html` and every post 404'd because
of this, while the sitemap advertised those URLs to crawlers.

**Rule: rewrite destinations must not end in `.html`.**

Note also that most of the single-page rewrites above are redundant —
`cleanUrls` already serves `/about` from `about.html` without them. Only
`/blog/:slug` does real work, because its URL shape differs from its filename.
That is why a broken `/blog/:slug` was invisible: every other route kept
working through `cleanUrls`, so `/blog` returning 200 proved nothing about
whether the config had deployed.

## Adding a blog post

Posts are individual files, not generated. For a slug `my-post`:

1. Create `src/pages/blog-my-post.html` (copy an existing post for the head
   block: canonical, `og:type=article`, `BlogPosting` and `BreadcrumbList`
   JSON-LD, `article:published_time`).
   - The canonical must be `https://www.ianmccallum.com/blog/my-post`, the
     rewritten shape, not the filename.
   - Use **absolute** paths for nav links (`/about.html`, not `about.html`).
     A post is served from a virtual `/blog/` directory, so relative links
     would resolve against `/blog/`.
2. Link it from `src/pages/blog.html`.
3. Add a `<url>` entry to `config/sitemap.xml`.
4. Add an `<item>` to `config/feed.xml`.

Steps 3 and 4 are manual. A post that skips them is live but undiscoverable.

## Build output

```
/
├── *.html              # from src/pages/
├── css/                # flattened from src/css/{base,components,themes,utilities}/
├── js/                 # flattened from src/js/{core,features/*}/
├── img/                # photos and icons from src/assets/
├── assets/             # logos, videos (mov/mp4/webm), backgrounds, favicon
├── fonts/              # from src/assets/fonts/
├── vercel.json         # from config/
├── robots.txt          # from config/
├── sitemap.xml         # from config/
└── feed.xml            # from config/
```

`api/` is not part of the build. Vercel picks it up as serverless functions
directly, and everything in it is CommonJS (see the root README).

## Testing locally

```bash
npm run build && npm run dev
```

`npm run dev` is a static server, so it does **not** apply `vercel.json`
rewrites. `/blog/my-post` will 404 locally even when correct; test that path
against a real deployment, or open `/blog-my-post.html` directly.

## Troubleshooting

**A change vanished after deploying.** It existed only in root. Move it into
`src/` (or `config/`) and rebuild.

**A rewrite returns 404.** Check whether its destination ends in `.html`; see
the cleanUrls trap above. Then confirm the *root* `vercel.json` carries the
rule, not just `config/vercel.json`.

**An asset 404s in production but exists in `src/`.** The build copies assets
by extension filter. Check the relevant `copyFiles` call in
`scripts/build.js`; adding a new file type means widening that pattern.

**Assets not loading.** Paths must be absolute (`/assets/x`, not `assets/x`).
