// ============================================================
// CONTACT FORM — submits to /api/contact, flows into ianOS
//
// Progressive enhancement: the form is a real <form> with a real
// action, so it works with JavaScript off (native POST, 303 to
// /thank-you). This file upgrades it to a fetch submit that keeps
// the visitor on the page.
//
// Turnstile is OPTIONAL and lives in exactly one place, the constant
// below. Empty means no widget, no script, no verification, and the
// form behaves exactly as it did before Turnstile existed. Paste the
// site key from the Cloudflare dashboard to switch it on. The site
// key is public by design; the SECRET key belongs in Vercel's
// environment and must never appear in this file.
// ============================================================

(function () {
    'use strict';

    // ── Paste your Cloudflare Turnstile SITE key here ────────────────
    const TURNSTILE_SITE_KEY = '';

    const form = document.getElementById('contactForm');
    if (!form) return;

    const status = document.getElementById('cf-status');
    const submit = document.getElementById('cf-submit');
    const slot = document.getElementById('cf-turnstile-slot');

    // ── Turnstile, only when configured ──────────────────────────────
    if (TURNSTILE_SITE_KEY && slot) {
        const widget = document.createElement('div');
        widget.className = 'cf-turnstile';
        widget.setAttribute('data-sitekey', TURNSTILE_SITE_KEY);
        // interaction-only: invisible for humans, challenges only on doubt.
        widget.setAttribute('data-appearance', 'interaction-only');
        widget.style.marginBottom = '14px';
        slot.appendChild(widget);

        const s = document.createElement('script');
        s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
        s.async = true;
        s.defer = true;
        document.head.appendChild(s);
    }

    const show = function (message) {
        if (!status) return;
        status.textContent = message;
        status.hidden = false;
    };

    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        if (status) status.hidden = true;

        const name = form.elements.name.value.trim();
        const email = form.elements.email.value.trim();
        const message = form.elements.message.value.trim();

        if (!name || !email || !message) return show('Name, email and message are required.');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return show('That email address looks off.');

        if (submit) {
            submit.disabled = true;
            submit.textContent = 'Sending…';
        }

        try {
            // FormData picks up the Turnstile token automatically: the widget
            // writes it into a hidden cf-turnstile-response input in the form.
            const payload = Object.fromEntries(new FormData(form));
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await res.json().catch(function () { return {}; });
            if (!res.ok || !result.ok) throw new Error(result.error || 'failed');

            form.reset();
            if (submit) {
                submit.textContent = 'Sent';
                submit.style.background = 'linear-gradient(to bottom,#4caf50,#2e7d32)';
                submit.style.borderColor = '#2e7d32';
            }
            show('Got it. I\'ll get back to you.');
        } catch (err) {
            if (submit) {
                submit.disabled = false;
                submit.textContent = 'Send message';
            }
            // Never a dead end: the shielded address below is the fallback.
            show('That did not send. Use the email below and I\'ll still get it.');
        }
    });
})();
