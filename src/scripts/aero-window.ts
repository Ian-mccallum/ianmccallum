import { initCvViewers } from './cv-mode';
import { initEmailShields } from './email-shield';
import { initPhotoGalleries } from './photo-gallery';
import { initProjectVideos } from './project-video';
import { isCompact } from './viewport';

// Progressive desktop window manager: the static route remains canonical, while
// ordinary same-origin clicks can open that route's existing frame beside it.
// Native links remain intact for modified clicks, compact screens, and JavaScript-off use.

function initAero() {
  const shell = document.querySelector<HTMLElement>('[data-aero-shell]');
  const host = document.querySelector<HTMLElement>('[data-window-host]');
  const startButton = document.querySelector<HTMLButtonElement>('[data-start-button]');
  const startMenu = document.querySelector<HTMLElement>('#start-menu');
  const startScrim = document.querySelector<HTMLElement>('[data-start-scrim]');
  const runningItems = document.querySelector<HTMLElement>('[data-taskbar-running]');
  const status = document.querySelector<HTMLElement>('[data-window-status]');
  const clock = document.querySelector<HTMLTimeElement>('[data-clock]');
  const date = document.querySelector<HTMLElement>('[data-date]');
  let zIndex = 10;
  let cascade = 0;

  if (!shell || !host) return;

  const desktopMode = () => !isCompact();
  const normalizeRoute = (href: string) => new URL(href, window.location.href).pathname;
  const frames = () => Array.from(host.querySelectorAll<HTMLElement>('[data-window-frame]'));
  const frameForRoute = (route: string) => frames().find((frame) => frame.dataset.windowRoute === route);
  const frameTitle = (frame: HTMLElement) => frame.querySelector<HTMLElement>('.window-titlebar__title span')?.textContent?.trim() || 'Window';

  const announce = (message: string) => {
    if (status) status.textContent = message;
  };

  const syncMaximizeLabel = (frame: HTMLElement) => {
    frame.querySelector<HTMLButtonElement>('[data-window-maximize]')?.setAttribute(
      'aria-label',
      frame.classList.contains('is-maximized') ? 'Restore window' : 'Maximize window',
    );
  };

  const setActive = (frame: HTMLElement) => {
    frames().forEach((candidate) => candidate.classList.toggle('is-active', candidate === frame));
    frame.style.zIndex = String(++zIndex);
    document.querySelectorAll<HTMLElement>('[data-taskbar-route]').forEach((item) => {
      const match = item.dataset.taskbarRoute === frame.dataset.windowRoute;
      item.classList.toggle('is-active', match && !frame.classList.contains('is-minimized'));
    });
  };

  const ensureTaskbarItem = (frame: HTMLElement) => {
    const route = frame.dataset.windowRoute;
    if (!route || document.querySelector(`[data-taskbar-route="${CSS.escape(route)}"]`) || !runningItems) return;
    const item = document.createElement('a');
    const title = frameTitle(frame);
    item.href = route;
    item.className = 'taskbar-item is-open';
    item.dataset.taskbarRoute = route;
    item.setAttribute('aria-label', `Restore ${title}`);
    const sourceIcon = frame.querySelector<HTMLImageElement>('.window-titlebar__title img');
    if (sourceIcon) {
      const icon = sourceIcon.cloneNode(true) as HTMLImageElement;
      icon.width = 22;
      icon.height = 22;
      icon.sizes = '22px';
      item.append(icon);
    }
    const label = document.createElement('span');
    label.textContent = title;
    item.append(label);
    runningItems.append(item);
  };

  const removeTaskbarItem = (route?: string) => {
    if (!route) return;
    document.querySelector<HTMLElement>(`[data-taskbar-running] [data-taskbar-route="${CSS.escape(route)}"]`)?.remove();
  };

  const updateTaskbar = () => {
    document.querySelectorAll<HTMLElement>('[data-taskbar-route]').forEach((item) => {
      const frame = item.dataset.taskbarRoute ? frameForRoute(item.dataset.taskbarRoute) : undefined;
      item.classList.toggle('is-open', Boolean(frame));
      item.classList.toggle('is-minimized', Boolean(frame?.classList.contains('is-minimized')));
      if (!frame) item.classList.remove('is-active');
    });
  };

  const placeRestoredWindow = (frame: HTMLElement) => {
    if (!frame.dataset.windowDynamic && !frame.classList.contains('is-floating')) return;
    const hostRect = host.getBoundingClientRect();
    const width = Math.min(900, Math.max(620, hostRect.width - 180));
    const height = Math.min(700, Math.max(480, hostRect.height - 70));
    cascade = (cascade + 1) % 6;
    frame.style.width = `${width}px`;
    frame.style.height = `${height}px`;
    frame.style.left = `${Math.max(96, (hostRect.width - width) / 2 + cascade * 18)}px`;
    frame.style.top = `${18 + cascade * 16}px`;
  };

  const toggleMaximize = (frame: HTMLElement) => {
    const maximizing = !frame.classList.contains('is-maximized');
    const control = frame.querySelector<HTMLButtonElement>('[data-window-maximize]');
    if (maximizing) {
      frame.dataset.restoreLeft = frame.style.left;
      frame.dataset.restoreTop = frame.style.top;
      frame.dataset.restoreWidth = frame.style.width;
      frame.dataset.restoreHeight = frame.style.height;
      frame.classList.remove('is-restored');
      frame.classList.add('is-maximized');
      frame.style.removeProperty('left');
      frame.style.removeProperty('top');
      frame.style.removeProperty('width');
      frame.style.removeProperty('height');
      frame.style.removeProperty('margin');
    } else {
      frame.classList.remove('is-maximized');
      frame.classList.add('is-restored');
      if (frame.dataset.windowDynamic || frame.classList.contains('is-floating')) {
        frame.style.left = frame.dataset.restoreLeft || '';
        frame.style.top = frame.dataset.restoreTop || '';
        frame.style.width = frame.dataset.restoreWidth || '';
        frame.style.height = frame.dataset.restoreHeight || '';
        if (!frame.style.left) placeRestoredWindow(frame);
      }
    }
    control?.setAttribute('aria-label', maximizing ? 'Restore window' : 'Maximize window');
    setActive(frame);
  };

  // Media inside a window (project demos) pauses and resumes with it.
  const windowStateChanged = (frame: HTMLElement) => frame.dispatchEvent(new CustomEvent('aero:window-state'));

  const minimizeFrame = (frame: HTMLElement) => {
    frame.classList.add('is-minimized');
    windowStateChanged(frame);
    frame.classList.remove('is-active');
    ensureTaskbarItem(frame);
    updateTaskbar();
    const next = frames().filter((candidate) => !candidate.classList.contains('is-minimized')).at(-1);
    if (next) setActive(next);
    announce(`${frameTitle(frame)} minimized.`);
  };

  const restoreFrame = (frame: HTMLElement) => {
    frame.classList.remove('is-minimized');
    windowStateChanged(frame);
    setActive(frame);
    updateTaskbar();
    announce(`${frameTitle(frame)} restored.`);
  };

  const closeFrame = (frame: HTMLElement) => {
    if (frame.dataset.windowPrimary !== undefined) {
      if (window.location.pathname !== '/') window.location.assign('/');
      // On a compact screen the Welcome window is the screen; there is no desktop to reveal.
      else if (desktopMode()) minimizeFrame(frame);
      return;
    }
    const title = frameTitle(frame);
    removeTaskbarItem(frame.dataset.windowRoute);
    frame.remove();
    updateTaskbar();
    const next = frames().filter((candidate) => !candidate.classList.contains('is-minimized')).at(-1);
    if (next) setActive(next);
    announce(`${title} closed.`);
  };

  // "Read more" disclosures: a link to an id inside one opens it, and its own
  // close button folds it back and returns the reader to its summary.
  const initDisclosures = (root: ParentNode) => {
    root.querySelectorAll<HTMLButtonElement>('[data-details-close]').forEach((button) => { button.hidden = false; });
  };
  const openLinkedDisclosure = () => {
    const target = window.location.hash ? document.getElementById(decodeURIComponent(window.location.hash.slice(1))) : null;
    const details = target?.closest('details');
    if (details && !details.open) {
      details.open = true;
      target?.scrollIntoView({ block: 'start' });
    }
  };

  const hydrateDynamicWindow = (frame: HTMLElement) => {
    frame.querySelectorAll<HTMLElement>('[autofocus]').forEach((element) => element.removeAttribute('autofocus'));
    initEmailShields(frame);
    initPhotoGalleries(frame);
    initCvViewers(frame);
    initProjectVideos(frame);
    initDisclosures(frame);
  };

  const openRouteWindow = async (href: string) => {
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin || !desktopMode()) {
      window.location.assign(url.href);
      return;
    }
    const route = url.pathname;
    const existing = frameForRoute(route);
    if (existing) {
      restoreFrame(existing);
      if (url.hash) existing.querySelector<HTMLElement>(url.hash)?.scrollIntoView({ block: 'start' });
      return;
    }

    announce(`Opening ${route}.`);
    try {
      const response = await fetch(route, { headers: { 'X-Aero-Window': '1' } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const page = new DOMParser().parseFromString(await response.text(), 'text/html');
      const source = page.querySelector<HTMLElement>('[data-window-frame]');
      if (!source) throw new Error('Window content missing');
      const frame = source.cloneNode(true) as HTMLElement;
      frame.removeAttribute('data-window-primary');
      frame.dataset.windowDynamic = 'true';
      frame.dataset.windowRoute = route;
      frame.classList.remove('is-maximized', 'is-minimized');
      frame.classList.add('is-restored', 'is-dynamic-window');
      frame.querySelectorAll('script').forEach((script) => script.remove());
      host.append(frame);
      placeRestoredWindow(frame);
      hydrateDynamicWindow(frame);
      syncMaximizeLabel(frame);
      ensureTaskbarItem(frame);
      setActive(frame);
      updateTaskbar();
      if (url.hash) frame.querySelector<HTMLElement>(url.hash)?.scrollIntoView({ block: 'start' });
      announce(`${frameTitle(frame)} opened.`);
    } catch {
      window.location.assign(url.href);
    }
  };

  const closeMenu = (returnFocus = false) => {
    if (!startMenu || !startButton) return;
    startMenu.classList.remove('is-open');
    startMenu.hidden = true;
    if (startScrim) startScrim.hidden = true;
    document.body.classList.remove('is-start-open');
    startButton.setAttribute('aria-expanded', 'false');
    if (returnFocus) startButton.focus();
  };

  const openMenu = () => {
    if (!startMenu || !startButton) return;
    startMenu.hidden = false;
    if (startScrim) startScrim.hidden = false;
    // Compact screens show Start as a sheet over the page, so the page holds still.
    document.body.classList.add('is-start-open');
    requestAnimationFrame(() => startMenu.classList.add('is-open'));
    startButton.setAttribute('aria-expanded', 'true');
    (startMenu.querySelector<HTMLAnchorElement>('[data-start-entry][aria-current]') ?? startMenu.querySelector<HTMLAnchorElement>('a'))?.focus({ preventScroll: true });
  };

  // A page restored from the back/forward cache must not come back mid-gesture.
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) closeMenu();
  });

  startButton?.addEventListener('click', (event) => {
    event.stopPropagation();
    if (startMenu?.hidden) openMenu();
    else closeMenu();
  });

  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const control = target.closest<HTMLElement>('.window-control');
    if (control) {
      const frame = control.closest<HTMLElement>('[data-window-frame]');
      if (!frame) return;
      event.preventDefault();
      event.stopPropagation();
      if (control.matches('[data-window-minimize]')) minimizeFrame(frame);
      else if (control.matches('[data-window-maximize]')) toggleMaximize(frame);
      else if (control.classList.contains('window-control--close')) closeFrame(frame);
      return;
    }

    // Like a native tab bar, choosing the page already on screen returns to its top.
    const sameRoute = target.closest<HTMLAnchorElement>('[data-taskbar-route], [data-start-entry]');
    if (sameRoute && !desktopMode() && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey
      && normalizeRoute(sameRoute.href) === window.location.pathname && !new URL(sameRoute.href).hash) {
      event.preventDefault();
      closeMenu();
      window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      return;
    }

    const taskbarItem = target.closest<HTMLAnchorElement>('[data-taskbar-route]');
    if (taskbarItem && desktopMode() && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
      event.preventDefault();
      const route = taskbarItem.dataset.taskbarRoute || normalizeRoute(taskbarItem.href);
      const frame = frameForRoute(route);
      if (!frame) void openRouteWindow(taskbarItem.href);
      else if (frame.classList.contains('is-minimized')) restoreFrame(frame);
      else if (frame.classList.contains('is-active')) minimizeFrame(frame);
      else setActive(frame);
      closeMenu();
      return;
    }

    const disclosureClose = target.closest<HTMLElement>('[data-details-close]')?.closest('details');
    if (disclosureClose) {
      disclosureClose.open = false;
      const summary = disclosureClose.querySelector<HTMLElement>('summary');
      summary?.focus({ preventScroll: true });
      summary?.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      return;
    }

    if (target.closest('[data-start-close]')) {
      closeMenu(true);
      return;
    }
    if (target.closest('[data-replay-welcome]')) {
      try { sessionStorage.removeItem('aero-boot-seen'); } catch { /* storage is optional */ }
      window.location.assign('/');
      return;
    }

    const windowLink = target.closest<HTMLAnchorElement>('a[data-window-link]');
    if (windowLink && desktopMode() && windowLink.target !== '_blank' && !windowLink.hasAttribute('download') && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
      event.preventDefault();
      void openRouteWindow(windowLink.href);
      closeMenu();
      return;
    }

    const frame = target.closest<HTMLElement>('[data-window-frame]');
    if (frame && !frame.classList.contains('is-minimized')) setActive(frame);
    if (!startMenu?.hidden && !startMenu?.contains(target) && !startButton?.contains(target)) closeMenu();
  });

  // iOS Safari only applies :active press states once a touch listener exists.
  document.addEventListener('touchstart', () => undefined, { passive: true });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !startMenu?.hidden) {
      event.preventDefault();
      closeMenu(true);
    }
  });

  document.querySelector<HTMLInputElement>('[data-start-search]')?.addEventListener('input', (event) => {
    const query = (event.currentTarget as HTMLInputElement).value.trim().toLowerCase();
    document.querySelectorAll<HTMLElement>('[data-start-entry]').forEach((entry) => {
      entry.hidden = Boolean(query) && !entry.textContent?.toLowerCase().includes(query);
    });
  });

  host.addEventListener('dblclick', (event) => {
    const titlebar = (event.target as HTMLElement).closest<HTMLElement>('.window-titlebar');
    if (titlebar && !(event.target as HTMLElement).closest('.window-controls') && desktopMode()) {
      const frame = titlebar.closest<HTMLElement>('[data-window-frame]');
      if (frame) toggleMaximize(frame);
    }
  });

  host.addEventListener('pointerdown', (event) => {
    const target = event.target as HTMLElement;
    const titlebar = target.closest<HTMLElement>('.window-titlebar');
    const frame = titlebar?.closest<HTMLElement>('[data-window-frame]');
    if (!titlebar || !frame || target.closest('.window-controls') || !desktopMode() || frame.classList.contains('is-maximized')) return;
    event.preventDefault();
    setActive(frame);
    const hostRect = host.getBoundingClientRect();
    const frameRect = frame.getBoundingClientRect();
    const offsetX = event.clientX - frameRect.left;
    const offsetY = event.clientY - frameRect.top;
    frame.classList.add('is-floating', 'is-dragging');
    frame.style.width = `${frameRect.width}px`;
    frame.style.height = `${frameRect.height}px`;
    frame.style.left = `${frameRect.left - hostRect.left}px`;
    frame.style.top = `${frameRect.top - hostRect.top}px`;
    frame.style.margin = '0';
    titlebar.setPointerCapture(event.pointerId);

    const move = (moveEvent: PointerEvent) => {
      const maxX = Math.max(8, hostRect.width - frameRect.width - 8);
      const maxY = Math.max(8, hostRect.height - titlebar.offsetHeight);
      frame.style.left = `${Math.min(maxX, Math.max(8, moveEvent.clientX - hostRect.left - offsetX))}px`;
      frame.style.top = `${Math.min(maxY, Math.max(8, moveEvent.clientY - hostRect.top - offsetY))}px`;
    };
    const end = () => {
      frame.classList.remove('is-dragging');
      titlebar.removeEventListener('pointermove', move);
      titlebar.removeEventListener('pointerup', end);
      titlebar.removeEventListener('pointercancel', end);
    };
    titlebar.addEventListener('pointermove', move);
    titlebar.addEventListener('pointerup', end);
    titlebar.addEventListener('pointercancel', end);
  });

  const updateClock = () => {
    if (!clock) return;
    const now = new Date();
    clock.dateTime = now.toISOString();
    clock.textContent = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    if (date) date.textContent = now.toLocaleDateString([], { weekday: 'short', month: 'numeric', day: 'numeric' });
  };
  updateClock();
  window.setInterval(updateClock, 60_000);

  const primary = host.querySelector<HTMLElement>('[data-window-primary]');
  initEmailShields(document);
  initPhotoGalleries(document);
  initCvViewers(document);
  initProjectVideos(document);
  initDisclosures(document);
  openLinkedDisclosure();
  window.addEventListener('hashchange', openLinkedDisclosure);
  if (primary) {
    syncMaximizeLabel(primary);
    ensureTaskbarItem(primary);
    setActive(primary);
    updateTaskbar();
  }

