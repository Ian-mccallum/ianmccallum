# Ian Innovates - Personal Website

Enterprise-grade personal brand website with Windows Vista/Frutiger Aero aesthetic.

## 🏗️ Architecture

This project follows enterprise-level organization principles with clear separation between source code and build output.

**📖 See [docs/ENTERPRISE_STRUCTURE.md](./docs/ENTERPRISE_STRUCTURE.md) for complete structure documentation.**

### Quick Overview

```
/
├── src/                    # ⭐ SOURCE CODE (Single Source of Truth)
│   ├── pages/             # HTML entry points
│   ├── js/                # JavaScript modules (core/features/)
│   ├── css/               # Stylesheets (base/components/themes/utilities/)
│   └── assets/            # All static assets (images/videos/icons/fonts/)
├── config/                # Configuration files (source)
├── scripts/               # Build and utility scripts
├── docs/                  # Documentation
└── [build output]         # Generated files in root (for deployment)
```

## 🚀 Quick Start

### Development

1. **Install dependencies** (if any are added in the future):
   ```bash
   npm install
   ```

2. **Build for deployment**:
   ```bash
   npm run build
   ```
   Or for a clean build:
   ```bash
   npm run build:clean
   ```
   This copies HTML files from `src/pages/` to root, flattens CSS/JS, and copies assets/config.

3. **Serve locally**:
   ```bash
   npm run serve
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

### File Organization

- **Source files**: All source code lives in `src/`
- **Deployed files**: HTML and config files are copied to root for Vercel deployment
- **Assets**: All assets are organized in `src/assets/` by type

## 📁 Directory Structure

### JavaScript Modules

- **Core** (`src/js/core/`): System-level modules
  - `window-manager.js` - Window management system
  - `vista-system.js` - Vista UI system

- **Features** (`src/js/features/`): Feature-specific modules
  - `backgrounds/` - Background systems (GIF, video, etc.)
  - `icons/` - Icon management
  - `mobile/` - Mobile UX optimizations
  - `effects/` - Visual effects

### CSS Organization

- **Base** (`src/css/base/`): Foundation styles
- **Components** (`src/css/components/`): Reusable component styles
- **Themes** (`src/css/themes/`): Theme-specific styles
- **Utilities** (`src/css/utilities/`): Utility classes and helpers

### Assets

- **Images** (`src/assets/images/`): Organized by purpose
  - `photos/` - Photo gallery images
  - `logos/` - Logo and brand assets
  - `backgrounds/` - Background images and GIFs
- **Videos** (`src/assets/videos/`): Video files
- **Icons** (`src/assets/icons/`): Icon files (Vista icons, etc.)
- **Fonts** (`src/assets/fonts/`): Font files

## 🔧 Build Process

The build process (`npm run build`):
1. Copies HTML files from `src/pages/` to root
2. Flattens CSS from `src/css/{category}/` to `css/`
3. Flattens JS from `src/js/{category}/` to `js/`
4. Copies assets from `src/assets/` to `img/` and `assets/`
5. Copies config files from `config/` to root

**Note**: Always edit files in `src/`, never edit build output in root.

## 📝 Path Conventions

**All paths use absolute paths from root (`/`)** to ensure compatibility with both Vercel rewrites and build output:

- **CSS**: `/css/{filename}.css`
- **JavaScript**: `/js/{filename}.js`
- **Images**: `/img/{path}` or `/assets/{filename}`
- **Icons**: `/img/icons/vista/{filename}`
- **Videos**: `/assets/{filename}`
- **Fonts**: `/fonts/{filename}`

**Source files are organized as:**
- **CSS**: `src/css/{category}/{filename}.css`
- **JavaScript**: `src/js/{category}/{filename}.js`
- **Assets**: `src/assets/{type}/{category}/{filename}`

## 🚢 Deployment

This site is configured for Vercel deployment:

- HTML files in root (copied during build)
- `vercel.json` in root for routing configuration
- All assets served from `src/assets/` paths

## 📚 Documentation

Comprehensive documentation is available in the `docs/` directory:

### Core Documentation
- **[ENTERPRISE_STRUCTURE.md](./docs/ENTERPRISE_STRUCTURE.md)** - Complete structure guide
- **[DEPLOYMENT.md](./docs/DEPLOYMENT.md)** - Deployment guide (rewrites & build)
- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - Architecture decisions
- **[STRUCTURE.md](./docs/STRUCTURE.md)** - Detailed structure documentation
- **[SEO_AEO_PLAN.md](./docs/SEO_AEO_PLAN.md)** - SEO & Answer Engine Optimization plan
- **[GOOGLE_SEARCH_CONSOLE_GUIDE.md](./docs/GOOGLE_SEARCH_CONSOLE_GUIDE.md)** - Google Search Console setup guide

### Additional Documentation
- **[TESTIMONIAL_STRATEGY.md](./docs/TESTIMONIAL_STRATEGY.md)** - Testimonial audit, collection plan, and email formula
- **[SEO_AEO_PLAN.md](./docs/SEO_AEO_PLAN.md)** - SEO & Answer Engine Optimization plan
- **[SEO_IMPLEMENTATION_STATUS.md](./docs/SEO_IMPLEMENTATION_STATUS.md)** - SEO implementation status
- **[ARCHITECTURE_PLAN.md](./docs/ARCHITECTURE_PLAN.md)** - Reorganization plan
- **[REORGANIZATION_SUMMARY.md](./docs/REORGANIZATION_SUMMARY.md)** - Summary of changes
- **[BUILD_SYSTEM_ANALYSIS.md](./docs/BUILD_SYSTEM_ANALYSIS.md)** - Build system analysis
- **[WORKFLOW.md](./docs/WORKFLOW.md)** - Development workflow
- Design system documentation
- Setup guides
- Feature documentation

## 🎨 Design System

The site uses a Windows Vista/Frutiger Aero aesthetic with:
- Glassmorphism effects
- Vista-style icons
- Frutiger Aero color palette
- Responsive mobile design

## 📄 License

MIT

