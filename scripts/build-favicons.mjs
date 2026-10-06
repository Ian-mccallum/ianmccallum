import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

// Origin: repository-authored public/favicon.svg, Aero adaptation of Ian's IM initials.
const source = 'public/favicon.svg';
for (const [file, size] of [['favicon.png', 96], ['favicon-32.png', 32], ['apple-touch-icon.png', 180]]) {
  await sharp(source).resize(size, size).png().toFile(`public/${file}`);
}
const frames = await Promise.all([16, 32, 48].map((size) => sharp(source).resize(size, size).png().toBuffer()));
const header = Buffer.alloc(6 + frames.length * 16);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(frames.length, 4);
let offset = header.length;
frames.forEach((frame, index) => {
  const entry = 6 + index * 16;
  const size = [16, 32, 48][index];
  header[entry] = size;
  header[entry + 1] = size;
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(frame.length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += frame.length;
});
await writeFile('public/favicon.ico', Buffer.concat([header, ...frames]));
