function initAero() {
  const frame = document.querySelector<HTMLElement>('[data-window-frame]');
  const startButton = document.querySelector<HTMLButtonElement>('[data-start-button]');
  const startMenu = document.querySelector<HTMLElement>('#start-menu');
  const minimize = document.querySelector<HTMLButtonElement>('[data-window-minimize]');
  const maximize = document.querySelector<HTMLButtonElement>('[data-window-maximize]');
  const restore = document.querySelector<HTMLAnchorElement>('[data-taskbar-restore]');
  const clock = document.querySelector<HTMLTimeElement>('[data-clock]');

  const closeMenu = (returnFocus = false) => {
    if (!startMenu || !startButton) return;
    startMenu.hidden = true;
    startButton.setAttribute('aria-expanded', 'false');
    if (returnFocus) startButton.focus();
  };

  startButton?.addEventListener('click', (event) => {
    event.stopPropagation();
    if (!startMenu) return;
    const opening = startMenu.hidden;
    startMenu.hidden = !opening;
    startButton.setAttribute('aria-expanded', String(opening));
    if (opening) startMenu.querySelector<HTMLAnchorElement>('a')?.focus();
  });

  document.addEventListener('click', (event) => {
    if (!startMenu?.hidden && !startMenu?.contains(event.target as Node) && !startButton?.contains(event.target as Node)) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !startMenu?.hidden) {
      event.preventDefault();
      closeMenu(true);
    }
  });

  minimize?.addEventListener('click', () => {
    frame?.classList.add('is-minimized');
    restore?.focus();
  });

  maximize?.addEventListener('click', () => {
    if (!frame) return;
    const restored = frame.classList.toggle('is-restored');
    frame.classList.toggle('is-maximized', !restored);
    maximize.setAttribute('aria-label', restored ? 'Maximize window' : 'Restore window');
  });

  restore?.addEventListener('click', (event) => {
    if (!frame?.classList.contains('is-minimized')) return;
    event.preventDefault();
    frame.classList.remove('is-minimized');
    minimize?.focus();
  });

  const updateClock = () => {
    if (!clock) return;
    const now = new Date();
    clock.dateTime = now.toISOString();
    clock.textContent = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };
  updateClock();
  window.setInterval(updateClock, 60_000);

  const boot = document.querySelector<HTMLElement>('[data-boot-overlay]');
  if (boot) {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let seen = false;
    try { seen = sessionStorage.getItem('aero-boot-seen') === '1'; } catch { seen = true; }
    const dismiss = () => {
      boot.classList.add('is-leaving');
      window.setTimeout(() => boot.remove(), reduced ? 0 : 170);
      try { sessionStorage.setItem('aero-boot-seen', '1'); } catch { /* storage is optional */ }
    };
    if (seen || reduced) boot.remove();
    else {
      boot.hidden = false;
      document.querySelector<HTMLButtonElement>('[data-skip-boot]')?.addEventListener('click', dismiss, { once: true });
      window.setTimeout(dismiss, 760);
    }
  }
}

initAero();
