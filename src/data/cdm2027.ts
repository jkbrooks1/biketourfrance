// Authoritative 2027 Canal des Deux Mers content. The home page and the CDM page both read from here.
// Source of each fact: docs/2027_CDM_CONTENT_AUTHORITY.md. Do not add dates, prices, deposits,
// cancellation terms, or supplier promises here until the owner approves them.

export const CDM_FACTS = {
  departures: 'Four departures in 2027: two between May 15 and June 15, and two in September.',
  datesNote: 'Exact dates are forthcoming.',
  pricingNote: 'Pricing is to be determined and will be announced before bookings open.',
  route: 'Bordeaux (Atlantic) to Sète (Mediterranean), the same route on every departure.',
  ridingDays: 9,
  restDays: 1,
  nights: 11,
  minRiders: 6,
  targetRiders: 8,
  maxRiders: 12,
} as const;

export const CDM_STATS = [
  { value: '4', label: 'departures in 2027' },
  { value: '9', label: 'riding days' },
  { value: '1', label: 'rest day in Toulouse' },
  { value: '11', label: 'nights' },
] as const;

export const INCLUDED: readonly string[] = [
  'Friday arrival night in Bordeaux.',
  'Lodging for every tour night through the final night in Sète.',
  'All breakfasts.',
  'All dinners, except two independent evenings: the arrival evening in Toulouse and the evening in Carcassonne.',
  'A Michelin restaurant dinner on the second evening in Toulouse.',
  'A ride briefing each morning at breakfast.',
  'Routes in a BikeTourFrance.net RideWithGPS collection built for this tour.',
  'Route notes on lunch, water, and restroom options for each riding day.',
  'Access to planning resources: packing lists, French phrases to practice, audio history guides for each riding day, and background reading by ride day and region.',
];

export const SEPARATE: readonly string[] = [
  'Your travel to Bordeaux and home from Sète. Guests are on their own from Tuesday morning after the final group night.',
  'Your bicycle. Guests bring their own bikes.',
  'An e-bike, if you want one. BikeTourFrance.net helps identify a vetted local rental agency in Bordeaux. You contract directly with that agency and must arrive early enough in Bordeaux to collect the bike.',
  'Front and rear panniers. They are required, and you carry all your own clothing and equipment.',
  'A phone with a handlebar mount. RideWithGPS navigation on your phone is required.',
  'Lunches and snacks.',
  'Your two independent dinners, in Toulouse and Carcassonne.',
];

export const SELF_SUPPORTED_POINTS: readonly string[] = [
  'There is no support van and no luggage transport. You carry everything you bring.',
  'The Canal des Deux Mers is fairly flat, but space on the bike still matters. Pack less than you think you need.',
  'Guests ride with RideWithGPS navigation on a phone mounted to the handlebars.',
];

export const WEEK_PLAN: readonly { day: string; text: string }[] = [
  { day: 'Friday', text: 'Arrive in Bordeaux. Collect a rental e-bike if you booked one.' },
  { day: 'Saturday', text: 'Ride briefing at breakfast, then wheels roll in the morning.' },
  {
    day: 'Nine riding days',
    text: 'The group rides the canal path from Bordeaux to Sète, with one rest day and two nights in Toulouse.',
  },
  { day: 'Monday', text: 'Final group night in Sète.' },
  { day: 'Tuesday', text: 'Guests are on their own from the morning.' },
];

export const STOPS: readonly string[] = [
  'Bordeaux',
  'La Réole',
  'Agen',
  'Moissac',
  'Toulouse (rest day)',
  'Castelnaudary',
  'Carcassonne',
  'Lézignan-Corbières',
  'Capestang',
  'Sète',
];

export const TOULOUSE_DINNER = {
  text: 'The second evening in Toulouse includes a dinner at a Michelin restaurant.',
  dress:
    'Dress expectation: a collared shirt such as a polo for men, and business-casual clothing for women.',
} as const;
