# Deployment Guide v2 - Vercel Rewrites

## 🎉 No Build Step Required!

The site now uses **Vercel rewrites** to serve directly from `src/pages/`. No build step needed!

## How It Works

1. **Edit files** in `src/pages/` directly
2. **Push to git** - that's it!
3. **Vercel automatically deploys** from `src/pages/`

## File Organization

### Source Files (Edit These)
- **Location**: `src/pages/*.html`
- **Edit**: ✅ YES - Edit these files
- **Status**: Single source of truth

### Build Output (Optional)
- **Location**: `*.html` in root
- **Edit**: ❌ NO - These are optional legacy files
- **Status**: Only needed if you want to test locally without Vercel

## Paths

All paths in `src/pages/` use **absolute paths** from root:
- CSS: `/css/style.css`
- JS: `/js/main.js`
- Images: `/img/icons/vista/`
- Assets: `/assets/logo.png`

This allows files to work regardless of their location.

## Workflow

### Simple Workflow (Recommended)
```bash
# 1. Edit files in src/pages/
# 2. Test locally (optional)
npm run dev

# 3. Commit and push
git add src/pages/
git commit -m "Update pages"
git push
```

### Legacy Build (Optional)
If you want to test with root HTML files:
```bash
npm run build:legacy
npm run dev
```

## Vercel Configuration

The `vercel.json` file contains rewrites that map:
- `/` → `/src/pages/index.html`
- `/about` → `/src/pages/about.html`
- `/portfolio` → `/src/pages/portfolio.html`
- etc.

## Benefits

✅ **No build step** - Edit and push
✅ **Single source of truth** - No duplicate files
✅ **Simpler workflow** - Less to remember
✅ **Same organization** - Still enterprise-grade structure
✅ **Automatic deployment** - Vercel handles everything

## Testing Locally

For local testing, you can either:

1. **Use Vercel CLI** (recommended):
   ```bash
   npx vercel dev
   ```

2. **Use legacy build**:
   ```bash
   npm run build:legacy
   npm run dev
   ```

## Migration Notes

- All paths updated to absolute (`/css/`, `/js/`, `/assets/`)
- `vercel.json` updated with rewrites to `src/pages/`
- Build script still available as `build:legacy` if needed
- Root HTML files are now optional (can be deleted if desired)

