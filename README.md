# Ian Innovates - Personal Website

Enterprise-grade personal brand website with Windows Vista/Frutiger Aero aesthetic.

## 🏗️ Architecture

This project follows enterprise-level organization principles:

```
/
├── src/
│   ├── pages/              # HTML entry points (source)
│   ├── js/
│   │   ├── core/           # Core system modules
│   │   ├── features/       # Feature modules (backgrounds, icons, mobile, effects)
│   │   └── main.js         # Main application entry
│   ├── css/
│   │   ├── base/           # Base styles
│   │   ├── components/     # Component styles
│   │   ├── themes/         # Theme-specific styles
│   │   └── utilities/      # Utility styles
│   └── assets/
│       ├── images/         # All images (photos, logos, backgrounds)
│       ├── videos/         # Video files
│       ├── icons/          # Icon files
│       └── fonts/          # Font files
├── config/                 # Configuration files (source)
├── docs/                   # Documentation
├── scripts/                # Build and utility scripts
└── [root HTML files]       # Deployed HTML files (copied from src/pages/)
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
   This copies HTML files from `src/pages/` to root and config files from `config/` to root.

3. **Serve locally**:
   ```bash
   npm run serve
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

The build process:
1. Copies HTML files from `src/pages/` to root
2. Copies config files from `config/` to root
3. All asset paths are already updated to use `src/assets/` structure

## 📝 Path Conventions

All paths in the codebase follow these conventions:

- **CSS**: `src/css/{category}/{filename}.css`
- **JavaScript**: `src/js/{category}/{filename}.js`
- **Images**: `src/assets/images/{type}/{filename}`
- **Icons**: `src/assets/icons/{category}/{filename}`
- **Videos**: `src/assets/videos/{filename}`

## 🚢 Deployment

This site is configured for Vercel deployment:

- HTML files in root (copied during build)
- `vercel.json` in root for routing configuration
- All assets served from `src/assets/` paths

## 📚 Documentation

See `docs/` directory for detailed documentation:
- Architecture decisions
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

