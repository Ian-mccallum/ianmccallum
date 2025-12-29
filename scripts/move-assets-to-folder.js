#!/usr/bin/env node
/**
 * Move asset references from root to assets/ folder
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

// Assets to move to assets/ folder
const assetsToMove = [
  'html5.png', 'css.png', 'js.jpg', 'reactjs.png', 'nodejs.png', 'ts.png',
  'insta.png', 'twitter.png', 'github.png', 'link.ico', 'vokelyt.png', 'IMlogo.png',
  'btcdemo.mov', 'tmmphotos.mov', 'nicsmarketingdemo.mov',
  '20251124_1315_Remix Video_remix_01kavmnrbpec59aep90j7an7yk.gif'
];

// Path mappings: old path -> new path
const pathMappings = [
  // Skill icons
  { from: /src=["']html5\.png["']/g, to: 'src="assets/html5.png"' },
  { from: /src=["']css\.png["']/g, to: 'src="assets/css.png"' },
  { from: /src=["']js\.jpg["']/g, to: 'src="assets/js.jpg"' },
  { from: /src=["']reactjs\.png["']/g, to: 'src="assets/reactjs.png"' },
  { from: /src=["']nodejs\.png["']/g, to: 'src="assets/nodejs.png"' },
  { from: /src=["']ts\.png["']/g, to: 'src="assets/ts.png"' },
  
  // Social icons
  { from: /src=["']insta\.png["']/g, to: 'src="assets/insta.png"' },
  { from: /src=["']twitter\.png["']/g, to: 'src="assets/twitter.png"' },
  { from: /src=["']github\.png["']/g, to: 'src="assets/github.png"' },
  { from: /src=["']link\.ico["']/g, to: 'src="assets/link.ico"' },
  
  // Other assets
  { from: /src=["']vokelyt\.png["']/g, to: 'src="assets/vokelyt.png"' },
  { from: /src=["']IMlogo\.png["']/g, to: 'src="assets/IMlogo.png"' },
  { from: /href=["']img\/IMlogo\.png["']/g, to: 'href="assets/IMlogo.png"' },
  
  // Videos
  { from: /src=["']btcdemo\.mov["']/g, to: 'src="assets/btcdemo.mov"' },
  { from: /src=["']tmmphotos\.mov["']/g, to: 'src="assets/tmmphotos.mov"' },
  { from: /src=["']nicsmarketingdemo\.mov["']/g, to: 'src="assets/nicsmarketingdemo.mov"' },
  
  // Background GIF
  { from: /src=["']20251124_1315_Remix Video_remix_01kavmnrbpec59aep90j7an7yk\.gif["']/g, to: 'src="assets/20251124_1315_Remix Video_remix_01kavmnrbpec59aep90j7an7yk.gif"' },
];

// Files to update
const filesToUpdate = [
  'index.html', 'about.html', 'contact.html', 'cv.html', 'portfolio.html',
  'photos.html', 'testimonials.html', 'thank-you.html'
];

// Update source files
const srcPagesDir = path.join(rootDir, 'src/pages');
filesToUpdate.forEach(file => {
  const srcPath = path.join(srcPagesDir, file);
  if (fs.existsSync(srcPath)) {
    let content = fs.readFileSync(srcPath, 'utf8');
    let updated = false;
    
    pathMappings.forEach(mapping => {
      if (mapping.from.test(content)) {
        content = content.replace(mapping.from, mapping.to);
        updated = true;
      }
    });
    
    if (updated) {
      fs.writeFileSync(srcPath, content, 'utf8');
      console.log(`Updated ${file} in src/pages/`);
    }
  }
});

// Update JavaScript files
const jsFiles = [
  'src/js/features/mobile/mobile-ux.js'
];

jsFiles.forEach(file => {
  const filePath = path.join(rootDir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;
    
    // Update social icons
    content = content.replace(/src="insta\.png"/g, 'src="assets/insta.png"');
    content = content.replace(/src="twitter\.png"/g, 'src="assets/twitter.png"');
    content = content.replace(/src="link\.ico"/g, 'src="assets/link.ico"');
    content = content.replace(/src="github\.png"/g, 'src="assets/github.png"');
    
    if (content !== fs.readFileSync(filePath, 'utf8')) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${file}`);
    }
  }
});

console.log('✅ Path updates complete!');

