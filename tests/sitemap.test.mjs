import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { contentImages } from '../scripts/build-sitemaps.mjs';
import { fingerprint } from '../scripts/sitemap-dates.mjs';

test('both sitemap entry points include automatically generated image coverage', () => {
  const index = readFileSync('dist/sitemap.xml', 'utf8');
  assert.equal(index, readFileSync('dist/sitemap-index.xml', 'utf8'));
  assert.match(index, /image-sitemap.xml/);
  const images = readFileSync('dist/image-sitemap.xml', 'utf8');
  assert.match(images, /<loc>https:\/\/www.ianmccallum.com\/photos<\/loc>/);
  assert.match(images, /gallery-/);
  assert.doesNotMatch(images, /\/icons\/|favicon|draft-fixture|thank-you/);
});

test('image discovery is content-only, deduplicated, local and supports video posters', () => {
  const html = '<img src="/outside.jpg"><main><img src="/a.jpg"><img src="/a.jpg"><img src="/icons/home.png"><img src="data:image/png;base64,abc"><img src="https://example.com/a.jpg"><video poster="/demo.webp"></video></main>';
  assert.deepEqual(contentImages(html, 'https://www.ianmccallum.com/'), ['https://www.ianmccallum.com/a.jpg', 'https://www.ianmccallum.com/demo.webp']);
});

test('dates are recorded source revisions, never invented build timestamps', () => {
  const dates = JSON.parse(readFileSync('scripts/sitemap-dates.json', 'utf8'));
  const xml = readFileSync('dist/sitemap-0.xml', 'utf8');
  assert.doesNotMatch(xml, /priority|changefreq|draft-fixture|thank-you/);
  for (const entry of xml.matchAll(/<url><loc>(.*?)<\/loc>(.*?)<\/url>/g)) {
    const record = dates[new URL(entry[1]).pathname];
    const emitted = entry[2].match(/<lastmod>(.*?)<\/lastmod>/)?.[1];
    if (emitted) {
      assert.equal(emitted, record.lastmod);
      assert.equal(fingerprint(record.files), record.fingerprint);
      assert.ok(Date.parse(emitted) <= Date.now());
    }
  }
  assert.notEqual(fingerprint(['a'], () => Buffer.from('old')), fingerprint(['a'], () => Buffer.from('new')));
});
