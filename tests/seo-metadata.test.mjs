import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const origin = 'https://www.ianmccallum.com';
const urls = [...readFileSync('dist/sitemap-0.xml', 'utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
const readPage = url => readFileSync(`dist${new URL(url).pathname === '/' ? '' : new URL(url).pathname}/index.html`, 'utf8');
const attrs = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(m => [m[1], m[2]]));
const meta = (html, key) => [...html.matchAll(/<meta\b[^>]*>/g)].map(m => attrs(m[0])).filter(a => a.name === key || a.property === key);
const schemas = html => [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].flatMap(m => JSON.parse(m[1]));

for (const url of urls) {
  test(`SEO metadata is valid: ${new URL(url).pathname}`, () => {
    const html = readPage(url);
    assert.match(html, /<title>[^<]+<\/title>/);
    const descriptions = meta(html, 'description');
    assert.equal(descriptions.length, 1);
    assert.ok(descriptions[0].content.trim().length > 0);
    assert.equal(meta(html, 'robots')[0]?.content, 'max-image-preview:large');
    for (const key of ['og:image', 'twitter:image']) {
      const entries = meta(html, key);
      assert.equal(entries.length, 1);
      const image = new URL(entries[0].content);
      assert.equal(image.origin, origin);
      assert.ok(existsSync(`dist${decodeURIComponent(image.pathname)}`), `Missing ${key} asset`);
    }
    const data = schemas(html);
    assert.ok(data.length > 0);
    for (const node of data) {
      assert.equal(node['@context'], 'https://schema.org');
      assert.ok(node['@type']);
    }
    const path = new URL(url).pathname;
    if (/^\/(blog|portfolio)\/.+/.test(path)) {
      const trail = data.find(node => node['@type'] === 'BreadcrumbList');
      assert.ok(trail);
      assert.deepEqual(trail.itemListElement.map(item => item.position), [1, 2, 3]);
      assert.equal(trail.itemListElement[2].item, url);
      for (const item of trail.itemListElement) {
        assert.ok(item.name);
        assert.ok(urls.includes(item.item));
      }
    }
  });
}

test('utility pages remain excluded from indexing', () => {
  for (const file of ['dist/404.html', 'dist/thank-you/index.html']) {
    assert.equal(meta(readFileSync(file, 'utf8'), 'robots')[0]?.content, 'noindex');
  }
});

test('contact references the shared person and project previews use real project images', () => {
  const contact = schemas(readPage(`${origin}/contact`)).find(node => node['@type'] === 'ContactPage');
  assert.equal(contact.mainEntity['@id'], `${origin}/#person`);
  const project = readPage(`${origin}/portfolio/beat-the-clock`);
  assert.equal(meta(project, 'og:image')[0].content, `${origin}/media/projects/btcdemo.webp`);
  assert.equal(meta(readPage(`${origin}/`), 'og:image')[0].content, `${origin}/images/ian-mccallum-headshot.jpg`);
});
