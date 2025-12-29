// ============================================
// VISTA ICON SYSTEM
// Integration with Frutiger Aero Archive Icons
// https://frutigeraeroarchive.org/icons
// ============================================

class VistaIconSystem {
    constructor() {
        this.iconBasePath = 'img/icons/vista/';
        this.fallbackIcons = {
            // Desktop Icons
            'recycle-bin': 'fas fa-trash',
            
            // Start Menu Icons
            'home': 'fas fa-home',
            'about': 'fas fa-user',
            'portfolio': 'fas fa-briefcase',
            'cv': 'fas fa-file-alt',
            'testimonials': 'fas fa-quote-left',
            'photos': 'fas fa-images',
            'contact': 'fas fa-envelope',
            'all-programs': 'fas fa-th',
            'power': 'fas fa-power-off',
            
            // Taskbar Icons
            'start-button': 'fas fa-th',
            'internet-explorer': 'fab fa-internet-explorer',
            'home-taskbar': 'fas fa-home',
            'about-taskbar': 'fas fa-user',
            'portfolio-taskbar': 'fas fa-briefcase',
            'contact-taskbar': 'fas fa-envelope',
            
            // Window Icons
            'portfolio-window': 'fas fa-briefcase',
            'about-window': 'fas fa-user',
            'contact-window': 'fas fa-envelope',
            'cv-window': 'fas fa-file-alt',
            'testimonials-window': 'fas fa-quote-left',
            'photos-window': 'fas fa-images',
            
            // System Icons
            'volume': 'fas fa-volume-up',
            'wifi': 'fas fa-wifi',
        };
        
        this.init();
    }
    
    init() {
        this.replaceIcons();
        this.hideFontAwesomeFallbacks();
    }
    
    hideFontAwesomeFallbacks() {
        // Hide all Font Awesome icons that are fallbacks for Vista icons
        document.querySelectorAll('.vista-icon-img').forEach(img => {
            // When Vista icon loads successfully, hide the Font Awesome fallback
            img.addEventListener('load', () => {
                const fallback = img.nextElementSibling;
                if (fallback && fallback.classList.contains('fa')) {
                    fallback.style.display = 'none';
                }
            });
            
            // Also check if image is already loaded
            if (img.complete && img.naturalHeight !== 0) {
                const fallback = img.nextElementSibling;
                if (fallback && fallback.classList.contains('fa')) {
                    fallback.style.display = 'none';
                }
            }
        });
        
        // Hide all Font Awesome icons that are siblings of Vista icons
        document.querySelectorAll('.vista-icon-img + i[class*="fa-"]').forEach(icon => {
            icon.style.display = 'none';
        });
    }
    
    // Replace Font Awesome icons with Vista icons where available
    replaceIcons() {
        // Desktop Icons - Skip recycle bin as it already has an image in HTML
        
        // Start Menu Icons
        document.querySelectorAll('.vista-glass-startitem').forEach(item => {
            const icon = item.querySelector('i');
            if (icon) {
                const iconName = this.getIconNameFromItem(item);
                if (iconName) {
                    this.replaceWithVistaIcon(icon, iconName, 20);
                }
            }
        });
        
        // Taskbar Icons
        document.querySelectorAll('.vista-glass-taskbar-item i').forEach(icon => {
            const iconName = this.getIconNameFromTaskbarItem(icon);
            if (iconName) {
                this.replaceWithVistaIcon(icon, iconName, 16);
            }
        });
        
        // Quick Launch
        const quickLaunchIcons = document.querySelectorAll('.vista-glass-quicklaunch-icon i');
        quickLaunchIcons.forEach(icon => {
            this.replaceWithVistaIcon(icon, 'internet-explorer', 20);
        });
        
        // Start Button
        const startBtn = document.querySelector('#vista-start-btn i');
        if (startBtn) {
            this.replaceWithVistaIcon(startBtn, 'start-button', 24);
        }
        
        // Window Title Icons
        document.querySelectorAll('.vista-glass-title i').forEach(icon => {
            const iconName = this.getIconNameFromWindowTitle(icon);
            if (iconName) {
                this.replaceWithVistaIcon(icon, iconName, 16);
            }
        });
    }
    
    getIconNameFromItem(item) {
        const text = item.textContent.toLowerCase();
        if (text.includes('home')) return 'home';
        if (text.includes('about')) return 'about';
        if (text.includes('portfolio')) return 'portfolio';
        if (text.includes('cv') || text.includes('resume')) return 'cv';
        if (text.includes('testimonial')) return 'testimonials';
        if (text.includes('photo')) return 'photos';
        if (text.includes('contact')) return 'contact';
        if (text.includes('all program')) return 'all-programs';
        if (item.closest('.vista-glass-power-btn')) return 'power';
        return null;
    }
    
    getIconNameFromTaskbarItem(icon) {
        const parent = icon.closest('.vista-glass-taskbar-item');
        if (!parent) return null;
        const text = parent.textContent.toLowerCase();
        if (text.includes('home')) return 'home-taskbar';
        if (text.includes('about')) return 'about-taskbar';
        if (text.includes('portfolio')) return 'portfolio-taskbar';
        if (text.includes('contact')) return 'contact-taskbar';
        return null;
    }
    
    getIconNameFromWindowTitle(icon) {
        const title = icon.closest('.vista-glass-title');
        if (!title) return null;
        const text = title.textContent.toLowerCase();
        if (text.includes('portfolio')) return 'portfolio-window';
        if (text.includes('about')) return 'about-window';
        if (text.includes('contact')) return 'contact-window';
        if (text.includes('cv') || text.includes('resume')) return 'cv-window';
        if (text.includes('testimonial')) return 'testimonials-window';
        if (text.includes('photo')) return 'photos-window';
        return null;
    }
    
    replaceWithVistaIcon(iconElement, iconName, size) {
        const img = document.createElement('img');
        img.src = `${this.iconBasePath}${iconName}.png`;
        img.alt = iconName;
        img.className = 'vista-icon-img';
        img.style.width = `${size}px`;
        img.style.height = `${size}px`;
        img.onerror = () => {
            // Fallback to Font Awesome if icon not found
            img.style.display = 'none';
            iconElement.style.display = 'inline-block';
        };
        img.onload = () => {
            iconElement.style.display = 'none';
        };
        iconElement.parentNode.insertBefore(img, iconElement);
    }
    
    setIcon(element, iconName, size) {
        const img = document.createElement('img');
        img.src = `${this.iconBasePath}${iconName}.png`;
        img.alt = iconName;
        img.className = 'vista-icon-img vista-desktop-icon-img';
        img.style.width = `${size}px`;
        img.style.height = `${size}px`;
        img.onerror = () => {
            // Keep fallback
        };
        element.appendChild(img);
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    window.vistaIconSystem = new VistaIconSystem();
});

