# Ian Innovates - Personal Website

Enterprise-grade personal brand website with Windows Vista/Frutiger Aero aesthetic.

## 🏗️ Architecture

This project follows enterprise-level organization principles with clear separation between source code and build output.

**📖 See [docs/ENTERPRISE_STRUCTURE.md](./docs/ENTERPRISE_STRUCTURE.md) for complete structure documentation.**

### Quick Overview

```
/
├── src/                    # ⭐ SOURCE CODE (Single Source of Truth)
│   ├── pages/             # HTML entry points
│   ├── js/                # JavaScript modules (core/features/)
│   ├── css/               # Stylesheets (base/components/themes/utilities/)
│   └── assets/            # All static assets (images/videos/icons/fonts/)
├── api/                   # Vercel serverless functions. CommonJS, see below
├── config/                # Configuration files (source)
├── scripts/               # Build and utility scripts
├── docs/                  # Documentation
└── [build output]         # Generated files in root (for deployment)
```

## 🚀 Quick Start

### Development

1. **Install dependencies** (if any are added in the future):
   ```bash
   npm install
   ```

2. **Build for deployment**:
   ```bash
   npm run build
   ```
   Or for a clean build:
   ```bash
   npm run build:clean
   ```
   This copies HTML files from `src/pages/` to root, flattens CSS/JS, and copies assets/config.

