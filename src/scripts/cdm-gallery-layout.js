// Run as an inline script immediately after the tiles, reserving their layout before first paint.
// All sizes use known image dimensions; no image download or font load is needed.
(() => {
for (const gallery of document.querySelectorAll('[data-cdm-gallery]')) {
  const list = gallery.querySelector('[data-gallery-tiles]');
  if (!list || list.dataset.masonryReady) continue;
  const tiles = [...list.querySelectorAll('[data-gallery-tile]')];
  let lastWidth = 0;
  function layout() {
    const width = list.clientWidth;
    if (!width || Math.abs(width - lastWidth) < 0.5) return;
    lastWidth = width;
    const gap = 16;
    const desktop = width >= 960;
    const tablet = !desktop && width >= 560;
    const columns = desktop ? 60 : tablet ? 12 : 2;
    const unit = (width + gap) / columns;
    const skyline = Array(columns).fill(0);
    let readingTop = 0;
    const placements = tiles.map((tile, index) => {
      const ratio = Number(tile.dataset.ratio);
      const seed = Number(tile.dataset.seed);
      const aspect = Math.max(0, Math.min(1, (ratio - 0.45) / 0.9));
      const preferredSpan = desktop
        ? index === 0 ? 20 : Math.max(12, Math.min(20, Math.round(12 + aspect * 6 + seed * 4)))
        : tablet ? Math.max(4, Math.min(6, Math.round(4 + aspect + seed))) : ratio > 1.2 ? 2 : 1;
      let start = 0;
      let top = Infinity;
      let span = preferredSpan;
      const minimum = desktop ? index === 0 ? 20 : 12 : tablet ? 4 : preferredSpan;
      // A slightly narrower photo can fill a gap without exceeding the requested size range.
      for (let candidateSpan = preferredSpan; candidateSpan >= minimum; candidateSpan--) {
        for (let column = 0; column <= columns - candidateSpan; column++) {
          const candidate = Math.max(readingTop, ...skyline.slice(column, column + candidateSpan));
          if (candidate < top - 0.5) { top = candidate; start = column; span = candidateSpan; }
        }
      }
      const tileWidth = unit * span - gap;
      const height = tileWidth / ratio;
      for (let column = start; column < start + span; column++) skyline[column] = top + height + gap;
      readingTop = top; // Later photos never start above earlier photos.
      return { tile, left: unit * start, top, width: tileWidth };
    });
    list.style.height = `${Math.max(0, Math.max(...skyline) - gap)}px`;
    list.dataset.masonryReady = 'true';
    for (const { tile, left, top, width: tileWidth } of placements) {
      Object.assign(tile.style, { left: `${left}px`, top: `${top}px`, width: `${tileWidth}px` });
    }
  }
  layout();
  new ResizeObserver(layout).observe(list);

}
})();
