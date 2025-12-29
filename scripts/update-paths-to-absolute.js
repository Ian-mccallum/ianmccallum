#!/usr/bin/env node
/**
 * Update all asset paths in src/pages/ to use absolute paths from root
 * This allows files to be served from src/pages/ via Vercel rewrites
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const pagesDir = path.join(rootDir, 'src/pages');

// Path mappings: relative -> absolute
const pathMappings = [
  // CSS paths
  { from: /href=["']css\//g, to: 'href="/css/' },
  { from: /href=["']\.\.\/css\//g, to: 'href="/css/' },
  
  // JS paths
  { from: /src=["']js\//g, to: 'src="/js/' },
  { from: /src=["']\.\.\/js\//g, to: 'src="/js/' },
  
  // Image paths
  { from: /src=["']img\//g, to: 'src="/img/' },
  { from: /src=["']\.\.\/img\//g, to: 'src="/img/' },
  { from: /href=["']img\//g, to: 'href="/img/' },
  { from: /href=["']\.\.\/img\//g, to: 'href="/img/' },
  
  // Assets paths
  { from: /src=["']assets\//g, to: 'src="/assets/' },
  { from: /src=["']\.\.\/assets\//g, to: 'src="/assets/' },
  { from: /href=["']assets\//g, to: 'href="/assets/' },
  { from: /href=["']\.\.\/assets\//g, to: 'href="/assets/' },
  
  // Fonts paths
  { from: /href=["']fonts\//g, to: 'href="/fonts/' },
  { from: /href=["']\.\.\/fonts\//g, to: 'href="/fonts/' },
  
  // Root-level asset references (already absolute, but ensure they are)
  { from: /src=["'](html5|css|js\.jpg|reactjs|nodejs|ts|insta|twitter|github|link\.ico|vokelyt|IMlogo|btcdemo|tmmphotos|nicsmarketing|20251124)/g, 
    to: (match, p1) => `src="/assets/${p1}` },
];

// Get all HTML files in src/pages
const htmlFiles = fs.readdirSync(pagesDir)
  .filter(file => file.endsWith('.html'))
  .map(file => path.join(pagesDir, file));

console.log('🔄 Updating paths to absolute in src/pages/...\n');

htmlFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;
  
  pathMappings.forEach(mapping => {
    if (typeof mapping.to === 'function') {
      const newContent = content.replace(mapping.from, mapping.to);
      if (newContent !== content) {
        content = newContent;
        updated = true;
      }
    } else {
      if (mapping.from.test(content)) {
        content = content.replace(mapping.from, mapping.to);
        updated = true;
      }
    }
  });
  
  if (updated) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ✓ Updated ${path.basename(filePath)}`);
  }
});

console.log('\n✅ All paths updated to absolute!');

