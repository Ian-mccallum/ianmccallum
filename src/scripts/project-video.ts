// Project demos play on their own: muted, looping, inline, and only while on
// screen, so a phone never spends battery on a demo nobody can see. A small
// toggle pauses them (moving content longer than five seconds must be
// stoppable). Reduced motion and data saving keep the poster until the visitor
// chooses Play. Without JavaScript the native controls remain.
export function initProjectVideos(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-project-video]').forEach((figure) => {
    if (figure.dataset.videoEnhanced === 'true') return;
    const video = figure.querySelector('video');
    const toggle = figure.querySelector<HTMLButtonElement>('[data-video-toggle]');
    if (!video || !toggle) return;
    figure.dataset.videoEnhanced = 'true';

    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const saveData = Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);
    let wanted = !reducedMotion.matches && !saveData;
    let onScreen = false;

    video.controls = false;
    video.muted = true;
    toggle.hidden = false;

    const render = () => {
      const playing = !video.paused;
      figure.classList.toggle('is-playing', playing);
      toggle.setAttribute('aria-label', playing ? 'Pause demo video' : 'Play demo video');
    };

    // A minimized desktop window still intersects the viewport; it is not on screen.
    const sync = () => {
      const shown = onScreen && !document.hidden && !figure.closest('.is-minimized');
      if (wanted && shown) {
        video.preload = 'auto';
        // Low Power Mode on iPhone refuses unprompted playback; the poster stays and Play is offered.
        video.play().catch(() => { wanted = false; render(); });
      } else if (!video.paused) video.pause();
    };

    // The toggle answers in the same frame; media events confirm it moments later.
    const choose = () => {
      wanted = video.paused;
      if (wanted) onScreen = true;
      sync();
      render();
    };

    video.addEventListener('play', render);
    video.addEventListener('pause', render);
    toggle.addEventListener('click', choose);
    video.addEventListener('click', choose);
    reducedMotion.addEventListener('change', (event) => {
      if (event.matches) { wanted = false; sync(); }
    });
    document.addEventListener('visibilitychange', sync);
    figure.closest('[data-window-frame]')?.addEventListener('aero:window-state', sync);
    new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    }, { threshold: 0.25 }).observe(video);
    render();
  });
}
