// Progressive enhancement for the mobile menu. Without JavaScript the full link list stays visible.
// At 768px and wider the menu is always shown, so the toggle only works on small screens.
const toggle = document.querySelector<HTMLButtonElement>('[data-nav-toggle]');
const nav = document.querySelector<HTMLElement>('[data-nav]');

if (toggle && nav) {
  const setOpen = (open: boolean) => {
    nav.dataset.open = String(open);
    toggle.setAttribute('aria-expanded', String(open));
  };
  setOpen(false);
  toggle.addEventListener('click', () => setOpen(nav.dataset.open !== 'true'));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.dataset.open === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
}
