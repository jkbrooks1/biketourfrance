// Sequential masonry uses known dimensions; layout never waits for image downloads.
// Native links remain usable when JavaScript or dialog support is unavailable.
for (const gallery of document.querySelectorAll<HTMLElement>('[data-cdm-gallery]')) {
  const links = [...gallery.querySelectorAll<HTMLAnchorElement>('[data-gallery-open]')];
  const dialog = gallery.querySelector<HTMLDialogElement>('[data-gallery-dialog]')!;
  const close = dialog.querySelector<HTMLButtonElement>('[data-gallery-close]')!;
  const previous = dialog.querySelector<HTMLButtonElement>('[data-gallery-previous]')!;
  const next = dialog.querySelector<HTMLButtonElement>('[data-gallery-next]')!;
  const media = dialog.querySelector<HTMLElement>('[data-gallery-media]')!;
  const caption = dialog.querySelector<HTMLElement>('[data-gallery-caption]')!;
  const position = dialog.querySelector<HTMLElement>('[data-gallery-position]')!;
  let active = 0;
  let opener: HTMLAnchorElement | undefined;
  let oldOverflow = '';

  function show(index: number) {
    active = (index + links.length) % links.length;
    const link = links[active];
    const image = document.createElement('img');
    image.alt = link.dataset.photoAlt!;
    image.width = Number(link.dataset.photoWidth);
    image.height = Number(link.dataset.photoHeight);
    image.decoding = 'async';
    image.src = link.href;
    media.replaceChildren(image);
    caption.textContent = image.alt;
    position.textContent = `${active + 1} / ${links.length}`;
  }
  function open(index: number, link: HTMLAnchorElement) {
    opener = link;
    show(index);
    oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    close.focus();
  }
  for (const [index, link] of links.entries()) link.addEventListener('click', (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || typeof dialog.showModal !== 'function') return;
    event.preventDefault();
    open(index, link);
  });
  function restorePage() {
    document.body.style.overflow = oldOverflow;
    media.replaceChildren();
    opener?.focus({ preventScroll: true });
  }
  function dismiss() {
    if (!dialog.open) return;
    dialog.close();
    restorePage();
  }
  close.addEventListener('click', dismiss);
  previous.addEventListener('click', () => show(active - 1));
  next.addEventListener('click', () => show(active + 1));
  dialog.addEventListener('cancel', (event) => { event.preventDefault(); dismiss(); });
  // A queued close event from an earlier view must not clear a newly opened photo.
  dialog.addEventListener('close', () => { if (!dialog.open) restorePage(); });
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      show(active + (event.key === 'ArrowRight' ? 1 : -1));
    }
    if (event.key === 'Tab') {
      const controls = [close, previous, next];
      const current = controls.indexOf(document.activeElement as HTMLButtonElement);
      if (event.shiftKey && current === 0) { event.preventDefault(); next.focus(); }
      else if (!event.shiftKey && current === controls.length - 1) { event.preventDefault(); close.focus(); }
    }
    // Escape dispatches native cancel; dismissal restores focus and scrolling immediately.
  });
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dismiss();
  });
}
