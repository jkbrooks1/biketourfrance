// Site-wide facts. One place to change the brand name, contact route, and navigation.
// All visitor-facing wording here comes from the approved-copy Sheet via TEXT, so that navigation
// labels and the pre-filled email subjects and bodies are owner-approved copy rather than
// literals. Only non-copy values (origin, flags, hrefs) are declared directly.
import { TEXT } from './approved-copy';

export const SITE = {
  // Standard visible brand form (see docs/STYLE_GUIDE.md).
  name: TEXT['/header/logo_text'],
  // Canonical production origin. Canonical URLs always use this, even on staging.
  origin: 'https://biketourfrance.net',
  // Contact address. The owner's personal address must never appear on the site.
  email: TEXT['/contact/contact_email'],
  tagline: TEXT['/about/subheading'],
  // Main is the approved production branch; other Pages branches and local dev stay non-indexable.
  indexingEnabled:
    import.meta.env.PROD &&
    (!process.env.CF_PAGES_BRANCH || process.env.CF_PAGES_BRANCH === 'main'),
} as const;

// Site-level navigation labels (owner decision 2026-10-03).
// `match` lists the path prefixes that mark an item as the current section.
export const NAV = [
  { label: TEXT['/nav/home'], href: '/', match: [] as readonly string[] },
  { label: TEXT['/nav/tours'], href: '/tours/', match: ['/canal-des-deux-mers/'] as readonly string[] },
  { label: TEXT['/nav/about'], href: '/about/', match: [] as readonly string[] },
  { label: TEXT['/nav/testimonials'], href: '/#testimonials', match: [] as readonly string[] },
  { label: TEXT['/nav/resources'], href: '/resources/', match: [] as readonly string[] },
  { label: TEXT['/nav/contact'], href: '/contact/', match: [] as readonly string[] },
  { label: TEXT['/gallery/heading'], href: '/cdm-photo-gallery/', match: [] as readonly string[] },
] as const;

// Extra useful links shown in the footer only.
export const FOOTER_TOUR_LINKS = [
  { label: TEXT['/nav/cdm_tour'], href: '/canal-des-deux-mers/' },
  { label: TEXT['/nav/practical_info'], href: '/canal-des-deux-mers/practical-info/' },
] as const;

export const LEGAL_NAV = [
  { label: TEXT['/nav/privacy'], href: '/privacy/' },
  { label: TEXT['/nav/terms'], href: '/terms/' },
  { label: TEXT['/nav/cookies'], href: '/cookies/' },
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
  return `https://forms.gle/thPjnUyKGCoZb6SM7`;
}

// No sign-up service is configured on this site, so every "join" or "ask" action is an email.
export const CONTACT_LINKS = {
  general: mailto(TEXT['/email/general_subject']),
  waitlist: mailto(TEXT['/email/waitlist_subject'], TEXT['/email/waitlist_body']),
  mailingList: mailto(TEXT['/email/mailing_list_subject'], TEXT['/email/mailing_list_body']),
  planning: mailto(TEXT['/email/planning_subject'], TEXT['/email/planning_body']),
} as const;
