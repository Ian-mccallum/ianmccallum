---
name: Ian McCallum — Aero
description: A sincere, functioning Windows Vista/7 Aero desktop, rebuilt as a personal brand and CV site.
colors:
  water-fill: "#0078D7"
  water-ink: "#0067BC"
  water-deep: "#005A9E"
  water-wash: "#E8F3FC"
  sky: "#87CEEB"
  sky-bright: "#00BFFF"
  spring-fill: "#00C853"
  spring-ink: "#0B7E3D"
  spring-wash: "#E6F8ED"
  sun-fill: "#FF8C00"
  sun-ink: "#985200"
  sun-wash: "#FFF2E0"
  coral-fill: "#FF6B6B"
  coral-ink: "#C22F2F"
  coral-wash: "#FDECEC"
  ink: "#0A2C4D"
  ink-soft: "#35506B"
  haze: "#5C6F80"
  glass: "rgba(250, 250, 248, 0.72)"
  glass-solid: "#FAFAF8"
  glass-thin: "rgba(255, 255, 255, 0.28)"
  glass-deep: "rgba(10, 44, 77, 0.55)"
  accent-violet: "#A06ED2"
typography:
  display:
    fontFamily: "'Segoe UI Semilight', 'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', sans-serif"
    fontWeight: 300
    lineHeight: 1.15
    letterSpacing: "-0.015em"
  body:
    fontFamily: "'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
    fontWeight: 400
    fontSize: "1rem"
    lineHeight: 1.6
  label:
    fontFamily: "'Segoe UI', system-ui, sans-serif"
    fontSize: "0.6875rem"
    letterSpacing: "0.12em"
  data:
    fontFamily: "ui-monospace, 'Cascadia Code', Consolas, 'SF Mono', Menlo, monospace"
rounded:
  xs: "2px"
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  full: "999px"
spacing:
  1: "4px"
  2: "8px"
  3: "12px"
  4: "16px"
  5: "24px"
  6: "32px"
  7: "48px"
  8: "64px"
components:
  button-primary:
    backgroundColor: "{colors.accent-violet}"
    textColor: "#FFFFFF"
    rounded: "{rounded.sm}"
    padding: "8px 20px"
  button-primary-hover:
    backgroundColor: "#B486E0"
  button-vista-legacy:
    backgroundColor: "{colors.water-fill}"
    textColor: "#FFFFFF"
    rounded: "{rounded.sm}"
    padding: "8px 20px"
  badge:
    backgroundColor: "{colors.water-wash}"
    textColor: "{colors.water-ink}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
  card:
    backgroundColor: "rgba(255, 255, 255, 0.25)"
    rounded: "{rounded.md}"
    padding: "20px"
  window-glass:
    backgroundColor: "rgba(255, 255, 255, 0.25)"
    rounded: "0"
  window-doc:
    backgroundColor: "{colors.glass}"
    rounded: "{rounded.lg}"
---

# Design System: Ian McCallum — Aero

## Overview

**Creative North Star: "The 2009 Time Capsule"**

This is not a retro pastiche of Windows Vista/7 Aero — it is a sincere, working artifact from that exact moment (2007–2009), rebuilt with today's craft. The desktop is real: a taskbar, draggable glass windows with titlebars and traffic-light controls, a Start menu, a lock-screen boot sequence. Content — CV, portfolio, the Clockwork writeup — lives inside those windows the way a document lived inside an app window in 2009, not as a modern webpage wearing Aero decoration.

The physical premise behind every surface is one light source: a glossy, translucent pane, lit from above, floating over a bright natural backdrop (grass, sky, water — the literal Windows Vista wallpaper lineage). That backdrop is a silent looping video (`assets/aero-bg.mp4`), not a still and no longer the animated GIF it began as; the glass reads as glass because something is actually moving behind it. Every highlight, shadow, and blur value in the token system derives from that one premise, which is why chrome built years apart still reads as one material.

Two component vocabularies currently coexist on top of the same token layer — a **glass** system (index, about, contact, portfolio: off-white translucent chrome, violet gloss buttons) and a **vista** system (CV, testimonials, photos, thank-you: blue-tinted glass, blue buttons). `aero-bridge.css` already documents this split and remaps both onto the same underlying tokens; violet is the chosen canonical accent going forward (see Do's and Don'ts).

