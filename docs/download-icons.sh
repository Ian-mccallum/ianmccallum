#!/bin/bash
# Download Vista Icons from Frutiger Aero Archive
# This script attempts to download icons directly from the archive

ICON_DIR="img/icons/vista"
mkdir -p "$ICON_DIR"

echo "Downloading Vista icons from frutigeraeroarchive.org..."
echo "Note: You may need to manually download some icons from the website"

# Try to download common Vista icons
# Note: These URLs may need to be adjusted based on actual archive structure

# For now, we'll use a workaround - create a script that opens the archive
# and provides instructions for batch downloading

echo ""
echo "To download icons:"
echo "1. Visit: https://frutigeraeroarchive.org/icons"
echo "2. Right-click each icon and 'Save Image As...'"
echo "3. Save to: $ICON_DIR/"
echo ""
echo "Required icons and their filenames:"
echo "- Recycle Bin → recycle-bin.png"
echo "- Orb White (Start) → start-button.png"
echo "- Internet Explorer → internet-explorer.png"
echo "- Get Started → home.png"
echo "- Personalization → about.png"
echo "- Photo Gallery → portfolio.png"
echo "- Book → cv.png"
echo "- Information → testimonials.png"
echo "- Photo Gallery → photos.png"
echo "- Windows Mail → contact.png"
echo "- Computer/Folder → all-programs.png"
echo "- Power icon → power.png"

