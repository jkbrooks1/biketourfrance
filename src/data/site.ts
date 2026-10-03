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

export const NAV = [
  { label: 'Tours', href: '/tours/' },
  { label: 'Canal des Deux Mers', href: '/canal-des-deux-mers/' },
  { label: 'Practical Information', href: '/canal-des-deux-mers/practical-info/' },
  { label: 'Resources', href: '/resources/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
] as const;

export const LEGAL_NAV = [
  { label: 'Privacy', href: '/privacy/' },
  { label: 'Terms', href: '/terms/' },
  { label: 'Cookies', href: '/cookies/' },
] as const;

export function mailto(subject: string, body = ''): string {
  const params = new URLSearchParams({ subject });
  if (body) params.set('body', body);
  // URLSearchParams encodes spaces as "+"; mail clients need %20.
  return `mailto:${SITE.email}?${params.toString().replace(/\+/g, '%20')}`;
}

export const CONTACT_LINKS = {
  general: mailto('Question about BikeTourFrance.net'),
  waitlist: mailto(
    '2027 Canal des Deux Mers waitlist',
    'Hello John,\n\nPlease add me to the waitlist for a 2027 Canal des Deux Mers tour.\n\nName:\nNumber of riders:\nPreferred season (spring or September):\n',
  ),
  planning: mailto(
    'Trip planning help',
    'Hello John,\n\nI would like help planning a bike trip in France.\n\nName:\nWhere I want to ride:\nApproximate time of year:\n',
  ),
} as const;
