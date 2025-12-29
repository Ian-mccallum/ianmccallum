# Download Vista Icons from Frutiger Aero Archive

## Quick Setup Instructions

1. **Visit the Icon Archive**: https://frutigeraeroarchive.org/icons

2. **Create Icon Directory**:
   ```bash
   mkdir -p img/icons/vista
   ```

3. **Download These Specific Icons**:

### Desktop Icons
- **Recycle Bin**: Download "Trashbin" icon (Windows 7 empty trashbin)
  - Save as: `img/icons/vista/recycle-bin.png`

### Start Menu Icons
- **Home**: Download "Get Started" icon from Windows Vista section
  - Save as: `img/icons/vista/home.png`
- **About**: Download "Personalization" icon from Windows Vista section
  - Save as: `img/icons/vista/about.png`
- **Portfolio**: Download "Photo Gallery" icon from Windows Vista section
  - Save as: `img/icons/vista/portfolio.png`
- **CV**: Download "Book/Journal" icon (Book 1, 2, or 3) from Windows Vista section
  - Save as: `img/icons/vista/cv.png`
- **Testimonials**: Download "Information" icon from Windows Vista section
  - Save as: `img/icons/vista/testimonials.png`
- **Photos**: Download "Photo Gallery" icon from Windows Vista section
  - Save as: `img/icons/vista/photos.png`
- **Contact**: Download "Windows Mail" icon from Email/Messaging section
  - Save as: `img/icons/vista/contact.png`
- **All Programs**: Use existing or download folder icon
  - Save as: `img/icons/vista/all-programs.png`

### Taskbar Icons
- **Start Button**: Download "Orb White" icon from Windows Vista section
  - Save as: `img/icons/vista/start-button.png`
- **Internet Explorer**: Download "Internet Explorer 7" or "Internet Explorer 9" icon
  - Save as: `img/icons/vista/internet-explorer.png`
- **Home Taskbar**: Same as start menu home icon
  - Save as: `img/icons/vista/home-taskbar.png`
- **About Taskbar**: Same as start menu about icon
  - Save as: `img/icons/vista/about-taskbar.png`
- **Portfolio Taskbar**: Same as start menu portfolio icon
  - Save as: `img/icons/vista/portfolio-taskbar.png`
- **Contact Taskbar**: Same as start menu contact icon
  - Save as: `img/icons/vista/contact-taskbar.png`

### Window Title Icons
- **Portfolio Window**: Same as portfolio icon
  - Save as: `img/icons/vista/portfolio-window.png`
- **About Window**: Same as about icon
  - Save as: `img/icons/vista/about-window.png`
- **Contact Window**: Same as contact icon
  - Save as: `img/icons/vista/contact-window.png`
- **CV Window**: Same as CV icon
  - Save as: `img/icons/vista/cv-window.png`
- **Testimonials Window**: Same as testimonials icon
  - Save as: `img/icons/vista/testimonials-window.png`
- **Photos Window**: Same as photos icon
  - Save as: `img/icons/vista/photos-window.png`

## Icon Format Requirements

- **Format**: PNG with transparency
- **Size**: 
  - Desktop: 48x48px
  - Taskbar: 24x24px or 32x32px
  - Start Menu: 20x20px
  - Window Title: 16x16px
- **Background**: Transparent
- **Quality**: High resolution (can be scaled down)

## Alternative: Direct URL Usage

If you want to use icons directly from the archive (if they provide direct links), you can modify `js/vista-icons.js` to use direct URLs instead of local paths.

## Testing

After downloading icons:
1. Check that all icons are in `img/icons/vista/` directory
2. Refresh the page
3. Icons should automatically replace Font Awesome icons
4. If an icon is missing, it will fall back to Font Awesome

