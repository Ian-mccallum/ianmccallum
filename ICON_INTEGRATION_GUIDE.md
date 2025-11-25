# Frutiger Aero Icon Integration Guide

## Icons from frutigeraeroarchive.org/icons

This guide helps you integrate authentic Vista-era icons from the Frutiger Aero Archive.

## Icon Download Instructions

1. Visit: https://frutigeraeroarchive.org/icons
2. Download the following icon sets:
   - Windows Vista icons (Photo Gallery, Calendar, Sidebar, etc.)
   - Web Browsers (Internet Explorer 7/9, Firefox, Chrome)
   - Various Utilities (File Explorer, Task Manager, Trashbin)
   - Email/Messaging (Windows Mail, Live Mail)
   - Media & Entertainment (Media Player, Media Center, Photo Gallery)

## Recommended Icons for This Site

### Desktop Icons
- **Recycle Bin**: Use Windows 7 Trashbin icon (empty/full variants available)

### Start Menu Icons
- **Home**: Windows Vista "Get Started" or "House" icon
- **About**: Windows Vista "Personalization" or user icon
- **Portfolio**: Windows Vista "Photo Gallery" icon
- **CV**: Windows Vista "Book/Journal" icon
- **Testimonials**: Windows Vista "Information" icon
- **Photos**: Windows Vista "Photo Gallery" icon
- **Contact**: Windows Mail or Live Mail icon

### Taskbar Icons
- **Start Button**: Windows Vista "Orb White" icon
- **Quick Launch**: Internet Explorer 7/9 icon

### Window Icons
- **Portfolio Window**: Briefcase or folder icon
- **About Window**: User or personalization icon
- **Contact Window**: Mail icon

## File Structure

Place downloaded icons in: `img/icons/vista/`

## Icon Formats

- Preferred: PNG with transparency
- Size: 32x32px for taskbar, 48x48px for desktop, 16x16px for window controls
- Format: ICO or PNG

## Integration

Icons are referenced in the HTML/CSS using the paths:
- Desktop: `img/icons/vista/recycle-bin.png`
- Start Menu: `img/icons/vista/[icon-name].png`
- Taskbar: `img/icons/vista/[icon-name].png`

