# Project Structure Documentation

## Overview

This project follows enterprise-grade organization principles with clear separation of concerns and scalable architecture.

## Directory Tree

```
ianinnovates-main/
├── src/                          # Source code
│   ├── pages/                    # HTML entry points (source)
│   │   ├── index.html
│   │   ├── about.html
│   │   ├── contact.html
│   │   ├── cv.html
│   │   ├── portfolio.html
│   │   ├── photos.html
│   │   ├── testimonials.html
│   │   └── thank-you.html
│   ├── js/                       # JavaScript modules
│   │   ├── core/                 # Core system modules
│   │   │   ├── vista-system.js
│   │   │   └── window-manager.js
│   │   ├── features/             # Feature modules
│   │   │   ├── backgrounds/      # Background systems
│   │   │   │   ├── gif-background.js
│   │   │   │   ├── video-background.js
│   │   │   │   ├── frutiger-background.js
│   │   │   │   ├── exact-background.js
│   │   │   │   └── background-generator.js
│   │   │   ├── icons/            # Icon management
│   │   │   │   └── vista-icons.js
│   │   │   ├── mobile/           # Mobile optimizations
│   │   │   │   └── mobile-ux.js
│   │   │   └── effects/         # Visual effects
│   │   │       └── clownfish-3d.js
│   │   └── main.js              # Main application entry
│   ├── css/                      # Stylesheets
│   │   ├── base/                # Base styles
│   │   │   └── style.css
│   │   ├── components/          # Component styles
│   │   │   ├── vista-glass-refined.css
│   │   │   ├── vista-icons.css
│   │   │   ├── vista-design-system.css
│   │   │   └── vista-exact-match.css
│   │   ├── themes/              # Theme-specific styles
│   │   │   ├── vintage-instagram.css
│   │   │   └── web2-gloss-enhancements.css
│   │   └── utilities/           # Utility styles
│   │       ├── mobile-responsive.css
│   │       ├── mobile-ux.css
│   │       ├── page-content-enhancements.css
│   │       └── text-sizing-enhancements.css
│   └── assets/                  # All static assets
│       ├── images/              # Images organized by type
│       │   ├── photos/          # Photo gallery images
│       │   ├── logos/           # Logo and brand assets
│       │   └── backgrounds/    # Background images/GIFs
│       ├── videos/              # Video files
│       ├── icons/               # Icon files
│       │   └── vista/          # Vista icon collection
│       └── fonts/               # Font files
├── config/                      # Configuration files (source)
│   ├── vercel.json
│   ├── robots.txt
│   └── sitemap.xml
├── docs/                        # Documentation
│   ├── ARCHITECTURE.md
│   ├── STRUCTURE.md
│   └── [other documentation files]
├── scripts/                     # Build and utility scripts
│   └── update-paths.js
├── [root HTML files]            # Deployed HTML (copied from src/pages/)
├── vercel.json                  # Vercel config (copied from config/)
├── robots.txt                   # Robots config (copied from config/)
├── sitemap.xml                  # Sitemap (copied from config/)
├── package.json                 # Node.js dependencies
└── README.md                    # Project documentation
```

## Module Dependencies

### Load Order

1. **Core Modules** (Load First)
   - `window-manager.js` - Window management system
   - `vista-system.js` - Vista UI system

2. **Feature Modules** (Load After Core)
   - `vista-icons.js` - Icon system
   - `gif-background.js` - Background handling
   - `mobile-ux.js` - Mobile optimizations
   - `main.js` - Main application logic

### Background Systems

Only one background system should be active:
- `gif-background.js` (current default)
- `video-background.js`
- `frutiger-background.js`
- `exact-background.js`
- `background-generator.js`

## Path Conventions

### CSS Paths
```
src/css/{category}/{filename}.css
```

Categories:
- `base/` - Foundation styles
- `components/` - Component styles
- `themes/` - Theme-specific
- `utilities/` - Utility classes

### JavaScript Paths
```
src/js/{category}/{filename}.js
```

Categories:
- `core/` - System modules
- `features/{domain}/` - Feature modules
- Root level - Main entry point

### Asset Paths
```
src/assets/{type}/{category}/{filename}
```

Types:
- `images/` - Photos, logos, backgrounds
- `videos/` - Video files
- `icons/` - Icon files
- `fonts/` - Font files

## Build Process

1. **Copy HTML files** from `src/pages/` to root
2. **Copy config files** from `config/` to root
3. All asset paths already use `src/assets/` structure

Run: `npm run build`

## Deployment

- Vercel serves from root directory
- HTML and config files copied to root during build
- All assets served from `src/assets/` paths
- Clean URLs configured in `vercel.json`

## Benefits

✅ **Maintainability**: Clear organization makes code easy to find and modify
✅ **Scalability**: Easy to add new features without cluttering
✅ **Standards**: Follows industry best practices
✅ **Documentation**: Comprehensive structure documentation
✅ **Build Process**: Automated deployment preparation

