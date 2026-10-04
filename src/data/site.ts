// Site-wide facts. One place to change the brand name, contact route, and navigation.

export const SITE = {
  // Standard visible brand form (see docs/STYLE_GUIDE.md).
  name: 'BikeTourFrance.net',
  // Canonical production origin. Canonical URLs always use this, even on staging.
  origin: 'https://biketourfrance.net',
  email: 'john@biketourfrance.net',
  tagline: 'Eat. Sleep. Roll. Repeat.',
  // Staging protection. Stays false until the owner approves production launch.
  // When false, every page carries a noindex meta tag (public/_headers and public/robots.txt also block crawlers).
  indexingEnabled: false,
} as const;

// Site-level navigation labels (owner decision 2026-10-03). The guide's single-tour examples do not fit this site.
// `match` lists the path prefixes that mark an item as the current section.
export const NAV = [
  { label: 'Home', href: '/', match: [] as readonly string[] },
  { label: 'Tours', href: '/tours/', match: ['/canal-des-deux-mers/'] as readonly string[] },
  { label: 'About', href: '/about/', match: [] as readonly string[] },
  { label: 'Resources', href: '/resources/', match: [] as readonly string[] },
  { label: 'Contact', href: '/contact/', match: [] as readonly string[] },
] as const;

// Extra useful links shown in the footer only.
export const FOOTER_TOUR_LINKS = [
  { label: 'Canal des Deux Mers', href: '/canal-des-deux-mers/' },
  { label: 'Practical information', href: '/canal-des-deux-mers/practical-info/' },
] as const;

export const LEGAL_NAV = [
  { label: 'Privacy', href: '/privacy/' },
  { label: 'Terms', href: '/terms/' },
  { label: 'Cookies', href: '/cookies/' },
] as const;

// The nav item that is current for a path: exact match, or a listed section prefix, or the longest href prefix.
export function currentNavHref(path: string): string | undefined {
  const exact = NAV.find((item) => item.href === path);
  if (exact) return exact.href;
  const section = NAV.find((item) => item.match.some((prefix) => path.startsWith(prefix)));
  if (section) return section.href;
  return NAV.filter((item) => item.href !== '/' && path.startsWith(item.href)).sort(
    (a, b) => b.href.length - a.href.length,
  )[0]?.href;
}

export function mailto(subject: string, body = ''): string {
  const params = new URLSearchParams({ subject });
  if (body) params.set('body', body);
  // URLSearchParams encodes spaces as "+"; mail clients need %20.
  return `mailto:${SITE.email}?${params.toString().replace(/\+/g, '%20')}`;
}

// No sign-up service is configured on this site, so every "join" or "ask" action is an email to John.
export const CONTACT_LINKS = {
  general: mailto('Question about BikeTourFrance.net'),
  waitlist: mailto(
    '2027 Canal des Deux Mers waitlist',
    'Hello John,\n\nPlease add me to the waitlist for a 2027 Canal des Deux Mers tour.\n\nName:\nNumber of riders:\nPreferred season (spring or September):\n',
  ),
  mailingList: mailto(
    'BikeTourFrance.net tour updates',
    'Hello John,\n\nPlease send me updates about BikeTourFrance.net tours.\n\nName:\n',
  ),
  planning: mailto(
    'Trip planning help',
    'Hello John,\n\nI would like help planning a bike trip in France.\n\nName:\nWhere I want to ride:\nApproximate time of year:\n',
  ),
} as const;
