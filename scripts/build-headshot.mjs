import sharp from 'sharp';

// Preserve the original and its existing public URL; generate descriptive,
// optimized derivatives without changing the photograph or its crop.
const source = 'src/assets/images/photos/seniorheadshot.jpg';
await sharp(source).rotate().resize({ width: 1170, withoutEnlargement: true })
  .jpeg({ quality: 85, mozjpeg: true }).toFile('public/images/ian-mccallum-headshot.jpg');
for (const width of [132, 264, 528, 1056]) {
  await sharp(source).rotate().resize({ width, withoutEnlargement: true })
    .webp({ quality: 85 }).toFile(`public/images/ian-mccallum-headshot-${width}.webp`);
}
