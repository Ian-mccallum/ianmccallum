// ============================================================
// iPHONE OS 4 SYSTEM — IAN'S iPHONE 4
// Completely replaces old mobile-ux.js experience.
// Only runs on mobile (≤ 768px).
// ============================================================

(function () {
    'use strict';

    if (window.innerWidth > 768) return;

    // ── 1. KILL OLD MOBILE UI IMMEDIATELY ────────────────────────────
    // mobile-ux.js runs before this file and creates DOM elements +
    // binds event listeners. We nuke it all right now, before any
    // layout or paint can happen.

    // Prevent MobileUXManager from doing anything further
    try {
        if (window.MobileUXManager) {
            window.MobileUXManager.prototype.init                 = function () {};
            window.MobileUXManager.prototype.createMobileStructure = function () {};
            window.MobileUXManager.prototype.initTabNavigation    = function () {};
            window.MobileUXManager.prototype.initBottomSheets     = function () {};
            window.MobileUXManager.prototype.initSwipeGestures    = function () {};
            window.MobileUXManager.prototype.loadContent          = function () {};
        }
        if (window.mobileUXManager) {
            window.mobileUXManager.isMobile = false;
        }
    } catch (e) {}

    // Selectors for every element old mobile UI creates or shows
    const OLD_UI_SELECTORS = [
        '#mobile-home-screen', '.mobile-home-screen',
        '.mobile-tab-bar',     '.mobile-tab-content',
        '.mobile-hero-card',   '.mobile-action-grid',
        '.mobile-action-card', '.mobile-bottom-sheet',
        '.mobile-overlay',     '.mobile-bottom-sheet-overlay',
        '.mobile-nav',
    ];

    function destroyOldUI() {
        OLD_UI_SELECTORS.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                el.remove();
            });
        });
        // Also forcibly kill the taskbar and Vista windows
        document.querySelectorAll(
            '.vista-glass-taskbar, .vista-glass-window, ' +
            '#vista-desktop-icons, #vista-startmenu, ' +
            '#vista-boot, #vista-context-menu, #vista-tooltip'
        ).forEach(el => {
            el.style.cssText += ';display:none!important;visibility:hidden!important;z-index:-9999!important;';
        });
        // Fix body — mobile-responsive.css adds padding-bottom and allows overflow
        document.body.style.cssText +=
            ';overflow:hidden!important;height:100svh!important;' +
            'padding-bottom:0!important;padding-top:0!important;' +
            'position:fixed!important;width:100%!important;top:0!important;left:0!important;';
    }

    // Run immediately (synchronously before first paint)
    destroyOldUI();

    // Run again on DOMContentLoaded to catch anything injected late
    document.addEventListener('DOMContentLoaded', destroyOldUI);

    // Belt-and-suspenders: run at 0ms, 200ms, 600ms after load
    window.addEventListener('load', () => {
        [0, 200, 600].forEach(delay => setTimeout(destroyOldUI, delay));
    });

    // Observe new nodes being added — nuke them if they're old mobile UI
    const nodeObserver = new MutationObserver(mutations => {
        mutations.forEach(m => {
            m.addedNodes.forEach(node => {
                if (node.nodeType !== 1) return;
                const matches = OLD_UI_SELECTORS.some(sel => {
                    try { return node.matches(sel) || node.querySelector(sel); }
                    catch (e) { return false; }
                });
                if (matches) node.remove();
            });
        });
    });
    nodeObserver.observe(document.documentElement, { childList: true, subtree: true });

    // ── 2. CLOCK ──────────────────────────────────────────────────────
    function tick() {
        const now = new Date();
        let h = now.getHours();
        const m = now.getMinutes().toString().padStart(2, '0');
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;

        const sbEl   = document.getElementById('iphone-sb-time');
        const lockEl = document.getElementById('lock-time');
        if (sbEl)   sbEl.textContent  = `${h}:${m}`;
        if (lockEl) lockEl.textContent = `${h}:${m} ${ampm}`;

        const days   = ['Sunday','Monday','Tuesday','Wednesday',
                        'Thursday','Friday','Saturday'];
        const months = ['January','February','March','April','May','June',
                        'July','August','September','October','November','December'];
        const dateEl = document.getElementById('lock-date');
        if (dateEl)
            dateEl.textContent =
                `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`;
    }

    tick();
    setInterval(tick, 30000);

    // ── 2b. LOCK SCREEN BOOT FX ─────────────────────────────────────
    function initLockBoot() {
        const particlesEl = document.getElementById('lock-particles');
        const statusEl    = document.getElementById('lock-status');
        const lock        = document.getElementById('iphone-lock');
        if (!lock) return;

        if (particlesEl) {
            const hues = [185, 210, 95, 280, 45, 160, 320];
            for (let i = 0; i < 18; i++) {
                const p = document.createElement('span');
                p.className = 'lock-particle';
                p.style.setProperty('--px', (Math.random() * 100).toFixed(1) + '%');
                p.style.setProperty('--py', (Math.random() * 100).toFixed(1) + '%');
                p.style.setProperty('--ph', hues[i % hues.length]);
                p.style.setProperty('--pd', (Math.random() * 3).toFixed(2) + 's');
                p.style.setProperty('--ps', (1.5 + Math.random() * 3).toFixed(1) + 'px');
                p.style.setProperty('--pt', (2.5 + Math.random() * 4).toFixed(1) + 's');
                particlesEl.appendChild(p);
            }
        }

        if (statusEl) {
            const lines = [
                { text: 'Preparing your atmosphere…', hue: 200 },
                { text: 'Loading Frutiger light fields…', hue: 165 },
                { text: 'Composing glass surfaces…', hue: 280 },
                { text: 'Floating the bubbles…', hue: 95 },
                { text: 'Warming up the colors…', hue: 45 },
                { text: 'Slide to unlock', hue: 180 }
            ];
            let idx = 0;
            const cycle = () => {
                if (lock.dataset.unlocked) return;
                const line = lines[idx % lines.length];
                statusEl.style.opacity = '0';
                setTimeout(() => {
                    if (lock.dataset.unlocked) return;
                    statusEl.textContent = line.text;
                    statusEl.style.color = `hsla(${line.hue}, 85%, 72%, 0.95)`;
                    statusEl.style.textShadow = `0 0 12px hsla(${line.hue}, 90%, 60%, 0.45)`;
                    statusEl.style.opacity = '1';
                }, 120);
                idx++;
            };
            cycle();
            setInterval(cycle, 900);
        }
    }

    // ── 3. LOCK SCREEN UNLOCK ────────────────────────────────────────
    function initLock() {
        const lock  = document.getElementById('iphone-lock');
        const hs    = document.getElementById('iphone-hs');
        const dock  = document.getElementById('iphone-dock');
        const track = document.querySelector('.lock-slide-track');
        const knob  = document.getElementById('lock-slide-knob');
        if (!lock || !hs || !dock || !track || !knob) return;

        let isDragging = false;
        let startX = 0;
        let currentOffset = 0;

        function maxOffset() {
            return track.offsetWidth - knob.offsetWidth - 4;
        }

        function doUnlock() {
            lock.dataset.unlocked = '1';
            lock.classList.add('lock-unlocking');
            knob.style.transition = 'margin-left 0.14s ease';
            knob.style.marginLeft = maxOffset() + 'px';
            setTimeout(() => {
                lock.style.transition = 'opacity 0.36s ease, transform 0.36s ease';
                lock.style.opacity    = '0';
                lock.style.transform  = 'scale(1.03)';
                setTimeout(() => {
                    lock.style.display = 'none';
                    hs.style.display   = 'flex';
                    dock.style.display = 'flex';
                }, 380);
            }, 140);
        }

        function snapBack() {
            knob.style.transition = 'margin-left 0.22s cubic-bezier(0.25,0.46,0.45,0.94)';
            knob.style.marginLeft = '2px';
            setTimeout(() => { knob.style.transition = ''; }, 240);
        }

        // Touch
        track.addEventListener('touchstart', e => {
            isDragging   = true;
            startX       = e.touches[0].clientX;
            knob.style.transition = '';
        }, { passive: true });

        track.addEventListener('touchmove', e => {
            if (!isDragging) return;
            const delta    = Math.max(0, Math.min(e.touches[0].clientX - startX, maxOffset()));
            currentOffset  = delta;
            knob.style.marginLeft = (2 + delta) + 'px';
        }, { passive: true });

        track.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;
            currentOffset >= maxOffset() * 0.68 ? doUnlock() : snapBack();
            currentOffset = 0;
        });

        // Mouse / tap
        track.addEventListener('click', doUnlock);
    }

    // ── 4. APP NAVIGATION ─────────────────────────────────────────────
    let activePanel = null;

    function openApp(appId) {
        const panel = document.getElementById('app-panel-' + appId);
        if (!panel) return;

        panel.style.display = 'flex';
        activePanel = panel;

        if (appId === 'skills') setTimeout(() => animateSkillBars(panel), 360);

        requestAnimationFrame(() => requestAnimationFrame(() => {
            panel.classList.add('panel-active', 'panel-visible');
        }));
    }

    function closeApp() {
        if (!activePanel) return;
        const panel = activePanel;
        activePanel = null;
        panel.classList.remove('panel-visible');
        setTimeout(() => {
            panel.classList.remove('panel-active');
            panel.style.display = 'none';
        }, 360);
    }

    function animateSkillBars(panel) {
        panel.querySelectorAll('.aero-skill-fill[data-pct]').forEach(el => {
            el.style.width = '0%';
            requestAnimationFrame(() => requestAnimationFrame(() => {
                el.style.width = el.getAttribute('data-pct') + '%';
            }));
        });
    }

    // ── 5. WIRE INTERACTIONS ─────────────────────────────────────────
    function wireInteractions() {
        document.querySelectorAll('.ios-icon, .ios-dock-icon').forEach(icon => {
            icon.addEventListener('click', () => {
                const appId = icon.getAttribute('data-app');
                if (appId) openApp(appId);
            });
        });

        document.querySelectorAll('.ios-back-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                e.stopPropagation();
                closeApp();
            });
        });
    }

    // ── 6. SWIPE-RIGHT-EDGE BACK ─────────────────────────────────────
    function wireSwipeBack() {
        let startX = 0, startY = 0;
        document.addEventListener('touchstart', e => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });
        document.addEventListener('touchend', e => {
            if (!activePanel) return;
            const dx = e.changedTouches[0].clientX - startX;
            const dy = Math.abs(e.changedTouches[0].clientY - startY);
            if (startX < 28 && dx > 70 && dy < 60) closeApp();
        }, { passive: true });
    }

    // ── INIT ─────────────────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', () => {
        destroyOldUI(); // one more pass after DOM is fully ready
        initLockBoot();
        initLock();
        wireInteractions();
        wireSwipeBack();
    });

})();
