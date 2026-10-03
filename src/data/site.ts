// Site-wide settings that are not public copy: origin, contact address, link targets, and the
// staging switch. All visible text (brand name, navigation labels, and so on) comes from the approved
// copy sheet through src/lib/copy.mjs and is keyed by page/field_name.

export const SITE = {
  // Canonical production origin. Canonical URLs always use this, even on staging.
  origin: 'https://biketourfrance.net',
  email: 'john@biketourfrance.net',
  // Staging protection. Stays false until the owner approves production launch.
  // When false, every page carries a noindex meta tag (public/_headers and public/robots.txt also block crawlers).
  indexingEnabled: false,
} as const;

// Navigation: each label is an approved copy field.
export const NAV = [
  { field: 'site/nav_tours', href: '/tours/' },
  { field: 'site/nav_cdm_tour', href: '/canal-des-deux-mers/' },
  { field: 'site/nav_practical_information', href: '/canal-des-deux-mers/practical-info/' },
  { field: 'site/nav_resources', href: '/resources/' },
  { field: 'site/nav_about', href: '/about/' },
  { field: 'site/nav_contact', href: '/contact/' },
] as const;

export const LEGAL_NAV = [
  { field: 'site/legal_privacy', href: '/privacy/' },
  { field: 'site/legal_terms', href: '/terms/' },
  { field: 'site/legal_cookies', href: '/cookies/' },
] as const;

// The subject and starting message of each mailto link open in the visitor's own email program.
// They are not page text, so they live here with the address.
export function mailto(subject: string, body = ''): string {
  const params = new URLSearchParams({ subject });
  if (body) params.set('body', body);
  // URLSearchParams encodes spaces as "+"; mail clients need %20.
  return `mailto:${SITE.email}?${params.toString().replace(/\+/g, '%20')}`;
}

// Copy cells link to these by symbolic target: mail:general, mail:waitlist, mail:planning.
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
