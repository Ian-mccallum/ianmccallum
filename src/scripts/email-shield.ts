type Shield = HTMLElement & { _correctAnswer?: number };
const vault = { u: [105, 97, 110], d: [98, 101, 97, 116, 121, 111, 117, 114, 99, 108, 111, 99, 107, 46, 99, 111, 109] };
const decode = (values: number[]) => values.map((value) => String.fromCharCode(value)).join('');
const address = () => `${decode(vault.u)}@${decode(vault.d)}`;
const challenge = () => {
  const a = Math.floor(Math.random() * 10) + 6;
  const b = Math.floor(Math.random() * 9) + 3;
  return { text: `${a} + ${b}`, answer: a + b };
};

export function initEmailShields(root: ParentNode = document) {
  root.querySelectorAll<Shield>('[data-email-shield]').forEach((shield) => {
    if (shield.dataset.emailEnhanced === 'true') return;
    shield.dataset.emailEnhanced = 'true';
    const trigger = shield.querySelector<HTMLButtonElement>('[data-email-reveal]');
    const panel = shield.querySelector<HTMLElement>('[data-email-challenge]');
    const question = shield.querySelector<HTMLElement>('[data-email-question]');
    const input = shield.querySelector<HTMLInputElement>('input');
    const verify = shield.querySelector<HTMLButtonElement>('[data-email-verify]');
    const output = shield.querySelector<HTMLElement>('[data-email-output]');
    const link = shield.querySelector<HTMLAnchorElement>('[data-email-link]');
    const error = shield.querySelector<HTMLElement>('[data-email-error]');
    const copy = shield.querySelector<HTMLButtonElement>('[data-email-copy]');
    const copied = shield.querySelector<HTMLElement>('[data-email-copied]');
    const errorText = error?.textContent ?? '';
    let copyTimer = 0;

    const reset = () => {
      const math = challenge();
      shield._correctAnswer = math.answer;
      if (question) question.textContent = `What is ${math.text}?`;
      if (input) input.value = '';
    };
    trigger?.addEventListener('click', () => {
      reset();
      trigger.hidden = true;
      if (panel) panel.hidden = false;
      input?.focus();
    });
    const check = () => {
      if (!input || Number(input.value) !== shield._correctAnswer) {
        if (error) {
          // Rewriting the text makes a repeated miss announce again.
          error.textContent = '';
          error.hidden = false;
          requestAnimationFrame(() => { error.textContent = errorText; });
        }
        reset();
        input?.focus();
        return;
      }
      if (panel) panel.hidden = true;
      if (output) output.hidden = false;
      if (copy && navigator.clipboard) copy.hidden = false;
      if (link) { link.textContent = address(); link.href = `mailto:${address()}`; link.focus(); }
    };
    verify?.addEventListener('click', check);
    input?.addEventListener('keydown', (event) => { if (event.key === 'Enter') { event.preventDefault(); check(); } });

    // A phone often has no mail app signed in; copying is the reliable path.
    copy?.addEventListener('click', async () => {
      window.clearTimeout(copyTimer);
      try {
        await navigator.clipboard.writeText(address());
        copy.textContent = 'Copied';
        if (copied) copied.textContent = 'Email address copied to clipboard.';
      } catch {
        if (copied) copied.textContent = 'Couldn’t copy. Select the address instead.';
      }
      copyTimer = window.setTimeout(() => {
        copy.textContent = 'Copy address';
        if (copied) copied.textContent = '';
      }, 2400);
    });
  });
}
