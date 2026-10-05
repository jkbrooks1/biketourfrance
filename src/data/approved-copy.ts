// Page copy taken from the approved-copy Google Sheet "BTF_Approved_Site_Copy" (tab "Approved Site Copy",
// read from Sheet during build). The Sheet is the source of truth for this wording.

export const COPY = {
  metaDescription: 'We help cyclists build extraordinary, self-supported bike tours in France!',

  hero: {
    heading: 'Choose your own bike adventure in France?',
    body1: 'Join us for a small group guided tour of the historic Canal des Deux Mers between Bordeaux on the Atlantic and Sète on the Mediterranean! We roll in the Spring and Fall of 2027. Or, do the same tour on your own and we\'ll help with remote support.',
    body2: 'I love bike touring in France. And I love to help fellow bike travelers have great trips! Roll with one of my small groups or buy a package so you can do the tour on your own (package coming soon!) Or, if you want a hand planning your own bike adventure in France and just want my coaching send me an email. I charge $250 for a 50-minute planning session that includes two follow up emails.',
    mailingListCta: 'Sign up for tour updates',
    waitlistCta: 'Join our free 2027 tour waitlist',
  },

  readyToRide: {
    heading: 'Ready to ride?',
    summary1: 'Cross France by bike along the great canals.',
    summary2: 'Canal des Deux Mers from Bordeaux (Atlantic) to Sète (Mediterranean) "CDM"',
    summary3: 'Two Spring 2027 tours',
    summary4: 'Two Fall 2027 tours',
    rideFacts: '9 ride days. 320+ miles. One rest day in Toulouse.',
    includedHeading: 'What\'s included;',
    included: [
      'Ride briefing every morning at breakfast',
      'Lodging for duration of the tour; Ride Day Zero (RD00) (arrival) in Bordeaux through Ride Day 09 (RD09) in Sète.',
      'Dinners together for all Ride Days except RD04 arrival in Toulouse and RD06, arrival in Carcassonne which are "Dine on your own" nights. I\'ve learned these are the places people most want to explore on their own.',
      'All dinner reservations and host coordination',
      'Three dinners with local hosts when we are staying at "Maison d\'Hôtes" (B&B that serves half-board meaning breakfast and dinner.) We won\'t eat family style but they will join us for conversation before or after our meal. One couple are British ex-pats and have a great perspective on living in Southwest France.',
      'Routes in special BikeTourFrance RideWithGPS tour specific collection',
      'Information on the route about lunch, water, and restroom options on each day\'s route.',
      'Access to helpful resources like example packing lists, simple French practice phrases to listen to and repeat, audio history guides for each ride day, history and background document for the entire ride broken down by ride day and geographic area.',
    ],
    cdmHeading: 'Canal des Deux Mers Tour (CDM)\nSpring & Fall of 2027! Bordeaux start\nAtlantic to Mediterranean',
    cdmLines: ['Spring & Fall of 2027! Bordeaux start', 'Atlantic to Mediterranean'],
    cdmCta: 'Learn about the CDM Tour',
  },

  about: {
    heading: 'About BikeTourFrance.net',
    subheading: 'Eat. Sleep. Roll. Repeat.',
    body1: 'I\'m John—the cyclist behind BikeTourFrance.net. I help riders execute extraordinary bicycle tours in France.',
    body2: 'I personally lead four very small, self-supported group tours each year. Groups have fewer than 12 riders, so I can lead the ride, communicate each day\'s plan in depth, and give the group the attention it needs.',
    body3: 'If you prefer to travel on your own schedule, I offer a self-guided tour package. I build the routes, book your accommodations, and provide practical support as you prepare for the trip. You ride independently, with a sound plan and help when you need it.',
    body4: 'All BikeTourFrance tours are self-supported. You carry your own gear from place to place. The Canal des Deux Mers is fairly flat, so you do not need to obsess over every gram. But space still matters. Pack less than you think you need.',
    body5: 'Planning a bicycle tour in France gets complex fast. Where you ride, how far you go, where you eat, where you sleep, how trains fit in, and when you stop to see a place all affect one another. A small choice early in the plan can cause a hard day later.',
    body6: 'I have planned and ridden self-supported tours across France. I have also traveled on foot in many parts of the country. I know what works on the ground: routes that make sense, days that fit real riders, places to stay, food stops, train options, and the small details that keep a trip moving well. I also know that coordinating your arrival time with your lodging can make a big difference for everyone.',
    body7: 'Outside of touring, I lead rides for Cascade Bicycle Club in Seattle, work in enterprise technology, and hold DELF B2 certification in French. I\'m not a camper—I like a good route, a real bed, a warm shower, and a solid meal at the end of the day. It is France, after all, and I love to eat well.',
  },

  gallery: { heading: 'Tour Gallery' },

  contact: { emailCta: 'Send us an email!', contactEmail: 'contact@biketourfrance.net' },

  footerPolicies: 'Privacy Policy: We collect email and calendar data for webinar registration and scheduling. Data is stored securely and never shared with third parties. Terms of Service: By using our site, you agree to follow all applicable laws and accept our liability limits. BikeTourFrance.net provides advisory services without warranties; users are responsible for their own tour planning and execution. Cookie Policy: We use cookies to track site usage and improve your experience. By continuing to use this site, you consent to cookie usage as required by GDPR and CCPA. Disclaimer: All content is advisory only. We are not liable for injuries, equipment failure, or planning errors resulting from our guidance.',

  resources: {
    metaDescription: 'For cyclists who value authenticity and agency over curated experiences: plan your own bike tour in France with practical guidance on routes, decisions, and real-world tradeoffs.',
    backLink: 'Back to the home page',
    helpfulStuffHeading: 'Helpful Stuff',
    helpfulSitesHeading: 'Helpful Sites',
    helpfulStuffBody: 'Planning a successful self-supported bike tour in France requires good structure. Here are some of the templates and examples of how I do it. They\'re free. Modify as you see fit. I\'d love to see what improvements worked well for you!',
    helpfulSitesBody: 'These are cycling and travel resources I trust for their accuracy, depth, and real-world relevance. I selected them because they provide reliable information riders use to plan better bike tours.',
    libraryText: 'Templates, audio guides, and trusted sites now live in the BikeTourFrance resource library.',
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

  buttons: {
    readMoreAboutJohn: 'Read more about John',
    moreTourPhotos: 'More tour photos',
  },

  footerNav: {
    exploreHeading: 'Explore',
    legalHeading: 'Legal',
  },

  copyright: '© 2026 BikeTourFrance.net',
} as const;

export function footerPolicyParts(): { label: string; text: string }[] {
  return COPY.footerPolicies
    .split(/(?=(?:Privacy Policy|Terms of Service|Cookie Policy|Disclaimer): )/)
    .map((part) => {
      const [label, ...rest] = part.split(': ');
      return { label, text: rest.join(': ').trim() };
    });
}
