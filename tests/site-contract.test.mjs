import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';

const routes = [
  ['/', 'dist/index.html'],
  ['/about', 'dist/about/index.html'],
  ['/portfolio', 'dist/portfolio/index.html'],
  ['/portfolio/beat-the-clock', 'dist/portfolio/beat-the-clock/index.html'],
  ['/portfolio/clockwork', 'dist/portfolio/clockwork/index.html'],
  ['/portfolio/fortivus-academy', 'dist/portfolio/fortivus-academy/index.html'],
  ['/portfolio/imanol-villagomez', 'dist/portfolio/imanol-villagomez/index.html'],
  ['/portfolio/luminate', 'dist/portfolio/luminate/index.html'],
  ['/portfolio/nics-marketing', 'dist/portfolio/nics-marketing/index.html'],
  ['/portfolio/tmm-photography', 'dist/portfolio/tmm-photography/index.html'],
  ['/portfolio/vokel', 'dist/portfolio/vokel/index.html'],
  ['/cv', 'dist/cv/index.html'],
  ['/photos', 'dist/photos/index.html'],
  ['/testimonials', 'dist/testimonials/index.html'],
  ['/contact', 'dist/contact/index.html'],
  ['/thank-you', 'dist/thank-you/index.html'],
  ['/blog', 'dist/blog/index.html'],
  ['/blog/2007-thought-the-future-would-be-beautiful', 'dist/blog/2007-thought-the-future-would-be-beautiful/index.html'],
  ['/blog/approval-gates-ai-service-businesses', 'dist/blog/approval-gates-ai-service-businesses/index.html'],
];

