# Enterprise Reorganization Plan

## Current Issues Identified

1. **Duplicate Structures**: Files exist in both root and `src/` directories
2. **Path Inconsistencies**: Mixed relative/absolute paths across codebase
3. **Asset Duplication**: Assets in both root (`assets/`, `img/`) and `src/assets/`
4. **Build Confusion**: Build script vs Vercel rewrites conflict

## Enterprise Solution

### 1. Single Source of Truth
- **Source**: All editable files in `src/`
- **Build Output**: Generated files in root (for Vercel deployment)
- **Strategy**: Use absolute paths (`/css/`, `/js/`, `/assets/`, `/img/`) that work for both

### 2. Directory Structure

```
/
├── src/                          # SOURCE CODE (single source of truth)
│   ├── pages/                    # HTML pages
│   ├── js/                       # JavaScript modules
│   │   ├── core/                 # Core system modules
│   │   ├── features/             # Feature modules by domain
│   │   └── main.js               # Main entry point
│   ├── css/                      # Stylesheets
│   │   ├── base/                 # Foundation styles
│   │   ├── components/           # Component styles
│   │   ├── themes/               # Theme styles
│   │   └── utilities/            # Utility classes
│   └── assets/                   # All static assets
│       ├── images/               # Images organized by type
│       │   ├── photos/           # Photo gallery
│       │   ├── logos/            # Logos and brand assets
│       │   └── backgrounds/      # Background images/GIFs
│       ├── videos/               # Video files
│       ├── icons/                # Icon files
│       │   └── vista/            # Vista icons
│       └── fonts/                # Font files
├── config/                       # Configuration files
│   ├── vercel.json
│   ├── robots.txt
│   └── sitemap.xml
├── scripts/                      # Build and utility scripts
├── docs/                         # Documentation
├── [root build output]           # Generated files for deployment
│   ├── *.html                    # Copied from src/pages/
│   ├── css/                      # Flattened from src/css/
│   ├── js/                       # Flattened from src/js/
│   ├── assets/                   # Copied from src/assets/images/logos + videos + backgrounds
│   ├── img/                      # Copied from src/assets/images/photos + icons
│   └── fonts/                    # Copied from src/assets/fonts/
└── package.json
```

### 3. Path Strategy

**All paths use absolute paths from root:**
- CSS: `/css/{filename}.css`
- JS: `/js/{filename}.js`
- Images: `/img/{path}` or `/assets/{filename}`
- Icons: `/img/icons/vista/{filename}`
- Videos: `/assets/{filename}`
- Fonts: `/fonts/{filename}`

**Why absolute paths?**
- Works when Vercel serves from `src/pages/` via rewrites
- Works when build copies files to root
- No path resolution issues

### 4. Build Process

1. Copy HTML from `src/pages/` to root
2. Flatten CSS from `src/css/{category}/` to `css/`
3. Flatten JS from `src/js/{category}/` to `js/`
4. Copy assets:
   - `src/assets/images/photos/` → `img/photos/` and `img/` (for compatibility)
   - `src/assets/images/logos/` → `assets/`
   - `src/assets/images/backgrounds/` → `assets/`
   - `src/assets/icons/` → `img/icons/`
   - `src/assets/videos/` → `assets/`
   - `src/assets/fonts/` → `fonts/`
5. Copy config files from `config/` to root

### 5. Implementation Steps

1. ✅ Analyze dependency graph
2. 🔄 Consolidate duplicate assets
3. ⏳ Update all JavaScript path references to absolute
4. ⏳ Update all HTML path references (already mostly done)
5. ⏳ Update build script
6. ⏳ Update Vercel config
7. ⏳ Clean up root directory
8. ⏳ Update documentation

