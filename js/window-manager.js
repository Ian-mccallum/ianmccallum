// ============================================
// VISTA WINDOW MANAGER
// Single Page Application with Window System
// ============================================

class VistaWindowManager {
    constructor() {
        this.windows = new Map();
        this.zIndexCounter = 200;
        this.windowStates = this.loadWindowStates();
        this.taskbarItems = new Map(); // Track taskbar items for windows
        // Detect mobile/touch device
        this.isMobile = window.innerWidth <= 768 || 'ontouchstart' in window;
        this.windowMetadata = {
            'cv-window': { name: 'CV', icon: '/img/icons/vista/vista_book_1.ico' },
            'testimonials-window': { name: 'Testimonials', icon: '/img/icons/vista/vista_collab.ico' },
            'photos-window': { name: 'Photos', icon: '/img/icons/vista/vista_photo_gallery.ico' },
            'thank-you-window': { name: 'Thank You', icon: '/img/icons/vista/vista_info.ico' },
            'welcome-window': { name: 'Welcome', icon: '/img/icons/vista/vista_get_started.ico' }
        };
        
        // Don't initialize desktop window manager on mobile
        if (!this.isMobile) {
            this.init();
        }
    }

    init() {
        this.setupEventListeners();
        this.restoreWindowStates();
    }

    loadWindowStates() {
        const saved = localStorage.getItem('vista-window-states');
        return saved ? JSON.parse(saved) : {};
    }

    saveWindowStates() {
        const states = {};
        this.windows.forEach((window, id) => {
            const element = document.getElementById(id);
            if (element && element.style.display !== 'none') {
                states[id] = {
                    top: element.style.top,
                    left: element.style.left,
                    width: element.style.width,
                    height: element.style.height,
                    zIndex: element.style.zIndex,
                    minimized: element.dataset.minimized === 'true',
                    maximized: element.dataset.maximized === 'true'
                };
            }
        });
        localStorage.setItem('vista-window-states', JSON.stringify(states));
    }

    restoreWindowStates() {
        Object.keys(this.windowStates).forEach(windowId => {
            const state = this.windowStates[windowId];
            const window = document.getElementById(windowId);
            if (window && state) {
                if (state.top) window.style.top = state.top;
                if (state.left) window.style.left = state.left;
                if (state.width) window.style.width = state.width;
                if (state.height) window.style.height = state.height;
                if (state.zIndex) window.style.zIndex = state.zIndex;
                if (state.minimized) {
                    window.dataset.minimized = 'true';
                    window.style.display = 'none';
                    // Add to taskbar even if minimized
                    this.addToTaskbar(windowId);
                    this.updateTaskbarItemState(windowId, true);
                } else {
                    // Window was open, add to taskbar
                    this.addToTaskbar(windowId);
                }
                if (state.maximized) {
                    window.dataset.maximized = 'true';
                    this.maximizeWindow(windowId);
                }
            }
        });
    }

