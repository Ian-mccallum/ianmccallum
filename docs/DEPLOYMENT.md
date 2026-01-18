# Deployment Guide

## 🚀 Quick Deployment

### Standard Deployment (Recommended)

The site uses **Vercel rewrites** to serve directly from `src/pages/`. No build step required!

```bash
# 1. Edit files in src/pages/
# 2. Commit and push
git add src/
git commit -m "Update site"
git push
```

Vercel automatically deploys from `src/pages/` using the rewrites configured in `vercel.json`.

### Build-Based Deployment (Alternative)

If you prefer to use build output in root:

```bash
# 1. Build the project
npm run build:clean

# 2. Verify build output
ls -la css/ js/ img/ assets/

# 3. Commit and push
git add .
git commit -m "Build for deployment"
git push
```

## File Organization

### Source Files (Edit These)
- **Location**: `src/pages/*.html`
- **Edit**: ✅ YES - Always edit these files
- **Status**: Single source of truth

### Build Output (Optional)
- **Location**: `*.html` in root
- **Edit**: ❌ NO - These are generated files
- **Status**: Only needed for build-based deployment

## Path Strategy

All paths use **absolute paths** from root (`/`):
- CSS: `/css/style.css`
- JS: `/js/main.js`
- Images: `/img/icons/vista/`
- Assets: `/assets/logo.png`
- Fonts: `/fonts/segoe_ui_semilight.ttf`

This ensures paths work regardless of file location.

## Vercel Configuration

The `vercel.json` file contains rewrites that map:
- `/` → `/src/pages/index.html`
- `/about` → `/src/pages/about.html`
- `/portfolio` → `/src/pages/portfolio.html`
- `/contact` → `/src/pages/contact.html`
- `/cv` → `/src/pages/cv.html`
- `/photos` → `/src/pages/photos.html`
- `/testimonials` → `/src/pages/testimonials.html`
- `/thank-you` → `/src/pages/thank-you.html`

## Development Workflow

### Simple Workflow (Recommended)
```bash
# 1. Edit files in src/pages/
# 2. Test locally (optional)
npm run dev

# 3. Commit and push
git add src/
git commit -m "Update pages"
git push
```

### Build Workflow (Alternative)
```bash
# 1. Edit files in src/
# 2. Build
npm run build:clean

# 3. Test locally
npm run dev

# 4. Commit and push
git add .
git commit -m "Build for deployment"
git push
```

## Testing Locally

### Option 1: Vercel CLI (Recommended)
```bash
npx vercel dev
```

### Option 2: Simple Server
```bash
npm run dev
# or
npm run serve
```

### Option 3: Build First
```bash
npm run build
npm run dev
```

## Build Output Structure

When using build-based deployment, the build script creates:

```
/
├── *.html              # HTML pages (from src/pages/)
├── css/                # CSS files (flattened from src/css/)
├── js/                 # JavaScript files (flattened from src/js/)
├── img/                # Images and icons
│   ├── icons/vista/    # Vista icons
│   ├── photos/         # Photo gallery
│   └── *.JPG          # Direct photo access
├── assets/             # Logos, videos, backgrounds
├── fonts/              # Font files
├── vercel.json         # Vercel configuration
├── robots.txt          # SEO configuration
└── sitemap.xml         # Sitemap
```

## Troubleshooting

### Assets Not Loading
1. Check that paths use absolute paths (`/assets/` not `assets/`)
2. Verify build output exists in root (if using build-based deployment)
3. Check browser console for 404 errors
4. Verify `vercel.json` rewrites are correct

### Build Issues
1. Run `npm run clean` to remove old artifacts
2. Run `npm run build:clean` for a fresh build
3. Check that `src/` directory structure is correct
4. Verify all source files exist

### Deployment Issues
1. Ensure source files are committed
2. Check `vercel.json` configuration
3. Verify all paths use absolute paths
4. Check Vercel deployment logs

## Benefits

✅ **No build step** - Edit and push (with rewrites)  
✅ **Single source of truth** - No duplicate files  
✅ **Simpler workflow** - Less to remember  
✅ **Enterprise organization** - Clean structure  
✅ **Automatic deployment** - Vercel handles everything  
✅ **Flexible** - Can use rewrites or build output

## Important Notes

- **Source files** are in `src/` - these are what you edit
- **Build output** is in root - these are generated (if using build-based deployment)
- **Never edit files in root** - always edit in `src/` and rebuild
- **Paths** use absolute paths from root for maximum compatibility

