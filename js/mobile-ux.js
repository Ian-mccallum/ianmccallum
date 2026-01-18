// ============================================
// MOBILE UX MANAGER
// Complete Mobile Redesign - Bottom Sheets, Tabs, Swipes
// ============================================

class MobileUXManager {
    constructor() {
        this.isMobile = window.innerWidth <= 768 || 'ontouchstart' in window;
        this.currentTab = 'home';
        this.activeBottomSheet = null;
        this.swipeStartX = 0;
        this.swipeStartY = 0;
        this.swipeThreshold = 50;
        this.tabs = ['home', 'about', 'portfolio', 'cv', 'contact'];
        this.dynamicTabs = []; // Tabs that are added dynamically (testimonials, photos)
        this.currentTabIndex = 0;
        
        if (this.isMobile) {
            this.init();
        }
    }
    
    init() {
        this.createMobileStructure();
        this.initTabNavigation();
        this.initBottomSheets();
        this.initSwipeGestures();
        this.initActionCards();
        this.loadContent();
    }
    
    createMobileStructure() {
        // Create mobile home screen if it doesn't exist
        if (!document.querySelector('.mobile-home-screen')) {
            const homeScreen = document.createElement('div');
            homeScreen.className = 'mobile-home-screen';
            homeScreen.id = 'mobile-home-screen';
            
            // Get profile data from existing content
            const profileImg = document.querySelector('.profile-image')?.src || 'img/IMG_3486.JPG';
            const name = 'Ian McCallum';
            const title = 'Tech Innovator & Young Entrepreneur';
            const location = 'Naperville, Illinois';
            
            homeScreen.innerHTML = `
                <div class="mobile-hero-card">
                    <img src="${profileImg}" alt="${name}" class="mobile-hero-image">
                    <h1 class="mobile-hero-name">${name}</h1>
                    <p class="mobile-hero-title">${title}</p>
                    <p class="mobile-hero-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${location}
                    </p>
                    <p class="mobile-hero-welcome">
                        Welcome to my site! I'm a 17-year-old senior at Metea Valley High School, passionate about technology, entrepreneurship, and innovation. Explore my work, skills, and projects through the windows below.
                    </p>
                    <div class="mobile-social-icons">
                        <a href="https://www.instagram.com/iandmccallum/" target="_blank" rel="noopener" class="mobile-social-icon" aria-label="Instagram">
                            <img src="/assets/insta.png" alt="Instagram" class="mobile-social-icon-img">
                        </a>
                        <a href="https://x.com/ian_mccaIlum" target="_blank" rel="noopener" class="mobile-social-icon" aria-label="Twitter">
                            <img src="/assets/twitter.png" alt="Twitter" class="mobile-social-icon-img">
                        </a>
                        <a href="https://www.linkedin.com/in/ian-mccallum-700722344/" target="_blank" rel="noopener" class="mobile-social-icon" aria-label="LinkedIn">
                            <img src="/assets/link.ico" alt="LinkedIn" class="mobile-social-icon-img">
                        </a>
                        <a href="https://github.com/Ian-mccallum" target="_blank" rel="noopener" class="mobile-social-icon" aria-label="GitHub">
                            <img src="/assets/github.png" alt="GitHub" class="mobile-social-icon-img">
                        </a>
                    </div>
                </div>
                
                <div class="mobile-action-grid">
                    <div class="mobile-action-card" data-action="about">
                        <img src="/img/icons/vista/vista_personalization.ico" alt="About" class="mobile-action-card-icon">
                        <div class="mobile-action-card-title">About Me</div>
                        <div class="mobile-action-card-subtitle">My Story</div>
                    </div>
                    <div class="mobile-action-card" data-action="portfolio">
                        <img src="/img/icons/vista/vista_photo_gallery.ico" alt="Portfolio" class="mobile-action-card-icon">
                        <div class="mobile-action-card-title">Portfolio</div>
                        <div class="mobile-action-card-subtitle">My Work</div>
                    </div>
                    <div class="mobile-action-card" data-action="cv">
                        <img src="/img/icons/vista/vista_book_1.ico" alt="CV" class="mobile-action-card-icon">
                        <div class="mobile-action-card-title">CV</div>
                        <div class="mobile-action-card-subtitle">Resume</div>
                    </div>
                    <div class="mobile-action-card" data-action="photos">
                        <img src="/img/icons/vista/vista_movie.ico" alt="Photos" class="mobile-action-card-icon">
                        <div class="mobile-action-card-title">Photos</div>
                        <div class="mobile-action-card-subtitle">Gallery</div>
                    </div>
                    <div class="mobile-action-card" data-action="testimonials">
                        <img src="/img/icons/vista/vista_collab.ico" alt="Testimonials" class="mobile-action-card-icon">
                        <div class="mobile-action-card-title">Testimonials</div>
                        <div class="mobile-action-card-subtitle">Reviews</div>
                    </div>
                    <div class="mobile-action-card" data-action="contact">
                        <img src="/img/icons/vista/thunderbird1.ico" alt="Contact" class="mobile-action-card-icon">
                        <div class="mobile-action-card-title">Contact</div>
                        <div class="mobile-action-card-subtitle">Get In Touch</div>
                    </div>
                </div>
            `;
            
            // Insert after background, before taskbar
            const background = document.getElementById('frutiger-background');
            if (background && background.nextSibling) {
                background.parentNode.insertBefore(homeScreen, background.nextSibling);
            } else {
                document.body.appendChild(homeScreen);
            }
        }
        
        // Create tab bar if it doesn't exist
        if (!document.querySelector('.mobile-tab-bar')) {
            const tabBar = document.createElement('div');
            tabBar.className = 'mobile-tab-bar';
            tabBar.innerHTML = `
                <div class="mobile-tab-item active" data-tab="home">
                    <img src="/img/icons/vista/vista_get_started.ico" alt="Home" class="mobile-tab-item-icon">
                    <span class="mobile-tab-item-label">Home</span>
                </div>
                <div class="mobile-tab-item" data-tab="about">
                    <img src="/img/icons/vista/vista_personalization.ico" alt="About" class="mobile-tab-item-icon">
                    <span class="mobile-tab-item-label">About</span>
                </div>
                <div class="mobile-tab-item" data-tab="portfolio">
                    <img src="/img/icons/vista/vista_photo_gallery.ico" alt="Portfolio" class="mobile-tab-item-icon">
                    <span class="mobile-tab-item-label">Portfolio</span>
                </div>
                <div class="mobile-tab-item" data-tab="cv">
                    <img src="/img/icons/vista/vista_book_1.ico" alt="CV" class="mobile-tab-item-icon">
                    <span class="mobile-tab-item-label">CV</span>
                </div>
                <div class="mobile-tab-item" data-tab="contact">
                    <img src="/img/icons/vista/thunderbird1.ico" alt="Contact" class="mobile-tab-item-icon">
                    <span class="mobile-tab-item-label">Contact</span>
                </div>
            `;
            document.body.appendChild(tabBar);
        }
        
        // Create content sections
        this.createContentSections();
    }
    