**Key Characteristics:**
- A real desktop metaphor, not a webpage with glass CSS applied to it
- One light source (top-down) governs every highlight, shadow, and blur
- Six hues, each split into a bright **fill** (surfaces, gradients — never text) and a darker **ink** twin (the only version allowed to carry text), because the fills measure 2.1–2.2:1 on glass and fail contrast as type
- Segoe UI Semilight at large sizes is the site's voice; below 16px the system switches to regular weight because semilight gets visually fragile
- Vista-era chrome (windows, titlebars) is tight and hard-edged; content surfaces (cards, media) are softer

## Colors

The palette reads as sky and water: blue is the dominant, most-used hue site-wide (chrome, taskbar, links, ink), with a violet accent reserved for primary call-to-action buttons on the glass-system pages, and green/orange/red as a strict success/warning/danger triad used sparingly.

### Primary
- **Water** (`#0078D7` fill / `#0067BC` ink): the system's most-used hue. Fill drives gradients, the taskbar, and glow effects; ink is the only version used for text, links, and icon strokes (5.48:1 on glass — AA). Deep (`#005A9E`) is the gradient's dark stop. Wash (`#E8F3FC`) is the light tinted background for tags and pills — this is what the fixed `.vista-badge` skill tags use.
- **Accent Violet** (`#A06ED2`, approximating a multi-stop gradient — see Components): the canonical primary-button color on the glass-system pages (home, about, contact, portfolio). Not yet promoted to a named `--aero-*` token; it lives as a literal gradient in `vista-glass-refined.css` / `web2-gloss-enhancements.css`. Treat as canonical, but see the Don't about un-tokenized values below.

### Secondary
- **Sky** (`#87CEEB`, bright `#00BFFF`): atmosphere only — backdrops, ambient glows. Never carries text; it isn't an ink-paired hue.

### Neutral
- **Ink** (`#0A2C4D`): primary text color, 13.57:1 on glass (AAA). Blue-biased on purpose — a neutral in a sky-lit world picks up the sky rather than reading as pure grey.
- **Ink Soft** (`#35506B`): secondary text, de-emphasized labels.
- **Haze** (`#5C6F80`): muted/meta text — dates, captions (4.97:1 — AA).
- **Glass** (`rgba(250, 250, 248, 0.72)`): the default translucent pane. **Glass Solid** (`#FAFAF8`): the opaque bed under long-form text, because type must never sit directly on translucent glass. **Glass Deep** (`rgba(10, 44, 77, 0.55)`): menus and overlays.

### Status
- **Spring** (`#00C853` fill / `#0B7E3D` ink, wash `#E6F8ED`): success and growth.
- **Sun** (`#FF8C00` fill / `#985200` ink, wash `#FFF2E0`): accent and warning.
- **Coral** (`#FF6B6B` fill / `#C22F2F` ink, wash `#FDECEC`): danger.

### Reverse-type variants (print and dark chrome)
White and near-white type on the deep titlebar band needs lighter blues than the on-glass palette provides; the standard `--aero-sky` is too saturated to sit as secondary text on that gradient.
- **Sky Mute** (`#C6E4F5`): secondary reverse type on a deep blue band (10.68:1). Used for byline metadata in the print documents.
- Reverse type also carries a shadow token, `rgba(4, 20, 36, 0.35)`, used only to lift display type off the band gradient. It is a depth value, not a palette color.

### Named Rules
**The Fill/Ink Rule.** Every hue except neutral ink ships two versions: a bright fill for surfaces and gradients, and a darker ink twin for any text, icon, or meaningful boundary. The fills were measured on glass and several fail AA as type (Sun: 2.2:1, Spring: 2.1:1) — using a fill as text is not a style choice, it's a contrast bug.

**The Border-Pair Rule.** A border is always a lit top/left edge (`rgba(255,255,255,0.75)`) paired with a shaded bottom/right edge (`rgba(10,44,77,0.16)`) — that pairing, not line weight, is what reads as physical thickness on a glass surface.

## Typography

**Display Font:** Segoe UI Semilight (with Segoe UI, system-ui, -apple-system, Helvetica Neue fallbacks)
**Body Font:** Segoe UI (system-ui, -apple-system, Helvetica Neue, Arial fallbacks)
**Data/Mono Font:** ui-monospace, Cascadia Code, Consolas, SF Mono, Menlo

**Character:** Semilight display type is the site's signature voice — light, confident, slightly technical. It only holds up at size; the scale deliberately drops to regular body weight below 16px rather than let semilight go fragile at small sizes.

