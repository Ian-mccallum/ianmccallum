# Deployment and rollback

## Preflight

Use Node.js 22.12 or newer, install the locked dependency graph, and verify the
same artifact Vercel will build:

```bash
npm ci
npm test
```

For browser and performance QA, install Playwright Chromium if the machine does
not have Google Chrome at the standard macOS location:

```bash
npx playwright install chromium
npm run preview -- --host 127.0.0.1
```

In a second terminal:

```bash
npm run test:browser
npm run test:performance
```

Inspect `.impeccable/review/` for the generated responsive screenshots, CV print
PDF, JSON browser report, and performance report. The reports are intentionally
ignored by Git.

## Vercel contract

The project uses Astro's static output and needs no framework-specific rewrite or
output configuration. Vercel detects Astro, runs `npm run build`, serves `dist/`,
and keeps CommonJS functions from the root `api/` directory.

`vercel.json` contains permanent redirects only. The explicit legacy article
redirect must stay before the generic `.html` cleanup rule. Do not restore the old
clean-URL rewrites; they are unnecessary and conflict with Astro route output.

Required environment variables are all optional for the public page to render:

| Variable | Purpose | Unset behavior |
| --- | --- | --- |
| `RESEND_API_KEY` | Contact notification email | Skipped |
| `NOTIFY_TO` | Notification recipients | `contact@beatyourclock.com` |
| `TURNSTILE_SECRET` | Bot verification | Verification skipped |
| `KV_REST_API_URL` | ianOS queue endpoint | Queueing skipped |
| `KV_REST_API_TOKEN` | ianOS queue credential | Queueing skipped |
| `IANOS_SYNC_TOKEN` | Inbox pull authorization | Endpoint returns `503` |

The Turnstile browser site key is public by design and lives in
`src/scripts/contact-form.ts`; its secret never belongs in the repository.

## Release checklist

1. Confirm `git status` contains only intended changes.
2. Run the preflight and browser commands above.
3. Confirm asset validation reports zero missing references.
4. Confirm browser QA reports zero serious/critical axe findings and zero
   console/network errors.
5. Confirm mobile LCP is below 2.5 seconds and CLS is at most 0.1 in the stored
   throttled report.
6. Confirm `/api/contact` and `/api/ianos-inbox` environment variables in Vercel.
7. Deploy through the repository's normal Vercel integration.
8. Smoke-test `/`, one project, the long article, `/feed.xml`, an unknown URL, and
   the contact form using a controlled message.

## Rollback

The immutable pre-Astro state is commit
`362da3fbad0d463a3aa59f3188244cf4dab0c3f6`, retained by both:

- branch `codex/pre-astro-backup-2026-09-23`
- tag `pre-astro-migration-2026-09-23`

Never force-update or delete those refs. To inspect or rebuild the old site without
changing any existing branch, create the required safe recovery branch:

```bash
git switch -c codex/restore-pre-astro pre-astro-migration-2026-09-23
```

Alternatively, keep the current checkout in place and create a temporary worktree:

```bash
git worktree add ../ianinnovates-pre-astro pre-astro-migration-2026-09-23
```

For a deployed rollback, use Vercel's normal rollback to the last known-good
deployment. If a new corrective branch is required, branch from the immutable tag;
do not reset the migration branch destructively.
