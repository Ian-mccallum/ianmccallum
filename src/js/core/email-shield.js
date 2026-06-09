// ============================================================
// EMAIL SHIELD — Two-step protection
//
// Step 1 (Cloudflare): Set up in dashboard — see README
// Step 2 (this file): Emails stored as char-code arrays,
//   never as plaintext in HTML. Assembled only AFTER the
//   visitor solves a randomised arithmetic problem.
// ============================================================

window.EmailShield = (function () {
    'use strict';

    // ── Email storage: char codes only — no plaintext anywhere ────────
    // ian@beatyourclock.com
    // mccallum.ian@icloud.com
    const VAULT = {
        work: {
            u: [105,97,110],
            d: [98,101,97,116,121,111,117,114,99,108,111,99,107,46,99,111,109]
        },
        personal: {
            u: [109,99,99,97,108,108,117,109,46,105,97,110],
            d: [105,99,108,111,117,100,46,99,111,109]
        }
    };

    function assemble(which) {
        const v = VAULT[which] || VAULT.work;
        const chars = c => c.map(n => String.fromCharCode(n)).join('');
        return chars(v.u) + '@' + chars(v.d);
    }

    // ── Math challenge generator ──────────────────────────────────────
    function newMath() {
        // Three question types — all produce a small positive integer
        const type = Math.floor(Math.random() * 3);
        let a, b, answer, q;
        switch (type) {
            case 0: // addition
                a = Math.floor(Math.random() * 13) + 4;
                b = Math.floor(Math.random() * 13) + 4;
                answer = a + b;
                q = `${a} + ${b}`;
                break;
            case 1: // subtraction (guaranteed positive)
                a = Math.floor(Math.random() * 10) + 13;
                b = Math.floor(Math.random() * 9)  + 2;
                answer = a - b;
                q = `${a} − ${b}`;
                break;
            case 2: // small multiplication
                a = Math.floor(Math.random() * 7) + 2;
                b = Math.floor(Math.random() * 5) + 2;
                answer = a * b;
                q = `${a} × ${b}`;
                break;
        }
        return { question: q, answer };
    }

    // ── Open challenge for a given trigger element ────────────────────
    function challenge(triggerEl) {
        const shield = triggerEl.closest('.email-shield');
        if (!shield) return;

        const math = newMath();
        shield._correctAnswer = math.answer;

        const textEl = shield.querySelector('.challenge-text');
        if (textEl) textEl.textContent = `What is  ${math.question}  = `;

        // Hide reveal button, show challenge
        triggerEl.style.display = 'none';
        const ch = shield.querySelector('.email-challenge');
        if (ch) {
            ch.style.display = 'inline-flex';
            const inp = ch.querySelector('.challenge-input');
            if (inp) {
                inp.value = '';
                inp.style.borderColor = '';
            }
            const errEl = shield.querySelector('.challenge-error');
            if (errEl) errEl.style.display = 'none';
            setTimeout(() => inp && inp.focus(), 60);
        }
    }

    // ── Verify the answer ────────────────────────────────────────────
    function verify(submitEl) {
        const shield = submitEl.closest('.email-shield');
        if (!shield) return;

        const inp   = shield.querySelector('.challenge-input');
        const errEl = shield.querySelector('.challenge-error');
        const val   = parseInt(inp ? inp.value : '', 10);

        if (isNaN(val) || val !== shield._correctAnswer) {
            // Wrong — shake input, show error, generate fresh question
            if (inp) {
                inp.style.borderColor = '#e53e3e';
                inp.value = '';
            }
            if (errEl) errEl.style.display = 'inline';

            setTimeout(() => {
                const math = newMath();
                shield._correctAnswer = math.answer;
                const textEl = shield.querySelector('.challenge-text');
                if (textEl) textEl.textContent = `What is  ${math.question}  = `;
                if (errEl) errEl.style.display = 'none';
                if (inp) {
                    inp.style.borderColor = '';
                    inp.focus();
                }
            }, 1500);
            return;
        }

        // ✓ Correct — assemble email and reveal with fade
        const email  = assemble(shield.dataset.which || 'work');
        const revEl  = shield.querySelector('.email-revealed');
        const linkEl = revEl ? revEl.querySelector('.email-link') : null;

        if (linkEl) {
            linkEl.textContent = email;
            linkEl.href        = 'mailto:' + email;
        }

        const ch = shield.querySelector('.email-challenge');
        if (ch) ch.style.display = 'none';

        if (revEl) {
            revEl.style.cssText = 'display:inline-flex;align-items:center;gap:6px;opacity:0;';
            requestAnimationFrame(() => {
                revEl.style.transition = 'opacity 0.30s ease';
                revEl.style.opacity    = '1';
            });
        }
    }

    // ── Copy email to clipboard ───────────────────────────────────────
    function copyEmail(copyEl) {
        const revEl  = copyEl.closest('.email-revealed');
        const linkEl = revEl ? revEl.querySelector('.email-link') : null;
        const text   = linkEl ? linkEl.textContent : '';
        if (!text) return;

        const succeed = () => {
            const orig = copyEl.innerHTML;
            copyEl.innerHTML = '<i class="fas fa-check"></i>';
            copyEl.style.color = '#16a34a';
            setTimeout(() => {
                copyEl.innerHTML = orig;
                copyEl.style.color = '';
            }, 1600);
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(succeed).catch(() => fallback(text, succeed));
        } else {
            fallback(text, succeed);
        }
    }

    function fallback(text, cb) {
        try {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0;pointer-events:none;';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            ta.remove();
            if (cb) cb();
        } catch (e) {}
    }

    // ── Enter key support ────────────────────────────────────────────
    document.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter') return;
        if (!e.target.classList.contains('challenge-input')) return;
        e.preventDefault();
        const ch  = e.target.closest('.email-challenge');
        const btn = ch && ch.querySelector('.challenge-submit');
        if (btn) verify(btn);
    });

    return { challenge, verify, copy: copyEmail };
})();