3. **Serve locally**:
   ```bash
   npm run serve
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

### File Organization

- **Source files**: All source code lives in `src/`
- **Deployed files**: HTML and config files are copied to root for Vercel deployment
- **Assets**: All assets are organized in `src/assets/` by type

## 📁 Directory Structure

### JavaScript Modules

- **Core** (`src/js/core/`): System-level modules
  - `window-manager.js` - Window management system
  - `vista-system.js` - Vista UI system

- **Features** (`src/js/features/`): Feature-specific modules
  - `backgrounds/` - Background video handler (`gif-background.js`, named for the
    GIF it used to drive; it now sizes the `<video>` background)
  - `icons/` - Icon management
  - `mobile/` - Mobile UX optimizations
  - `effects/` - Visual effects

### CSS Organization

- **Base** (`src/css/base/`): Foundation styles
- **Components** (`src/css/components/`): Reusable component styles
- **Themes** (`src/css/themes/`): Theme-specific styles
- **Utilities** (`src/css/utilities/`): Utility classes and helpers

### Assets

- **Images** (`src/assets/images/`): Organized by purpose
  - `photos/` - Photo gallery images
  - `logos/` - Logo and brand assets
  - `backgrounds/` - Background stills (the video itself lives in `assets/videos/`)
- **Videos** (`src/assets/videos/`): Video files
- **Icons** (`src/assets/icons/`): Icon files (Vista icons, etc.)
- **Fonts** (`src/assets/fonts/`): Font files

## 🔧 Build Process

The build process (`npm run build`):
1. Copies HTML files from `src/pages/` to root
2. Flattens CSS from `src/css/{category}/` to `css/`
3. Flattens JS from `src/js/{category}/` to `js/`
4. Copies assets from `src/assets/` to `img/` and `assets/`
5. Copies config files from `config/` to root (`vercel.json`, `robots.txt`,
   `sitemap.xml`, `feed.xml`)

**Note**: Always edit files in `src/`, never edit build output in root.

## 📝 Path Conventions

**All paths use absolute paths from root (`/`)** to ensure compatibility with both Vercel rewrites and build output:

- **CSS**: `/css/{filename}.css`
- **JavaScript**: `/js/{filename}.js`
- **Images**: `/img/{path}` or `/assets/{filename}`
- **Icons**: `/img/icons/vista/{filename}`
- **Videos**: `/assets/{filename}`
- **Fonts**: `/fonts/{filename}`

**Source files are organized as:**
- **CSS**: `src/css/{category}/{filename}.css`
- **JavaScript**: `src/js/{category}/{filename}.js`
- **Assets**: `src/assets/{type}/{category}/{filename}`

## 🚢 Deployment

This site is configured for Vercel deployment:

- HTML files in root (copied during build)
- `vercel.json` in root for routing configuration
- All assets served from `src/assets/` paths
- `api/` is picked up automatically as serverless functions (see below)

## 📮 Contact form

`/contact` offers two paths on purpose. The **form** posts to `api/contact.js`
for structured messages; the **EmailShield** below it still reveals the address
behind an arithmetic challenge, for people who would rather use their own mail
client. The shield is what keeps the address away from scrapers, so it stays.

The form is a real `<form>` with a real action, so it works with JavaScript
off (native POST, 303 to `/thank-you`). `js/contact-form.js` upgrades it to a
fetch submit that keeps the visitor on the page.

**Everything in `api/` is CommonJS.** The root `package.json` deliberately has
no `"type": "module"`; adding it breaks the handler in production.

### Where messages go

`api/contact.js` emails Ian, then holds the record in a KV queue that
[ianOS](https://github.com/ian-mccallum/ianOS) collects on its own schedule.
ianOS files these under **Inbox** as correspondence and **never** as a lead:
its `leads` table is Clockwork's scored call queue, and a personal inquiry
entering it would corrupt that ordering invisibly. Design:
[SPEC-v19](https://github.com/ian-mccallum/ianOS/blob/main/docs/SPEC-v19-personal-inbound.md).

No autoresponse is sent, deliberately. This site promises nothing, and a reply
would have to come from the Resend-verified `beatyourclock.com` sender, which
reads as a business robot answering a personal note.

### Bot verification

`api/_turnstile.js` runs Cloudflare Turnstile. It **fails open** on any
service error (timeout, 5xx, unreachable) and closed only on an explicit bot
verdict, because a false positive silently costs a real message. A rejected
bot gets the same success response a human does.

Paste the site key into the `TURNSTILE_SITE_KEY` constant at the top of
`js/contact-form.js` (it is public by design); the **secret** goes in Vercel
as `TURNSTILE_SECRET` and never in this repo.

### Environment variables (all optional)

| Var | Effect when unset |
|---|---|
| `RESEND_API_KEY` | no notification email is sent |
| `NOTIFY_TO` | alerts fall back to `contact@beatyourclock.com` |
| `TURNSTILE_SECRET` | bot verification is skipped entirely |
| `KV_REST_API_URL` / `_TOKEN` | nothing is queued for ianOS |
| `IANOS_SYNC_TOKEN` | `/api/ianos-inbox` returns 503 and exposes nothing |

Unconfigured is always silent, never an error: the form keeps working.

## ✍️ Blog

Posts are hand-authored files, one per post: `src/pages/blog-<slug>.html`,
listed from `src/pages/blog.html`, styled by `src/css/components/blog.css`.

Routing is `/blog/<slug>` via a `vercel.json` rewrite to `/blog-<slug>`.
**The rewrite destination must not end in `.html`** — `cleanUrls` 308-redirects
`.html` paths, so a rewrite pointing at one resolves to a redirect and 404s.
That bug shipped once and made every post unreachable.

Because a post is served from a virtual `/blog/` directory, its nav links must
be **absolute** (`/about.html`, not `about.html`).

Publishing a post is four steps, and the last two are manual:

1. `src/pages/blog-<slug>.html`
2. link it from `src/pages/blog.html`
3. add a `<url>` to `config/sitemap.xml`
4. add an `<item>` to `config/feed.xml`

Skip 3 and 4 and the post is live but undiscoverable. See
[DEPLOYMENT.md](./docs/DEPLOYMENT.md) for the full checklist.

## 📡 Feed

RSS 2.0 at `/feed.xml`, authored in `config/feed.xml` and copied to root by the
build. Every page carries a discovery `<link rel="alternate">` in its head.

## 🖼️ Background

The site background is a silent looping video, `assets/aero-bg.mp4` (~400KB),
with `assets/aero-bg-poster.jpg` behind it for first paint.

It was previously an 8.6MB animated GIF at 320x214 upscaled to fill the
viewport: roughly 64MB of decoded frames held resident and recomposited
fullscreen and forever, which made the whole site feel sluggish. The source
also never looped, so the wrap visibly jumped; the current clip crossfades its
last 1.4s back over its first, which closes the seam.

`src/js/features/backgrounds/gif-background.js` still owns sizing. It keeps its
old name and the element keeps `id="background-gif"` so existing CSS selectors
continue to apply.

## 📚 Documentation

Comprehensive documentation is available in the `docs/` directory:

### Core Documentation
- **[ENTERPRISE_STRUCTURE.md](./docs/ENTERPRISE_STRUCTURE.md)** - Complete structure guide
- **[DEPLOYMENT.md](./docs/DEPLOYMENT.md)** - Deployment guide (rewrites & build)
- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - Architecture decisions
- **[STRUCTURE.md](./docs/STRUCTURE.md)** - Detailed structure documentation
- **[SEO_AEO_PLAN.md](./docs/SEO_AEO_PLAN.md)** - SEO & Answer Engine Optimization plan
- **[GOOGLE_SEARCH_CONSOLE_GUIDE.md](./docs/GOOGLE_SEARCH_CONSOLE_GUIDE.md)** - Google Search Console setup guide

### Additional Documentation
- **[SEO_AEO_PLAN.md](./docs/SEO_AEO_PLAN.md)** - SEO & Answer Engine Optimization plan
- **[SEO_IMPLEMENTATION_STATUS.md](./docs/SEO_IMPLEMENTATION_STATUS.md)** - SEO implementation status
- **[ARCHITECTURE_PLAN.md](./docs/ARCHITECTURE_PLAN.md)** - Reorganization plan
- **[REORGANIZATION_SUMMARY.md](./docs/REORGANIZATION_SUMMARY.md)** - Summary of changes
- **[BUILD_SYSTEM_ANALYSIS.md](./docs/BUILD_SYSTEM_ANALYSIS.md)** - Build system analysis
- **[WORKFLOW.md](./docs/WORKFLOW.md)** - Development workflow
- Design system documentation
- Setup guides
- Feature documentation

## 🎨 Design System

The site uses a Windows Vista/Frutiger Aero aesthetic with:
- Glassmorphism effects
- Vista-style icons
- Frutiger Aero color palette
- Responsive mobile design

## 📄 License

MIT

