> **Superseded.** The site background is no longer a still image or an animated
> GIF. It is a silent looping video, `assets/aero-bg.mp4` (~400KB), with
> `assets/aero-bg-poster.jpg` behind it for first paint, sized by
> `src/js/features/backgrounds/gif-background.js`.
>
> The GIF it replaced was 8.6MB at 320x214, upscaled to fill the viewport:
> roughly 64MB of decoded frames held resident and recomposited fullscreen and
> forever. Replacing it cut the background asset by 95% and moved the animation
> off the main thread. See the Background section of the root README.
>
> This file is kept for the generation prompts and the composition brief, which
> still describe the look accurately.

---

# AI Background Image Generation - Perfect Frutiger Aero Background

## 🎯 Your Vision
A single, perfect background image combining:
- **Futuristic city** (distant, on horizon)
- **Ocean/water** (calm, in midground)
- **Blue sky** (vibrant, with clouds)
- **Rolling hills** (green, in foreground - NOT covering whole ground)

## 🎨 Primary AI Generation Prompt

### For Midjourney (Best Quality):
```
/imagine prompt: Frutiger Aero aesthetic, Windows Vista Bliss wallpaper style, panoramic landscape, futuristic city skyline in the far distance on horizon, rolling green hills in the foreground covering only bottom 30%, calm ocean or water in the midground, vibrant blue sky with white fluffy clouds at top, bright saturated colors, glossy surfaces, nature-technology fusion, optimistic futuristic feel, high resolution 4K, photorealistic but stylized, cinematic lighting, depth of field, wide angle view, horizontal composition 16:9 aspect ratio, the hills do not cover the entire ground, ocean visible between hills and city --ar 16:9 --v 6 --style raw
```

### For DALL-E 3 (ChatGPT Plus):
```
Create a panoramic landscape in Frutiger Aero aesthetic, inspired by Windows Vista Bliss wallpaper. The scene should have: 
- Rolling green hills in the foreground (covering only the bottom 30% of the image, not the whole ground)
- A calm ocean or body of water in the midground (visible between the hills and city)
- A futuristic city skyline in the far distance on the horizon
- A vibrant blue sky with white fluffy clouds at the top
- Bright, saturated colors with glossy surfaces
- Nature-technology fusion aesthetic
- Optimistic, futuristic feel
- Photorealistic but slightly stylized
- Cinematic lighting with depth of field
- Wide angle, horizontal composition, 16:9 aspect ratio
- High resolution, 4K quality
```

### For Stable Diffusion / Leonardo.ai:
```
Frutiger Aero aesthetic, Windows Vista Bliss style, panoramic landscape, futuristic city skyline far distance horizon, rolling green hills foreground bottom 30%, calm ocean midground, vibrant blue sky white fluffy clouds, bright saturated colors, glossy surfaces, nature-technology fusion, optimistic futuristic, 4K high resolution, photorealistic stylized, cinematic lighting, depth of field, wide angle, 16:9 aspect ratio, hills do not cover entire ground, ocean visible between hills and city
```

## 📐 Image Specifications

- **Resolution**: 3840x2160 (4K) or minimum 1920x1080 (Full HD)
- **Aspect Ratio**: 16:9 (landscape)
- **Format**: JPG (for smaller file size) or PNG (for quality)
- **File Name**: `frutiger-background.jpg`
- **Save Location**: `img/frutiger-background.jpg`

## 🎯 Composition Breakdown

### Vertical Layout (Top to Bottom):
1. **Top 30%**: Blue sky with white clouds
2. **30-50%**: Futuristic city skyline (distant, on horizon)
3. **50-70%**: Ocean/water (calm, reflective)
4. **Bottom 30%**: Rolling green hills (NOT covering entire bottom - leave some ground visible)

### Key Requirements:
- ✅ Hills should be in foreground but NOT cover the whole ground
- ✅ Ocean/water must be visible between hills and city
- ✅ City should be clearly visible but distant
- ✅ Sky should be vibrant blue with clouds
- ✅ Overall Frutiger Aero aesthetic with saturated colors

## 🛠️ AI Tools & Instructions

### Option 1: Midjourney (Recommended - Best Quality)
1. Join Midjourney Discord server
2. Use `/imagine` command with the prompt above
3. Add `--ar 16:9 --v 6` for aspect ratio
4. Upscale the best result to 4K
5. Download and save as `img/frutiger-background.jpg`

### Option 2: DALL-E 3 (via ChatGPT Plus)
1. Open ChatGPT Plus
2. Use the detailed prompt above
3. Request 16:9 aspect ratio
4. Download and save as `img/frutiger-background.jpg`

### Option 3: Leonardo.ai (Free Tier Available)
1. Go to leonardo.ai
2. Select "PhotoReal" or "Leonardo Diffusion" model
3. Use the prompt above
4. Set aspect ratio to 16:9
5. Generate and download
6. Save as `img/frutiger-background.jpg`

### Option 4: Stable Diffusion (Free, Local)
1. Use Stable Diffusion WebUI
2. Load a landscape model
3. Use the prompt above
4. Set resolution to 1920x1080 or higher
5. Generate and save as `img/frutiger-background.jpg`

## 🎨 Color Palette Reference

Ensure the generated image uses these Frutiger Aero colors:
- **Sky Blues**: #87CEEB, #00BFFF, #1E90FF, #4682B4
- **Nature Greens**: #00FF7F, #7FFF00, #00C853, #228B22
- **Water**: Bright blue tones, reflective
- **City**: Silhouetted or with blue/white tones

## ✅ Quality Checklist

Before using the image, verify:
- [ ] Image is 1920x1080 or larger
- [ ] Aspect ratio is 16:9
- [ ] Hills are in foreground but don't cover entire bottom
- [ ] Ocean is visible between hills and city
- [ ] City is clearly visible but distant
- [ ] Sky has proper blue gradient with clouds
- [ ] Colors are vibrant and saturated (Frutiger Aero style)
- [ ] File is optimized for web (under 2MB if possible)
- [ ] Saved as `img/frutiger-background.jpg`

## 📝 Post-Processing (Optional)

If needed, use Photoshop/GIMP to:
1. Adjust saturation to match Frutiger Aero palette
2. Ensure proper composition (hills not covering everything)
3. Enhance colors if needed
4. Optimize file size for web

## 🚀 Implementation

Once you have the image:
1. Save it as `img/frutiger-background.jpg`
2. The code is already set up to use this image
3. Refresh your browser to see the background
4. If image doesn't appear, check the file path

## 🔄 Alternative: Use Placeholder

If you want to test the layout first, you can temporarily use:
- Unsplash: `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80`
- Or any panoramic landscape image

But the final version MUST be your AI-generated perfect background!
