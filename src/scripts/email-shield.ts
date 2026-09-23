type Shield = HTMLElement & { _correctAnswer?: number };
const vault = { u: [105, 97, 110], d: [98, 101, 97, 116, 121, 111, 117, 114, 99, 108, 111, 99, 107, 46, 99, 111, 109] };
const decode = (values: number[]) => values.map((value) => String.fromCharCode(value)).join('');
const address = () => `${decode(vault.u)}@${decode(vault.d)}`;
const challenge = () => {
  const a = Math.floor(Math.random() * 10) + 6;
  const b = Math.floor(Math.random() * 9) + 3;
  return { text: `${a} + ${b}`, answer: a + b };
};

document.querySelectorAll<Shield>('[data-email-shield]').forEach((shield) => {
  const trigger = shield.querySelector<HTMLButtonElement>('[data-email-reveal]');
  const panel = shield.querySelector<HTMLElement>('[data-email-challenge]');
  const question = shield.querySelector<HTMLElement>('[data-email-question]');
  const input = shield.querySelector<HTMLInputElement>('input');
  const verify = shield.querySelector<HTMLButtonElement>('[data-email-verify]');
  const output = shield.querySelector<HTMLElement>('[data-email-output]');
  const link = shield.querySelector<HTMLAnchorElement>('[data-email-link]');
  const error = shield.querySelector<HTMLElement>('[data-email-error]');

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
      if (error) error.hidden = false;
      reset();
      input?.focus();
      return;
    }
    if (panel) panel.hidden = true;
    if (output) output.hidden = false;
    if (link) { link.textContent = address(); link.href = `mailto:${address()}`; link.focus(); }
  };
  verify?.addEventListener('click', check);
  input?.addEventListener('keydown', (event) => { if (event.key === 'Enter') { event.preventDefault(); check(); } });
});
