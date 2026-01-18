# Enterprise Codebase Structure

## Overview

This codebase follows enterprise-level organizational principles with clear separation between source code and build output.

## Directory Structure

```
/
├── src/                          # ⭐ SOURCE CODE (Single Source of Truth)
│   ├── pages/                    # HTML entry points
│   │   ├── index.html
│   │   ├── about.html
│   │   ├── contact.html
│   │   ├── cv.html
│   │   ├── portfolio.html
│   │   ├── photos.html
│   │   ├── testimonials.html
│   │   └── thank-you.html
│   │
│   ├── js/                       # JavaScript modules
│   │   ├── core/                 # Core system modules
│   │   │   ├── window-manager.js
│   │   │   └── vista-system.js
│   │   ├── features/             # Feature modules by domain
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
│   │   │   └── effects/          # Visual effects
│   │   │       └── clownfish-3d.js
│   │   └── main.js               # Main application entry
│   │
│   ├── css/                      # Stylesheets
│   │   ├── base/                 # Foundation styles
│   │   │   └── style.css
│   │   ├── components/           # Component styles
│   │   │   ├── vista-design-system.css
│   │   │   ├── vista-exact-match.css
│   │   │   ├── vista-glass-refined.css
│   │   │   └── vista-icons.css
│   │   ├── themes/               # Theme-specific styles
│   │   │   ├── vintage-instagram.css
│   │   │   └── web2-gloss-enhancements.css
│   │   └── utilities/            # Utility classes
│   │       ├── mobile-responsive.css
│   │       ├── mobile-ux.css
│   │       ├── page-content-enhancements.css
│   │       └── text-sizing-enhancements.css
│   │
│   └── assets/                   # All static assets
│       ├── images/               # Images organized by type
│       │   ├── photos/           # Photo gallery images
│       │   ├── logos/            # Logos and brand assets
│       │   └── backgrounds/      # Background images/GIFs
│       ├── videos/               # Video files
│       ├── icons/                # Icon files
│       │   └── vista/            # Vista icons (94 files)
│       └── fonts/                # Font files
│
├── config/                       # Configuration files (source)
│   ├── vercel.json              # Vercel deployment config
│   ├── robots.txt               # SEO robots file
│   └── sitemap.xml              # SEO sitemap
│
├── scripts/                      # Build and utility scripts
│   ├── build.js                 # Main build script
│   ├── clean-build.js           # Clean build artifacts
│   ├── update-paths.js          # Path update utility
│   └── update-paths-to-absolute.js
│
├── docs/                         # Documentation
│   ├── ARCHITECTURE.md
│   ├── STRUCTURE.md
│   └── [other documentation files]
│
├── [BUILD OUTPUT - Root Level]   # ⚠️ Generated files (do not edit)
│   ├── *.html                    # Copied from src/pages/
│   ├── css/                      # Flattened from src/css/
│   ├── js/                       # Flattened from src/js/
│   ├── assets/                   # Copied from src/assets/
│   ├── img/                      # Copied from src/assets/
│   ├── fonts/                    # Copied from src/assets/fonts/
│   ├── vercel.json              # Copied from config/
│   ├── robots.txt               # Copied from config/
│   └── sitemap.xml              # Copied from config/
│
└── package.json
```

## Path Conventions

### All paths use absolute paths from root (`/`)

This ensures paths work both:
- When Vercel serves from `src/pages/` via rewrites
- When build copies files to root

**CSS:**
```html
<link rel="stylesheet" href="/css/style.css">
<link rel="stylesheet" href="/css/vista-glass-refined.css">
```

**JavaScript:**
```html
<script src="/js/main.js"></script>
<script src="/js/window-manager.js"></script>
```

**Images:**
```html
<img src="/img/icons/vista/vista_get_started.ico">
<img src="/img/photos/IMG_2806.JPG">
```

**Assets:**
```html
<img src="/assets/IMlogo.png">
<img src="/assets/20251124_1315_Remix Video_remix_01kavmnrbpec59aep90j7an7yk.gif">
```

**Videos:**
```html
<video src="/assets/btcdemo.mov">
```

