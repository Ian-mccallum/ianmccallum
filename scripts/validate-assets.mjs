import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';

const root = resolve('dist');
if (!existsSync(root)) {
  console.error('dist/ does not exist. Run npm run build first.');
  process.exit(1);
}

const files = [];
function walk(directory) {
  for (const name of readdirSync(directory)) {
    const path = join(directory, name);
    if (statSync(path).isDirectory()) walk(path);
    else files.push(path);
  }
}
walk(root);

const checkable = files.filter((file) => ['.html', '.css', '.xml'].includes(extname(file)));
const refs = [];
const patterns = [/(?:src|href|poster|data-src)=["']([^"']+)["']/g, /url\(["']?([^"')]+)["']?\)/g];
for (const file of checkable) {
  const body = readFileSync(file, 'utf8');
  for (const pattern of patterns) {
    for (const match of body.matchAll(pattern)) refs.push({ file, value: match[1] });
  }
  for (const match of body.matchAll(/srcset=["']([^"']+)["']/g)) {
    for (const item of match[1].split(',')) refs.push({ file, value: item.trim().split(/\s+/)[0] });
  }
}

const missing = [];
for (const ref of refs) {
  const value = ref.value.split('#')[0].split('?')[0];
  if (!value || /^(?:https?:|mailto:|tel:|data:|#)/.test(value) || value.startsWith('/api/')) continue;
  const relative = value.startsWith('/') ? value.slice(1) : value;
  const target = resolve(root, relative);
  const exists = existsSync(target) || existsSync(join(target, 'index.html')) || (/^404\/?$/.test(relative) && existsSync(join(root, '404.html')));
  if (!exists) missing.push(`${ref.file.replace(`${root}/`, '')}: ${ref.value}`);
}

if (missing.length) {
  console.error(`Missing local asset or route references (${missing.length}):\n${missing.join('\n')}`);
  process.exit(1);
}
console.log(`Validated ${refs.length} generated local references: 0 missing.`);
