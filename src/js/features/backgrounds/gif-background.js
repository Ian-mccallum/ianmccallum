// ============================================
// GIF BACKGROUND HANDLER
// Manages the Frutiger Aero GIF background
// ============================================

class GIFBackgroundHandler {
    constructor() {
        this.gif = document.getElementById('background-gif');
        this.init();
    }

    init() {
        if (!this.gif) return;

        // Force GIF to cover full screen
        this.forceFullCoverage();

        // Handle image load
        this.gif.addEventListener('load', () => {
            this.forceFullCoverage();
            console.log('GIF background loaded successfully');
        });

        // Handle image errors
        this.gif.addEventListener('error', (e) => {
            console.error('GIF error:', e);
            this.handleGIFError();
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            this.forceFullCoverage();
        });

        // Ensure GIF is set to cover
        this.gif.style.imageRendering = 'high-quality';
    }

    forceFullCoverage() {
        if (!this.gif) return;

        // Force full viewport coverage
        this.gif.style.cssText = `
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
            user-select: none;
            -webkit-user-select: none;
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

    handleGIFError() {
        // If GIF fails to load, show fallback
        const container = document.getElementById('frutiger-background');
        if (container) {
            container.style.background = `
                linear-gradient(to bottom, 
                    #87CEEB 0%,
                    #00BFFF 30%,
                    #1E90FF 60%,
                    #4682B4 100%
                )
            `;
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.gifBackground = new GIFBackgroundHandler();
});

