// ============================================
// FRUTIGER AERO REALISTIC BACKGROUND GENERATOR
// ============================================

(function() {
    const canvas = document.getElementById('frutigerBackgroundCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;
    
    // Resize canvas to full screen
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        drawScene();
    }
    
    // Draw realistic Frutiger Aero scene
    function drawScene() {
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // ============================================
        // SKY GRADIENT (Frutiger Aero Blue)
        // ============================================
        const skyGradient = ctx.createLinearGradient(0, 0, 0, height * 0.6);
        skyGradient.addColorStop(0, '#87CEEB');    // Sky Blue
        skyGradient.addColorStop(0.3, '#00BFFF');  // Deep Sky Blue
        skyGradient.addColorStop(0.6, '#1E90FF');  // Dodger Blue
        skyGradient.addColorStop(1, '#4682B4');    // Steel Blue
        
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, width, height * 0.6);
        
        // ============================================
        // REALISTIC CLOUDS (Photorealistic)
        // ============================================
        drawClouds(width, height);
        
        // ============================================
        // DISTANT FUTURISTIC CITY
        // ============================================
        drawCity(width, height);
        
        // ============================================
        // OCEAN/WATER (Realistic with reflections)
        // ============================================
        drawOcean(width, height);
        
        // ============================================
        // ROLLING GREEN HILLS (Bliss-style)
        // ============================================
        drawHills(width, height);
        
        // ============================================
        // ATMOSPHERIC EFFECTS
        // ============================================
        drawAtmosphere(width, height);
    }
    
    // Draw photorealistic clouds with better positioning
    function drawClouds(width, height) {
        const cloudCount = 10;
        const cloudSpeed = 0.25;
        
        // Predefined cloud positions for better composition
        const cloudPositions = [
            { x: 0, y: 0.08, size: 180, speed: 1.0 },
            { x: 0.15, y: 0.12, size: 220, speed: 0.8 },
            { x: 0.3, y: 0.15, size: 160, speed: 1.2 },
            { x: 0.45, y: 0.1, size: 200, speed: 0.9 },
            { x: 0.6, y: 0.18, size: 240, speed: 0.7 },
            { x: 0.75, y: 0.14, size: 190, speed: 1.1 },
            { x: 0.2, y: 0.25, size: 170, speed: 1.0 },
            { x: 0.5, y: 0.22, size: 210, speed: 0.85 },
            { x: 0.8, y: 0.2, size: 185, speed: 0.95 },
            { x: 0.35, y: 0.28, size: 195, speed: 1.05 }
        ];
        
        for (let i = 0; i < cloudCount; i++) {
            const pos = cloudPositions[i];
            const cloudX = (time * cloudSpeed * pos.speed * 50 + pos.x * width) % (width + 500) - 250;
            const cloudY = height * pos.y;
            
            drawRealisticCloud(cloudX, cloudY, pos.size, 0.9);
        }
    }
    
    // Draw a single realistic cloud with enhanced Frutiger Aero style
    function drawRealisticCloud(x, y, size, opacity) {
        ctx.save();
        ctx.globalAlpha = opacity;
        
        // Enhanced cloud puffs for more realistic appearance
        const puffs = [
            { x: 0, y: 0, r: size, intensity: 0.95 },
            { x: size * 0.45, y: -size * 0.25, r: size * 0.75, intensity: 0.9 },
            { x: -size * 0.35, y: size * 0.12, r: size * 0.65, intensity: 0.85 },
            { x: size * 0.65, y: size * 0.18, r: size * 0.7, intensity: 0.88 },
            { x: -size * 0.25, y: -size * 0.18, r: size * 0.55, intensity: 0.82 },
            { x: size * 0.3, y: size * 0.25, r: size * 0.5, intensity: 0.8 },
            { x: -size * 0.15, y: -size * 0.1, r: size * 0.45, intensity: 0.75 }
        ];
        
        // Draw each cloud puff with soft edges
        puffs.forEach(puff => {
            const puffGradient = ctx.createRadialGradient(
                x + puff.x, y + puff.y, 0,
                x + puff.x, y + puff.y, puff.r
            );
            puffGradient.addColorStop(0, `rgba(255, 255, 255, ${puff.intensity})`);
            puffGradient.addColorStop(0.3, `rgba(255, 255, 255, ${puff.intensity * 0.9})`);
            puffGradient.addColorStop(0.6, `rgba(255, 255, 255, ${puff.intensity * 0.6})`);
            puffGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            ctx.fillStyle = puffGradient;
            ctx.beginPath();
            ctx.arc(x + puff.x, y + puff.y, puff.r, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // Add subtle shadow for depth
        ctx.globalAlpha = opacity * 0.3;
        const shadowGradient = ctx.createRadialGradient(
            x, y + size * 0.3, 0,
            x, y + size * 0.3, size * 1.2
        );
        shadowGradient.addColorStop(0, 'rgba(100, 150, 200, 0.2)');
        shadowGradient.addColorStop(1, 'rgba(100, 150, 200, 0)');
        ctx.fillStyle = shadowGradient;
        ctx.beginPath();
        ctx.arc(x, y + size * 0.3, size * 1.2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    // Draw distant futuristic city
    function drawCity(width, height) {
        const cityY = height * 0.4;
        const cityHeight = height * 0.15;
        const buildingCount = 20;
        
        ctx.save();
        ctx.globalAlpha = 0.5;
        
        // City silhouette gradient
        const cityGradient = ctx.createLinearGradient(0, cityY, 0, cityY + cityHeight);
        cityGradient.addColorStop(0, 'rgba(20, 40, 80, 0.6)');
        cityGradient.addColorStop(0.5, 'rgba(30, 60, 100, 0.4)');
        cityGradient.addColorStop(1, 'rgba(40, 80, 120, 0.2)');
        
        ctx.fillStyle = cityGradient;
        
        // Draw buildings with varied heights
        for (let i = 0; i < buildingCount; i++) {
            const buildingX = (width / buildingCount) * i;
            const buildingWidth = width / buildingCount * 0.8;
            const buildingHeight = cityHeight * (0.4 + Math.random() * 0.6);
            
            // Building shape with some variation
            ctx.beginPath();
            ctx.moveTo(buildingX, cityY + cityHeight);
            ctx.lineTo(buildingX + buildingWidth * 0.3, cityY + cityHeight - buildingHeight);
            ctx.lineTo(buildingX + buildingWidth * 0.7, cityY + cityHeight - buildingHeight * 0.9);
            ctx.lineTo(buildingX + buildingWidth, cityY + cityHeight);
            ctx.closePath();
            ctx.fill();
            
            // Add some lit windows
            if (Math.random() > 0.3) {
                ctx.fillStyle = 'rgba(255, 255, 150, 0.4)';
                const windowY = cityY + cityHeight - buildingHeight * 0.3;
                ctx.fillRect(buildingX + buildingWidth * 0.2, windowY, buildingWidth * 0.15, buildingHeight * 0.1);
            }
            ctx.fillStyle = cityGradient;
        }
        
        ctx.restore();
    }
    
    // Draw realistic ocean with flowing water
    function drawOcean(width, height) {
        const oceanY = height * 0.55;
        const oceanHeight = height * 0.15;
        
        // Ocean base gradient
        const oceanGradient = ctx.createLinearGradient(0, oceanY, 0, oceanY + oceanHeight);
        oceanGradient.addColorStop(0, 'rgba(0, 191, 255, 0.6)');
        oceanGradient.addColorStop(0.5, 'rgba(30, 144, 255, 0.7)');
        oceanGradient.addColorStop(1, 'rgba(0, 100, 200, 0.5)');
        
        // Draw water with waves
        ctx.beginPath();
        ctx.moveTo(0, oceanY + oceanHeight);
        
        const waveFrequency = 0.01;
        const waveAmplitude = 8;
        const waveSpeed = time * 0.5;
        
        for (let x = 0; x <= width; x += 2) {
            const y = oceanY + 
                Math.sin(x * waveFrequency + waveSpeed) * waveAmplitude +
                Math.sin(x * waveFrequency * 2 + waveSpeed * 1.5) * (waveAmplitude * 0.5) +
                Math.sin(x * waveFrequency * 0.5 + waveSpeed * 0.8) * (waveAmplitude * 0.3);
            ctx.lineTo(x, y);
        }
        
        ctx.lineTo(width, oceanY + oceanHeight);
        ctx.closePath();
        ctx.fillStyle = oceanGradient;
        ctx.fill();
        
        // Add water highlights and reflections
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        for (let i = 0; i < 5; i++) {
            const highlightX = (time * 30 + i * width / 5) % (width + 200) - 100;
            const highlightY = oceanY + Math.sin(highlightX * waveFrequency + waveSpeed) * waveAmplitude;
            
            const highlightGradient = ctx.createRadialGradient(
                highlightX, highlightY, 0,
                highlightX, highlightY, 100
            );
            highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
            highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            ctx.fillStyle = highlightGradient;
            ctx.beginPath();
            ctx.arc(highlightX, highlightY, 80, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Add ripples
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 8; i++) {
            const rippleX = (time * 20 + i * width / 8) % (width + 150) - 75;
            const rippleY = oceanY + Math.sin(rippleX * waveFrequency + waveSpeed) * waveAmplitude;
            
            ctx.beginPath();
            ctx.arc(rippleX, rippleY, 15 + i * 8, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
    
    // Draw rolling green hills (Bliss-style) - NOT covering whole ground
    function drawHills(width, height) {
        const hillStartY = height * 0.65; // Start higher so hills don't cover everything
        
        // Hill 1 - Foreground (most prominent, but only bottom 25%)
        drawHill(0, hillStartY, width, height * 0.25, 
            ['#00C853', '#00FF7F', '#7FFF00', '#98FB98'], 0.95);
        
        // Hill 2 - Mid-ground
        drawHill(-width * 0.02, hillStartY + height * 0.04, width * 1.04, height * 0.2,
            ['#228B22', '#00C853', '#00FF7F', '#7FFF00'], 0.88);
        
        // Hill 3 - Background (distant)
        drawHill(-width * 0.01, hillStartY + height * 0.08, width * 1.02, height * 0.15,
            ['#2F4F2F', '#228B22', '#00C853', '#00FF7F'], 0.78);
    }
    
    // Draw a single hill with enhanced Frutiger Aero style
    function drawHill(offsetX, startY, hillWidth, hillHeight, colors, opacity) {
        ctx.save();
        ctx.globalAlpha = opacity;
        
        // Enhanced hill gradient with more color stops
        const hillGradient = ctx.createLinearGradient(0, startY, 0, startY + hillHeight);
        colors.forEach((color, index) => {
            hillGradient.addColorStop(index / (colors.length - 1), color);
        });
        
        ctx.fillStyle = hillGradient;
        ctx.beginPath();
        ctx.moveTo(offsetX, startY + hillHeight);
        
        // Create more natural rolling hill shape (Bliss-style)
        const points = 80; // More points for smoother curves
        for (let i = 0; i <= points; i++) {
            const x = offsetX + (hillWidth / points) * i;
            const baseY = startY + hillHeight;
            // Multiple sine waves for natural rolling effect
            const wave1 = Math.sin(i / points * Math.PI * 2.5) * (hillHeight * 0.12);
            const wave2 = Math.sin(i / points * Math.PI * 5) * (hillHeight * 0.06);
            const wave3 = Math.sin(i / points * Math.PI * 8) * (hillHeight * 0.03);
            const y = baseY - (hillHeight * (1 - i / points)) - wave1 - wave2 - wave3;
            ctx.lineTo(x, y);
        }
        
        ctx.lineTo(offsetX + hillWidth, startY + hillHeight);
        ctx.closePath();
        ctx.fill();
        
        // Add glossy highlight (Frutiger Aero style)
        const highlightGradient = ctx.createLinearGradient(0, startY, 0, startY + hillHeight * 0.3);
        highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
        highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = highlightGradient;
        ctx.fill();
        
        // Add grass texture with varied sizes
        ctx.fillStyle = 'rgba(0, 200, 83, 0.25)';
        for (let i = 0; i < 50; i++) {
            const x = offsetX + Math.random() * hillWidth;
            const y = startY + Math.random() * hillHeight * 0.7; // Only on top portion
            const size = 1.5 + Math.random() * 2.5;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Add some brighter grass highlights
        ctx.fillStyle = 'rgba(127, 255, 0, 0.2)';
        for (let i = 0; i < 15; i++) {
            const x = offsetX + Math.random() * hillWidth;
            const y = startY + Math.random() * hillHeight * 0.6;
            ctx.beginPath();
            ctx.arc(x, y, 1.5, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
    
    // Draw atmospheric effects
    function drawAtmosphere(width, height) {
        // Light rays from top
        const rayGradient = ctx.createRadialGradient(
            width * 0.5, height * 0.2, 0,
            width * 0.5, height * 0.2, height * 0.6
        );
        rayGradient.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
        rayGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = rayGradient;
        ctx.fillRect(0, 0, width, height * 0.6);
        
        // Atmospheric haze
        const hazeGradient = ctx.createLinearGradient(0, 0, 0, height);
        hazeGradient.addColorStop(0, 'rgba(135, 206, 235, 0.1)');
        hazeGradient.addColorStop(1, 'rgba(135, 206, 235, 0)');
        
        ctx.fillStyle = hazeGradient;
        ctx.fillRect(0, 0, width, height);
    }
    
    // Animation loop
    function animate() {
        time += 0.016; // ~60fps
        drawScene();
        animationId = requestAnimationFrame(animate);
    }
    
    // Initialize
    resizeCanvas();
    animate();
    
    // Handle resize
    window.addEventListener('resize', () => {
        resizeCanvas();
    });
})();

