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

# GIF Background Option

## Using GIF Instead of Video

Yes, a GIF can work as a background! Here are the pros and cons:

### Pros of GIF:
- ✅ Universal browser support
- ✅ Simple implementation (just an `<img>` tag)
- ✅ No autoplay restrictions
- ✅ Works everywhere

### Cons of GIF:
- ❌ Usually much larger file sizes
- ❌ Lower quality (256 color limit)
- ❌ No sound (but you don't need it anyway)
- ❌ Less efficient compression

## Implementation

If you want to use a GIF instead, here's how to update the code:

### Option 1: Replace Video with GIF in HTML

```html
<!-- Replace the video element with this: -->
<div id="frutiger-background" class="fixed inset-0 z-0">
    <img 
        id="background-gif" 
        class="background-gif"
        src="your-background.gif" 
        alt="Frutiger Aero Background"
    >
    <div class="video-overlay absolute inset-0"></div>
</div>
```

### Option 2: CSS for GIF Background

```css
.background-gif {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    object-fit: cover;
    object-position: center;
    z-index: 1;
    min-width: 100vw;
    min-height: 100vh;
}
```

## Recommendation

**For best quality and performance, I recommend:**
1. **Keep the video** - Better quality, smaller file size
2. **Convert .mov to .mp4** - Better browser support
3. **Use GIF only if** - Video doesn't work or you prefer simplicity

## Converting Video to GIF

If you want to convert your video to GIF:

### Online Tools:
- **EZGIF.com** - https://ezgif.com/video-to-gif
- **CloudConvert** - https://cloudconvert.com/mov-to-gif
- **FreeConvert** - https://www.freeconvert.com/mov-to-gif

### Command Line (if you have ffmpeg):
```bash
ffmpeg -i Video_Regeneration_and_Aesthetic_Adjustment.mov -vf "fps=10,scale=1920:-1:flags=lanczos" -c:v gif output.gif
```

## Current Status

The video background is now fixed to cover the full screen. If you want to switch to GIF, let me know and I'll update the code!