The site shipped `fonts/segoe_ui_semilight.ttf` but never declared the `@font-face`, and four stylesheets tried (and failed) to pull "Segoe UI" from Google Fonts, which doesn't host it — so the signature weight silently fell back to Arial everywhere except Windows until `aero-system.css` added the correct `@font-face`.

### Hierarchy
- **Hero** (`clamp(2.25rem, 1.6rem + 2.6vw, 3.5rem)`, tight line-height 1.15): landing-page display headlines.
- **H1** (`clamp(1.75rem, 1.4rem + 1.4vw, 2.375rem)`): page titles (e.g. "Ian McCallum" on the CV).
- **H2** (`1.5rem` / 24–32px depending on which component system): section headers.
- **H3** (`1.1875rem`): sub-section and card titles.
- **Body** (`1rem`, line-height 1.6): running text.
- **Small** (`0.875rem`) / **XS** (`0.8125rem`): captions, dates, meta.
- **Label** (`0.6875rem`, uppercase, `0.12em` tracking): tags, eyebrow text.

### Named Rules
**The Semilight Floor Rule.** Segoe UI Semilight is the display voice above 16px only. Below that, switch to regular Segoe UI — semilight at small sizes reads as broken rendering, not elegance.

## Layout

Two window shells, chosen per page rather than per breakpoint:

- **Floating pane** (`.aero-window-float` — about, portfolio, contact): pinned over the desktop background, positioned below the viewport top and above the taskbar, sized with `min()` against both a declared comfortable width and the viewport, so it's fluid without a breakpoint.
- **Scrolling document** (`.aero-window-doc` — CV, testimonials, photos, thank-you): scrolls with the page rather than floating, same fluid `min()` sizing.

Below 700px, both shells give back their margins entirely — the chrome becomes the whole screen. Widths were formerly hard-coded per page as inline styles (`width: 800px`); they're now inputs (`--aero-window-w`) the shell layer responds to, so a page can still declare its own comfortable width without an `!important` war.

Spacing runs on a 4px base grid (`--aero-s-1` through `--aero-s-8`: 4/8/12/16/24/32/48/64px). Below 768px, a separate iOS-style mobile shell takes over entirely and renders the same content as app panels rather than reflowing the desktop metaphor.

### Named Rules
**The No-Sideways Rule.** The page itself never scrolls horizontally; wide content (tables, `<pre>`, media) scrolls within its own box instead of pushing the shell wider.

## Elevation & Depth

Elevation is not a shadow alone — it's blur + shadow + a specular highlight together, on a six-rung ladder (`--aero-blur-0..5`, `--aero-lift-0..5`). Raising an element means moving it further from the backdrop, so it refracts more and casts a wider shadow. Every lift value pairs an ambient drop shadow with `inset 0 1px 0` in the specular color — that inset is what reads as a wet top edge, not just a shadow.

Focus is its own rung (`--aero-focus`, a 3px blue ring) that must clear any elevation shadow so it's never visually absorbed by a card's own shadow.

### Shadow Vocabulary
- **Lift 1** (`0 1px 2px rgba(10,44,77,0.10)` + specular inset): resting state, barely raised.
- **Lift 2** (`0 2px 6px rgba(10,44,77,0.12)` + inset): buttons, tags.
- **Lift 3** (`0 6px 16px rgba(10,44,77,0.14)` + inset): cards, portfolio items.
- **Lift 4** (`0 12px 32px rgba(10,44,77,0.18)` + inset): floating windows.
- **Lift 5** (`0 24px 56px rgba(10,44,77,0.22)` + inset): the deepest rung — menus, overlays.

### Named Rules
**The Refraction Rule.** An element doesn't just get a bigger shadow as it rises — it gets more blur too. Elevation and blur move together across the six rungs; using a high lift value with `--aero-blur-0` breaks the physical model.

## Shapes

Six radius steps, split by era: **Vista-era chrome is tight, content is soft.**

- **XS** (`2px`): inputs, tight chrome.
- **SM** (`4px`): buttons, tags.
- **MD** (`8px`): cards, media frames.
- **LG** (`12px`): the token scale's reserved size for windows — but see the Don't below.
- **XL** (`16px`): hero panels.
- **Full** (`999px`): pills, avatars, the `.vista-badge` skill tags.

Borders always come as the lit/shaded pair described in Colors, never a single flat line.

## Components

### Buttons — two systems, one canonical
Two visually distinct button treatments exist in production. **Violet gloss is canonical** going forward.

