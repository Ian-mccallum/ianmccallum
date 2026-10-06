import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, statSync } from 'node:fs';

test('headshot is crawlable, responsive, and consistently identified', () => {
  const image = 'https://www.ianmccallum.com/images/ian-mccallum-headshot.jpg';
  for (const page of ['dist/index.html', 'dist/about/index.html']) {
    const html = readFileSync(page, 'utf8');
    assert.match(html, /<img[^>]+src="\/images\/ian-mccallum-headshot.jpg"[^>]+srcset=/);
    assert.match(html, /alt="Portrait of Ian McCallum"/);
    const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].flatMap((match) => JSON.parse(match[1]));
    assert.ok(schemas.some((schema) => schema.primaryImageOfPage === image));
    assert.ok(schemas.some((schema) => schema.image === image || schema.mainEntity?.image === image));
    assert.ok(html.includes(`property="og:image" content="${image}"`));
  }
  for (const width of [132, 264, 528, 1056]) assert.ok(existsSync(`dist/images/ian-mccallum-headshot-${width}.webp`));
  assert.ok(existsSync('dist/images/seniorheadshot.jpg'), 'preserve old public links');
  assert.ok(statSync('dist/images/ian-mccallum-headshot.jpg').size < statSync('dist/images/seniorheadshot.jpg').size);
  const sitemap = readFileSync('dist/image-sitemap.xml', 'utf8');
  assert.equal((sitemap.match(/<image:image>/g) ?? []).length, 2);
  assert.ok(sitemap.includes(`<image:loc>${image}</image:loc>`));
  assert.match(readFileSync('dist/sitemap.xml', 'utf8'), /image-sitemap.xml/);
  assert.match(readFileSync('dist/robots.txt', 'utf8'), /Sitemap: https:\/\/www.ianmccallum.com\/image-sitemap.xml/);
});
