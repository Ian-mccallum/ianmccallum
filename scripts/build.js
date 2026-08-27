#!/usr/bin/env node
/**
 * Build Script
 * Copies files from src/ to root-level directories for deployment
 */

const fs = require('fs');
const path = require('path');

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`   ⚠ Skipping missing path: ${src}`);
    return;
  }

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function copyFile(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`   ⚠ Skipping missing file: ${src}`);
    return;
  }
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  fs.copyFileSync(src, dest);
}

function copyFiles(srcDir, destDir, pattern = null) {
  if (!fs.existsSync(srcDir)) {
    console.warn(`Source directory ${srcDir} does not exist`);
    return;
  }
  
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  
  for (const entry of entries) {
    if (pattern && !entry.name.match(pattern)) continue;
    
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      copyFile(srcPath, destPath);
    }
  }
}

console.log('🚀 Starting build process...\n');

const rootDir = path.join(__dirname, '..');

// 1. Copy HTML files from src/pages/ to root
console.log('📄 Copying HTML files...');
copyFiles(path.join(rootDir, 'src/pages'), rootDir, /\.html$/);
console.log('   ✓ HTML files copied\n');

// 2. Copy CSS files - flatten structure to css/
console.log('🎨 Copying CSS files...');
const cssSrc = path.join(rootDir, 'src/css');
const cssDest = path.join(rootDir, 'css');

// Copy all CSS files from subdirectories to css/
['base', 'components', 'themes', 'utilities'].forEach(subdir => {
  const subdirPath = path.join(cssSrc, subdir);
  if (fs.existsSync(subdirPath)) {
    copyFiles(subdirPath, cssDest, /\.css$/);
  }
});
console.log('   ✓ CSS files copied\n');

// 3. Copy JS files - flatten structure to js/
console.log('📜 Copying JavaScript files...');
const jsSrc = path.join(rootDir, 'src/js');
const jsDest = path.join(rootDir, 'js');

// Copy core files
copyFiles(path.join(jsSrc, 'core'), jsDest, /\.js$/);

// Copy feature files
const featuresDir = path.join(jsSrc, 'features');
if (fs.existsSync(featuresDir)) {
  const featureDirs = fs.readdirSync(featuresDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name);
  
  featureDirs.forEach(featureDir => {
    const featurePath = path.join(featuresDir, featureDir);
    copyFiles(featurePath, jsDest, /\.js$/);
  });
}

// Copy main.js
if (fs.existsSync(path.join(jsSrc, 'main.js'))) {
  copyFile(path.join(jsSrc, 'main.js'), path.join(jsDest, 'main.js'));
}
console.log('   ✓ JavaScript files copied\n');

// 4. Copy assets to img/ and root
console.log('🖼️  Copying assets...');
const assetsSrc = path.join(rootDir, 'src/assets');

// Copy images
const imagesSrc = path.join(assetsSrc, 'images');
const imgDest = path.join(rootDir, 'img');

// Copy photos to both img/photos/ and img/ root (for compatibility)
copyRecursive(path.join(imagesSrc, 'photos'), path.join(imgDest, 'photos'));
// Also copy photos to img/ root for direct access
copyFiles(path.join(imagesSrc, 'photos'), imgDest, /\.(JPG|jpg|jpeg|png)$/);

// Copy icons
copyRecursive(path.join(assetsSrc, 'icons'), path.join(imgDest, 'icons'));

// Create assets directory in root
const rootAssetsDir = path.join(rootDir, 'assets');
if (!fs.existsSync(rootAssetsDir)) {
  fs.mkdirSync(rootAssetsDir, { recursive: true });
}

// Copy logos to assets/ (for skill icons)
copyFiles(path.join(imagesSrc, 'logos'), rootAssetsDir, /\.(png|jpg|jpeg|ico)$/);

// Copy background GIF to assets/
if (fs.existsSync(path.join(imagesSrc, 'backgrounds'))) {
  copyFiles(path.join(imagesSrc, 'backgrounds'), rootAssetsDir, /\.gif$/);
}

// Copy videos to assets/
copyFiles(path.join(assetsSrc, 'videos'), rootAssetsDir, /\.mov$/);

// Copy fonts
const fontsSrc = path.join(assetsSrc, 'fonts');
const fontsDest = path.join(rootDir, 'fonts');
if (fs.existsSync(fontsSrc)) {
  copyRecursive(fontsSrc, fontsDest);
}

console.log('   ✓ Assets copied\n');

// 5. Copy config files
console.log('⚙️  Copying config files...');
const configSrc = path.join(rootDir, 'config');
copyFile(path.join(configSrc, 'vercel.json'), path.join(rootDir, 'vercel.json'));
copyFile(path.join(configSrc, 'robots.txt'), path.join(rootDir, 'robots.txt'));
copyFile(path.join(configSrc, 'sitemap.xml'), path.join(rootDir, 'sitemap.xml'));
copyFile(path.join(configSrc, 'feed.xml'), path.join(rootDir, 'feed.xml'));
console.log('   ✓ Config files copied\n');

console.log('✅ Build complete! Ready for deployment.\n');

