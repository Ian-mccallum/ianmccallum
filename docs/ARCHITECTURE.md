# Enterprise Architecture Documentation

## Project Structure

```
/
├── src/
│   ├── pages/              # HTML pages (entry points)
│   ├── js/
│   │   ├── core/           # Core system modules
│   │   │   ├── vista-system.js
│   │   │   └── window-manager.js
│   │   ├── features/       # Feature modules
│   │   │   ├── backgrounds/
│   │   │   │   ├── gif-background.js
│   │   │   │   ├── video-background.js
│   │   │   │   ├── frutiger-background.js
│   │   │   │   ├── exact-background.js
│   │   │   │   └── background-generator.js
│   │   │   ├── icons/
│   │   │   │   └── vista-icons.js
│   │   │   ├── mobile/
│   │   │   │   └── mobile-ux.js
│   │   │   └── effects/
│   │   │       └── clownfish-3d.js
│   │   └── main.js         # Main entry point
│   ├── css/
│   │   ├── base/           # Base styles
│   │   │   └── style.css
│   │   ├── components/      # Component styles
│   │   │   ├── vista-glass-refined.css
│   │   │   ├── vista-icons.css
│   │   │   └── vista-design-system.css
│   │   ├── themes/         # Theme-specific
│   │   │   ├── vintage-instagram.css
│   │   │   └── web2-gloss-enhancements.css
│   │   └── utilities/      # Utility styles
│   │       ├── mobile-responsive.css
│   │       ├── mobile-ux.css
│   │       ├── page-content-enhancements.css
│   │       └── text-sizing-enhancements.css
│   └── assets/
│       ├── images/         # All images
│       │   ├── photos/     # Photo gallery images
│       │   ├── logos/      # Logo files
│       │   └── backgrounds/ # Background images/gifs
│       ├── videos/         # Video files
│       ├── icons/          # Icon files
│       │   └── vista/      # Vista icons
│       └── fonts/          # Font files
├── config/                 # Configuration files
│   ├── vercel.json
│   ├── robots.txt
│   └── sitemap.xml
├── docs/                   # Documentation
│   ├── *.md files
│   └── design-docs/
└── package.json            # Dependency management
```

## Module Dependencies

### Core Modules (Load First)
1. `vista-system.js` - Vista UI system initialization
2. `window-manager.js` - Window management system

### Feature Modules (Load After Core)
1. `vista-icons.js` - Icon system (depends on assets)
2. `gif-background.js` - Background handling
3. `mobile-ux.js` - Mobile optimizations
4. `main.js` - Main application logic

### Background Modules (Mutually Exclusive)
- Only one background system should be active at a time
- `gif-background.js` (current default)
- `video-background.js`
- `frutiger-background.js`
- `exact-background.js`
- `background-generator.js`

## Path Mapping

### Old → New Paths
- `js/*.js` → `src/js/core/*.js` or `src/js/features/*/*.js`
- `css/*.css` → `src/css/base/*.css`, `src/css/components/*.css`, etc.
- `img/*` → `src/assets/images/*`
- `fonts/*` → `src/assets/fonts/*`
- `*.mov`, `*.gif` → `src/assets/videos/*` or `src/assets/images/backgrounds/*`

## Build & Deployment

- Static site - no build step required
- Vercel deployment with clean URLs
- All paths relative to root for HTML files
- Assets served from `src/assets/`