    createContentSections() {
        // Don't create 'home' section - home uses mobile-home-screen instead
        // Don't create testimonials/photos - they're added dynamically
        const sections = ['about', 'portfolio', 'cv', 'contact'];
        
        sections.forEach(tab => {
            if (!document.getElementById(`mobile-content-${tab}`)) {
                const section = document.createElement('div');
                section.className = 'mobile-content-section';
                section.id = `mobile-content-${tab}`;
                section.style.display = 'none'; // Explicitly hide all sections
                section.classList.remove('active'); // Ensure not active
                document.body.appendChild(section);
            }
        });
    }
    
    initTabNavigation() {
        document.querySelectorAll('.mobile-tab-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = item.getAttribute('data-tab');
                this.switchTab(tab);
            });
        });
    }
    
    addDynamicTab(tab) {
        // Check if tab already exists
        if (this.dynamicTabs.includes(tab) || document.querySelector(`.mobile-tab-item[data-tab="${tab}"]`)) {
            return;
        }
        
        // Add to dynamic tabs array
        this.dynamicTabs.push(tab);
        
        // Get tab bar
        const tabBar = document.querySelector('.mobile-tab-bar');
        if (!tabBar) return;
        
        // Get metadata for the tab
        const metadata = {
            'testimonials': { name: 'Testimonials', icon: '/img/icons/vista/vista_collab.ico' },
            'photos': { name: 'Photos', icon: '/img/icons/vista/vista_movie.ico' }
        };
        
        const tabData = metadata[tab];
        if (!tabData) return;
        
        // Create content section if it doesn't exist
        if (!document.getElementById(`mobile-content-${tab}`)) {
            const contentSection = document.createElement('div');
            contentSection.id = `mobile-content-${tab}`;
            contentSection.className = 'mobile-content-section';
            contentSection.style.display = 'none'; // Hidden by default
            document.body.appendChild(contentSection);
        }
        
        // Create tab item
        const tabItem = document.createElement('div');
        tabItem.className = 'mobile-tab-item';
        tabItem.setAttribute('data-tab', tab);
        tabItem.innerHTML = `
            <img src="${tabData.icon}" alt="${tabData.name}" class="mobile-tab-item-icon">
            <span class="mobile-tab-item-label">${tabData.name}</span>
        `;
        
        // Add click handler
        tabItem.addEventListener('click', (e) => {
            e.preventDefault();
            this.switchTab(tab);
        });
        
        // Insert before contact tab (second to last)
        const contactTab = tabBar.querySelector('.mobile-tab-item[data-tab="contact"]');
        if (contactTab) {
            tabBar.insertBefore(tabItem, contactTab);
        } else {
            tabBar.appendChild(tabItem);
        }
        
        // Load content for this tab
        this.loadTabContent(tab);
    }
    
    switchTab(tab) {
        // Update tab bar
        document.querySelectorAll('.mobile-tab-item').forEach(item => {
            item.classList.remove('active');
        });
        const tabItem = document.querySelector(`.mobile-tab-item[data-tab="${tab}"]`);
        if (tabItem) {
            tabItem.classList.add('active');
        }
        
        // Update content sections - hide all first (including any that might have been created)
        document.querySelectorAll('.mobile-content-section').forEach(section => {
            section.classList.remove('active');
            section.style.display = 'none';
        });
        
        // Also hide any 'home' content section if it exists (shouldn't, but just in case)
        const homeContentSection = document.getElementById('mobile-content-home');
        if (homeContentSection) {
            homeContentSection.style.display = 'none';
            homeContentSection.classList.remove('active');
        }
        
        // Close any open bottom sheets
        this.closeBottomSheet();
        
        // Reset scroll position for all sections before switching
        document.querySelectorAll('.mobile-content-section').forEach(section => {
            section.scrollTop = 0;
        });
        
        // Reset window scroll position
        window.scrollTo({ top: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        
        // Show home screen or content section
        const homeScreen = document.getElementById('mobile-home-screen');
        if (tab === 'home') {
            if (homeScreen) {
                homeScreen.style.display = 'block';
                homeScreen.classList.add('active');
                // Scroll to top of home screen
                setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'instant' });
                    homeScreen.scrollIntoView({ behavior: 'instant', block: 'start' });
                }, 50);
            }
        } else {
            // Hide home screen
            if (homeScreen) {
                homeScreen.style.display = 'none';
                homeScreen.classList.remove('active');
            }
            
            // Show content section
            let contentSection = document.getElementById(`mobile-content-${tab}`);
            if (!contentSection) {
                // If section doesn't exist, create it for dynamic tabs
                if (this.dynamicTabs.includes(tab)) {
                    const mobileContainer = document.getElementById('mobile-container');
                    if (mobileContainer) {
                        contentSection = document.createElement('div');
                        contentSection.id = `mobile-content-${tab}`;
                        contentSection.className = 'mobile-content-section';
                        mobileContainer.appendChild(contentSection);
                    }
                }
            }
            
            if (contentSection) {
                // Force display and active state
                contentSection.style.display = 'block';
                contentSection.classList.add('active');
                contentSection.style.overflowY = 'auto';
                contentSection.style.overflowX = 'hidden';
                
                // Scroll to top of the new tab
                setTimeout(() => {
                    contentSection.scrollTop = 0;
                    contentSection.scrollIntoView({ behavior: 'instant', block: 'start' });
                }, 50);
                
                // Load content if not already loaded
                if (contentSection.dataset.loaded !== 'true') {
                    this.loadTabContent(tab);
                } else {
                    // Even if already loaded, scroll to top
                    setTimeout(() => {
                        contentSection.scrollTop = 0;
                        contentSection.scrollIntoView({ behavior: 'instant', block: 'start' });
                    }, 50);
                }
            }
        }
        
        this.currentTab = tab;
        // Update current tab index (handle both regular and dynamic tabs)
        const allTabs = [...this.tabs, ...this.dynamicTabs];
        this.currentTabIndex = allTabs.indexOf(tab);
        if (this.currentTabIndex === -1) {
            this.currentTabIndex = 0;
        }
    }
    
    initActionCards() {
        // Use event delegation since cards are created dynamically
        document.addEventListener('click', (e) => {
            const card = e.target.closest('.mobile-action-card');
            if (card) {
                const action = card.getAttribute('data-action');
                if (action) {
                    // Handle testimonials and photos - add to taskbar dynamically
                    if (action === 'testimonials' || action === 'photos') {
                        this.addDynamicTab(action);
                        setTimeout(() => {
                            this.switchTab(action);
                        }, 50);
                    } else if (this.tabs.includes(action) || this.dynamicTabs.includes(action)) {
                        // If action matches a tab, switch to that tab
                        this.switchTab(action);
                    } else {
                        // Otherwise open as bottom sheet (skills, etc.)
                        this.openBottomSheet(action);
                    }
                }
            }
        });
        
        // Handle data-window buttons on mobile - convert to tab switches
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[data-window]');
            if (link && this.isMobile) {
                e.preventDefault();
                e.stopPropagation();
                const windowId = link.getAttribute('data-window');
                // Convert window IDs to tab names
                let tab = null;
                if (windowId === 'portfolio-window') {
                    tab = 'portfolio';
                } else if (windowId === 'cv-window') {
                    tab = 'cv';
                } else if (windowId === 'contact-window') {
                    tab = 'contact';
                } else if (windowId === 'about-window') {
                    tab = 'about';
                }
                
                if (tab && (this.tabs.includes(tab) || this.dynamicTabs.includes(tab))) {
                    this.switchTab(tab);
                }
            }
        });
    }
    
    initBottomSheets() {
        // Create backdrop
        if (!document.querySelector('.mobile-bottom-sheet-backdrop')) {
            const backdrop = document.createElement('div');
            backdrop.className = 'mobile-bottom-sheet-backdrop';
            backdrop.addEventListener('click', () => {
                this.closeBottomSheet();
            });
            document.body.appendChild(backdrop);
        }
    }
    
    openBottomSheet(contentType) {
        // Close any existing sheet
        this.closeBottomSheet();
        
        // Create or get bottom sheet
        let sheet = document.querySelector('.mobile-bottom-sheet');
        if (!sheet) {
            sheet = document.createElement('div');
            sheet.className = 'mobile-bottom-sheet';
            document.body.appendChild(sheet);
        }
        
        // Get content from existing windows
        let sourceWindow = document.getElementById(`${contentType}-window`);
        let title = contentType.charAt(0).toUpperCase() + contentType.slice(1);
        let titleIcon = '';
        let content = '';
        
        // Handle special window names
        if (contentType === 'cv') {
            sourceWindow = document.getElementById('cv-window');
        } else if (contentType === 'testimonials') {
            sourceWindow = document.getElementById('testimonials-window');
        } else if (contentType === 'photos') {
            sourceWindow = document.getElementById('photos-window');
        }
        
        if (sourceWindow) {
            const titleElement = sourceWindow.querySelector('.vista-glass-title');
            title = titleElement?.textContent.trim() || title;
            titleIcon = titleElement?.querySelector('img')?.src || '';
            content = sourceWindow.querySelector('.vista-glass-content')?.innerHTML || '';
        } else {
            // Fallback: try to get from tab content
            const tabContent = document.getElementById(`mobile-content-${contentType}`);
            if (tabContent) {
                content = tabContent.innerHTML;
            }
        }
        
        if (!content) {
            console.warn(`No content found for ${contentType}`);
            return;
        }
        
        sheet.innerHTML = `
            <div class="mobile-bottom-sheet-handle"></div>
            <div class="mobile-bottom-sheet-header">
                <div class="mobile-bottom-sheet-title">
                    ${titleIcon ? `<img src="${titleIcon}" alt="${title}">` : ''}
                    <span>${title}</span>
                </div>
                <button class="mobile-bottom-sheet-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="mobile-bottom-sheet-content">
                ${content}
            </div>
        `;
        
        // Add close handler
        sheet.querySelector('.mobile-bottom-sheet-close').addEventListener('click', () => {
            this.closeBottomSheet();
        });
        
        // Adapt content for mobile
        setTimeout(() => {
            this.adaptContentForMobile(sheet.querySelector('.mobile-bottom-sheet-content'));
        }, 100);
        
        // Add swipe down handler
        this.initBottomSheetSwipe(sheet);
        
        // Show sheet
        document.querySelector('.mobile-bottom-sheet-backdrop').classList.add('active');
        sheet.classList.add('active');
        this.activeBottomSheet = sheet;
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }
    
    closeBottomSheet() {
        const sheet = document.querySelector('.mobile-bottom-sheet');
        const backdrop = document.querySelector('.mobile-bottom-sheet-backdrop');
        
        if (sheet) {
            sheet.classList.remove('active');
        }
        if (backdrop) {
            backdrop.classList.remove('active');
        }
        
        this.activeBottomSheet = null;
        document.body.style.overflow = '';
    }
    
    initBottomSheetSwipe(sheet) {
        let startY = 0;
        let currentY = 0;
        let isDragging = false;
        
        const handle = sheet.querySelector('.mobile-bottom-sheet-handle');
        const header = sheet.querySelector('.mobile-bottom-sheet-header');
        
        const startDrag = (e) => {
            isDragging = true;
            startY = e.touches ? e.touches[0].clientY : e.clientY;
            sheet.style.transition = 'none';
        };
        
        const drag = (e) => {
            if (!isDragging) return;
            currentY = (e.touches ? e.touches[0].clientY : e.clientY) - startY;
            if (currentY > 0) {
                sheet.style.transform = `translateY(${currentY}px)`;
            }
        };
        
        const endDrag = () => {
            if (!isDragging) return;
            isDragging = false;
            sheet.style.transition = '';
            
            if (currentY > 100) {
                this.closeBottomSheet();
            } else {
                sheet.style.transform = '';
            }
            currentY = 0;
        };
        
        [handle, header].forEach(el => {
            if (el) {
                el.addEventListener('touchstart', startDrag);
                el.addEventListener('touchmove', drag);
                el.addEventListener('touchend', endDrag);
                el.addEventListener('mousedown', startDrag);
                document.addEventListener('mousemove', drag);
                document.addEventListener('mouseup', endDrag);
            }
        });
    }
    
    initSwipeGestures() {
        let startX = 0;
        let startY = 0;
        let isSwiping = false;
        
        document.addEventListener('touchstart', (e) => {
            if (this.activeBottomSheet) return; // Don't swipe when sheet is open
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isSwiping = true;
        });
        
        document.addEventListener('touchmove', (e) => {
            if (!isSwiping || this.activeBottomSheet) return;
            
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const diffX = currentX - startX;
            const diffY = currentY - startY;
            
            // Horizontal swipe (tab switching)
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    // Swipe right - previous tab
                    this.swipeToTab(this.currentTabIndex - 1);
                } else {
                    // Swipe left - next tab
                    this.swipeToTab(this.currentTabIndex + 1);
                }
                isSwiping = false;
            }
        });
        
        document.addEventListener('touchend', () => {
            isSwiping = false;
        });
    }
    
    swipeToTab(index) {
        if (index < 0) index = this.tabs.length - 1;
        if (index >= this.tabs.length) index = 0;
        this.switchTab(this.tabs[index]);
    }
    
    loadTabContent(tab) {
        const section = document.getElementById(`mobile-content-${tab}`);
        if (!section) return;
        
        // Skip if already loaded
        if (section.dataset.loaded === 'true') return;
        
        // Get content from existing windows
        let sourceWindow = document.getElementById(`${tab}-window`);
        let content = '';
        
        // Handle CV window
        if (tab === 'cv') {
            sourceWindow = document.getElementById('cv-window');
        }
        
        // Handle About window
        if (tab === 'about') {
            sourceWindow = document.getElementById('about-window');
        }
        
        // Handle Testimonials window
        if (tab === 'testimonials') {
            sourceWindow = document.getElementById('testimonials-window');
        }
        
        // Handle Photos window
        if (tab === 'photos') {
            sourceWindow = document.getElementById('photos-window');
        }
        
        if (sourceWindow) {
            const contentElement = sourceWindow.querySelector('.vista-glass-content');
            if (contentElement) {
                // Get the inner HTML directly, not the wrapper
                content = contentElement.innerHTML;
            } else {
                console.warn(`No .vista-glass-content found in ${tab}-window`);
            }
        } else {
            console.warn(`Source window ${tab}-window not found`);
        }
        
        if (content) {
            // Clear any existing content
            section.innerHTML = '';
            // Insert content directly (it's already unwrapped from .vista-glass-content)
            section.innerHTML = content;
            section.dataset.loaded = 'true';
            
            // Convert buttons and forms for mobile
            this.adaptContentForMobile(section);
            
            // Force display to ensure visibility
            section.style.display = 'block';
            section.classList.add('active');
            
            // Ensure overflow is visible for content
            section.style.overflow = 'auto';
            section.style.overflowX = 'hidden';
        } else {
            console.warn(`No content found for tab: ${tab}`);
            section.innerHTML = '<p>Content not available</p>';
        }
    }
    
    adaptContentForMobile(section) {
        // Convert buttons
        section.querySelectorAll('.vista-glass-button, .vista-glass-button-primary, a.vista-glass-button, a.vista-glass-button-primary').forEach(btn => {
            btn.classList.add('mobile-form-button');
            btn.style.width = '100%';
            btn.style.margin = '10px 0';
            btn.style.display = 'block';
            btn.style.textAlign = 'center';
        });
        
        // Convert inputs
        section.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea').forEach(input => {
            if (input.tagName === 'TEXTAREA') {
                input.classList.add('mobile-form-textarea');
            } else {
                input.classList.add('mobile-form-input');
            }
        });
        
        // Convert skill items
        section.querySelectorAll('.skill-item').forEach(item => {
            item.classList.add('mobile-skill-item');
        });
        
        // Convert skills grid
        const skillsGrid = section.querySelector('.skills-grid');
        if (skillsGrid) {
            skillsGrid.classList.add('mobile-skills-grid');
        }
        
        // Convert project cards
        section.querySelectorAll('.portfolio-project-card').forEach(card => {
            card.classList.add('mobile-project-card');
        });
        
        // Make all images responsive
        section.querySelectorAll('img').forEach(img => {
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
        });
        
        // Convert flex containers to stack on mobile
        section.querySelectorAll('div[style*="display: flex"]').forEach(container => {
            if (window.innerWidth <= 480) {
                container.style.flexDirection = 'column';
            }
        });
    }
    
    loadContent() {
        // Ensure all content sections are hidden on initial load
        document.querySelectorAll('.mobile-content-section').forEach(section => {
            section.style.display = 'none';
            section.classList.remove('active');
        });
        
        // Preload first tab content (only if not home)
        if (this.currentTab !== 'home') {
            this.loadTabContent(this.currentTab);
        }
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    window.mobileUXManager = new MobileUXManager();
});

