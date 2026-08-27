// Initialize AOS (Animate On Scroll) with enhanced settings
AOS.init({
    duration: 1000,
    once: true,
    offset: 100,
    easing: 'ease-out-cubic',
    delay: 0,
    anchorPlacement: 'top-bottom'
});

// Theme Switching
document.addEventListener('DOMContentLoaded', () => {
    // Apply the saved theme immediately before DOM is fully loaded to prevent flash
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return; // Exit if toggle button is not found

    const themeIcon = themeToggle.querySelector('i');
    const html = document.documentElement;
 
    // Update the icon to match current theme
    updateThemeIcon(savedTheme === 'dark');

    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });

    function setTheme(theme) {
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateThemeIcon(theme === 'dark');

        // Animate icon
        themeIcon.style.transition = 'transform 0.3s ease';
        themeIcon.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            themeIcon.style.transform = 'none';
        }, 300);
    }

    function updateThemeIcon(isDark) {
        if (isDark) {
            themeIcon.className = 'fas fa-moon';
            themeToggle.setAttribute('aria-label', 'Switch to Light Mode');
        } else {
            themeIcon.className = 'fas fa-sun';
            themeToggle.setAttribute('aria-label', 'Switch to Dark Mode');
        }
    }

    // Simple Dropdown Menu
    const dropdown = document.querySelector('.dropdown');
    if (dropdown) {
        const dropdownLink = dropdown.querySelector('.nav-link');
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');

        // Toggle dropdown on click
        dropdownLink.addEventListener('click', (e) => {
            e.preventDefault();
            dropdownMenu.classList.toggle('show');
            dropdownLink.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                dropdownMenu.classList.remove('show');
                dropdownLink.classList.remove('active');
            }
        });

        // Handle desktop hover if not on mobile
        if (window.innerWidth > 768) {
            dropdown.addEventListener('mouseenter', () => {
                dropdownMenu.classList.add('show');
            });

            dropdown.addEventListener('mouseleave', () => {
                dropdownMenu.classList.remove('show');
                dropdownLink.classList.remove('active');
            });
        }
    }
});

// Initialize Lightbox options
if (typeof lightbox !== 'undefined') {
    lightbox.option({
        'resizeDuration': 200,
        'wrapAround': true,
        'albumLabel': 'Image %1 of %2',
        'fadeDuration': 300,
        'imageFadeDuration': 300
    });
}

// Contact form handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Here you would typically send the data to a server
        console.log('Form submitted:', data);
        
        // Show success message
        showNotification('Message sent successfully!', 'success');
        
        // Reset form
        this.reset();
    });
}

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background-color: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        border-radius: 4px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        z-index: 1000;
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.3s ease;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Lazy load images in gallery
document.addEventListener('DOMContentLoaded', function() {
    const galleryImages = document.querySelectorAll('.gallery-item img');
    if (galleryImages.length > 0) {
        galleryImages.forEach(img => {
            img.setAttribute('loading', 'lazy');
        });
    }
});

// Advanced Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all elements with animate-on-scroll class
document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// Parallax effect removed - using enhanced version below

// Smooth reveal animation for skill cards
const skillCards = document.querySelectorAll('.skill-card');
skillCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
});

// Add ripple effect to buttons
document.querySelectorAll('.btn-primary, .btn-outline-primary').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add CSS for ripple effect
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .btn-primary, .btn-outline-primary {
        position: relative;
        overflow: hidden;
    }

    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }

    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Mouse cursor effect for interactive elements
document.querySelectorAll('a, button, .skill-card, .portfolio-item').forEach(element => {
    element.addEventListener('mouseenter', function() {
        this.style.cursor = 'pointer';
    });
});

// Add stagger animation to navigation links
const navLinks = document.querySelectorAll('.navigation-links .nav-link');
navLinks.forEach((link, index) => {
    link.style.animationDelay = `${0.4 + index * 0.1}s`;
});

// Add floating animation to profile image
const profileImg = document.querySelector('.profile-img');
if (profileImg) {
    setInterval(() => {
        profileImg.style.animation = 'float 3s ease-in-out infinite';
    }, 100);
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Intersection Observer for fade-in animations
const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.card-modern, .portfolio-item, .testimonial-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeInObserver.observe(el);
});