- **Primary (canonical — `.vista-glass-button-primary`):** a five-stop violet gradient (`rgba(180,130,230)` → `rgba(120,70,170)`) with a hard step at 55%, `4px` radius, a `::before` shine overlay covering the top half, white text with a soft drop shadow. Hover brightens the gradient and lifts the button 1px.
- **Legacy (`.vista-button-primary`, CV/testimonials/photos/thank-you pages):** the same shape and motion, but the gradient runs through Water blue (`--vista-blue-light` → `--vista-blue` → `--vista-blue-dark`) instead of violet. Kept working via `aero-bridge.css` aliasing; not the direction to build new work in.

### Badges / Tags
`.vista-badge` — used for skill tags ("Python", "Prompt engineering"...) on the CV and home page. Water-wash background (`#E8F3FC`), water-ink text (`#0067BC`), fully rounded (`999px`), `4px 12px` padding, `600` weight at label size. This rule did not exist until this pass — the class rendered as unstyled block text before. It needs `!important` on `color` specifically, because `style.css` carries a broad `section *, .cv-document *, ... { color: inherit !important }` reset that any component nested in those containers has to out-rank.

### Cards
`.portfolio-project-card` / `.project-card`: a soft white gradient (30%→20% opacity), `8px` radius, Lift-3 shadow, a `::before` gloss overlay on the top half. Hover lifts 2px and brightens the border.

### Windows — two systems, deliberately different corner treatment
- **Glass system** (`.vista-glass-window`): `0` radius — hard, square Vista-authentic corners, translucent white background (`rgba(255,255,255,0.25)`), heavy layered box-shadow (multiple insets plus an outer glow). This is the more period-faithful of the two chrome systems relative to the "2009 Time Capsule" north star.
- **Doc system** (used implicitly via `.aero-surface` primitives): `--aero-r-lg` (`12px`), the token scale's own prescription for "windows."

### Titlebar
`.vista-glass-titlebar`: a blue gradient (`aero-bridge.css` corrected the original pale-blue-on-white to a deeper gradient after measuring 2.42:1 contrast — now 4.63:1 worst case), sticky at the top of its window, with a `::before` 1px specular line and a `::after` glossy highlight band across the top 16px. Draggable (`cursor: move`).

### Navigation (Taskbar + Start Menu)
The taskbar is Water-blue (`--taskbar-bg: var(--aero-water-fill)`) regardless of which button system the page otherwise uses — chrome color is universal even where button color forks. The Start menu uses `--aero-glass-deep` as its background, a near-opaque dark blue pane.

## Do's and Don'ts

### Do:
- **Do** use the ink twin (`-ink` suffix) for any text, icon stroke, or meaningful boundary — never the bright `-fill` version, which fails contrast as type for Sun and Spring.
- **Do** pair a lit top/left border edge with a shaded bottom/right edge together; a single flat border reads as flat, not as glass.
- **Do** use `.vista-glass-button-primary` (violet) for new primary actions — it's the canonical accent per this pass; don't introduce a third button color.
- **Do** treat elevation and blur as one system — raising a rung means increasing both the shadow spread and the backdrop blur together.
- **Do** give long-form text an opaque bed (`.aero-legible` / `--aero-glass-solid`) rather than letting it sit directly on translucent glass.

### Don't:
- **Don't** add a new component color as a bare hex or rgba literal the way `.vista-glass-button-primary`'s violet currently is. It works today, but it isn't a named `--aero-*` token, so it can't be themed for dark mode or referenced elsewhere — promoting it to `--aero-violet-fill` / `--aero-violet-ink` is the next real step for this system, not a new one-off gradient.
- **Don't** build new pages against `.vista-button` / `.vista-design-system.css` (the blue "legacy" system on CV/testimonials/photos/thank-you). It still works via the `aero-bridge.css` alias layer, but new surfaces should start from the glass system.
- **Don't** declare a component's `color` without `!important` if it can be nested inside `<section>`, `.cv-document`, `.card-modern`, or similar — `style.css` carries a blanket `color: inherit !important` reset scoped to those containers that will silently win otherwise. This is exactly what broke `.vista-badge` before this pass.
- **Don't** round the corners of `.vista-glass-window` to match the token scale's `--aero-r-lg`. The `0` radius there is what makes the chrome read as authentic 2009 Vista rather than a softened modern reinterpretation.
- **Don't** ship a work-in-progress or placeholder state on any deployed page — the site is actively linked from live outreach and applications, so every surface needs to be presentable at all times (see PRODUCT.md's Operating Context).
