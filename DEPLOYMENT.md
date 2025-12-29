# Deployment Guide

## Pre-Deployment Checklist

✅ **Build Process Complete**
- Run `npm run build` before every deployment
- This copies all files from `src/` to root-level directories

## Build Output

The build script creates the following structure in the root:

```
/
├── *.html              # HTML pages (from src/pages/)
├── css/                # CSS files (from src/css/)
├── js/                 # JavaScript files (from src/js/)
├── img/                # Images and icons
│   ├── icons/vista/    # Vista icons
│   ├── photos/         # Photo gallery
│   └── *.JPG          # Direct photo access
├── fonts/              # Font files
├── *.gif               # Background GIFs
├── *.mov               # Video files
├── *.png, *.jpg, *.ico # Logo and skill icons
├── vercel.json         # Vercel configuration
├── robots.txt          # SEO configuration
└── sitemap.xml         # Sitemap
```

## Deployment Steps

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Verify build output:**
   - Check that `css/`, `js/`, `img/` directories exist
   - Verify HTML files are in root
   - Ensure all assets are present

3. **Commit and push:**
   ```bash
   git add .
   git commit -m "Build for deployment"
   git push
   ```

4. **Vercel will automatically deploy** from the root directory

## Important Notes

- **Source files** are in `src/` - these are what you edit
- **Build output** is in root - these are what gets deployed
- **Never edit files in root** - always edit in `src/` and rebuild
- The `.gitignore` is configured to track source files but ignore build artifacts

## File Paths

All paths in HTML and JavaScript use the deployment structure:
- CSS: `css/style.css`
- JS: `js/main.js`
- Images: `img/icons/vista/`, `img/IMG_*.JPG`
- Assets: Root level for logos, videos, GIFs

## Troubleshooting

If something doesn't work after deployment:

1. **Check build output:**
   ```bash
   npm run build
   ls -la css/ js/ img/
   ```

2. **Verify paths match:**
   - HTML files reference `css/`, `js/`, `img/`
   - JavaScript files reference `img/icons/vista/`
   - All assets are in expected locations

3. **Check Vercel logs:**
   - Look for 404 errors
   - Verify file paths in error messages

## Development Workflow

1. Edit files in `src/`
2. Run `npm run build` to test locally
3. Test with `npm run dev`
4. Commit source files (not build output)
5. Push to trigger deployment

