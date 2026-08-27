// ============================================
// WINDOWS VISTA SYSTEM INTERACTIONS
// Start Menu, Taskbar, Windows, etc.
// ============================================

class VistaSystem {
    constructor() {
        this.startMenu = document.getElementById('vista-start-menu');
        this.startButton = document.getElementById('vista-start-button');
        this.init();
    }

    init() {
        this.setupStartMenu();
        this.setupTaskbar();
        this.setupWindows();
        this.setupDesktopIcons();
        this.updateTime();
        this.setupTextAnimations();
    }

    setupStartMenu() {
        if (!this.startButton || !this.startMenu) return;

        // Toggle Start Menu
        this.startButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.startMenu.classList.toggle('show');
        });

        // Close Start Menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.startMenu.contains(e.target) && !this.startButton.contains(e.target)) {
                this.startMenu.classList.remove('show');
            }
        });

        // Prevent Start Menu clicks from closing it
        this.startMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    setupTaskbar() {
        // Update active taskbar item based on current page
        const currentPath = window.location.pathname;
        const taskbarItems = document.querySelectorAll('.vista-taskbar-item');
        
        taskbarItems.forEach(item => {
            item.classList.remove('active');
            const href = item.getAttribute('href');
            if (href && (currentPath.includes(href.replace('.html', '')) || 
                (currentPath === '/' && href === 'index.html'))) {
                item.classList.add('active');
            }
        });
    }

    setupWindows() {
        const windows = document.querySelectorAll('.vista-window');
        
        windows.forEach(window => {
            // Window controls
            const minimizeBtn = window.querySelector('.vista-control-btn.minimize');
            const maximizeBtn = window.querySelector('.vista-control-btn.maximize');
            const closeBtn = window.querySelector('.vista-control-btn.close');

            if (minimizeBtn) {
                minimizeBtn.addEventListener('click', () => {
                    window.style.transform = 'scale(0.8)';
                    window.style.opacity = '0';
                    setTimeout(() => {
                        window.style.display = 'none';
                    }, 200);
                });
            }

            if (maximizeBtn) {
                maximizeBtn.addEventListener('click', () => {
                    if (window.classList.contains('maximized')) {
                        window.classList.remove('maximized');
                        window.style.width = '';
                        window.style.height = '';
                        window.style.top = '';
                        window.style.left = '';
                        window.style.margin = '';
                    } else {
                        window.classList.add('maximized');
                        window.style.width = 'calc(100vw - 20px)';
                        window.style.height = 'calc(100vh - 100px)';
                        window.style.top = '10px';
                        window.style.left = '10px';
                        window.style.margin = '0';
                    }
                });
            }

            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    window.style.animation = 'vistaWindowClose 0.3s ease-out';
                    setTimeout(() => {
                        window.style.display = 'none';
                    }, 300);
                });
            }

            // Make window draggable
            this.makeDraggable(window);
        });
    }

    makeDraggable(window) {
        const titleBar = window.querySelector('.vista-title-bar');
        if (!titleBar) return;

        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        titleBar.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            if (window.classList.contains('maximized')) return;
            
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;

            if (e.target === titleBar || titleBar.contains(e.target)) {
                isDragging = true;
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                xOffset = currentX;
                yOffset = currentY;

                window.style.transform = `translate(${currentX}px, ${currentY}px)`;
            }
        }

        function dragEnd(e) {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        }
    }

    setupDesktopIcons() {
        const icons = document.querySelectorAll('.vista-desktop-icon');
        icons.forEach(icon => {
            icon.addEventListener('dblclick', () => {
                // Open corresponding window/page
                const text = icon.querySelector('span').textContent;
                if (text.includes('Portfolio')) {
                    window.location.href = 'portfolio.html';
                } else if (text.includes('Ian')) {
                    window.location.href = 'about.html';
                }
            });

            // Hover effect
            icon.addEventListener('mouseenter', () => {
                icon.style.transform = 'scale(1.1)';
            });

            icon.addEventListener('mouseleave', () => {
                icon.style.transform = 'scale(1)';
            });
        });
    }

    updateTime() {
        const timeElement = document.getElementById('vista-time');
        if (!timeElement) return;

        function update() {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const displayHours = hours % 12 || 12;
            const displayMinutes = minutes.toString().padStart(2, '0');
            
            timeElement.textContent = `${displayHours}:${displayMinutes} ${ampm}`;
        }

        update();
        setInterval(update, 60000); // Update every minute
    }

    setupTextAnimations() {
        // Animate text elements on load
        const textElements = document.querySelectorAll('.vista-h1, .vista-h2, .vista-h3, .vista-body-text');
        
        textElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                el.style.transition = 'all 0.6s ease-out';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 100);
        });

        // Typing effect for main heading
        const mainHeading = document.querySelector('.vista-h1');
        if (mainHeading) {
            const text = mainHeading.textContent;
            mainHeading.textContent = '';
            mainHeading.style.borderRight = '2px solid var(--vista-blue)';
            
            let i = 0;
            const typeInterval = setInterval(() => {
                if (i < text.length) {
                    mainHeading.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typeInterval);
                    setTimeout(() => {
                        mainHeading.style.borderRight = 'none';
                    }, 500);
                }
            }, 100);
        }
    }
}

// Add window close animation
const windowCloseStyle = document.createElement('style');
windowCloseStyle.textContent = `
    @keyframes vistaWindowClose {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.8);
        }
    }
`;
document.head.appendChild(windowCloseStyle);

// Initialize Vista System
document.addEventListener('DOMContentLoaded', () => {
    window.vistaSystem = new VistaSystem();
});

