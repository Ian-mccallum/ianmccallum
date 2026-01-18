#!/usr/bin/env node
/**
 * Clean Build Script
 * Removes old build artifacts before rebuilding
 * This ensures a clean build output
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

// Directories/files to clean (build output only)
const buildOutputs = [
  'css',
  'js',
  'img',
  'assets',
  'fonts',
  'index.html',
  'about.html',
  'contact.html',
  'cv.html',
  'portfolio.html',
  'photos.html',
  'testimonials.html',
  'thank-you.html',
  'vercel.json',
  'robots.txt',
  'sitemap.xml'
];

function removePath(targetPath) {
  const fullPath = path.join(rootDir, targetPath);
  
  if (!fs.existsSync(fullPath)) {
    return; // Already doesn't exist
  }
  
  const stat = fs.statSync(fullPath);
  
  if (stat.isDirectory()) {
    fs.rmSync(fullPath, { recursive: true, force: true });
    console.log(`   ✓ Removed directory: ${targetPath}`);
  } else {
    fs.unlinkSync(fullPath);
    console.log(`   ✓ Removed file: ${targetPath}`);
  }
}

console.log('🧹 Cleaning build output...\n');

buildOutputs.forEach(output => {
  removePath(output);
});

console.log('\n✅ Clean complete! Ready for build.\n');

