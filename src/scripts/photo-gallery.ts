export function initPhotoGalleries(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-gallery]').forEach((gallery) => {
    if (gallery.dataset.galleryEnhanced === 'true') return;
    gallery.dataset.galleryEnhanced = 'true';
    const scope = gallery.closest<HTMLElement>('[data-window-frame]') ?? document.body;
    const lightbox = scope.querySelector<HTMLElement>('[data-lightbox]');
    const close = lightbox?.querySelector<HTMLButtonElement>('[data-lightbox-close]');
    let returnFocus: HTMLButtonElement | null = null;
    const dismiss = () => {
      if (!lightbox) return;
      lightbox.hidden = true;
      document.body.style.overflow = '';
      returnFocus?.focus();
    };
    gallery.querySelectorAll<HTMLButtonElement>('[data-gallery-item]').forEach((button) => {
      button.addEventListener('click', () => {
        const image = button.querySelector<HTMLImageElement>('img');
        if (!image || !lightbox) return;
        const lightboxImage = lightbox.querySelector<HTMLImageElement>('[data-lightbox-image]') ?? document.createElement('img');
        lightboxImage.dataset.lightboxImage = '';
        returnFocus = button;
        lightboxImage.src = image.currentSrc || image.src;
        lightboxImage.alt = image.alt;
        if (!lightboxImage.isConnected) lightbox.append(lightboxImage);
        lightbox.hidden = false;
        document.body.style.overflow = 'hidden';
        close?.focus();
      });
    });
    close?.addEventListener('click', dismiss);
    lightbox?.addEventListener('click', (event) => { if (event.target === lightbox) dismiss(); });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && lightbox && !lightbox.hidden) dismiss();
      if (event.key === 'Tab' && lightbox && !lightbox.hidden && close) { event.preventDefault(); close.focus(); }
    });
  });
}
