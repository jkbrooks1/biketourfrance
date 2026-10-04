// Page copy taken from the approved-copy Google Sheet "BTF_Approved_Site_Copy" (tab "Approved Site Copy",
// read 2026-10-03, sheet modified 22:52Z). The Sheet is the source of truth for this wording.
//
// Where the Sheet text breaks the style guide (v4.4) or has a typo, this file carries the corrected text and a
// "Sheet:" comment shows the original. The Sheet itself was not edited. Until its rows are corrected, a fresh
// pull from the Sheet will bring these defects back, so fix them in the Sheet too.
//
// Rows not used by any page: /meta_title (the page title is built in the layout), /header/logo_text (the brand
// name comes from SITE.name), /self-guided/subtitle (brand name only), /resources/meta_title (duplicate of the
// home title, so it would fail the unique-title check), /404/meta_title and /404/header_logo_text (same reason).
// /hero/body_3 is empty in the Sheet and stays unused.

export const COPY = {
  // Sheet: "We help cyclists build extraordinary, self-supported bike tours in France!" (exclamation mark removed)
  metaDescription: 'We help cyclists build extraordinary, self-supported bike tours in France.',

  hero: {
    heading: 'Choose your own bike adventure in France?',
    // Sheet: "...Sète on the Mediterranean! We roll..." (exclamation mark removed)
    body1:
      "Join us for a small group guided tour of the historic Canal des Deux Mers between Bordeaux on the Atlantic and Sète on the Mediterranean. We roll in the Spring and Fall of 2027. Or, do the same tour on your own and we'll help with remote support.",
    // Sheet: "...have great trips! Roll with ... (package coming soon!.) ..." (exclamation marks removed; "(package coming soon!.)" -> "(package coming soon.)")
    body2:
      'I love bike touring in France. And I love to help fellow bike travelers have great trips. Roll with one of my small groups or buy a package so you can do the tour on your own (package coming soon.) Or, if you want a hand planning your own bike adventure in France and just want my coaching send me an email. I charge $250 for a 50-minute planning session that includes two follow up emails.',
    // Sheet: "Stay up to date! Join our mailing list" (38 characters; button labels may be 24 at most, and no mailing-list
    // sign-up exists, so the button sends an email request)
    mailingListCta: 'Email for tour updates',
    // Sheet: "Get on the free waitlist for Spring or Fall 2027 tours!" (55 characters; no waitlist form exists on this site)
    waitlistCta: 'Email for 2027 waitlist',
  },

  readyToRide: {
    heading: 'Ready to ride?',
    summary1: 'Cross France by bike along the great canals.',
    summary2: 'Canal des Deux Mers from Bordeaux (Atlantic) to Sète (Mediterranean) "CDM"',
    summary3: 'Two Spring 2027 tours',
    summary4: 'Two Fall 2027 tours',
    rideFacts: '9 ride days. 320+ miles. One rest day in Toulouse.',
    // Sheet: "What's included;" (stray semicolon removed)
    includedHeading: "What's included",
    included: [
      'Ride briefing every morning at breakfast',
      'Lodging for duration of the tour; Ride Day Zero (RD00) (arrival) in Bordeaux through Ride Day 09 (RD09) in Sète.',
      'Dinners together for all Ride Days except RD04 arrival in Toulouse and RD06, arrival in Carcassonne which are "Dine on your own" nights. I\'ve learned these are the places people most want to explore on their own.',
      'All dinner reservations and host coordination',
      'Three dinners with local hosts when we are staying at "Maison d\'Hôtes" (B&B that serves half-board meaning breakfast and dinner.) We won\'t eat family style but they will join us for conversation before or after our meal. One couple are British ex-pats and have a great perspective on living in Southwest France.',
      // Sheet: "...special BikeTourFrance RideWithGPS..." (brand written with .net)
      'Routes in special BikeTourFrance.net RideWithGPS tour specific collection',
      // Sheet: "...on each days route." (apostrophe added)
      "Information on the route about lunch, water, and restroom options on each day's route.",
      'Access to helpful resources like example packing lists, simple French practice phrases to listen to and repeat, audio history guides for each ride day, history and background document for the entire ride broken down by ride day and geographic area.',
    ],
    // Sheet: "Canal des Deux Mers Tour (CDM)\nSpring & Fall of 2027! Bordeaux start\nAtlantic to Mediterranean" (94 characters in one heading;
    // split into a heading and a line below it, exclamation mark removed)
    cdmHeading: 'Canal des Deux Mers Tour (CDM)',
    cdmLines: ['Spring & Fall of 2027. Bordeaux start', 'Atlantic to Mediterranean'],
    cdmCta: 'Learn about the CDM Tour',
  },

  about: {
    heading: 'About BikeTourFrance.net',
    subheading: 'Eat. Sleep. Roll. Repeat.',
    body1:
      'I’m John—the cyclist behind BikeTourFrance.net. I help riders execute extraordinary bicycle tours in France.',
    body2:
      'I personally lead four very small, self-supported group tours each year. Groups have fewer than 12 riders, so I can lead the ride, communicate each day’s plan in depth, and give the group the attention it needs.',
    body3:
      'If you prefer to travel on your own schedule, I offer a self-guided tour package. I build the routes, book your accommodations, and provide practical support as you prepare for the trip. You ride independently, with a sound plan and help when you need it.',
    // Sheet: "All BikeTourFrance tours are self-supported." (brand written with .net)
    body4:
      'All BikeTourFrance.net tours are self-supported. You carry your own gear from place to place. The Canal des Deux Mers is fairly flat, so you do not need to obsess over every gram. But space still matters. Pack less than you think you need.',
    body5:
      'Planning a bicycle tour in France gets complex fast. Where you ride, how far you go, where you eat, where you sleep, how trains fit in, and when you stop to see a place all affect one another. A small choice early in the plan can cause a hard day later.',
    body6:
      'I have planned and ridden self-supported tours across France. I have also traveled on foot in many parts of the country. I know what works on the ground: routes that make sense, days that fit real riders, places to stay, food stops, train options, and the small details that keep a trip moving well. I also know that coordinating your arrival time with your lodging can make a big difference for everyone.',
    body7:
      'Outside of touring, I lead rides for Cascade Bicycle Club in Seattle, work in enterprise technology, and hold DELF B2 certification in French. I’m not a camper—I like a good route, a real bed, a warm shower, and a solid meal at the end of the day. It is France, after all, and I love to eat well.',
  },

  gallery: { heading: 'Tour Gallery' },

  // Sheet: "Send us an email!" (exclamation mark removed)
  contact: { emailCta: 'Send us an email', contactEmail: 'john@biketourfrance.net' },

  // One cell in the Sheet. The footer splits it at the four policy labels. Text is unchanged.
  footerPolicies:
    'Privacy Policy: We collect email and calendar data for webinar registration and scheduling. Data is stored securely and never shared with third parties. Terms of Service: By using our site, you agree to follow all applicable laws and accept our liability limits. BikeTourFrance.net provides advisory services without warranties; users are responsible for their own tour planning and execution. Cookie Policy: We use cookies to track site usage and improve your experience. By continuing to use this site, you consent to cookie usage as required by GDPR and CCPA. Disclaimer: All content is advisory only. We are not liable for injuries, equipment failure, or planning errors resulting from our guidance.',

  resources: {
    // Sheet meta_description, unchanged
    metaDescription:
      'For cyclists who value authenticity and agency over curated experiences: plan your own bike tour in France with practical guidance on routes, decisions, and real-world tradeoffs.',
    // Sheet: "Back to BikeTourFrance.net" (26 characters; limit is 24)
    backLink: 'Back to the home page',
    helpfulStuffHeading: 'Helpful Stuff',
    helpfulSitesHeading: 'Helpful Sites',
    helpfulStuffBody:
      "Planning a successful self-supported bike tour in France requires good structure. Here are some of the templates and examples of how I do it. They're free. Modify as you see fit. I'd love to see what improvements worked well for you.",
    helpfulSitesBody:
      'These are cycling and travel resources I trust for their accuracy, depth, and real-world relevance. I selected them because they provide reliable information riders use to plan better bike tours.',
    // Sheet: "Templates, audio guides, and trusted sites now live in the BikeTourFrance resource library." (brand written with .net).
    // The Sheet repeats this text and its button in two sections with the same link; the page shows it once.
    libraryText:
      'Templates, audio guides, and trusted sites now live in the BikeTourFrance.net resource library.',
    // Sheet: "Open the resource library" (25 characters; limit is 24)
    libraryCta: 'Open resource library',
  },

  notFound: {
    heading: 'Page not found',
    body: 'We could not find that page. It may have moved, or the link may be mistyped.',
    homeCta: 'Back to the home page',
    resourcesCta: 'Resources',
    footerNote: 'Staging site. Not indexed.',
  },

  smallCommercialBottom: 'Small-group, self-supported bicycle tours in France, led by John Brooks. Eat. Sleep. Roll. Repeat.',
} as const;

// Splits the one-cell footer policy text into its four labelled parts.
export function footerPolicyParts(): { label: string; text: string }[] {
  return COPY.footerPolicies
    .split(/(?=(?:Privacy Policy|Terms of Service|Cookie Policy|Disclaimer): )/)
    .map((part) => {
      const [label, ...rest] = part.split(': ');
      return { label, text: rest.join(': ').trim() };
    });
}
