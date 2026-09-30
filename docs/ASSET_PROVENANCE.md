# Asset provenance

All shipping rasters carry an `impeccable:prompt` origin note in PNG/JPEG metadata
or a same-name `.json` sidecar for WebP. The note records the existing-source
origin when no generative prompt exists.

## Current sources

- Gallery, profile, testimonial, social, and favicon images are pre-existing Ian
  Innovates repository assets selected or renamed during the migration.
- The Aero background poster is a frame derived from the pre-existing background
  video.
- Project posters are frames derived from their matching pre-existing demo videos.
- The selected 64px PNG icons are direct conversions of the same-named legacy ICO
  files, not newly generated art.
- Project MP4 files are H.264 transcodes of the pre-existing MOV demonstrations.

The original legacy files remain recoverable from the immutable pre-migration
branch and tag documented in [Deployment](DEPLOYMENT.md); unused originals are not
carried into the production build.

## Manual review required

The repository does not redistribute Segoe UI. The font stack uses the visitor's
installed Segoe UI Semilight or Segoe UI when available, then falls back to the
documented system sans-serif stack.

The repository did not contain authoritative licensing provenance for the
Microsoft/Vista-style icons. The migration preserves a small converted icon subset
to maintain the established Aero identity. This is a provenance record, not a legal
conclusion. The owner should confirm redistribution rights before public deployment
or replace them with licensed, locally controlled equivalents that preserve the
same visual world.

## Audit command

From the repository root:

```bash
node /Users/ianmccallum/.agents/skills/impeccable/scripts/embed-prompt.mjs --scan public/icons public/favicon.png public/images public/media src/assets/images/photos
```

The command should report zero missing rasters. Generated `dist/` images are not
source assets and are intentionally excluded; optimizers may strip metadata.
