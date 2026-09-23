---
name: Ian McCallum — Aero
description: A sincere Windows Vista/7 Aero desktop rebuilt with current accessibility and performance craft.
colors:
  water-fill: "#0078d7"
  water-ink: "#0067bc"
  water-deep: "#005a9e"
  water-wash: "#e8f3fc"
  sky: "#87ceeb"
  violet-fill: "#a06ed2"
  violet-bright: "#bd8ce6"
  violet-deep: "#7442a6"
  spring-fill: "#00c853"
  spring-ink: "#0b7e3d"
  spring-wash: "#e6f8ed"
  sun-fill: "#ff8c00"
  sun-ink: "#985200"
  sun-wash: "#fff2e0"
  coral-fill: "#ff6b6b"
  coral-ink: "#c22f2f"
  coral-wash: "#fdecec"
  ink: "#0a2c4d"
  ink-soft: "#35506b"
  haze: "#5c6f80"
  glass: "rgba(250, 250, 248, 0.78)"
  glass-solid: "#fafaf8"
  glass-deep: "rgba(7, 35, 62, 0.92)"
  specular: "rgba(255, 255, 255, 0.78)"
typography:
  display:
    fontFamily: "'Segoe UI Semilight', 'Segoe UI', system-ui, -apple-system, sans-serif"
    fontSize: "clamp(2rem, 1.45rem + 2vw, 3.35rem)"
    fontWeight: 300
    lineHeight: 1.08
    letterSpacing: "-0.025em"
  body:
    fontFamily: "'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
rounded:
  chrome: "2px"
  button: "4px"
  content: "8px"
  overlay: "12px"
spacing:
  1: "0.25rem"
  2: "0.5rem"
  3: "0.75rem"
  4: "1rem"
  5: "1.5rem"
  6: "2rem"
  7: "3rem"
  8: "4rem"
components:
  button-primary:
    backgroundColor: "{colors.violet-fill}"
    textColor: "#ffffff"
    rounded: "{rounded.button}"
    padding: "9px 18px"
  button-secondary:
    backgroundColor: "{colors.water-wash}"
    textColor: "{colors.ink}"
    rounded: "{rounded.button}"
    padding: "9px 18px"
  reading-surface:
    backgroundColor: "{colors.glass-solid}"
    textColor: "{colors.ink}"
---

# Design System: Ian McCallum — Aero

## Overview

**Creative North Star: "The 2009 Time Capsule"**

This is a sincere, functioning Windows Vista/7 Aero desktop, not a generic glass
landing page and not an ironic retro skin. Window chrome, taskbar, Start menu,
desktop icons, background atmosphere, focus, selection, and browser surfaces share
one light-source-driven visual world. The period optimism stays intact while current
accessibility, responsive behavior, and performance make it usable now.

The design-direction contract is the HTML comment beginning
`AERO-MIGRATION-CONTRACT` in `src/layouts/WindowPageLayout.astro`; generated-route
tests require it to survive the build.

**Key Characteristics:**

- One real desktop/window metaphor built on real web routes
- Sky, water, grass, gloss, and depth governed by one top-down light source
- Tight, hard-edged Vista chrome around softer content surfaces
- Opaque warm-white reading beds inside translucent window frames
- Concentrated violet gloss for meaningful primary actions

## Colors

Water blue is universal chrome; sky supports atmosphere; violet is reserved for
primary actions. Spring, Sun, and Coral form the success/warning/danger triad.
Neutral Ink is blue-biased so text belongs to the illuminated environment without
losing contrast.

**The Fill/Ink Rule.** Bright fills belong to surfaces and gradients. Only the
darker ink twin carries text, icon strokes, or meaningful boundaries.

**The Border-Pair Rule.** A physical edge pairs a lit top/left line with a shaded
bottom/right line; line weight alone does not create Aero depth.

## Typography

Segoe UI Semilight is the large display voice, with Segoe UI and system fallbacks.
Regular Segoe UI carries body copy and compact controls. Long-form text stays near
65–75 characters per line; sentence case and spacing establish hierarchy.

