# Development Workflow

## File Organization

### Source Files (`src/pages/`)
- **Location**: `src/pages/*.html`
- **Purpose**: These are your **source files** - the files you edit
- **Status**: These are tracked in git and are your source of truth
- **Examples**: `src/pages/index.html`, `src/pages/about.html`, etc.

### Deployed Files (Root)
- **Location**: `*.html` in root directory
- **Purpose**: These are **build output** - copied from `src/pages/` during build
- **Status**: Generated files (can be regenerated anytime)
- **Examples**: `index.html`, `about.html`, etc.

## How It Works

1. **Edit source files** in `src/pages/`
2. **Run build**: `npm run build`
3. **Build script copies** files from `src/pages/` → root
4. **Deploy**: Root files are what get deployed to Vercel

## Which Files Should You Edit?

✅ **ALWAYS edit files in `src/pages/`**
❌ **NEVER edit files in root** (they get overwritten on next build)

## Build Process

```
src/pages/index.html  →  [build]  →  index.html (root)
src/pages/about.html  →  [build]  →  about.html (root)
...and so on
```

## Quick Reference

| Location | Purpose | Edit? |
|----------|---------|-------|
| `src/pages/*.html` | Source files | ✅ YES - Edit these |
| `*.html` (root) | Build output | ❌ NO - Auto-generated |

## Workflow

1. Make changes to `src/pages/index.html`
2. Run `npm run build`
3. Test locally with `npm run dev`
4. Commit `src/pages/` files (not root HTML)
5. Push to deploy

## Why This Structure?

- **Enterprise organization**: Source files organized in `src/`
- **Deployment compatibility**: Root files work with Vercel
- **Clean separation**: Source vs. build output
- **Version control**: Only track source files