const boot = document.querySelector<HTMLElement>('[data-boot-overlay]');
if (boot) {
  const root = document.documentElement;
  // The inline head script raises the overlay only for a first visit this session with motion allowed.
  if (!root.classList.contains('is-booting')) boot.remove();
  else {
    const MIN_MS = 1000;
    const CAP_MS = 2000;
    const EXIT_MS = 600;
    const progress = boot.querySelector<HTMLElement>('[data-boot-progress]');
    const orb = boot.querySelector<HTMLElement>('[data-boot-orb]');
    const timers: number[] = [];
    let dismissed = false;
    // Time the sequence from when the orb's animation started painting, not from navigation.
    const startedAt = boot.querySelector('.boot-orb__glass')?.getAnimations()[0]?.startTime;
    const t0 = typeof startedAt === 'number' ? startedAt : performance.now();
    const wait = (until: number) => Math.max(0, until - performance.now());

    const finish = () => {
      boot.remove();
      root.classList.remove('is-booting', 'boot-handoff');
    };
    const dismiss = () => {
      if (dismissed) return;
      dismissed = true;
      timers.forEach(window.clearTimeout);
      document.removeEventListener('keydown', onBootKey);
      try { sessionStorage.setItem('aero-boot-seen', '1'); } catch { /* storage is optional */ }
      const startTile = document.querySelector<HTMLElement>('.start-im');
      const to = startTile?.getBoundingClientRect();
      const from = orb?.getBoundingClientRect();
      // Nothing to hand off when the overlay is already hidden (page skip link target, CSS failsafe) or Start is missing.
      if (!orb || !startTile || !to?.width || !from?.width || getComputedStyle(boot).visibility === 'hidden') {
        finish();
        return;
      }
      orb.style.setProperty('--dx', `${to.left + to.width / 2 - (from.left + from.width / 2)}px`);
      (orb.firstElementChild as HTMLElement).style.setProperty('--dy', `${to.top + to.height / 2 - (from.top + from.height / 2)}px`);
      (orb.firstElementChild as HTMLElement).style.setProperty('--s', (to.width / from.width).toFixed(3));
      root.classList.add('boot-handoff');
      boot.classList.add('is-leaving');
      window.setTimeout(() => {
        finish();
        startTile.classList.add('is-landing');
        window.setTimeout(() => startTile.classList.remove('is-landing'), 520);
      }, EXIT_MS);
    };
    const onBootKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') dismiss();
    };

    // Ready means what the Welcome window shows: parsed document (this module running), fonts, and the photo.
    // Not window load: on cellular that waits for every icon, the background poster and video.
    const steps: Promise<unknown>[] = [
      document.fonts.ready,
      document.querySelector<HTMLImageElement>('.welcome-profile img')?.decode().catch(() => undefined) ?? Promise.resolve(),
    ];
    let done = 1;
    const report = () => {
      const share = done / (steps.length + 1);
      progress?.style.setProperty('--p', share.toFixed(3));
      progress?.setAttribute('aria-valuenow', String(Math.round(share * 100)));
    };
    report();
    steps.forEach((step) => void step.then(() => { done += 1; if (!dismissed) report(); }));
    void Promise.all(steps).then(() => { if (!dismissed) timers.push(window.setTimeout(dismiss, wait(t0 + MIN_MS))); });
    timers.push(window.setTimeout(dismiss, wait(t0 + CAP_MS)));
    // Escape or a tap anywhere lets a visitor in early.
    boot.addEventListener('click', dismiss);
    document.addEventListener('keydown', onBootKey);
  }
}
}

initAero();
