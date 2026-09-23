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
    assert.match(html, /class="window-frame is-maximized/);
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
});

test('navigation uses real links and no hidden page copies', () => {
  const html = readFileSync('dist/index.html', 'utf8');
  for (const href of ['/about', '/portfolio', '/cv', '/photos', '/testimonials', '/blog', '/contact']) assert.match(html, new RegExp(`href="${href}"`));
  assert.doesNotMatch(html, /id="about-window"|id="portfolio-window"|ios-app-panel/);
});

test('contact keeps progressive form and protected fallback', () => {
  const html = readFileSync('dist/contact/index.html', 'utf8');
  assert.match(html, /method="POST" action="\/api\/contact"/);
  assert.match(html, /name="_gotcha"/);
  assert.match(html, /role="status" aria-live="polite"/);
  assert.match(html, /data-email-shield/);
});

test('content automation publishes route, index, RSS, and sitemap', () => {
  const slug = '2007-thought-the-future-would-be-beautiful';
  assert.ok(existsSync(`dist/blog/${slug}/index.html`));
  assert.match(readFileSync('dist/blog/index.html', 'utf8'), new RegExp(`/blog/${slug}`));
  assert.match(readFileSync('dist/feed.xml', 'utf8'), new RegExp(`/blog/${slug}`));
  assert.match(readFileSync('dist/sitemap-0.xml', 'utf8'), new RegExp(`/blog/${slug}`));
});

test('draft blog entries stay out of every generated surface', () => {
  const slug = 'draft-fixture-never-publish';
  assert.equal(existsSync(`dist/blog/${slug}/index.html`), false);
  assert.doesNotMatch(readFileSync('dist/blog/index.html', 'utf8'), new RegExp(slug));
  assert.doesNotMatch(readFileSync('dist/feed.xml', 'utf8'), new RegExp(slug));
  assert.doesNotMatch(readFileSync('dist/sitemap-0.xml', 'utf8'), new RegExp(slug));
});

test('project media is opt-in and broadly supported', () => {
  const html = readFileSync('dist/portfolio/imanol-villagomez/index.html', 'utf8');
  assert.match(html, /preload="none"/);
  assert.match(html, /type="video\/mp4"/);
  assert.doesNotMatch(html, /\bautoplay\b/);
  assert.doesNotMatch(html, /\.mov/);
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