// ============================================
// DYNAMIC WATER ANIMATION (Canvas)
// ============================================
function initWaterAnimation() {
    const canvas = document.getElementById('waterCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;
    
    function resizeCanvas() {
        const waterLayer = canvas.parentElement;
        canvas.width = waterLayer.offsetWidth;
        canvas.height = waterLayer.offsetHeight;
    }
    
    function drawWater() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        time += 0.02;
        
        // Create flowing water effect with waves
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, 'rgba(0, 191, 255, 0.4)');
        gradient.addColorStop(0.5, 'rgba(30, 144, 255, 0.5)');
        gradient.addColorStop(1, 'rgba(0, 191, 255, 0.3)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        
        // Create wave pattern
        const waveHeight = 15;
        const waveFrequency = 0.02;
        const waveSpeed = time * 0.5;
        
        ctx.moveTo(0, canvas.height);
        
        for (let x = 0; x <= canvas.width; x += 2) {
            const y = canvas.height / 2 + 
                Math.sin(x * waveFrequency + waveSpeed) * waveHeight +
                Math.sin(x * waveFrequency * 2 + waveSpeed * 1.5) * (waveHeight * 0.5) +
                Math.sin(x * waveFrequency * 0.5 + waveSpeed * 0.8) * (waveHeight * 0.3);
            ctx.lineTo(x, y);
        }
        
        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();
        ctx.fill();
        
        // Add flowing highlights
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        for (let i = 0; i < 3; i++) {
            const highlightX = (time * 50 + i * canvas.width / 3) % (canvas.width + 200) - 100;
            const highlightY = canvas.height / 2 + Math.sin(highlightX * waveFrequency + waveSpeed) * waveHeight;
            
            const highlightGradient = ctx.createRadialGradient(
                highlightX, highlightY, 0,
                highlightX, highlightY, 100
            );
            highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
            highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            ctx.fillStyle = highlightGradient;
            ctx.beginPath();
            ctx.arc(highlightX, highlightY, 80, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Add ripples
        for (let i = 0; i < 5; i++) {
            const rippleX = (time * 30 + i * canvas.width / 5) % (canvas.width + 150) - 75;
            const rippleY = canvas.height / 2 + Math.sin(rippleX * waveFrequency + waveSpeed) * waveHeight;
            
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 - i * 0.05})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(rippleX, rippleY, 20 + i * 15, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
    
    function animate() {
        drawWater();
        animationId = requestAnimationFrame(animate);
    }
    
    resizeCanvas();
    animate();
    
    window.addEventListener('resize', () => {
        resizeCanvas();
    });
}

// Initialize water animation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initWaterAnimation();
});

// ============================================
// FRUTIGER AERO INTERACTIVE EFFECTS
// ============================================

// Create interactive water ripples on click
document.addEventListener('click', function(e) {
    if (e.target.closest('.glass, .nav-link, .social-icon, .btn-primary, .btn-outline-primary')) {
        const ripple = document.createElement('div');
        ripple.className = 'water-droplet';
        const rect = e.target.getBoundingClientRect();
        ripple.style.left = (e.clientX - rect.left - 10) + 'px';
        ripple.style.top = (e.clientY - rect.top - 10) + 'px';
        e.target.style.position = 'relative';
        e.target.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 2000);
    }
});

// Add floating nature accents
function createNatureAccent() {
    const accent = document.createElement('div');
    accent.className = 'nature-accent';
    accent.style.left = Math.random() * 100 + '%';
    accent.style.top = Math.random() * 100 + '%';
    accent.style.animationDelay = Math.random() * 5 + 's';
    document.body.appendChild(accent);
    
    setTimeout(() => {
        accent.remove();
    }, 8000);
}

// Create nature accents periodically
setInterval(createNatureAccent, 3000);

// Enhanced parallax for hero section with nature feel (replaces old parallax)
let parallaxActive = true;
window.addEventListener('scroll', () => {
    if (!parallaxActive) return;
    const currentScroll = window.pageYOffset;
    const hero = document.querySelector('.hero');
    
    if (hero) {
        const heroContent = hero.querySelector('.profile-container');
        if (heroContent && currentScroll < window.innerHeight) {
            const parallaxValue = currentScroll * 0.3;
            heroContent.style.transform = `translateY(${parallaxValue}px)`;
            heroContent.style.opacity = 1 - (currentScroll / window.innerHeight) * 0.3;
        }
    }
    
    // Step 10: Parallax scrolling effect for city and hills
    const city = document.querySelector('.city-skyline');
    const hills = document.querySelector('.hills-container');
    
    if (city) {
        const cityParallax = currentScroll * 0.3;
        city.style.transform = `translateY(${cityParallax}px)`;
    }
    
    if (hills) {
        const hillsParallax = currentScroll * 0.1;
        hills.style.transform = `translateY(${hillsParallax}px)`;
    }
});

// Add glow effect to interactive elements on hover
document.querySelectorAll('.nav-link, .social-icon, .skill-card').forEach(element => {
    element.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    });
});

// Create bubble effect on skill cards
document.querySelectorAll('.skill-card').forEach((card, index) => {
    card.addEventListener('mouseenter', function() {
        const bubble = document.createElement('div');
        bubble.style.cssText = `
            position: absolute;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, rgba(0, 191, 255, 0.4) 0%, transparent 100%);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            pointer-events: none;
            animation: bubbleRise 3s ease-out forwards;
        `;
        this.appendChild(bubble);
        
        setTimeout(() => {
            bubble.remove();
        }, 3000);
    });
});

// Enhanced theme toggle: press animation + expanding ripple
const themeToggle = document.querySelector('.theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', function() {
        // Press animation
        this.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);

        // Create expanding circle effect
        const circle = document.createElement('div');
        circle.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(0, 191, 255, 0.3) 0%, transparent 70%);
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 9999;
            animation: waterRipple 1s ease-out forwards;
        `;
        document.body.appendChild(circle);
        
        setTimeout(() => {
            circle.remove();
        }, 1000);
    });
}

// Add shimmer effect to gradient text
const gradientTexts = document.querySelectorAll('.bio-text h1, .cv-header h1, .skills-section h2');
gradientTexts.forEach(text => {
    setInterval(() => {
        text.style.backgroundPosition = '200% center';
        setTimeout(() => {
            text.style.backgroundPosition = '-200% center';
        }, 2000);
    }, 5000);
}); 
