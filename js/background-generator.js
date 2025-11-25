// ============================================
// DYNAMIC BACKGROUND GENERATOR
// Creates a video-like animated Frutiger Aero background
// ============================================

class FrutigerBackgroundGenerator {
    constructor() {
        this.canvas = document.getElementById('backgroundCanvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.animationId = null;
        this.time = 0;
        this.clouds = [];
        this.waterOffset = 0;
        
        this.init();
    }
    
    init() {
        this.resizeCanvas();
        this.createClouds();
        this.animate();
        
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.draw();
    }
    
    createClouds() {
        this.clouds = [];
        for (let i = 0; i < 8; i++) {
            this.clouds.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * (this.canvas.height * 0.4) + 50,
                size: 150 + Math.random() * 100,
                speed: 0.2 + Math.random() * 0.3,
                opacity: 0.6 + Math.random() * 0.3,
                offset: Math.random() * Math.PI * 2
            });
        }
    }
    
    drawSky() {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(0.25, '#00BFFF');
        gradient.addColorStop(0.5, '#1E90FF');
        gradient.addColorStop(0.75, '#4682B4');
        gradient.addColorStop(1, '#5F9EA0');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    drawClouds() {
        this.clouds.forEach(cloud => {
            cloud.x += cloud.speed;
            if (cloud.x > this.canvas.width + cloud.size) {
                cloud.x = -cloud.size;
            }
            
            const yOffset = Math.sin(this.time * 0.5 + cloud.offset) * 10;
            
            this.ctx.save();
            this.ctx.globalAlpha = cloud.opacity;
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            
            // Draw cloud with multiple circles for realistic shape
            this.ctx.beginPath();
            this.ctx.arc(cloud.x, cloud.y + yOffset, cloud.size * 0.4, 0, Math.PI * 2);
            this.ctx.arc(cloud.x + cloud.size * 0.3, cloud.y + yOffset, cloud.size * 0.5, 0, Math.PI * 2);
            this.ctx.arc(cloud.x + cloud.size * 0.6, cloud.y + yOffset, cloud.size * 0.4, 0, Math.PI * 2);
            this.ctx.arc(cloud.x + cloud.size * 0.4, cloud.y + yOffset - cloud.size * 0.2, cloud.size * 0.35, 0, Math.PI * 2);
            this.ctx.arc(cloud.x + cloud.size * 0.7, cloud.y + yOffset - cloud.size * 0.15, cloud.size * 0.3, 0, Math.PI * 2);
            
            // Apply blur effect
            this.ctx.filter = 'blur(30px)';
            this.ctx.fill();
            this.ctx.filter = 'none';
            
            this.ctx.restore();
        });
    }
    
    drawCity() {
        const cityY = this.canvas.height * 0.35;
        const cityHeight = this.canvas.height * 0.15;
        
        // Create futuristic city skyline
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        this.ctx.beginPath();
        
        const buildingCount = 15;
        const buildingWidth = this.canvas.width / buildingCount;
        
        for (let i = 0; i < buildingCount; i++) {
            const x = i * buildingWidth;
            const height = cityHeight * (0.4 + Math.random() * 0.6);
            const width = buildingWidth * (0.6 + Math.random() * 0.4);
            
            // Building shape with some variation
            this.ctx.rect(x, cityY, width, height);
            
            // Add windows
            this.ctx.fillStyle = 'rgba(255, 255, 200, 0.3)';
            const windowRows = Math.floor(height / 20);
            const windowCols = 3;
            
            for (let row = 0; row < windowRows; row++) {
                for (let col = 0; col < windowCols; col++) {
                    if (Math.random() > 0.3) { // Some windows are lit
                        this.ctx.fillRect(
                            x + (col + 1) * (width / (windowCols + 1)) - 3,
                            cityY + row * 20 + 5,
                            6,
                            8
                        );
                    }
                }
            }
            
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        }
        
        this.ctx.fill();
        
        // Add glow effect
        const glowGradient = this.ctx.createLinearGradient(0, cityY, 0, cityY + cityHeight);
        glowGradient.addColorStop(0, 'rgba(0, 191, 255, 0.2)');
        glowGradient.addColorStop(1, 'transparent');
        this.ctx.fillStyle = glowGradient;
        this.ctx.fillRect(0, cityY, this.canvas.width, cityHeight);
    }
    
    drawWater() {
        const waterY = this.canvas.height * 0.25;
        const waterHeight = this.canvas.height * 0.15;
        
        this.waterOffset += 0.02;
        
        // Base water color
        const waterGradient = this.ctx.createLinearGradient(0, waterY, 0, waterY + waterHeight);
        waterGradient.addColorStop(0, 'rgba(0, 191, 255, 0.4)');
        waterGradient.addColorStop(0.5, 'rgba(30, 144, 255, 0.5)');
        waterGradient.addColorStop(1, 'rgba(0, 191, 255, 0.3)');
        
        this.ctx.fillStyle = waterGradient;
        this.ctx.beginPath();
        
        // Create flowing wave pattern
        this.ctx.moveTo(0, waterY + waterHeight);
        
        for (let x = 0; x <= this.canvas.width; x += 2) {
            const wave1 = Math.sin(x * 0.02 + this.waterOffset) * 15;
            const wave2 = Math.sin(x * 0.04 + this.waterOffset * 1.5) * 8;
            const wave3 = Math.sin(x * 0.01 + this.waterOffset * 0.8) * 5;
            const y = waterY + waterHeight / 2 + wave1 + wave2 + wave3;
            this.ctx.lineTo(x, y);
        }
        
        this.ctx.lineTo(this.canvas.width, waterY + waterHeight);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Add flowing highlights
        for (let i = 0; i < 3; i++) {
            const highlightX = ((this.waterOffset * 50 + i * this.canvas.width / 3) % (this.canvas.width + 200)) - 100;
            const waveY = waterY + waterHeight / 2 + Math.sin(highlightX * 0.02 + this.waterOffset) * 15;
            
            const highlightGradient = this.ctx.createRadialGradient(
                highlightX, waveY, 0,
                highlightX, waveY, 100
            );
            highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
            highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            this.ctx.fillStyle = highlightGradient;
            this.ctx.beginPath();
            this.ctx.arc(highlightX, waveY, 80, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // Add ripples
        for (let i = 0; i < 5; i++) {
            const rippleX = ((this.waterOffset * 30 + i * this.canvas.width / 5) % (this.canvas.width + 150)) - 75;
            const rippleY = waterY + waterHeight / 2 + Math.sin(rippleX * 0.02 + this.waterOffset) * 15;
            
            this.ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 - i * 0.05})`;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(rippleX, rippleY, 20 + i * 15, 0, Math.PI * 2);
            this.ctx.stroke();
        }
    }
    
    drawHills() {
        const hillBaseY = this.canvas.height * 0.25;
        
        // Hill 1 - Foreground
        this.ctx.fillStyle = '#00C853';
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvas.height);
        
        for (let x = 0; x <= this.canvas.width; x += 5) {
            const wave1 = Math.sin(x * 0.01 + this.time * 0.1) * 20;
            const wave2 = Math.sin(x * 0.005 + this.time * 0.15) * 10;
            const y = hillBaseY + wave1 + wave2;
            this.ctx.lineTo(x, y);
        }
        
        this.ctx.lineTo(this.canvas.width, this.canvas.height);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Add grass texture
        this.ctx.fillStyle = '#00FF7F';
        for (let i = 0; i < 20; i++) {
            const x = (i * this.canvas.width / 20) + Math.random() * 50;
            const y = hillBaseY + Math.sin(x * 0.01) * 20 + 30;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 15 + Math.random() * 10, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // Hill 2 - Midground
        this.ctx.fillStyle = '#228B22';
        this.ctx.globalAlpha = 0.9;
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvas.height);
        
        for (let x = 0; x <= this.canvas.width; x += 5) {
            const wave1 = Math.sin(x * 0.008 + this.time * 0.12) * 15;
            const wave2 = Math.sin(x * 0.004 + this.time * 0.18) * 8;
            const y = hillBaseY * 0.9 + wave1 + wave2;
            this.ctx.lineTo(x, y);
        }
        
        this.ctx.lineTo(this.canvas.width, this.canvas.height);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
        
        // Hill 3 - Background
        this.ctx.fillStyle = '#2F4F2F';
        this.ctx.globalAlpha = 0.7;
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvas.height);
        
        for (let x = 0; x <= this.canvas.width; x += 5) {
            const wave1 = Math.sin(x * 0.006 + this.time * 0.14) * 12;
            const wave2 = Math.sin(x * 0.003 + this.time * 0.2) * 6;
            const y = hillBaseY * 0.8 + wave1 + wave2;
            this.ctx.lineTo(x, y);
        }
        
        this.ctx.lineTo(this.canvas.width, this.canvas.height);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
    }
    
    drawLightRays() {
        const gradient = this.ctx.createRadialGradient(
            this.canvas.width / 2, this.canvas.height * 0.2, 0,
            this.canvas.width / 2, this.canvas.height * 0.2, this.canvas.height * 0.6
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
        gradient.addColorStop(1, 'transparent');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawSky();
        this.drawClouds();
        this.drawCity();
        this.drawWater();
        this.drawHills();
        this.drawLightRays();
    }
    
    animate() {
        this.time += 0.016; // ~60fps
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.frutigerBackground = new FrutigerBackgroundGenerator();
});

