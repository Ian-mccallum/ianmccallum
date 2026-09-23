import { initEmailShields } from './email-shield';
import { initPhotoGalleries } from './photo-gallery';

// Progressive desktop window manager: the static route remains canonical, while
// ordinary same-origin clicks can open that route's existing frame beside it.
// Native links remain intact for modified clicks, mobile, and JavaScript-off use.
const DESKTOP_BREAKPOINT = 760;

function initAero() {
  const shell = document.querySelector<HTMLElement>('[data-aero-shell]');
  const host = document.querySelector<HTMLElement>('[data-window-host]');
  const startButton = document.querySelector<HTMLButtonElement>('[data-start-button]');
  const startMenu = document.querySelector<HTMLElement>('#start-menu');
  const runningItems = document.querySelector<HTMLElement>('[data-taskbar-running]');
  const status = document.querySelector<HTMLElement>('[data-window-status]');
  const clock = document.querySelector<HTMLTimeElement>('[data-clock]');
  const date = document.querySelector<HTMLElement>('[data-date]');
  let zIndex = 10;
  let cascade = 0;

  if (!shell || !host) return;

  const desktopMode = () => window.innerWidth > DESKTOP_BREAKPOINT;
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

  const minimizeFrame = (frame: HTMLElement) => {
    frame.classList.add('is-minimized');
    frame.classList.remove('is-active');
    ensureTaskbarItem(frame);
    updateTaskbar();
    const next = frames().filter((candidate) => !candidate.classList.contains('is-minimized')).at(-1);
    if (next) setActive(next);
    announce(`${frameTitle(frame)} minimized.`);
  };

  const restoreFrame = (frame: HTMLElement) => {
    frame.classList.remove('is-minimized');
    setActive(frame);
    updateTaskbar();
    announce(`${frameTitle(frame)} restored.`);
  };

  const closeFrame = (frame: HTMLElement) => {
    if (frame.dataset.windowPrimary !== undefined) {
      if (window.location.pathname !== '/') window.location.assign('/');
      else minimizeFrame(frame);
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

  const hydrateDynamicWindow = (frame: HTMLElement) => {
    frame.querySelectorAll<HTMLElement>('[autofocus]').forEach((element) => element.removeAttribute('autofocus'));
    initEmailShields(frame);
    initPhotoGalleries(frame);
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
    startButton.setAttribute('aria-expanded', 'false');
    if (returnFocus) startButton.focus();
  };

  const openMenu = () => {
    if (!startMenu || !startButton) return;
    startMenu.hidden = false;
    requestAnimationFrame(() => startMenu.classList.add('is-open'));
    startButton.setAttribute('aria-expanded', 'true');
    startMenu.querySelector<HTMLAnchorElement>('a')?.focus();
  };

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
  if (primary) {
    syncMaximizeLabel(primary);
    ensureTaskbarItem(primary);
    setActive(primary);
    updateTaskbar();
  }

const boot = document.querySelector<HTMLElement>('[data-boot-overlay]');
if (boot) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let seen = false;
    try { seen = sessionStorage.getItem('aero-boot-seen') === '1'; } catch { seen = true; }
  const timers: number[] = [];
  let progressFrame = 0;
  let dismissed = false;
  let onBootKey: ((event: KeyboardEvent) => void) | undefined;
  const dismiss = () => {
    if (dismissed) return;
    dismissed = true;
    timers.forEach(window.clearTimeout);
    cancelAnimationFrame(progressFrame);
    if (onBootKey) document.removeEventListener('keydown', onBootKey);
    boot.classList.add('is-leaving');
    window.setTimeout(() => boot.remove(), reduced ? 0 : 720);
    try { sessionStorage.setItem('aero-boot-seen', '1'); } catch { /* storage is optional */ }
  };
  if (seen || reduced) boot.remove();
  else {
    boot.hidden = false;
    const sky = boot.querySelector<HTMLElement>('[data-boot-sky]');
    const particles = boot.querySelector<HTMLElement>('[data-boot-particles]');
    const progress = boot.querySelector<HTMLElement>('[data-boot-progress]');
    const progressBar = boot.querySelector<HTMLElement>('[data-boot-progress-bar]');
    const percent = boot.querySelector<HTMLOutputElement>('[data-boot-percent]');
    const statusLine = boot.querySelector<HTMLElement>('[data-boot-status]');
    const statusLines = [
      'Preparing your atmosphere…',
      'Gathering the light fields…',
      'Composing glass surfaces…',
      'Floating the bubbles…',
      'Warming up the colors…',
      'Opening your personal desktop…',
      'Welcome.',
    ];
    const statusTimes = [0, 720, 1380, 2040, 2700, 3360, 4060];

    for (let index = 0; index < 22; index += 1) {
      const particle = document.createElement('span');
      particle.style.setProperty('--px', `${(index * 37) % 101}%`);
      particle.style.setProperty('--py', `${(index * 61) % 97}%`);
      particle.style.setProperty('--size', `${2 + (index % 4)}px`);
      particle.style.setProperty('--delay', `${(index % 7) * -.42}s`);
      particle.style.setProperty('--duration', `${3.2 + (index % 5) * .7}s`);
      particles?.append(particle);
    }

    const startedAt = performance.now();
    const updateProgress = (now: number) => {
      const value = Math.min(100, Math.round(((now - startedAt) / 4100) * 100));
      progress?.setAttribute('aria-valuenow', String(value));
      if (progressBar) progressBar.style.transform = `scaleX(${value / 100})`;
      if (percent) percent.value = `${value}%`;
      if (!dismissed && value < 100) progressFrame = requestAnimationFrame(updateProgress);
    };
    progressFrame = requestAnimationFrame(updateProgress);

    statusTimes.forEach((delay, index) => {
      timers.push(window.setTimeout(() => {
        if (!statusLine || dismissed) return;
        statusLine.classList.add('is-changing');
        timers.push(window.setTimeout(() => {
          statusLine.textContent = statusLines[index];
          statusLine.classList.remove('is-changing');
        }, index === 0 ? 0 : 120));
      }, delay));
    });

    boot.addEventListener('pointermove', (event) => {
      if (!sky || dismissed) return;
      const x = (event.clientX / window.innerWidth - .5) * 2;
      const y = (event.clientY / window.innerHeight - .5) * 2;
      sky.style.setProperty('--mx', x.toFixed(3));
      sky.style.setProperty('--my', y.toFixed(3));
    });
    document.querySelector<HTMLAnchorElement>('[data-skip-boot]')?.addEventListener('click', dismiss, { once: true });
    onBootKey = (event) => {
      if (event.key === 'Escape') dismiss();
    };
    document.addEventListener('keydown', onBootKey);
    timers.push(window.setTimeout(dismiss, 4600));
  }
}
}

initAero();
