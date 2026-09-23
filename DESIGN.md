# Design system: Ian McCallum — Aero

## Creative north star

The interface is a sincere, functioning Windows Vista/7 Aero desktop rebuilt with
current accessibility and performance craft. It is not a generic glass landing
page and not an ironic retro skin. The window, taskbar, Start menu, desktop icons,
background atmosphere, focus, selection, and browser chrome all belong to the same
light-source-driven visual world.

The design-direction contract is also stored as an HTML comment beginning
`AERO-MIGRATION-CONTRACT` in `src/layouts/WindowPageLayout.astro`; generated route
tests require it to survive the Astro build.

## Materials and color

The physical premise is one translucent pane lit from above over sky, water, and
grass. Specular top edges, darker lower edges, blur, and shadows move together.
Long-form copy uses the opaque `--aero-glass-solid` bed so text never competes with
the moving atmosphere.

Core tokens live in `src/styles/tokens.css`:

- Ink `#0a2c4d` and soft ink `#35506b` for readable type
- Water fill/ink/deep `#0078d7` / `#0067bc` / `#005a9e`
- Sky atmosphere `#87ceeb`
- Violet fill/deep for the canonical glossy primary action
- Success, warning, and danger pairs used sparingly
- 4px spacing rhythm, tight chrome radii, softer content radii

Bright fills belong to surfaces and gradients; darker ink twins carry text and
meaningful boundaries. Focus uses a distinct blue ring that clears component
shadows. Text selection and scrollbars are themed rather than left visually foreign.

## Typography

Segoe UI Semilight is the display voice above 16px, declared locally with Segoe UI
and system fallbacks. Body and compact control text use regular weight for
legibility. Long-form text is constrained to approximately 65–75 characters per
line. Headings remain sentence case and hierarchy comes from size, weight, and
space rather than excessive labels.

The checked-in Semilight font has incomplete licensing provenance; see
`docs/ASSET_PROVENANCE.md` before deployment.

## Shell and behavior

Every public page renders one maximized `.window-frame`. Desktop shortcut and Start
menu links navigate to real URLs. The close control returns home, minimize can be
recovered from the taskbar, and the maximize control toggles a restored state.
These behaviors are functional affordances, not decorative controls.

On narrow viewports the same semantic window becomes the screen. Desktop shortcuts
drop away, content reflows into one column, and the taskbar remains fixed. There is
no separate mobile page tree and no duplicate content source.

The root-only boot treatment is brief and skippable. Reduced motion removes it and
the background video immediately. The background honors data-saving preferences,
has a poster, and pauses while the tab is hidden.

## Component vocabulary

- Window chrome: square outer silhouette, compact glossy titlebar, authentic local
  64px icon sources, red close control.
- Cards and media: softer inset/gloss surfaces within the window, never a second
  unrelated design system.
- Buttons: violet glossy primary; pale Aero secondary; at least 44px tall.
- Explorer: sortable-looking visual table with semantic links; horizontal overflow
  is contained on small screens.
- Forms: clear labels, simple white controls, visible focus, live status, and a
  protected-email recovery path.
- Gallery: real buttons, modal semantics, Escape dismissal, trapped close focus,
  and trigger focus restoration.
- Project video: poster-first, user-controlled, H.264 MP4, no autoplay.

## Motion

Motion is short, purposeful, and interruptible: boot exit, subtle hover lift, Start
menu reveal, and window state changes. It never blocks a route. Under
`prefers-reduced-motion: reduce`, durations collapse and ambient video is removed.

## Accessibility and QA

Maintain visible focus, semantic landmarks, one `<h1>`, descriptive image alt text,
44px touch targets, AA text contrast, and no sideways page scroll. Verify at 360,
390, 768, 1024, and 1440px. The repository's Playwright pass also checks axe
serious/critical findings, console/network errors, window controls, contact recovery,
gallery focus, history, and the Aero 404.

## Do and do not

- Do extend the shared Astro shell, tokens, and content schemas.
- Do preserve direct-link, Back/Forward, keyboard, reduced-motion, and print states.
- Do use right-sized local media with embedded origin/generation metadata.
- Do not introduce a client router, hidden full-page copies, a second mobile shell,
  or a generic modern landing-page identity.
- Do not soften Clockwork's precise claims into unverified marketing language.
- Do not add icon libraries, emoji, autoplaying project media, or remote font/CDN
  dependencies.
