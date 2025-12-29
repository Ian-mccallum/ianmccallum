// ============================================
// EXACT IMAGE BACKGROUND - Pixel Perfect Match
// ============================================

class ExactBackgroundSystem {
    constructor() {
        this.init();
    }

    init() {
        this.createSkyBase();
        this.createClouds();
        this.createCelestialSphere();
        this.createGreenHill();
        this.createCityOnHill();
        this.createWaterline();
        this.createUnderwaterLayer();
        this.createYellowCoral();
        this.createBubbles();
    }

    // Sky Base - Top 50%
    createSkyBase() {
        const skyBase = document.querySelector('.sky-base');
        if (!skyBase) return;
        
        skyBase.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 50%;
            background: linear-gradient(to bottom, 
                #87CEEB 0%,
                #00BFFF 30%,
                #1E90FF 60%,
                #4682B4 100%
            );
            z-index: 1;
        `;
    }

    // Clouds - Upper Left and Center
    createClouds() {
        const cloudsLayer = document.querySelector('.clouds-layer');
        if (!cloudsLayer) return;

        // Cloud 1 - Upper Left
        const cloud1 = document.querySelector('.cloud-1');
        if (cloud1) {
            cloud1.style.cssText = `
                position: absolute;
                top: 8%;
                left: 5%;
                width: 200px;
                height: 100px;
                background: rgba(255, 255, 255, 0.8);
                border-radius: 50px;
                filter: blur(40px);
                animation: cloudFloat1 40s linear infinite;
                z-index: 2;
            `;
        }

        // Cloud 2 - Center
        const cloud2 = document.querySelector('.cloud-2');
        if (cloud2) {
            cloud2.style.cssText = `
                position: absolute;
                top: 12%;
                left: 45%;
                width: 180px;
                height: 90px;
                background: rgba(255, 255, 255, 0.8);
                border-radius: 50px;
                filter: blur(40px);
                animation: cloudFloat2 45s linear infinite;
                z-index: 2;
            `;
        }

        // Add cloud animations
        this.addCloudAnimations();
    }

    addCloudAnimations() {
        const style = document.createElement('style');
        style.id = 'exact-cloud-animations';
        style.textContent = `
            @keyframes cloudFloat1 {
                0% { transform: translateX(0) translateY(0); }
                50% { transform: translateX(20px) translateY(-10px); }
                100% { transform: translateX(40px) translateY(0); }
            }
            
            @keyframes cloudFloat2 {
                0% { transform: translateX(0) translateY(0); }
                50% { transform: translateX(-15px) translateY(10px); }
                100% { transform: translateX(-30px) translateY(0); }
            }
        `;
        if (!document.getElementById('exact-cloud-animations')) {
            document.head.appendChild(style);
        }
    }

    // Large Celestial Sphere - Upper Right
    createCelestialSphere() {
        const sphere = document.querySelector('.celestial-sphere');
        if (!sphere) return;

        sphere.style.cssText = `
            position: absolute;
            top: 5%;
            right: 5%;
            width: 400px;
            height: 400px;
            border-radius: 50%;
            background: radial-gradient(circle at 30% 30%,
                rgba(135, 206, 235, 0.6) 0%,
                rgba(0, 191, 255, 0.4) 20%,
                rgba(30, 144, 255, 0.3) 40%,
                rgba(70, 130, 180, 0.2) 60%,
                transparent 80%
            );
            border: 3px solid rgba(255, 255, 255, 0.3);
            box-shadow: 
                inset -30px -30px 60px rgba(0, 0, 0, 0.2),
                inset 30px 30px 60px rgba(255, 255, 255, 0.3),
                0 0 80px rgba(0, 191, 255, 0.4),
                0 0 120px rgba(135, 206, 235, 0.3);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            z-index: 3;
            animation: sphereFloat 20s ease-in-out infinite;
        `;

        // Add sphere animation
        if (!document.getElementById('sphere-float-animation')) {
            const style = document.createElement('style');
            style.id = 'sphere-float-animation';
            style.textContent = `
                @keyframes sphereFloat {
                    0%, 100% { 
                        transform: translateY(0) rotateY(0deg) scale(1);
                        opacity: 0.8;
                    }
                    50% { 
                        transform: translateY(-20px) rotateY(15deg) scale(1.05);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Green Hill - Left Side Only
    createGreenHill() {
        const hill = document.querySelector('.green-hill-left');
        if (!hill) return;

        hill.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            width: 40%;
            height: 35%;
            background: linear-gradient(to top,
                #00C853 0%,
                #00FF7F 30%,
                #7FFF00 60%,
                #98FB98 100%
            );
            clip-path: polygon(
                0% 100%,
                0% 60%,
                10% 50%,
                25% 45%,
                40% 48%,
                50% 52%,
                60% 50%,
                75% 55%,
                90% 60%,
                100% 65%,
                100% 100%
            );
            z-index: 4;
            box-shadow: 
                inset 0 -20px 40px rgba(0, 0, 0, 0.1),
                0 0 60px rgba(0, 200, 83, 0.3);
        `;

        // Add grass texture
        const grassTexture = document.createElement('div');
        grassTexture.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 10%;
            background: repeating-linear-gradient(
                90deg,
                transparent,
                transparent 5px,
                rgba(0, 200, 83, 0.3) 5px,
                rgba(0, 200, 83, 0.3) 7px
            );
            pointer-events: none;
        `;
        hill.appendChild(grassTexture);
    }

    // City Skyline on Hill - Left Side
    createCityOnHill() {
        const cityContainer = document.querySelector('.city-on-hill');
        if (!cityContainer) return;

        cityContainer.style.cssText = `
            position: absolute;
            bottom: 35%;
            left: 2%;
            width: 35%;
            height: 20%;
            z-index: 5;
        `;

        // Create buildings
        const buildingCount = 8;
        const buildingWidth = 100 / buildingCount;
        
        for (let i = 0; i < buildingCount; i++) {
            const building = document.createElement('div');
            building.className = 'city-building';
            
            const height = 40 + Math.random() * 60;
            const left = i * buildingWidth;
            
            building.style.cssText = `
                position: absolute;
                bottom: 0;
                left: ${left}%;
                width: ${buildingWidth * 0.8}%;
                height: ${height}%;
                background: linear-gradient(to top,
                    rgba(40, 40, 60, 0.8) 0%,
                    rgba(60, 80, 100, 0.6) 50%,
                    rgba(100, 120, 140, 0.4) 100%
                );
                border-left: 2px solid rgba(255, 255, 255, 0.2);
                border-right: 2px solid rgba(0, 0, 0, 0.3);
                box-shadow: 
                    inset -10px 0 30px rgba(0, 0, 0, 0.3),
                    inset 10px 0 30px rgba(255, 255, 255, 0.2),
                    0 0 40px rgba(0, 191, 255, 0.3);
                clip-path: polygon(
                    0% 100%,
                    20% ${100 - height * 0.1}%,
                    50% ${100 - height * 0.2}%,
                    80% ${100 - height * 0.15}%,
                    100% 100%
                );
            `;
            
            // Add windows
            this.addBuildingWindows(building, buildingWidth * 0.8, height);
            
            cityContainer.appendChild(building);
        }
    }

    addBuildingWindows(building, width, height) {
        const windowRows = Math.floor(height / 15);
        const windowCols = 2;
        
        for (let row = 0; row < windowRows; row++) {
            for (let col = 0; col < windowCols; col++) {
                if (Math.random() > 0.4) {
                    const window = document.createElement('div');
                    window.style.cssText = `
                        position: absolute;
                        left: ${(col + 1) * (100 / (windowCols + 1)) - 3}%;
                        top: ${row * 15 + 5}%;
                        width: 6px;
                        height: 8px;
                        background: rgba(255, 255, 150, ${0.3 + Math.random() * 0.5});
                        border-radius: 1px;
                        animation: windowBlink ${3 + Math.random() * 4}s ease-in-out infinite;
                    `;
                    building.appendChild(window);
                }
            }
        }
    }

    // Waterline - Middle Horizontal
    createWaterline() {
        const waterline = document.querySelector('.waterline');
        if (!waterline) return;

        waterline.style.cssText = `
            position: absolute;
            top: 50%;
            left: 0;
            width: 100%;
            height: 2%;
            background: linear-gradient(to bottom,
                rgba(255, 255, 255, 0.4) 0%,
                rgba(0, 191, 255, 0.3) 50%,
                rgba(255, 255, 255, 0.4) 100%
            );
            z-index: 6;
            animation: waterlineSplash 3s ease-in-out infinite;
            box-shadow: 
                0 -5px 15px rgba(255, 255, 255, 0.3),
                0 5px 15px rgba(0, 191, 255, 0.3);
        `;

        // Add animation
        if (!document.getElementById('waterline-animation')) {
            const style = document.createElement('style');
            style.id = 'waterline-animation';
            style.textContent = `
                @keyframes waterlineSplash {
                    0%, 100% { 
                        transform: translateY(0);
                        opacity: 0.8;
                    }
                    50% { 
                        transform: translateY(-3px);
                        opacity: 1;
                    }
                }
                
                @keyframes windowBlink {
                    0%, 100% { opacity: 0.4; }
                    50% { opacity: 0.8; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Underwater Layer - Bottom 50%
    createUnderwaterLayer() {
        const underwater = document.querySelector('.underwater-layer');
        if (!underwater) return;

        underwater.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 50%;
            background: linear-gradient(to bottom,
                rgba(0, 191, 255, 0.5) 0%,
                rgba(30, 144, 255, 0.6) 30%,
                rgba(0, 100, 200, 0.7) 60%,
                rgba(0, 50, 150, 0.8) 100%
            );
            z-index: 3;
        `;
    }

    // Yellow Coral - Bottom Right
    createYellowCoral() {
        const coral = document.querySelector('.yellow-coral');
        if (!coral) return;

        coral.style.cssText = `
            position: absolute;
            bottom: 5%;
            right: 10%;
            width: 150px;
            height: 200px;
            background: 
                radial-gradient(ellipse at 30% 80%, rgba(255, 255, 0, 0.6) 0%, transparent 50%),
                radial-gradient(ellipse at 70% 60%, rgba(255, 220, 0, 0.5) 0%, transparent 50%),
                radial-gradient(ellipse at 50% 40%, rgba(255, 200, 0, 0.4) 0%, transparent 50%);
            clip-path: polygon(
                30% 100%, 25% 80%, 20% 60%, 25% 40%, 30% 20%,
                50% 10%, 70% 20%, 75% 40%, 80% 60%, 75% 80%, 70% 100%
            );
            z-index: 3;
            filter: blur(2px);
            animation: coralSway 8s ease-in-out infinite;
        `;

        // Add animation
        if (!document.getElementById('coral-animation')) {
            const style = document.createElement('style');
            style.id = 'coral-animation';
            style.textContent = `
                @keyframes coralSway {
                    0%, 100% { transform: translateX(0) rotate(0deg); }
                    25% { transform: translateX(3px) rotate(1deg); }
                    75% { transform: translateX(-3px) rotate(-1deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Glass Bubbles - 4 Exact Positions
    createBubbles() {
        const bubbles = [
            {
                element: document.querySelector('.bubble-large.bubble-near-city'),
                top: '25%',
                left: '8%',
                width: '120px',
                height: '120px',
                delay: '0s'
            },
            {
                element: document.querySelector('.bubble-small.bubble-above-water-1'),
                top: '45%',
                left: '55%',
                width: '60px',
                height: '60px',
                delay: '2s'
            },
            {
                element: document.querySelector('.bubble-small.bubble-above-water-2'),
                top: '48%',
                left: '65%',
                width: '50px',
                height: '50px',
                delay: '4s'
            },
            {
                element: document.querySelector('.bubble-small.bubble-underwater'),
                top: '55%',
                left: '50%',
                width: '40px',
                height: '40px',
                delay: '1s'
            }
        ];

        bubbles.forEach((bubble, index) => {
            if (!bubble.element) return;

            bubble.element.style.cssText = `
                position: absolute;
                top: ${bubble.top};
                left: ${bubble.left};
                width: ${bubble.width};
                height: ${bubble.height};
                background: radial-gradient(circle at 30% 30%, 
                    rgba(255, 255, 255, 0.4) 0%, 
                    rgba(255, 255, 255, 0.1) 50%, 
                    rgba(255, 255, 255, 0.05) 100%
                );
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                backdrop-filter: blur(2px);
                -webkit-backdrop-filter: blur(2px);
                box-shadow: 
                    0 0 20px rgba(255, 255, 255, 0.3),
                    inset -10px -10px 20px rgba(0, 0, 0, 0.1),
                    inset 20px 20px 30px rgba(255, 255, 255, 0.4);
                z-index: ${index < 2 ? 7 : 4};
                animation: bubbleFloat${index + 1} ${20 + index * 5}s ease-in-out infinite;
                animation-delay: ${bubble.delay};
            `;

            // Add bubble animations
            this.addBubbleAnimation(index + 1, 20 + index * 5);
        });
    }

    addBubbleAnimation(index, duration) {
        if (document.getElementById(`bubble-animation-${index}`)) return;

        const style = document.createElement('style');
        style.id = `bubble-animation-${index}`;
        style.textContent = `
            @keyframes bubbleFloat${index} {
                0% {
                    transform: translateY(0) translateX(0) scale(0.8) rotate(0deg);
                    opacity: 0.6;
                }
                50% {
                    transform: translateY(${index % 2 === 0 ? '-20px' : '20px'}) translateX(${index * 10}px) scale(1.2) rotate(180deg);
                    opacity: 0.9;
                }
                100% {
                    transform: translateY(0) translateX(0) scale(0.8) rotate(360deg);
                    opacity: 0.6;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.exactBackground = new ExactBackgroundSystem();
});

