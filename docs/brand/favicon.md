# Aero IM favicon

The selected mark is a glossy water-blue badge with white **IM** initials. Its
top-lit gloss and dark rim extend the existing Aero identity in `DESIGN.md`.

`public/favicon.svg` is the editable 64 × 64 SVG master. Native geometry and
outlined initials require no installed font or external image.

| Generated file | Size |
| --- | --- |
| `public/favicon.png` | 96 × 96 |
| `public/favicon-32.png` | 32 × 32 |
| `public/apple-touch-icon.png` | 180 × 180 |
| `public/favicon.ico` | 16, 32, and 48 px frames |

After editing the SVG, regenerate all derivatives from the repository root with
`node scripts/build-favicons.mjs` (project dependencies required).
The script uses Sharp and packages PNG frames into the ICO.

The shipped PNGs carry origin metadata embedded with Impeccable's
`embed-prompt.mjs`. This records a repository-authored SVG, not an AI raster.
Regeneration does not restore metadata: preserve the existing origin text with
the skill script's `--read` option and re-embed it in all three PNGs using
`--prompt` or `--prompt-file` afterward.

Review at actual 16, 32, and 48 px sizes on light and dark backgrounds. Keep the
initials distinct, their gap open, and gloss subordinate to legibility.
The completed asset received a **SHIP** review with no material findings and
passing checks; the temporary preview is `/tmp/ian-favicon-size-check.png`.

`src/components/seo/BaseHead.astro` declares the PNG96, SVG, and Apple180 icons.
The ICO remains at the conventional root URL. The headshot remains the default
social image, and Person metadata retains personal identity imagery.