**Fonts:**
```css
@font-face {
  src: url('/fonts/segoe_ui_semilight.ttf');
}
```

## Build Process

### Standard Build
```bash
npm run build
```

This:
1. Copies HTML files from `src/pages/` to root
2. Flattens CSS from `src/css/{category}/` to `css/`
3. Flattens JS from `src/js/{category}/` to `js/`
4. Copies assets:
   - `src/assets/images/photos/` → `img/photos/` and `img/` (for compatibility)
   - `src/assets/images/logos/` → `assets/`
   - `src/assets/images/backgrounds/` → `assets/`
   - `src/assets/icons/` → `img/icons/`
   - `src/assets/videos/` → `assets/`
   - `src/assets/fonts/` → `fonts/`
5. Copies config files from `config/` to root

### Clean Build
```bash
npm run build:clean
```

Removes old build artifacts before rebuilding.

### Clean Only
```bash
npm run clean
```

Removes build artifacts without rebuilding.

## Development Workflow

1. **Edit source files** in `src/` directory
2. **Run build** before testing: `npm run build`
3. **Test locally**: `npm run serve` or `npm run dev`
4. **Commit source files** (build output is tracked for Vercel deployment)

## Deployment

### Vercel Configuration

The `vercel.json` uses rewrites to serve pages from `src/pages/`:

```json
{
  "rewrites": [
    { "source": "/", "destination": "/src/pages/index.html" },
    { "source": "/about", "destination": "/src/pages/about.html" }
  ]
}
```

However, for optimal performance, build output in root is preferred.

### Deployment Steps

1. **Build the project:**
   ```bash
   npm run build:clean
   ```

2. **Verify build output:**
   - Check that `css/`, `js/`, `img/`, `assets/` directories exist
   - Verify HTML files are in root
   - Ensure all assets are present

3. **Commit and push:**
   ```bash
   git add .
   git commit -m "Build for deployment"
   git push
   ```

4. **Vercel automatically deploys** from the root directory

## Key Principles

### ✅ Single Source of Truth
- All editable files are in `src/`
- Build output is generated, not edited directly

### ✅ Consistent Paths
- All paths use absolute paths from root (`/`)
- Works for both Vercel rewrites and build output

### ✅ Clear Separation
- Source code (`src/`) vs Build output (root)
- Configuration (`config/`) vs Deployed config (root)

### ✅ Organized by Domain
- JavaScript organized by feature domain
- CSS organized by purpose (base/components/themes/utilities)
- Assets organized by type

## File Organization Rules

### JavaScript
- **Core modules**: System-level functionality (`src/js/core/`)
- **Feature modules**: Domain-specific features (`src/js/features/{domain}/`)
- **Main entry**: Application initialization (`src/js/main.js`)

### CSS
- **Base**: Foundation styles, resets, variables
- **Components**: Reusable component styles
- **Themes**: Theme-specific overrides
- **Utilities**: Helper classes and utilities

### Assets
- **Images**: Organized by purpose (photos, logos, backgrounds)
- **Icons**: Organized by icon set (vista/)
- **Videos**: All video files in one directory
- **Fonts**: All font files in one directory

## Troubleshooting

### Path Issues
If assets don't load:
1. Check that paths use absolute paths (`/assets/` not `assets/`)
2. Verify build output exists in root
3. Check browser console for 404 errors

### Build Issues
If build fails:
1. Check that `src/` directory structure is correct
2. Verify all source files exist
3. Run `npm run clean` then `npm run build`

### Deployment Issues
If deployment fails:
1. Ensure build output is committed
2. Check `vercel.json` configuration
3. Verify all paths use absolute paths

## Benefits

✅ **Maintainability**: Clear organization makes code easy to find and modify  
✅ **Scalability**: Easy to add new features without cluttering  
✅ **Standards**: Follows industry best practices  
✅ **Documentation**: Comprehensive structure documentation  
✅ **Build Process**: Automated deployment preparation  
✅ **Path Consistency**: No path resolution issues  
✅ **Single Source**: No confusion about which files to edit

