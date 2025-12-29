// ============================================
// 3D CLOWNFISH - Exact Match to Image
// Orange with white stripes, black outline
// ============================================

class Clownfish3D {
    constructor() {
        this.container = document.querySelector('.clownfish-3d');
        if (!this.container) return;
        
        this.create3DFish();
        this.addAnimations();
    }
    
    create3DFish() {
        // Main fish container
        this.container.style.cssText = `
            position: absolute;
            bottom: 15%;
            left: 10%;
            width: 120px;
            height: 80px;
            z-index: 4;
            transform-style: preserve-3d;
            animation: clownfishSwim 15s ease-in-out infinite;
        `;
        
        // Fish body - orange with white stripes
        const body = document.createElement('div');
        body.className = 'clownfish-body';
        body.style.cssText = `
            position: absolute;
            width: 100px;
            height: 60px;
            background: linear-gradient(135deg,
                #FF8C00 0%,
                #FF6B35 20%,
                #FF8C00 40%,
                #FF6B35 60%,
                #FF8C00 80%,
                #FF6B35 100%
            );
            border-radius: 50% 40% 40% 50%;
            border: 2px solid #000;
            box-shadow: 
                inset -5px 0 10px rgba(0, 0, 0, 0.3),
                inset 5px 0 10px rgba(255, 255, 255, 0.3),
                0 2px 8px rgba(0, 0, 0, 0.4),
                0 0 15px rgba(255, 140, 0, 0.3);
            transform-style: preserve-3d;
            position: relative;
        `;
        
        // White stripes with black outline (3 stripes)
        const stripePositions = [25, 45, 65]; // Percentage from left
        stripePositions.forEach((pos, i) => {
            const stripe = document.createElement('div');
            stripe.className = `clownfish-stripe stripe-${i + 1}`;
            stripe.style.cssText = `
                position: absolute;
                left: ${pos}%;
                top: 10%;
                width: 10px;
                height: 80%;
                background: #FFFFFF;
                border: 1.5px solid #000;
                border-radius: 5px;
                transform: rotate(${-3 + i * 2}deg);
                box-shadow: 
                    inset 0 0 5px rgba(0, 0, 0, 0.2),
                    0 0 3px rgba(255, 255, 255, 0.5);
            `;
            body.appendChild(stripe);
        });
        
        // Tail fin - orange with black outline
        const tail = document.createElement('div');
        tail.className = 'clownfish-tail';
        tail.style.cssText = `
            position: absolute;
            right: -18px;
            top: 50%;
            transform: translateY(-50%);
            width: 0;
            height: 0;
            border-top: 22px solid transparent;
            border-bottom: 22px solid transparent;
            border-left: 28px solid #FF6B35;
            filter: drop-shadow(2px 0 4px rgba(0, 0, 0, 0.4));
            animation: tailWiggle 0.3s ease-in-out infinite;
            z-index: 1;
        `;
        
        // Tail outline
        const tailOutline = document.createElement('div');
        tailOutline.style.cssText = `
            position: absolute;
            right: -20px;
            top: 50%;
            transform: translateY(-50%);
            width: 0;
            height: 0;
            border-top: 24px solid transparent;
            border-bottom: 24px solid transparent;
            border-left: 30px solid #000;
            z-index: 0;
            opacity: 0.3;
        `;
        tail.appendChild(tailOutline);
        body.appendChild(tail);
        
        // Eye - white with black pupil
        const eye = document.createElement('div');
        eye.className = 'clownfish-eye';
        eye.style.cssText = `
            position: absolute;
            left: 15px;
            top: 50%;
            transform: translateY(-50%);
            width: 14px;
            height: 14px;
            background: #FFFFFF;
            border: 2px solid #000;
            border-radius: 50%;
            box-shadow: 
                inset -2px -2px 4px rgba(255, 255, 255, 0.5),
                0 0 4px rgba(255, 255, 255, 0.8),
                0 0 8px rgba(0, 0, 0, 0.3);
            z-index: 10;
        `;
        
        const pupil = document.createElement('div');
        pupil.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 7px;
            height: 7px;
            background: #000;
            border-radius: 50%;
            box-shadow: inset 0 0 2px rgba(255, 255, 255, 0.3);
        `;
        eye.appendChild(pupil);
        body.appendChild(eye);
        
        // Top fin
        const topFin = document.createElement('div');
        topFin.className = 'clownfish-fin-top';
        topFin.style.cssText = `
            position: absolute;
            left: 25px;
            top: -10px;
            width: 0;
            height: 0;
            border-left: 12px solid transparent;
            border-right: 12px solid transparent;
            border-bottom: 18px solid rgba(255, 140, 0, 0.9);
            filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.3));
            animation: finMove 0.4s ease-in-out infinite;
            z-index: 2;
        `;
        body.appendChild(topFin);
        
        // Bottom fin
        const bottomFin = document.createElement('div');
        bottomFin.className = 'clownfish-fin-bottom';
        bottomFin.style.cssText = `
            position: absolute;
            left: 30px;
            bottom: -10px;
            width: 0;
            height: 0;
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
            border-top: 15px solid rgba(255, 140, 0, 0.9);
            filter: drop-shadow(0 -2px 3px rgba(0, 0, 0, 0.3));
            animation: finMove 0.5s ease-in-out infinite 0.1s;
            z-index: 2;
        `;
        body.appendChild(bottomFin);
        
        // Add scale texture
        const scaleTexture = document.createElement('div');
        scaleTexture.style.cssText = `
            position: absolute;
            top: 15%;
            left: 20%;
            width: 60%;
            height: 70%;
            background: repeating-linear-gradient(
                45deg,
                transparent,
                transparent 8px,
                rgba(255, 255, 255, 0.1) 8px,
                rgba(255, 255, 255, 0.1) 10px
            );
            border-radius: 50%;
            opacity: 0.3;
            pointer-events: none;
        `;
        body.appendChild(scaleTexture);
        
        this.container.appendChild(body);
    }
    
    addAnimations() {
        if (document.getElementById('clownfish-animations')) return;

        const style = document.createElement('style');
        style.id = 'clownfish-animations';
        style.textContent = `
            @keyframes clownfishSwim {
                0% { 
                    transform: translateX(0) translateY(0) rotateY(0deg) rotateZ(0deg);
                }
                25% { 
                    transform: translateX(15vw) translateY(-10px) rotateY(5deg) rotateZ(2deg);
                }
                50% { 
                    transform: translateX(30vw) translateY(5px) rotateY(0deg) rotateZ(0deg);
                }
                75% { 
                    transform: translateX(45vw) translateY(-8px) rotateY(-5deg) rotateZ(-2deg);
                }
                100% { 
                    transform: translateX(60vw) translateY(0) rotateY(0deg) rotateZ(0deg);
                }
            }
            
            @keyframes tailWiggle {
                0%, 100% { 
                    transform: translateY(-50%) rotate(0deg) scaleX(1);
                }
                50% { 
                    transform: translateY(-50%) rotate(12deg) scaleX(1.1);
                }
            }
            
            @keyframes finMove {
                0%, 100% { 
                    transform: scaleY(1) scaleX(1);
                }
                50% { 
                    transform: scaleY(1.3) scaleX(1.1);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.clownfish3D = new Clownfish3D();
});

