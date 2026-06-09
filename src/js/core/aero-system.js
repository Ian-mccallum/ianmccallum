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

        if (window.innerWidth <= 768) return;

        if (sessionStorage.getItem('aero-booted')) {
            boot.style.display = 'none';
            return;
        }

        const statusEl = document.getElementById('boot-status');
        const percentEl = document.getElementById('boot-percent');
        const particlesEl = document.getElementById('boot-particles');
        const skyEl = boot.querySelector('.boot-sky');

        const statusLines = [
            { text: 'Preparing your atmosphere…', hue: '200' },
            { text: 'Loading Frutiger light fields…', hue: '165' },
            { text: 'Composing glass surfaces…', hue: '280' },
            { text: 'Floating the bubbles…', hue: '95' },
            { text: 'Warming up the colors…', hue: '45' },
            { text: 'Starting personal desktop…', hue: '210' },
            { text: 'Welcome.', hue: '180' }
        ];
        const statusTimes = [0, 700, 1200, 1700, 2200, 2700, 3200];
        const timers = [];

        // Floating color particles
        if (particlesEl) {
            const hues = [185, 210, 95, 280, 45, 160, 320];
            for (let i = 0; i < 28; i++) {
                const p = document.createElement('span');
                p.className = 'boot-particle';
                p.style.setProperty('--px', (Math.random() * 100).toFixed(1) + '%');
                p.style.setProperty('--py', (Math.random() * 100).toFixed(1) + '%');
                p.style.setProperty('--ph', hues[i % hues.length]);
                p.style.setProperty('--pd', (Math.random() * 4).toFixed(2) + 's');
                p.style.setProperty('--ps', (2 + Math.random() * 4).toFixed(1) + 'px');
                p.style.setProperty('--pt', (3 + Math.random() * 5).toFixed(1) + 's');
                particlesEl.appendChild(p);
            }
        }

        // Subtle mouse parallax on sky layers
        if (skyEl) {
            boot.addEventListener('mousemove', (e) => {
                if (boot.dataset.exiting) return;
                const x = (e.clientX / window.innerWidth - 0.5) * 2;
                const y = (e.clientY / window.innerHeight - 0.5) * 2;
                skyEl.style.setProperty('--mx', x.toFixed(3));
                skyEl.style.setProperty('--my', y.toFixed(3));
            });
        }

        // Live progress percentage
        const progressStart = 1150;
        const progressDur = 2400;
        let pctFrame;
        function tickPercent() {
            if (boot.dataset.exiting) return;
            const elapsed = Date.now() - boot._progressT0;
            const t = Math.min(1, Math.max(0, (elapsed - progressStart) / progressDur));
            const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
            const pct = Math.round(eased * 100);
            if (percentEl) percentEl.textContent = pct + '%';
            if (t < 1) pctFrame = requestAnimationFrame(tickPercent);
        }
        boot._progressT0 = Date.now();
        pctFrame = requestAnimationFrame(tickPercent);

        statusTimes.forEach((ms, i) => {
            timers.push(setTimeout(() => {
                if (!statusEl || boot.dataset.exiting) return;
                const apply = () => {
                    statusEl.textContent = statusLines[i].text;
                    statusEl.style.color = `hsla(${statusLines[i].hue}, 85%, 72%, 0.95)`;
                    statusEl.style.textShadow = `0 0 14px hsla(${statusLines[i].hue}, 90%, 60%, 0.55)`;
                    statusEl.style.opacity = '1';
                };
                if (i === 0) {
                    apply();
                    return;
                }
                statusEl.style.opacity = '0';
                setTimeout(apply, 120);
            }, ms));
        });

        function skip() {
            if (boot.dataset.exiting) return;
            boot.dataset.exiting = '1';
            timers.forEach(clearTimeout);
            cancelAnimationFrame(pctFrame);
            sessionStorage.setItem('aero-booted', '1');
            boot.classList.add('boot-exit');
            setTimeout(() => { boot.style.display = 'none'; }, 880);
        }

        boot.addEventListener('click', skip);
        document.addEventListener('keydown', skip, { once: true });
        timers.push(setTimeout(skip, 3800));
    }

    function signOut() {
        sessionStorage.removeItem('aero-booted');
        const menu = document.getElementById('vista-context-menu');
        if (menu) menu.classList.remove('show');
        const start = document.getElementById('vista-startmenu');
        if (start) start.classList.remove('show');
        window.location.reload();
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
            const y = Math.min(e.clientY, window.innerHeight - 235);
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

        const signOutBtn = document.getElementById('ctx-signout');
        if (signOutBtn) signOutBtn.addEventListener('click', signOut);

        const startSignOut = document.getElementById('start-signout-btn');
        if (startSignOut) startSignOut.addEventListener('click', signOut);
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

    window.aeroSignOut = signOut;

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