for (const [route, file] of routes) {
  test(`${route} is a semantic, canonical Aero route`, () => {
    assert.ok(existsSync(file), `${file} missing`);
    const html = readFileSync(file, 'utf8');
    const canonical = route;
    assert.match(html, new RegExp(`<link rel="canonical" href="https://www\\.ianmccallum\\.com${canonical}"`));
    assert.equal((html.match(/<main\b/g) ?? []).length, 1);
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
    assert.equal((html.match(/<section[^>]+data-window-frame/g) ?? []).length, 1);
    if (route === '/') {
      assert.match(html, /class="window-frame is-restored/);
      assert.match(html, /<a[^>]+data-skip-boot/);
      assert.doesNotMatch(html, /<button[^>]+data-skip-boot/);
    }
    else assert.match(html, /class="window-frame is-maximized/);
    assert.match(html, /AERO-MIGRATION-CONTRACT/);
    assert.doesNotMatch(html, /cdn\.jsdelivr|cdnjs\.cloudflare|unpkg\.com/);
  });
}

test('generated HTML route inventory contains no unexpected pages', () => {
  const walk = (directory) => readdirSync(directory).flatMap((entry) => {
    const path = `${directory}/${entry}`;
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
  const expected = new Set([...routes.map(([, file]) => file), 'dist/404.html']);
  const generated = walk('dist').filter((file) => file.endsWith('.html'));
  assert.deepEqual(new Set(generated), expected);
});

test('404 is an Aero window with recovery links', () => {
  const html = readFileSync('dist/404.html', 'utf8');
  assert.match(html, /data-aero-shell/);
  assert.match(html, /That window could not be opened/);
  assert.match(html, /href="\/portfolio"/);
  assert.match(html, /<meta name="robots" content="noindex">/);
});

test('sitemap discovery uses a conventional endpoint and excludes utility pages', () => {
  const robots = readFileSync('dist/robots.txt', 'utf8');
  const sitemapIndex = readFileSync('dist/sitemap.xml', 'utf8');
  const sitemap = readFileSync('dist/sitemap-0.xml', 'utf8');
  const thankYou = readFileSync('dist/thank-you/index.html', 'utf8');

  assert.match(robots, /Sitemap: https:\/\/www\.ianmccallum\.com\/sitemap\.xml/);
  assert.match(sitemapIndex, /<sitemapindex[^>]+http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9/);
  assert.match(sitemapIndex, /<loc>https:\/\/www\.ianmccallum\.com\/sitemap-0\.xml<\/loc>/);
  assert.doesNotMatch(sitemap, /https:\/\/www\.ianmccallum\.com\/(404|thank-you)(?:<|\/)/);
  assert.match(thankYou, /<meta name="robots" content="noindex">/);
});

test('navigation uses real links and no hidden page copies', () => {
  const html = readFileSync('dist/index.html', 'utf8');
  for (const href of ['/about', '/portfolio', '/cv', '/photos', '/testimonials', '/blog', '/contact']) assert.match(html, new RegExp(`href="${href}"`));
  assert.doesNotMatch(html, /id="about-window"|id="portfolio-window"|ios-app-panel/);
  assert.doesNotMatch(html, /builds across disciplines/i);
  assert.match(html, /Welcome to my site!/);
  assert.match(html, /data-window-link/);
  assert.match(html, /aria-label="Social profiles"/);
  assert.match(html, /class="start-menu__body"/);
});

test('contact exposes only the protected email reveal', () => {
  const html = readFileSync('dist/contact/index.html', 'utf8');
  assert.doesNotMatch(html, /<form|\/api\/contact|data-contact-form/);
  assert.match(html, /data-email-shield/);
  assert.match(html, /Protected email/);
});

test('CV mirrors the one-page PDF and offers corporate mode', () => {
  const html = readFileSync('dist/cv/index.html', 'utf8');
  assert.match(html, /data-cv-viewer data-cv-mode="aero"/);
  assert.match(html, /role="switch" aria-checked="false" data-cv-mode-switch hidden/);
  assert.match(html, /href="\/downloads\/Ian-McCallum-CV\.pdf" download/);
  for (const heading of ['Education', 'Experience', 'Projects', 'Technical Skills', 'Honors &amp; Activities']) assert.match(html, new RegExp(`<h2 id="cv-[a-z]+">${heading}</h2>`));
  assert.doesNotMatch(html, /@beatyourclock\.com/);
  assert.ok(existsSync('dist/downloads/Ian-McCallum-CV.pdf'));
});

test('content automation publishes route, index, RSS, and sitemap', () => {
  for (const slug of ['2007-thought-the-future-would-be-beautiful', 'approval-gates-ai-service-businesses']) {
    assert.ok(existsSync(`dist/blog/${slug}/index.html`));
    assert.match(readFileSync('dist/blog/index.html', 'utf8'), new RegExp(`/blog/${slug}`));
    assert.match(readFileSync('dist/feed.xml', 'utf8'), new RegExp(`/blog/${slug}`));
    assert.match(readFileSync('dist/sitemap-0.xml', 'utf8'), new RegExp(`/blog/${slug}`));
  }
});

test('draft blog entries stay out of every generated surface', () => {
  const slug = 'draft-fixture-never-publish';
  assert.equal(existsSync(`dist/blog/${slug}/index.html`), false);
  assert.doesNotMatch(readFileSync('dist/blog/index.html', 'utf8'), new RegExp(slug));
  assert.doesNotMatch(readFileSync('dist/feed.xml', 'utf8'), new RegExp(slug));
  assert.doesNotMatch(readFileSync('dist/sitemap-0.xml', 'utf8'), new RegExp(slug));
});

test('project demos loop inline, muted, with a no-JavaScript fallback', () => {
  const html = readFileSync('dist/portfolio/imanol-villagomez/index.html', 'utf8');
  const video = html.match(/data-project-video[^]*?(<video[^>]*>)/)?.[1] ?? '';
  for (const attribute of ['controls', 'muted', 'loop', 'playsinline', 'preload="none"', 'poster="/media/projects/imanol.webp"']) assert.ok(video.includes(attribute), `video lacks ${attribute}`);
  // Script starts playback, so reduced motion and data saving are honored before any frame moves.
  assert.doesNotMatch(video, /\bautoplay\b/);
  assert.match(html, /data-project-video/);
  assert.match(html, /data-video-toggle/);
  assert.match(html, /type="video\/mp4"/);
  assert.doesNotMatch(html, /\.mov/);
});

test('icons ship a 3x source so iPhone never upscales them', () => {
  const html = readFileSync('dist/contact/index.html', 'utf8');
  assert.match(html, /srcset="\/icons\/thunderbird2\.png 64w, \/icons\/thunderbird2-128\.webp 128w, \/icons\/thunderbird2-256\.webp 256w" sizes="64px"/);
  for (const name of ['explorer', 'thunderbird2', 'vista_book_3', 'vista_get_started', 'vista_info', 'vista_personalization', 'vista_photo_gallery', 'vista_sticky_notes', 'vista_warning']) {
    for (const file of [`${name}.png`, `${name}-128.webp`, `${name}-256.webp`, `${name}-128.webp.json`, `${name}-256.webp.json`]) assert.ok(existsSync(`public/icons/${file}`), `${file} missing`);
  }
});

test('Vercel redirects preserve the legacy article URL', () => {
  const config = JSON.parse(readFileSync('vercel.json', 'utf8'));
  assert.equal(config.rewrites, undefined);
  assert.deepEqual(config.redirects[0], {
    source: '/blog-2007-thought-the-future-would-be-beautiful.html',
    destination: '/blog/2007-thought-the-future-would-be-beautiful',
    permanent: true,
  });
});
