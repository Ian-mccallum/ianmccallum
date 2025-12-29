// ============================================
// VIDEO BACKGROUND HANDLER
// Manages the Frutiger Aero video background
// ============================================

class VideoBackgroundHandler {
    constructor() {
        this.video = document.getElementById('background-video');
        this.init();
    }

    init() {
        if (!this.video) return;

        // Force video to cover full screen
        this.forceFullCoverage();

        // Ensure video plays
        this.video.addEventListener('loadedmetadata', () => {
            this.forceFullCoverage();
            this.video.play().catch(err => {
                console.log('Video autoplay prevented:', err);
                // Try to play on user interaction
                document.addEventListener('click', () => {
                    this.video.play();
                }, { once: true });
            });
        });

        // Handle video errors
        this.video.addEventListener('error', (e) => {
            console.error('Video error:', e);
            this.handleVideoError();
        });

        // Ensure video loops
        this.video.loop = true;
        this.video.muted = true;
        this.video.playsInline = true;

        // Preload video
        this.video.preload = 'auto';

        // Handle window resize
        window.addEventListener('resize', () => {
            this.forceFullCoverage();
        });
    }

    forceFullCoverage() {
        if (!this.video) return;

        // Force full viewport coverage
        this.video.style.cssText = `
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
        `;

        // Ensure parent container is full screen
        const container = document.getElementById('frutiger-background');
        if (container) {
            container.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                z-index: 0;
                overflow: hidden;
                pointer-events: none;
            `;
        }
    }

    handleVideoError() {
        // If video fails to load, show fallback
        const fallback = document.querySelector('.video-fallback');
        if (fallback) {
            fallback.style.cssText = `
                position: absolute;
                inset: 0;
                background: linear-gradient(to bottom, 
                    #87CEEB 0%,
                    #00BFFF 30%,
                    #1E90FF 60%,
                    #4682B4 100%
                );
                z-index: 1;
            `;
        }
    }

    // Method to pause/play video (for performance)
    pause() {
        if (this.video) this.video.pause();
    }

    play() {
        if (this.video) {
            this.video.play().catch(err => {
                console.log('Video play error:', err);
            });
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.videoBackground = new VideoBackgroundHandler();
});

// Pause video when page is hidden (for performance)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (window.videoBackground) window.videoBackground.pause();
    } else {
        if (window.videoBackground) window.videoBackground.play();
    }
});
