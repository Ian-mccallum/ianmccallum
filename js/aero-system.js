// ============================================================
// FRUTIGER AERO SYSTEM
// Boot animation, context menu, tooltips, clock, skill bars
// ============================================================

(function () {
    'use strict';

    // ── Boot Screen ────────────────────────────────────────────
    function initBoot() {
        const boot = document.getElementById('vista-boot');
        if (!boot) return;

        // Skip if already booted this session
        if (sessionStorage.getItem('aero-booted')) {
            boot.style.display = 'none';
            return;
        }

        // Click or key to skip
        function skip() {
            boot.classList.add('fade-out');
            setTimeout(() => { boot.style.display = 'none'; }, 680);
        }
        boot.addEventListener('click', skip);
        document.addEventListener('keydown', skip, { once: true });

        // Auto-dismiss after boot sequence finishes
        setTimeout(() => {
            sessionStorage.setItem('aero-booted', '1');
            skip();
        }, 2350);
    }

    // ── Context Menu ───────────────────────────────────────────
    function initContextMenu() {
        const menu = document.getElementById('vista-context-menu');
        if (!menu) return;

        document.addEventListener('contextmenu', (e) => {
            // Show only when right-clicking the bare desktop
            if (e.target.closest('.vista-glass-window') ||
                e.target.closest('.vista-glass-taskbar') ||
                e.target.closest('.vista-context-menu') ||
                e.target.closest('.vista-desktop-icon')) return;

            e.preventDefault();
            const x = Math.min(e.clientX, window.innerWidth  - 200);
            const y = Math.min(e.clientY, window.innerHeight - 210);
            menu.style.left = x + 'px';
            menu.style.top  = y + 'px';
            menu.classList.add('show');
        });

        document.addEventListener('mousedown', (e) => {
            if (!menu.contains(e.target)) menu.classList.remove('show');
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') menu.classList.remove('show');
        });
    }

    // ── Tooltip System ─────────────────────────────────────────
    function initTooltips() {
        const tip = document.getElementById('vista-tooltip');
        if (!tip) return;

        let timer;

        document.addEventListener('mouseover', (e) => {
            const el = e.target.closest('[data-tip]');
            if (!el) return;
            clearTimeout(timer);
            timer = setTimeout(() => {
                tip.textContent = el.getAttribute('data-tip');
                const r = el.getBoundingClientRect();
                tip.style.left = (r.left + r.width / 2) + 'px';
                tip.style.top  = (r.top  - 30) + 'px';
                tip.classList.add('show');
            }, 580);
        });

        document.addEventListener('mouseout', (e) => {
            if (!e.target.closest('[data-tip]')) return;
            clearTimeout(timer);
            tip.classList.remove('show');
        });
    }

    // ── Clock (time + date) ────────────────────────────────────
    function initClock() {
        const el = document.getElementById('vista-time');
        if (!el) return;

        function tick() {
            const now  = new Date();
            let   h    = now.getHours();
            const m    = now.getMinutes().toString().padStart(2, '0');
            const ampm = h >= 12 ? 'PM' : 'AM';
            h = h % 12 || 12;
            const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
            const day  = days[now.getDay()];
            const mo   = now.getMonth() + 1;
            const d    = now.getDate();
            el.innerHTML = `${h}:${m} ${ampm}<small>${day} ${mo}/${d}</small>`;
        }

        tick();
        setInterval(tick, 30000);
    }

    // ── Skill Bar Entrance (IntersectionObserver) ──────────────
    function initSkillBars() {
        const fills = document.querySelectorAll('.aero-skill-fill[data-pct]');
        if (!fills.length) return;

        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                // Small delay so the window-open animation completes first
                setTimeout(() => {
                    el.style.width = el.getAttribute('data-pct') + '%';
                }, 80);
                io.unobserve(el);
            });
        }, { threshold: 0.2 });

        fills.forEach(f => {
            f.style.width = '0%';
            io.observe(f);
        });
    }

    // ── Animate skill bars when skills window opens ────────────
    // (IntersectionObserver fires immediately if already visible)
    document.addEventListener('aero:windowOpen', (e) => {
        if (e.detail && e.detail.windowId === 'skills-window') {
            setTimeout(initSkillBars, 100);
        }
    });

    // ── Wire context menu items ────────────────────────────────
    function wireContextItems() {
        function ctxOpen(id) {
            if (window.vistaWindowManager) window.vistaWindowManager.openWindow(id);
            const m = document.getElementById('vista-context-menu');
            if (m) m.classList.remove('show');
        }
        const map = {
            'ctx-about':         'about-window',
            'ctx-portfolio':     'portfolio-window',
            'ctx-contact':       'contact-window',
            'ctx-skills':        'skills-window',
            'ctx-testimonials':  'testimonials-window',
        };
        Object.entries(map).forEach(([btnId, winId]) => {
            const btn = document.getElementById(btnId);
            if (btn) btn.addEventListener('click', () => ctxOpen(winId));
        });
    }

    // ── Dispatch aero:windowOpen when window manager opens a window ──
    // Patch into window manager after it loads
    function patchWindowManager() {
        const wm = window.vistaWindowManager;
        if (!wm) return;
        const orig = wm.openWindow.bind(wm);
        wm.openWindow = function(id) {
            orig(id);
            document.dispatchEvent(new CustomEvent('aero:windowOpen', { detail: { windowId: id } }));
        };
    }

    document.addEventListener('DOMContentLoaded', () => {
        initBoot();
        initContextMenu();
        initTooltips();
        initClock();
        initSkillBars();
        wireContextItems();
        // Give window manager time to initialise, then patch
        setTimeout(patchWindowManager, 200);
    });

})();
