const TURNSTILE_SITE_KEY = '';

export function initContactForms(root: ParentNode = document) {
  root.querySelectorAll<HTMLFormElement>('[data-contact-form]').forEach((form) => {
    if (form.dataset.contactEnhanced === 'true') return;
    form.dataset.contactEnhanced = 'true';
    const status = form.querySelector<HTMLElement>('[data-form-status]');
    const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    const slot = form.querySelector<HTMLElement>('[data-turnstile-slot]');

    if (TURNSTILE_SITE_KEY && slot) {
      const widget = document.createElement('div');
      widget.className = 'cf-turnstile';
      widget.dataset.sitekey = TURNSTILE_SITE_KEY;
      widget.dataset.appearance = 'interaction-only';
      slot.append(widget);
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      document.head.append(script);
    }

    const announce = (message: string, state: 'error' | 'success' | 'neutral' = 'neutral') => {
      if (!status) return;
      status.textContent = message;
      status.dataset.state = state;
      status.hidden = false;
    };

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      if (status) status.hidden = true;
      if (submit) { submit.disabled = true; submit.textContent = 'Sending…'; }
      try {
        const payload = Object.fromEntries(new FormData(form));
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || !result.ok) throw new Error(result.error || 'Submission failed');
        form.reset();
        if (submit) submit.textContent = 'Sent';
        announce('Got it. I’ll get back to you.', 'success');
      } catch {
        if (submit) { submit.disabled = false; submit.textContent = 'Send message'; }
        announce('That did not send. Use the protected email option below and I’ll still get it.', 'error');
      }
    });
  });
}
