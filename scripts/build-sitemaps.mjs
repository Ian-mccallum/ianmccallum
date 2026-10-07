import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { fingerprint } from './sitemap-dates.mjs';

const origin = 'https://www.ianmccallum.com';
const escapeXml = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
const decode = (value) => value.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'");
const attrs = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map((m) => [m[1].toLowerCase(), decode(m[2] ?? m[3])]));

export function contentImages(html, pageUrl) {
  // Content only: exclude desktop chrome, social icons, and the Start menu.
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? '';
  const images = new Set();
  for (const match of main.matchAll(/<(img|video)\b[^>]*>/gi)) {
    const a = attrs(match[0]);
    const src = match[1].toLowerCase() === 'video' ? a.poster : a.src;
    if (!src || /^(data:|blob:)/i.test(src)) continue;
    const url = new URL(src, pageUrl);
    if (url.origin !== origin || /\/(icons|favicon)(\/|\.)/i.test(url.pathname) || !/\.(jpe?g|png|webp|avif|gif)$/i.test(url.pathname)) continue;
    url.hash = '';
    images.add(url.href);
  }
  return [...images];
}

export function buildSitemaps(dist = 'dist') {
  const dates = JSON.parse(readFileSync('scripts/sitemap-dates.json', 'utf8'));
  const index = readFileSync(`${dist}/sitemap-index.xml`, 'utf8');
  const children = [...index.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => decode(m[1])).filter((url) => /\/sitemap-\d+\.xml$/.test(url));
  if (!children.length) throw Error('No generated page sitemaps');
  const seen = new Set();
  const imageEntries = [];
  let dated = 0;
  for (const child of children) {
    const sitemapPath = `${dist}${new URL(child).pathname}`;
    const xml = readFileSync(sitemapPath, 'utf8');
    const entries = [];
    for (const match of xml.matchAll(/<loc>(.*?)<\/loc>/g)) {
      const url = decode(match[1]);
      const parsed = new URL(url);
      if (parsed.origin !== origin || parsed.search || parsed.hash || seen.has(url)) throw Error(`Invalid/duplicate canonical sitemap URL: ${url}`);
      seen.add(url);
      const route = parsed.pathname;
      const html = readFileSync(`${dist}${route === '/' ? '' : route}/index.html`, 'utf8');
      const canonical = [...html.matchAll(/<link\b[^>]*>/gi)].map((m) => attrs(m[0])).find((a) => a.rel === 'canonical')?.href;
      if (canonical !== url || [...html.matchAll(/<meta\b[^>]*>/gi)].some((m) => { const a = attrs(m[0]); return /^(robots|googlebot)$/i.test(a.name ?? '') && /\b(noindex|none)\b/i.test(a.content ?? ''); })) throw Error(`Non-indexable or mismatched canonical: ${url}`);
      const record = dates[route];
      let lastmod = '';
      if (record && record.files.every(existsSync) && fingerprint(record.files) === record.fingerprint && Number.isFinite(Date.parse(record.lastmod)) && Date.parse(record.lastmod) <= Date.now()) {
        lastmod = `<lastmod>${record.lastmod}</lastmod>`;
        dated++;
      }
      entries.push(`  <url><loc>${escapeXml(url)}</loc>${lastmod}</url>`);
      const images = contentImages(html, url);
      for (const image of images) {
        const path = resolve(dist, '.' + decodeURIComponent(new URL(image).pathname));
        if (!path.startsWith(resolve(dist) + '/') || !existsSync(path)) throw Error(`Missing sitemap image: ${image}`);
      }
      if (images.length) imageEntries.push(`  <url><loc>${escapeXml(url)}</loc>${images.map((image) => `<image:image><image:loc>${escapeXml(image)}</image:loc></image:image>`).join('')}</url>`);
    }
    writeFileSync(sitemapPath, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`);
  }
  writeFileSync(`${dist}/image-sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${imageEntries.join('\n')}\n</urlset>\n`);
  const combined = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...children, `${origin}/image-sitemap.xml`].map((url) => `  <sitemap><loc>${escapeXml(url)}</loc></sitemap>`).join('\n')}\n</sitemapindex>\n`;
  for (const name of ['sitemap.xml', 'sitemap-index.xml']) writeFileSync(`${dist}/${name}`, combined);
  console.log(`Sitemaps: ${seen.size} canonical pages, ${dated} verified dates, ${imageEntries.length} pages with content images.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) buildSitemaps();
