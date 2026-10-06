import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import sharp from 'sharp';

test('Aero favicon assets and head links are valid', async () => {
  const html = readFileSync('dist/index.html', 'utf8');
  assert.match(html, /rel="icon" type="image\/svg\+xml" sizes="any" href="\/favicon.svg"/);
  assert.match(html, /rel="icon" type="image\/png" sizes="96x96" href="\/favicon.png"/);
  assert.match(html, /rel="apple-touch-icon" sizes="180x180" href="\/apple-touch-icon.png"/);
  for (const [file, size] of [['favicon.png', 96], ['favicon-32.png', 32], ['apple-touch-icon.png', 180]]) {
    const metadata = await sharp(`dist/${file}`).metadata();
    assert.equal(metadata.width, size);
    assert.equal(metadata.height, size);
    assert.equal(metadata.hasAlpha, true);
  }
  const icon = readFileSync('dist/favicon.ico');
  assert.equal(icon.readUInt16LE(2), 1);
  assert.equal(icon.readUInt16LE(4), 3);
  assert.match(readFileSync('dist/favicon.svg', 'utf8'), /Ian McCallum/);
  assert.match(html, /og:image" content="https:\/\/www.ianmccallum.com\/images\/ian-mccallum-headshot.jpg/);
});
