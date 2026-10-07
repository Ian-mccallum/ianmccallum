# Sitemap maintenance

`npm run build` generates page URLs through Astro, then derives image entries
from the published HTML inside each page's main content. Local photos and video
posters are included; interface icons, drafts and noindex pages are excluded.
Both `/sitemap.xml` and `/sitemap-index.xml` list the same page and image sitemaps.
The build fails for duplicate URLs, canonical conflicts, noindex entries or missing
image files. The existing robots.txt discovery URLs remain unchanged.

Dates are portable records in `scripts/sitemap-dates.json`, with source-file
fingerprints and committed modification times. After committing substantive page
or content changes, run `npm run sitemap:dates` with full Git history and commit
the updated records. Deployments never invent dates from their build time.
If content no longer matches a record, the build safely omits that page's date
until the records are refreshed. Add relevant content/data dependencies in
`scripts/sitemap-dates.mjs` when introducing a new source of page content.

Sitemaps aid discovery; they do not guarantee crawling, indexing or rankings.
