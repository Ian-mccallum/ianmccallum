import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export const fingerprint = (files, read = (file) => readFileSync(file)) => {
  const hash = createHash('sha256');
  for (const file of [...files].sort()) hash.update(file).update('\0').update(read(file)).update('\0');
  return hash.digest('hex');
};

// Refresh from committed content only. This record also works on deployment
// platforms with shallow/no Git history. Never substitute a build timestamp.
export function refreshDates() {
  const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
  if (git('rev-parse', '--is-shallow-repository') !== 'false') throw Error('Full Git history required to refresh sitemap dates');
  const identity = ['src/data/identity.ts', 'src/data/profile.ts', 'src/data/social.ts'];
  const routes = {};
  const add = (route, files) => {
    const date = git('log', '-1', '--format=%cI', 'HEAD', '--', ...files);
    if (!date) throw Error(`No committed date for ${route}`);
    routes[route] = { files, fingerprint: fingerprint(files, (file) => execFileSync('git', ['show', `HEAD:${file}`])), lastmod: new Date(date).toISOString() };
  };
  for (const name of ['index', 'about', 'cv', 'contact', 'photos', 'testimonials']) {
    const extras = name === 'photos' ? ['src/components/content/PhotoGallery.astro', 'src/data/photos.ts']
      : name === 'testimonials' ? ['src/data/testimonials.ts'] : [];
    if (['index', 'about'].includes(name)) extras.push('src/components/seo/Headshot.astro', 'public/images/ian-mccallum-headshot.jpg');
    add(name === 'index' ? '/' : `/${name}`, [`src/pages/${name}.astro`, ...identity, ...extras]);
  }
  for (const [collection, route, template] of [['blog', 'blog', 'src/pages/blog/[slug].astro'], ['projects', 'portfolio', 'src/pages/portfolio/[slug].astro']]) {
    const files = git('ls-tree', '-r', '--name-only', 'HEAD', '--', `src/content/${collection}`).split('\n').filter((file) => file.endsWith('.md'));
    const published = [];
    for (const file of files) {
      const content = git('show', `HEAD:${file}`);
      if (/^draft:\s*true\s*$/m.test(content)) continue;
      const slug = content.match(/^slug:\s*["']?([^\s"']+)["']?\s*$/m)?.[1];
      if (!slug) throw Error(`Missing slug in ${file}`);
      published.push(file);
      add(`/${route}/${slug}`, [file, template, ...identity]);
    }
    add(`/${route}`, [`src/pages/${route}/index.astro`, ...published]);
  }
  writeFileSync('scripts/sitemap-dates.json', JSON.stringify(routes, null, 2) + '\n');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) refreshDates();