**The Semilight Floor Rule.** Semilight is used only above 16px. Smaller type uses
regular weight because fragile strokes read as broken rendering rather than polish.

The checked-in font's redistribution provenance is unresolved; see
`docs/ASSET_PROVENANCE.md` before deployment.

## Layout

Every deep link renders one maximized Aero window within the usable workspace above
the 48px taskbar. Home deliberately restores the smaller personal Welcome window,
leaving the desktop visible and inviting exploration. On desktop, route anchors can
open additional requested windows that stack, focus, drag, minimize, maximize, and
close like the original site; they are never pre-rendered hidden copies. At narrow
widths the primary semantic window becomes the screen, desktop shortcuts disappear,
and content reflows into one column; there is no second mobile content tree.

Spacing follows the 4px scale in the frontmatter. Explorer tables contain their own
horizontal overflow rather than widening the document.

**The No-Sideways Rule.** The page itself never scrolls horizontally; wide content
scrolls inside its own bounded surface.

## Elevation & Depth

Depth is a combination of backdrop blur, an ambient blue-black shadow, and a white
specular inset. Cards use a small lift; windows use a larger lift; menus and the
lightbox occupy the deepest layer. Long-form content deliberately stops refracting
and uses the opaque reading surface.

**The Refraction Rule.** Blur and shadow increase together. A high shadow without
the corresponding refraction breaks the one-light-source model.

Focus is a separate elevation state: a blue ring plus a white outer separator that
must remain visible beyond the component's resting shadow.

## Shapes

Vista-era chrome uses the tightest two radii: titlebar controls, fields, and buttons
stay compact and mechanical. Content cards and media frames use the softer content
radius; menus and overlays may use the largest radius. The window's outer silhouette
remains square enough to read as period chrome rather than modern glassmorphism.

## Components

### Window chrome and navigation

The titlebar is a compact glossy blue band with a local 64px-source icon and native
window-control silhouette. Closing a secondary window removes it; closing a direct
route returns home; closing the Home Welcome window minimizes it. Minimize and
restore use the taskbar, and maximize toggles the comfortable reading size without
changing URL. Desktop icons, the two-column Start menu, pinned taskbar apps, social
tray, and contextual navigation are all real anchors.

The root route opens with one session-scoped startup ritual derived from the
original site: a luminous horizon, colored atmosphere, floating bubbles, the IM
glass orb, changing system phrases, and live progress. It runs for roughly 4.6
seconds before a short circular reveal, remains immediately skippable, can be
replayed from Start, and is omitted under reduced motion. Its skip action is a
small, quiet text link—not a competing button—and Escape provides the keyboard
shortcut. This is the authored focal sequence; routine desktop transitions stay
brief.

### Buttons and fields

Primary buttons use the violet token family, a two-part glossy gradient, white text,
and a minimum 44px target. Secondary buttons use a pale water surface and Ink text.
The protected-email check uses a simple white recessed field with an explicit
label and the shared focus ring. Errors are announced in text, never color alone.

### Cards, Explorer, and media

Cards use a restrained glass wash, paired edge treatment, and low ambient lift.
Explorer rows optimize scanning rather than imitate every file-manager control.
Gallery items are real buttons with a focus-managed dialog. Project video is
poster-first, user-controlled, H.264 MP4, and never autoplayed.

### Motion

Boot exit, hover lift, Start reveal, and window state changes are brief,
interruptible feedback. Reduced motion collapses transitions and removes ambient
video. The background also honors data-saving preferences and pauses with the tab.

## Do's and Don'ts

### Do

- **Do** extend the shared Astro shell, tokens, and canonical content schemas.
- **Do** preserve direct links, Back/Forward, keyboard, print, and reduced-motion
  states as part of the design.
- **Do** use right-sized local media with embedded origin or generation metadata.
- **Do** keep precise Clockwork evidence legible inside the visual world.

### Don't

- **Don't** introduce a client router, hidden full-page copies, or a second mobile
  shell.
- **Don't** replace the established world with generic modern glassmorphism.
- **Don't** add icon libraries, emoji, autoplaying project media, or remote font/CDN
  dependencies.
- **Don't** place long-form type directly over moving or translucent imagery.
