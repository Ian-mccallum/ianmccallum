// Corporate mode re-sets the one semantic CV as a plain Letter page in the
// classic one-page resume format. A shared /cv?mode=corporate link wins, then the
// visitor's last explicit choice. The inline script in cv.astro applies the same
// rule before first paint; keep the two in step.
type CvMode = 'aero' | 'corporate';

const STORAGE_KEY = 'cv-mode';
const LEAVE: Keyframe[] = [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(6px) scale(.996)' }];
const ENTER: Keyframe[] = [{ opacity: 0, transform: 'translateY(12px) scale(.99)', filter: 'blur(3px)' }, { opacity: 1, transform: 'none', filter: 'none' }];

const isMode = (value: unknown): value is CvMode => value === 'aero' || value === 'corporate';

const linkedMode = () => {
  const value = new URLSearchParams(window.location.search).get('mode');
  return isMode(value) ? value : undefined;
};

const savedMode = () => {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return isMode(value) ? value : undefined;
  } catch {
    return undefined;
  }
};

// Desktop windows scroll their own body; the mobile document scrolls the page.
const scrollerFor = (viewer: HTMLElement) => {
  const body = viewer.closest<HTMLElement>('.window-frame__body');
  return body && getComputedStyle(body).overflowY !== 'visible' ? body : document.documentElement;
};

// The lowest sticky chrome (titlebar or toolbar) marks where reading starts.
const readingEdge = (viewer: HTMLElement, scroller: HTMLElement) => {
  const chrome = [viewer.closest('[data-window-frame]')?.querySelector('.window-titlebar'), viewer.querySelector('[data-cv-toolbar]')];
  const edges = chrome.map((element) => element?.getBoundingClientRect().bottom ?? 0);
  return Math.max(scroller === document.documentElement ? 0 : scroller.getBoundingClientRect().top, ...edges);
};

// Keeps the reader's place: the block they are reading stays put while the
// layout around it changes length. That is the first block starting near the
// top of the view, else the one already scrolled partly past the edge.
const captureAnchor = (viewer: HTMLElement, scroller: HTMLElement) => {
  if (scroller.scrollTop < 8) return undefined;
  const edge = readingEdge(viewer, scroller);
  const viewBottom = scroller === document.documentElement ? window.innerHeight : scroller.getBoundingClientRect().bottom;
  const blocks = Array.from(viewer.querySelectorAll<HTMLElement>('.cv-section > h2, .cv-entry, .cv-facts > div'));
  const top = (block: HTMLElement) => block.getBoundingClientRect().top;
  const anchor = blocks.find((block) => top(block) >= edge - 2 && top(block) <= edge + (viewBottom - edge) * .4)
    ?? blocks.findLast((block) => top(block) < edge);
  return anchor && { anchor, offset: top(anchor) - edge };
};

const restoreAnchor = (viewer: HTMLElement, scroller: HTMLElement, saved: ReturnType<typeof captureAnchor>) => {
  if (!saved) return;
  const drift = saved.anchor.getBoundingClientRect().top - readingEdge(viewer, scroller) - saved.offset;
  scroller.scrollBy({ top: drift, behavior: 'instant' });
};

export function initCvViewers(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-cv-viewer]').forEach((viewer) => {
    if (viewer.dataset.cvEnhanced === 'true') return;
    const toggle = viewer.querySelector<HTMLButtonElement>('[data-cv-mode-switch]');
    const sheet = viewer.querySelector<HTMLElement>('[data-cv-document]');
    if (!toggle || !sheet) return;
    viewer.dataset.cvEnhanced = 'true';
    const primary = viewer.closest('[data-window-primary]') !== null;
    let motion: Animation | undefined;
    // The shorter Corporate page can clamp the scroll; until the reader scrolls,
    // switching back reuses the original anchor so a round trip is lossless.
    let held: { anchor?: ReturnType<typeof captureAnchor>; scrollTop: number } | undefined;

    const initial = (primary && linkedMode()) || savedMode() || 'aero';
    viewer.dataset.cvMode = initial;
    toggle.setAttribute('aria-checked', String(initial === 'corporate'));
    toggle.hidden = false;

    toggle.addEventListener('click', () => {
      const next: CvMode = toggle.getAttribute('aria-checked') === 'true' ? 'aero' : 'corporate';
      toggle.setAttribute('aria-checked', String(next === 'corporate'));
      try { localStorage.setItem(STORAGE_KEY, next); } catch { /* storage is optional */ }
      if (primary) {
        const url = new URL(window.location.href);
        if (next === 'corporate') url.searchParams.set('mode', next);
        else url.searchParams.delete('mode');
        history.replaceState(history.state, '', url);
      }

      motion?.cancel();
      const scroller = scrollerFor(viewer);
      const saved = held && Math.abs(scroller.scrollTop - held.scrollTop) < 2 ? held.anchor : captureAnchor(viewer, scroller);
      const commit = () => {
        viewer.dataset.cvMode = next;
        restoreAnchor(viewer, scroller, saved);
        held = { anchor: saved, scrollTop: scroller.scrollTop };
      };
      if (matchMedia('(prefers-reduced-motion: reduce)').matches || typeof sheet.animate !== 'function') {
        commit();
        return;
      }

      const leave = sheet.animate(LEAVE, { duration: 120, easing: 'cubic-bezier(.4,0,1,1)', fill: 'forwards' });
      motion = leave;
      leave.finished.then(() => {
        // Measure the new layout without the leave transform, all before the next frame.
        leave.cancel();
        commit();
        motion = sheet.animate(ENTER, { duration: 320, easing: 'cubic-bezier(.16,1,.3,1)' });
      }, () => { /* superseded by a newer toggle */ });
    });
  });
}
