// Focus-managed photo viewer: buttons, arrow keys, and (on touch) a swipe that
// follows the finger. The thumbnails' own srcset supplies the large image: the
// smallest candidate that fills the viewer at the screen's pixel density.
const SWIPE_DISTANCE = 56;
const VIEWER_MAX_WIDTH = 1100;

const viewerSource = (image: HTMLImageElement) => {
  const candidates = (image.getAttribute('srcset') ?? '').split(',').map((entry) => {
    const [url, size = '0w'] = entry.trim().split(/\s+/);
    return { url, width: Number.parseInt(size, 10) || 0 };
  }).filter((candidate) => candidate.url).sort((a, b) => a.width - b.width);
  const needed = Math.min(window.innerWidth, VIEWER_MAX_WIDTH) * (window.devicePixelRatio || 1);
  return (candidates.find((candidate) => candidate.width >= needed) ?? candidates.at(-1))?.url ?? image.currentSrc ?? image.src;
};

export function initPhotoGalleries(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-gallery]').forEach((gallery) => {
    if (gallery.dataset.galleryEnhanced === 'true') return;
    gallery.dataset.galleryEnhanced = 'true';
    const scope = gallery.closest<HTMLElement>('[data-window-frame]') ?? document.body;
    const lightbox = scope.querySelector<HTMLElement>('[data-lightbox]');
    const stage = lightbox?.querySelector<HTMLElement>('[data-lightbox-stage]');
    const close = lightbox?.querySelector<HTMLButtonElement>('[data-lightbox-close]');
    const prev = lightbox?.querySelector<HTMLButtonElement>('[data-lightbox-prev]');
    const next = lightbox?.querySelector<HTMLButtonElement>('[data-lightbox-next]');
    const caption = lightbox?.querySelector<HTMLElement>('[data-lightbox-caption]');
    const count = lightbox?.querySelector<HTMLElement>('[data-lightbox-count]');
    const items = Array.from(gallery.querySelectorAll<HTMLButtonElement>('[data-gallery-item]'));
    if (!lightbox || !stage || !close || !items.length) return;

    const image = document.createElement('img');
    image.dataset.lightboxImage = '';
    image.decoding = 'async';
    stage.prepend(image);
    let current = 0;
    let returnFocus: HTMLButtonElement | null = null;

    const show = (index: number, direction = 0) => {
      current = Math.max(0, Math.min(items.length - 1, index));
      const thumb = items[current].querySelector<HTMLImageElement>('img');
      if (!thumb) return;
      image.src = viewerSource(thumb);
      image.alt = thumb.alt;
      if (caption) caption.textContent = thumb.alt;
      if (count) count.textContent = `${current + 1} of ${items.length}`;
      const atStart = current === 0;
      const atEnd = current === items.length - 1;
      // Never strand focus on a control that just became unavailable.
      if ((atStart && document.activeElement === prev) || (atEnd && document.activeElement === next)) (atStart ? next : prev)?.focus();
      if (prev) prev.disabled = atStart;
      if (next) next.disabled = atEnd;
      if (direction && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
        image.animate([{ opacity: .4, transform: `translateX(${direction * 36}px)` }, { opacity: 1, transform: 'none' }], { duration: 220, easing: 'cubic-bezier(.16,1,.3,1)' });
      }
    };

    const open = (index: number) => {
      returnFocus = items[index];
      lightbox.hidden = false;
      document.body.classList.add('has-lightbox');
      document.body.style.overflow = 'hidden';
      show(index);
      close.focus();
    };

    const dismiss = () => {
      if (lightbox.hidden) return;
      lightbox.hidden = true;
      document.body.classList.remove('has-lightbox');
      document.body.style.overflow = '';
      returnFocus?.focus();
    };

    const step = (delta: number) => {
      const target = current + delta;
      if (target < 0 || target >= items.length) return false;
      show(target, delta);
      return true;
    };

    items.forEach((button, index) => button.addEventListener('click', () => open(index)));
    close.addEventListener('click', dismiss);
    prev?.addEventListener('click', () => step(-1));
    next?.addEventListener('click', () => step(1));
    let dragged = false;
    lightbox.addEventListener('click', (event) => {
      if (dragged) { dragged = false; return; }
      if (event.target === lightbox || event.target === stage) dismiss();
    });

    document.addEventListener('keydown', (event) => {
      if (lightbox.hidden) return;
      if (event.key === 'Escape') dismiss();
      else if (event.key === 'ArrowLeft') step(-1);
      else if (event.key === 'ArrowRight') step(1);
      else if (event.key === 'Tab') {
        const stops = [close, prev, next].filter((control): control is HTMLButtonElement => Boolean(control && !control.disabled));
        const at = stops.indexOf(document.activeElement as HTMLButtonElement);
        event.preventDefault();
        stops[(at + (event.shiftKey ? -1 : 1) + stops.length) % stops.length]?.focus();
      }
    });

    // The photo tracks a horizontal drag, then settles on the next photo or back.
    let drag: { id: number; x: number; y: number; dx: number; horizontal?: boolean } | undefined;
    stage.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'mouse') return;
      drag = { id: event.pointerId, x: event.clientX, y: event.clientY, dx: 0 };
    });
    stage.addEventListener('pointermove', (event) => {
      if (!drag || event.pointerId !== drag.id) return;
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;
      drag.horizontal ??= Math.abs(dx) > 8 || Math.abs(dy) > 8 ? Math.abs(dx) > Math.abs(dy) : undefined;
      if (!drag.horizontal) return;
      const atEdge = (dx > 0 && current === 0) || (dx < 0 && current === items.length - 1);
      drag.dx = atEdge ? dx / 3 : dx;
      image.style.transition = 'none';
      image.style.transform = `translateX(${drag.dx}px)`;
    });
    const endDrag = (event: PointerEvent) => {
      if (!drag || event.pointerId !== drag.id) return;
      const { dx, horizontal } = drag;
      drag = undefined;
      dragged = Boolean(horizontal);
      window.setTimeout(() => { dragged = false; }, 0);
      image.style.transition = '';
      image.style.transform = '';
      if (horizontal && Math.abs(dx) > SWIPE_DISTANCE) step(dx < 0 ? 1 : -1);
    };
    stage.addEventListener('pointerup', endDrag);
    stage.addEventListener('pointercancel', endDrag);
  });
}