    setupEventListeners() {
        // Navigation links - open windows instead of navigating
        document.querySelectorAll('a[href*=".html"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                const windowId = href.replace('.html', '-window');
                this.openWindow(windowId);
            });
        });

        // Data-window attribute links
        document.querySelectorAll('a[data-window]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const windowId = link.getAttribute('data-window');
                this.openWindow(windowId);
            });
        });

        // Window controls
        document.addEventListener('click', (e) => {
            if (e.target.closest('.vista-glass-control-btn')) {
                e.preventDefault();
                e.stopPropagation();
                const btn = e.target.closest('.vista-glass-control-btn');
                const window = btn.closest('.vista-glass-window');
                if (window && window.id) {
                    if (btn.classList.contains('close')) {
                        this.closeWindow(window.id);
                    } else if (btn.classList.contains('minimize')) {
                        this.minimizeWindow(window.id);
                    } else if (btn.classList.contains('maximize')) {
                        this.maximizeWindow(window.id);
                    }
                }
            }
        });

        // Taskbar items - open windows (for permanent items with href)
        document.querySelectorAll('.vista-glass-taskbar-item[href]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const href = item.getAttribute('href');
                const windowId = href.replace('.html', '-window');
                this.openWindow(windowId);
            });
        });

        // Start menu items - open windows
        document.querySelectorAll('.vista-glass-startitem[href]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const href = item.getAttribute('href');
                const windowId = href.replace('.html', '-window');
                this.openWindow(windowId);
            });
        });

        // Make windows draggable
        document.querySelectorAll('.vista-glass-titlebar').forEach(titlebar => {
            this.makeDraggable(titlebar);
        });

        // Taskbar item clicks - restore/minimize windows (for dynamically added items)
        document.addEventListener('click', (e) => {
            const taskbarItem = e.target.closest('.vista-glass-taskbar-item[data-window-id]');
            if (taskbarItem) {
                e.preventDefault();
                e.stopPropagation();
                const windowId = taskbarItem.getAttribute('data-window-id');
                const window = document.getElementById(windowId);
                if (window) {
                    if (window.dataset.minimized === 'true') {
                        this.restoreWindow(windowId);
                    } else {
                        this.bringToFront(windowId);
                    }
                }
            }
        });
    }

    openWindow(windowId) {
        let window = document.getElementById(windowId);
        
        if (!window) {
            console.warn(`Window ${windowId} not found`);
            return;
        }

        // If window exists but is minimized, restore it
        if (window.dataset.minimized === 'true') {
            this.restoreWindow(windowId);
            return;
        }

        // Show window
        window.style.display = 'block';
        window.dataset.minimized = 'false';
        window.dataset.maximized = 'false';

        // Add to taskbar if not already there and has metadata
        this.addToTaskbar(windowId);

        // On mobile, windows are always relative positioned
        if (this.isMobile) {
            window.style.position = 'relative';
            window.style.top = '';
            window.style.left = '';
            window.style.right = '';
            window.style.bottom = '';
            window.style.transform = '';
        } else {
            // Desktop: restore position if saved
            const savedState = this.windowStates[windowId];
            if (savedState && !savedState.maximized) {
                if (savedState.top) window.style.top = savedState.top;
                if (savedState.left) window.style.left = savedState.left;
            }
        }

        // Bring to front
        this.bringToFront(windowId);

        this.windows.set(windowId, window);
        this.saveWindowStates();
    }

    closeWindow(windowId) {
        const window = document.getElementById(windowId);
        if (window) {
            window.style.display = 'none';
            window.dataset.minimized = 'false';
            window.dataset.maximized = 'false';
            this.windows.delete(windowId);
            // Remove from taskbar
            this.removeFromTaskbar(windowId);
            this.saveWindowStates();
        }
    }

    minimizeWindow(windowId) {
        const window = document.getElementById(windowId);
        if (window) {
            window.style.display = 'none';
            window.dataset.minimized = 'true';
            this.updateTaskbarItemState(windowId, true);
            this.saveWindowStates();
        }
    }

    restoreWindow(windowId) {
        const window = document.getElementById(windowId);
        if (window) {
            window.style.display = 'block';
            window.dataset.minimized = 'false';
            this.updateTaskbarItemState(windowId, false);
            this.bringToFront(windowId);
            this.saveWindowStates();
        }
    }

    maximizeWindow(windowId) {
        const window = document.getElementById(windowId);
        if (!window) return;

        const isMaximized = window.dataset.maximized === 'true';

        if (isMaximized) {
            // Restore
            const savedState = this.windowStates[windowId];
            if (this.isMobile) {
                // On mobile, restore to relative positioning
                window.style.position = '';
                window.style.top = '';
                window.style.left = '';
                window.style.right = '';
                window.style.bottom = '';
                window.style.width = '';
                window.style.height = '';
                window.style.maxHeight = '';
                window.style.margin = '';
                window.style.borderRadius = '';
                window.style.zIndex = '';
            } else {
                // Desktop restore
                if (savedState && savedState.restoredWidth !== undefined) {
                    window.style.width = savedState.restoredWidth;
                    window.style.height = savedState.restoredHeight || '';
                    window.style.top = savedState.restoredTop || '';
                    window.style.left = savedState.restoredLeft || '';
                    window.style.right = '';
                    window.style.bottom = '';
                    window.style.maxHeight = savedState.restoredMaxHeight || '';
                    window.style.transform = savedState.restoredTransform || '';
                } else {
                    // Fallback: remove all positioning
                    window.style.width = '';
                    window.style.height = '';
                    window.style.top = '';
                    window.style.left = '';
                    window.style.right = '';
                    window.style.bottom = '';
                    window.style.maxHeight = '';
                    window.style.transform = '';
                }
            }
            // Ensure opacity is reset
            window.style.opacity = '';
            window.dataset.maximized = 'false';
        } else {
            // Save current inline style values (even if empty)
            if (!this.windowStates[windowId]) {
                this.windowStates[windowId] = {};
            }
            this.windowStates[windowId].restoredWidth = window.style.width || '';
            this.windowStates[windowId].restoredHeight = window.style.height || '';
            this.windowStates[windowId].restoredTop = window.style.top || '';
            this.windowStates[windowId].restoredLeft = window.style.left || '';
            this.windowStates[windowId].restoredMaxHeight = window.style.maxHeight || '';
            this.windowStates[windowId].restoredTransform = window.style.transform || '';

            // Maximize - different behavior for mobile vs desktop
            if (this.isMobile) {
                // On mobile, maximize means full-screen modal above taskbar
                window.style.position = 'fixed';
                window.style.top = '0';
                window.style.left = '0';
                window.style.right = '0';
                window.style.bottom = '60px'; // Above taskbar
                window.style.width = '100%';
                window.style.height = 'calc(100vh - 60px)';
                window.style.maxHeight = 'calc(100vh - 60px)';
                window.style.margin = '0';
                window.style.borderRadius = '0';
                window.style.zIndex = '9999';
            } else {
                // Desktop maximize - set to fullscreen (taskbar will overlay)
                window.style.width = '100vw';
                window.style.height = '100vh';
                window.style.maxHeight = '100vh'; // Override any max-height
                window.style.top = '0';
                window.style.left = '0';
                window.style.right = '0';
                window.style.bottom = '0';
                window.style.transform = 'none'; // Remove any transform
            }
            window.style.opacity = '1'; // Ensure full opacity
            window.dataset.maximized = 'true';
        }

        this.bringToFront(windowId);
        this.saveWindowStates();
    }

    bringToFront(windowId) {
        const window = document.getElementById(windowId);
        if (window) {
            this.zIndexCounter++;
            window.style.zIndex = this.zIndexCounter;
            
            // Update taskbar item active state
            this.updateTaskbarItemState(windowId, false);
            
            // Remove active from other taskbar items
            document.querySelectorAll('.vista-glass-taskbar-item').forEach(item => {
                if (item.getAttribute('data-window-id') !== windowId) {
                    item.classList.remove('active');
                }
            });
            
            this.saveWindowStates();
        }
    }

    makeDraggable(titlebar) {
        // Don't enable dragging on mobile
        if (this.isMobile) return;
        
        let isDragging = false;
        let currentX, currentY, initialX, initialY;
        let xOffset = 0, yOffset = 0;
        let window = null;

        titlebar.addEventListener('mousedown', (e) => {
            if (e.target.closest('.vista-glass-controls')) return;
            
            window = titlebar.closest('.vista-glass-window');
            if (!window) return;

            // Don't drag if maximized
            if (window.dataset.maximized === 'true') return;

            isDragging = true;
            this.bringToFront(window.id);

            const rect = window.getBoundingClientRect();
            initialX = e.clientX - rect.left;
            initialY = e.clientY - rect.top;

            xOffset = rect.left;
            yOffset = rect.top;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging && window && window.dataset.maximized !== 'true') {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                window.style.left = currentX + 'px';
                window.style.top = currentY + 'px';
                window.style.transform = '';
                window.style.right = '';
                window.style.bottom = '';
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                if (window) {
                    this.saveWindowStates();
                }
            }
        });
    }

    addToTaskbar(windowId) {
        // Skip if already in taskbar or no metadata
        if (this.taskbarItems.has(windowId) || !this.windowMetadata[windowId]) {
            return;
        }

        // Skip if it's a permanent taskbar item (Home, About, Portfolio, Contact)
        const permanentWindows = ['about-window', 'portfolio-window', 'contact-window'];
        if (permanentWindows.includes(windowId)) {
            return;
        }

        const metadata = this.windowMetadata[windowId];
        const taskbarItems = document.querySelector('.vista-glass-taskbar-items');
        if (!taskbarItems) return;

        // Create taskbar item
        const item = document.createElement('a');
        item.href = '#';
        item.className = 'vista-glass-taskbar-item';
        item.setAttribute('data-window-id', windowId);
        
        const icon = document.createElement('img');
        icon.src = metadata.icon;
        icon.alt = metadata.name;
        icon.className = 'vista-icon-img vista-taskbar-icon-img';
        icon.style.width = '20px';
        icon.style.height = '20px';
        
        const span = document.createElement('span');
        span.textContent = metadata.name;
        
        item.appendChild(icon);
        item.appendChild(span);
        
        taskbarItems.appendChild(item);
        this.taskbarItems.set(windowId, item);
    }

    removeFromTaskbar(windowId) {
        const item = this.taskbarItems.get(windowId);
        if (item && item.parentNode) {
            item.parentNode.removeChild(item);
            this.taskbarItems.delete(windowId);
        }
    }

    updateTaskbarItemState(windowId, isMinimized) {
        const item = this.taskbarItems.get(windowId);
        if (item) {
            if (isMinimized) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }
        }
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    window.vistaWindowManager = new VistaWindowManager();
    
    // Ensure all windows have proper IDs for window manager
    document.querySelectorAll('.vista-glass-window').forEach((win, index) => {
        if (!win.id) {
            win.id = `window-${index}`;
        }
    });
});

