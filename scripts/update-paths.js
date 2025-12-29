#!/usr/bin/env node
/**
 * Path Update Script
 * Updates all asset paths in HTML files to match new enterprise structure
 */

const fs = require('fs');
const path = require('path');

const htmlFiles = [
  'index.html',
  'about.html',
  'contact.html',
  'cv.html',
  'portfolio.html',
  'photos.html',
  'testimonials.html',
  'thank-you.html'
];

const pathMappings = [
  // CSS paths
  { from: /href="css\//g, to: 'href="src/css/' },
  { from: /href="css\/style\.css"/g, to: 'href="src/css/base/style.css"' },
  { from: /href="css\/vista-glass-refined\.css"/g, to: 'href="src/css/components/vista-glass-refined.css"' },
  { from: /href="css\/vista-icons\.css"/g, to: 'href="src/css/components/vista-icons.css"' },
  { from: /href="css\/vista-design-system\.css"/g, to: 'href="src/css/components/vista-design-system.css"' },
  { from: /href="css\/web2-gloss-enhancements\.css"/g, to: 'href="src/css/themes/web2-gloss-enhancements.css"' },
  { from: /href="css\/page-content-enhancements\.css"/g, to: 'href="src/css/utilities/page-content-enhancements.css"' },
  { from: /href="css\/text-sizing-enhancements\.css"/g, to: 'href="src/css/utilities/text-sizing-enhancements.css"' },
  { from: /href="css\/mobile-responsive\.css"/g, to: 'href="src/css/utilities/mobile-responsive.css"' },
  { from: /href="css\/mobile-ux\.css"/g, to: 'href="src/css/utilities/mobile-ux.css"' },
  { from: /href="css\/vintage-instagram\.css"/g, to: 'href="src/css/themes/vintage-instagram.css"' },
  
  // JS paths
  { from: /src="js\/window-manager\.js"/g, to: 'src="src/js/core/window-manager.js"' },
  { from: /src="js\/vista-system\.js"/g, to: 'src="src/js/core/vista-system.js"' },
  { from: /src="js\/gif-background\.js"/g, to: 'src="src/js/features/backgrounds/gif-background.js"' },
  { from: /src="js\/vista-icons\.js"/g, to: 'src="src/js/features/icons/vista-icons.js"' },
  { from: /src="js\/mobile-ux\.js"/g, to: 'src="src/js/features/mobile/mobile-ux.js"' },
  { from: /src="js\/main\.js"/g, to: 'src="src/js/main.js"' },
  
  // Image paths
  { from: /src="img\/icons\/vista\//g, to: 'src="src/assets/icons/vista/' },
  { from: /src="img\/IMlogo\.png"/g, to: 'src="src/assets/images/logos/IMlogo.png"' },
  { from: /src="img\/IMG_/g, to: 'src="src/assets/images/photos/IMG_' },
  { from: /src="img\/hoco\.jpg"/g, to: 'src="src/assets/images/photos/hoco.jpg"' },
  
  // Logo/skill icon paths (root level)
  { from: /src="html5\.png"/g, to: 'src="src/assets/images/logos/html5.png"' },
  { from: /src="css\.png"/g, to: 'src="src/assets/images/logos/css.png"' },
  { from: /src="js\.jpg"/g, to: 'src="src/assets/images/logos/js.jpg"' },
  { from: /src="reactjs\.png"/g, to: 'src="src/assets/images/logos/reactjs.png"' },
  { from: /src="nodejs\.png"/g, to: 'src="src/assets/images/logos/nodejs.png"' },
  { from: /src="ts\.png"/g, to: 'src="src/assets/images/logos/ts.png"' },
  
  // Video paths
  { from: /src="btcdemo\.mov"/g, to: 'src="src/assets/videos/btcdemo.mov"' },
  { from: /src="tmmphotos\.mov"/g, to: 'src="src/assets/videos/tmmphotos.mov"' },
  { from: /src="nicsmarketingdemo\.mov"/g, to: 'src="src/assets/videos/nicsmarketingdemo.mov"' },
  
  // Background GIF
  { from: /src="20251124_1315_Remix Video_remix_01kavmnrbpec59aep90j7an7yk\.gif"/g, to: 'src="src/assets/images/backgrounds/20251124_1315_Remix Video_remix_01kavmnrbpec59aep90j7an7yk.gif"' },
  
  // Favicon
  { from: /href="img\/IMlogo\.png"/g, to: 'href="src/assets/images/logos/IMlogo.png"' },
];

htmlFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;
    
    pathMappings.forEach(mapping => {
      if (mapping.from.test(content)) {
        content = content.replace(mapping.from, mapping.to);
        updated = true;
      }
    });
    
    if (updated) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated paths in ${file}`);
    }
  }
});

console.log('Path update complete!');

