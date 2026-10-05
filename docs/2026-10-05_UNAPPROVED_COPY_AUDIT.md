# Unapproved copy audit — BikeTourFrance.net

**Date:** 2026-10-05
**Scope:** every user-visible string in the built site (`dist/`, 12 routes) and in `src/`,
compared against the 64 rows of `BTF_Approved_Site_Copy`.
**Trigger:** owner found unapproved copy on /tours/ — "Ways to ride in France with BikeTourFrance.net".

**Coverage rule used:** a visible string counts as approved only if it is contained within some
approved Sheet value, or within one line of a multi-line value. The reverse is not accepted — a
hardcoded sentence that merely embeds an approved token such as "BikeTourFrance.net" is unapproved.
Five non-copy chrome strings are exempt (`Skip to main content`, `Menu`, `Main`, `Site`, `Home`).

## Finding

**214 user-visible strings are not in the Sheet**, across all 12 routes
(213 page-specific, 1 shared chrome).

The approved-copy gate only ever checked **one direction**: that approved Sheet copy appears on the
pages. It never checked the reverse — that every visible string originates from the Sheet. Any text
hardcoded in a component therefore ships silently while the gate still reports success. That is why
`copy:verify-rendered` reported "OK: 12 pages, 63 fields confirmed" on a site carrying 214
unapproved strings.

## How it happened — two causes

**1. The reverse check was removed, but its documentation was left behind.**
`scripts/copy/verify-rendered.mjs` still advertises it at the top of the file:

> `// 2. No visible text, image alt text, page title, or meta description on any page is missing from the`
> `//    approved fields (public copy with no approved field fails the build).`

The code no longer does this. Line 83 still builds the array for exactly that purpose:

> `const allBlocks = []; // every approved text fragment, for the "no uncovered text" check`

`allBlocks` is filled at line 92 and **never read again** — dead code. In its place, lines 137-140
declare the gap intentional:

> `// This gate covers only fields present in BTF_Approved_Site_Copy. Native Astro`
> `// layout, navigation, asset alt text, and route-specific editorial material are`
> `// verified separately by verify-dist; treating them as Sheet fields would invent`
> `// a second copy authority.`

That claim does not hold. `verify-dist.mjs` checks length limits, brand spelling and accessibility.
It has no concept of Sheet approval, so nothing verifies this copy against the Sheet.

**2. The field manifest was cut from 224 fields to 64.**
`copy/field-manifest.json` originally carried 224 fields — the full inventory of rendered copy,
still listed in `docs/COPY_FIELD_MAP_REVIEW.md`. It was later reduced to 57, and is 64 today after
the 7 rows added on 2026-10-05. Roughly 160 fields of real page copy were dropped from both the
manifest and the Sheet. Because of cause 1, nothing flagged the loss.

Together: the Sheet holds 64 fields, the site renders far more, and the gate is structurally
incapable of noticing the difference.

## Unapproved strings per route

| Route | Unapproved | Strings checked |
|---|---|---|
| `/404.html` | 2 | 24 |
| `/about/` | 7 | 34 |
| `/canal-des-deux-mers/` | 69 | 91 |
| `/canal-des-deux-mers/practical-info/` | 53 | 72 |
| `/contact/` | 8 | 26 |
| `/cookies/` | 9 | 26 |
| `/` | 10 | 59 |
| `/privacy/` | 10 | 27 |
| `/resources/` | 6 | 38 |
| `/terms/` | 11 | 29 |
| `/tours/` | 15 | 34 |
| `/waitlist-2027/` | 13 | 32 |

Shared chrome, counted once (1):

- BikeTourFrance.net logo: a bicycle over a map of France

## Full list of unapproved strings, by route

### `/404.html` — 2

- *(meta description)* That page is not on the BikeTourFrance.net website. Use these links to find the tour, resources, or contact page.
- *(p)* These pages can help:

### `/about/` — 7

- *(title)* About John Brooks \| BikeTourFrance.net
- *(meta description)* John Brooks leads small, self-supported bicycle tours in France. Learn who he is, how the tours work, and why he plans each day in detail.
- *(img alt)* Three riders in cycling kit posing beside a bike in a town square with a palm tree.
- *(h2)* How the tours work
- *(h2)* Who is planning your trip
- *(h2)* Want to talk it through?
- *(p)* Email John with your questions about the 2027 tours or about planning your own trip.

### `/canal-des-deux-mers/` — 69

- *(title)* Canal des Deux Mers by bike, 2027 small-group tour \| BikeTourFrance.net
- *(meta description)* Ride from Bordeaux to Sète along the Canal des Deux Mers with a small, self-supported group. Four departures in 2027: nine riding days, one rest day in Toulouse …
- *(img alt)* A cyclist riding away on a paved canal path, with water and green vegetation on both sides and trees in the distance.
- *(img alt)* Two loaded touring bikes parked in front of a wooden building with a sign reading "Créon fête le vélo".
- *(img alt)* A rider in a red helmet smiling at the camera on a shaded canal path, with a second rider behind.
- *(img alt)* A rider on a pale gravel path beside a straight canal with grass on both sides.
- *(img alt)* Two green signs for the Canal du Midi cycle route, one pointing left and one pointing right.
- *(img alt)* Five riders in cycling jerseys sharing coffee at a café table.
- *(img alt)* A rider far ahead on a narrow cobbled strip between two stretches of calm water.
- *(img alt)* Three riders in cycling kit posing beside a bike in a town square with a palm tree.
- *(img alt)* A small stone church with a bell tower, with a bicycle leaning near its door.
- *(img alt)* A long straight paved greenway through pine woods, with one rider ahead in the distance.
- *(img alt)* Riders in matching cycling jerseys on a tree-lined path, with more riders behind them.
- *(img alt)* Two people working on a bicycle wheel together in a workshop.
- *(img alt)* A paved path through tall pine trees with a rider in the distance.
- *(aria-label)* Route stops in order
- *(p)* 2027 small-group tour
- *(h1)* Canal des Deux Mers by bike, Bordeaux to Sète
- *(p)* Bordeaux (Atlantic) to Sète (Mediterranean), the same route on every departure. Nine riding days, one rest day in Toulouse, and 11 nights, led by John Brooks.
- *(p)* Dates and pricing are not final. Four departures in 2027: two between May 15 and June 15, and two in September. Exact dates are forthcoming. Pricing is to be de …
- *(a)* Ask a question
- *(h2)* The tour at a glance
- *(li)* 4 departures in 2027
- *(li)* 9 riding days
- *(li)* 1 rest day in Toulouse
- *(li)* 11 nights
- *(li)* The route is the same on every departure.
- *(li)* Groups run with a minimum of 6 riders. The target is 8, and the maximum is 12.
- *(h2)* The route and the week
- *(p)* From the Atlantic to the Mediterranean, the tour passes through these stops:
- *(li)* La Réole
- *(li)* Moissac
- *(li)* Toulouse (rest day)
- *(li)* Castelnaudary
- *(li)* Lézignan-Corbières
- *(li)* Capestang
- *(h3)* How the week runs
- *(li)* Friday Arrive in Bordeaux. Collect a rental e-bike if you booked one.
- *(li)* Saturday Ride briefing at breakfast, then wheels roll in the morning.
- *(li)* Nine riding days The group rides the canal path from Bordeaux to Sète, with one rest day and two nights in Toulouse.
- *(li)* Monday Final group night in Sète.
- *(li)* Tuesday Guests are on their own from the morning.
- *(h3)* Dinner in Toulouse
- *(p)* The second evening in Toulouse includes a dinner at a Michelin restaurant. Dress expectation: a collared shirt such as a polo for men, and business-casual cloth …
- *(h2)* What is included, and what you arrange separately
- *(p)* Dates and pricing are not final. Exact dates are forthcoming. Pricing is to be determined and will be announced before bookings open.
- *(li)* Friday arrival night in Bordeaux.
- *(li)* Lodging for every tour night through the final night in Sète.
- *(li)* All breakfasts.
- *(li)* All dinners, except two independent evenings: the arrival evening in Toulouse and the evening in Carcassonne.
- *(li)* A Michelin restaurant dinner on the second evening in Toulouse.
- *(li)* A ride briefing each morning at breakfast.
- *(li)* Routes in a BikeTourFrance.net RideWithGPS collection built for this tour.
- *(li)* Route notes on lunch, water, and restroom options for each riding day.
- *(li)* Access to planning resources: packing lists, French phrases to practice, audio history guides for each riding day, and background reading by ride day and region …
- *(h3)* You arrange separately
- *(li)* Your travel to Bordeaux and home from Sète. Guests are on their own from Tuesday morning after the final group night.
- *(li)* Your bicycle. Guests bring their own bikes.
- *(li)* An e-bike, if you want one. BikeTourFrance.net helps identify a vetted local rental agency in Bordeaux. You contract directly with that agency and must arrive e …
- *(li)* Front and rear panniers. They are required, and you carry all your own clothing and equipment.
- *(li)* A phone with a handlebar mount. RideWithGPS navigation on your phone is required.
- *(li)* Lunches and snacks.
- *(li)* Your two independent dinners, in Toulouse and Carcassonne.
- *(h2)* Self-supported means you carry your own gear
- *(li)* There is no support van and no luggage transport. You carry everything you bring.
- *(li)* The Canal des Deux Mers is fairly flat, but space on the bike still matters. Pack less than you think you need.
- *(li)* Guests ride with RideWithGPS navigation on a phone mounted to the handlebars.
- *(h2)* Earlier tours on this route
- *(h2)* Photos from the route

### `/canal-des-deux-mers/practical-info/` — 53

- *(title)* Bordeaux Airport to Gare Saint-Jean: tram or airport bus \| BikeTourFrance.net
- *(meta description)* How to get from Bordeaux Airport (Mérignac) to Gare Saint-Jean station and nearby hotels: Tram Line F or the 30'Direct airport bus, with times, costs, and bike  …
- *(img alt)* Illustration of a panda arriving at Bordeaux Airport with a bike case and a backpack.
- *(p)* Practical information
- *(h1)* Bordeaux Airport to Gare Saint-Jean and your hotel
- *(p)* Gare Saint-Jean is Bordeaux's main railway station. All recommended hotels are within about 500 m of the station.
- *(p)* Schedules and fares come from the transport operators and were last checked in June 2026. Confirm them with TBM and 30'Direct before you travel.
- *(h2)* Your two options
- *(h3)* Tram Line F
- *(li)* Cost: €1.90
- *(li)* Travel time: about 45 minutes
- *(li)* Frequency: every 10–15 minutes
- *(li)* Bike in a case: always allowed
- *(li)* Tickets: TBM app or machines
- *(li)* Best for: lowest cost and flexibility
- *(h3)* 30'Direct airport bus
- *(li)* Cost: €9–10
- *(li)* Travel time: about 30 minutes
- *(li)* Schedule: limited window
- *(li)* Bike in a case: accepted
- *(li)* Tickets: online or onboard
- *(li)* Best for: fastest public option
- *(h2)* Which should I choose?
- *(h3)* Choose Tram Line F if:
- *(li)* Lowest cost matters
- *(li)* You arrive early or late
- *(li)* You have a bike case
- *(li)* You want flexibility
- *(h3)* Choose the 30'Direct airport bus if:
- *(li)* Fastest journey matters
- *(li)* You arrive during operating hours
- *(li)* Extra cost is okay
- *(li)* You want the simplest trip
- *(summary)* What is it?
- *(p)* Direct tram connection from Bordeaux Airport (Mérignac) to Gare Saint-Jean (main train station). Launched Dec 6, 2025.
- *(p)* Direct coach shuttle from Bordeaux Airport to Gare Saint-Jean. No intermediate stops, no transfers.
- *(summary)* How often does it run?
- *(p)* Every 10 min (Mon–Sat) / Every 15 min (Sun/holidays). First: ~5am. Last: Midnight (Mon–Wed), 1am (Thu–Sat)
- *(p)* Limited: 07:30–20:05 daily. Mon–Fri: ~22 runs. Sat/Sun: ~14 runs. Not available early morning or late evening.
- *(summary)* How long does it take?
- *(p)* ~45 minutes. Direct, no transfers.
- *(p)* ~30 minutes (traffic dependent)
- *(summary)* How much does it cost?
- *(p)* €1.90 per ticket
- *(p)* €9 online / €10 on board
- *(summary)* What about my bike?
- *(p)* ✅ Bikes in cases: Always ✅ Bikes not in cases: 9am–4pm only ❌ NOT 7am–9am or 4pm–7pm Pack in case to avoid rush hours. TBM Bicycle Rules: 05 57 57 88 88
- *(p)* ✅ Bikes in cases: Yes ✅ Bikes not in cases: Yes Requirement: Closed bag, labeled with name, phone, address. Carrier may refuse oversized items. Bikes not in cas …
- *(summary)* How do I book?
- *(p)* No booking required. Buy ticket at tram stop (vending machine), TBM mobile app (Bordeaux transit app), or Relay newsstand at airport. To board: Validate your ti …
- *(p)* Book online at 30direct.com or pay €10 on board. Book in advance for €9 rate. To board: Show your ticket to the driver (printed, phone e-ticket, or mobile). Tic …
- *(h2)* Questions about getting to Bordeaux?
- *(p)* Email John and he will help you plan your arrival.

### `/contact/` — 8

- *(title)* Contact John \| BikeTourFrance.net
- *(meta description)* Email John Brooks with questions about the 2027 Canal des Deux Mers tours, the waitlist, or planning your own bike trip in France.
- *(h1)* Contact John
- *(p)* Email is the best way to reach BikeTourFrance.net.
- *(h2)* Choose a starting point
- *(p)* Each link opens your email program with a short message ready to fill in. If it does not open, write to john@biketourfrance.net directly.
- *(h2)* About the waitlist and the mailing list
- *(p)* This website does not have an online sign-up form yet. To hear about exact 2027 dates and pricing when they are announced, email John and ask to be added to the …

### `/cookies/` — 9

- *(title)* Cookies \| BikeTourFrance.net
- *(meta description)* This BikeTourFrance.net website does not set cookies of its own and runs no analytics or advertising tools.
- *(p)* What this website stores in your browser. Last updated October 2, 2026.
- *(h2)* Cookies and tracking on this site
- *(p)* This website's code does not set cookies, and it runs no analytics, advertising, or social-media tracking tools. Because of that, it shows no cookie banner and  …
- *(h2)* If that changes
- *(p)* If analytics or marketing tools are added later, this page will be updated first, and the site will ask for your choice before any non-essential tool runs.
- *(h2)* Other sites
- *(p)* Links on the Resources page lead to Google Docs, Google Sheets, and other websites. Those sites may set their own cookies once you open them.

### `/` — 10

- *(img alt)* A cyclist riding away on a paved canal path, with water and green vegetation on both sides and trees in the distance.
- *(img alt)* A rider in a red helmet smiling at the camera on a shaded canal path, with a second rider behind.
- *(img alt)* A rider on a pale gravel path beside a straight canal with grass on both sides.
- *(img alt)* John and friends seated together at a table, smiling at the camera.
- *(img alt)* Two loaded touring bikes parked in front of a wooden building with a sign reading "Créon fête le vélo".
- *(img alt)* Two green signs for the Canal du Midi cycle route, one pointing left and one pointing right.
- *(img alt)* Five riders in cycling jerseys sharing coffee at a café table.
- *(img alt)* A rider far ahead on a narrow cobbled strip between two stretches of calm water.
- *(img alt)* Three riders in cycling kit posing beside a bike in a town square with a palm tree.
- *(img alt)* A small stone church with a bell tower, with a bicycle leaning near its door.

### `/privacy/` — 10

- *(title)* Privacy \| BikeTourFrance.net
- *(meta description)* What the BikeTourFrance.net website does and does not collect, and how email you send to John is handled.
- *(p)* This page describes what this website does today. Last updated October 2, 2026.
- *(h2)* What this website collects
- *(h2)* When you email John
- *(h2)* Hosting and technical logs
- *(p)* Web servers normally record technical details of each visit, such as the page requested and the visitor's IP address. This website is hosted on Cloudflare Pages …
- *(h2)* Other sites and media
- *(p)* The Resources page loads audio files from BikeTourFrance.net's media storage only when you press play. It also links to Google Docs and Google Sheets and to oth …
- *(h2)* Questions

### `/resources/` — 6

- *(h1)* Resources for planning and riding
- *(h3)* Audio guides for the Canal des Deux Mers
- *(p)* A short history guide for each riding day, from Bordeaux to Sète. Press play to listen here, or download a file to listen offline. The files load only when you  …
- *(h3)* Reading
- *(h2)* Missing something?
- *(p)* Tell John what would make planning easier and he will consider adding it.

### `/terms/` — 11

- *(title)* Terms \| BikeTourFrance.net
- *(meta description)* Terms for using the BikeTourFrance.net website: tour information may change, no bookings are taken on this site, and links lead to other sites.
- *(p)* How to read the information on this website. Last updated October 2, 2026.
- *(h2)* Tour information
- *(p)* The tour descriptions on this website are plans, and they can change. Exact dates and pricing for the 2027 tours have not been announced. Deposit, payment, and  …
- *(h2)* No bookings on this website
- *(p)* You cannot book or pay for a tour on this website. Asking to join the waitlist by email does not reserve a place. Any booking terms will be given to you in writ …
- *(h2)* Advice and planning help
- *(p)* Information here, including the Practical Information and Resources pages, is general guidance from John's own experience. Transport schedules, fares, and rules …
- *(h2)* Links to other sites
- *(p)* This website links to other websites and to files stored elsewhere. BikeTourFrance.net does not control them.

### `/tours/` — 15

- *(title)* Bike tours in France: small-group and self-guided \| BikeTourFrance.net
- *(meta description)* BikeTourFrance.net offers small-group, self-supported bicycle tours in France, a self-guided tour package, and trip-planning help from John Brooks.
- *(img alt)* A rider on a pale gravel path beside a straight canal with grass on both sides.
- *(h1)* Ways to ride in France with BikeTourFrance.net
- *(p)* All BikeTourFrance.net tours are self-supported. You carry your own gear from place to place, and John helps you plan the rest.
- *(h2)* Canal des Deux Mers, 2027
- *(p)* Bordeaux (Atlantic) to Sète (Mediterranean), the same route on every departure.
- *(p)* Four departures in 2027: two between May 15 and June 15, and two in September. Exact dates are forthcoming. Pricing is to be determined and will be announced be …
- *(a)* See the 2027 tour
- *(p)* If you prefer to travel on your own schedule, John offers a self-guided tour package. He builds the routes, books your accommodations, and gives practical suppo …
- *(p)* Details and rates are shared by email, because each trip is different.
- *(a)* Ask about self-guided
- *(h2)* Trip-planning help
- *(p)* Want to plan your own adventure in France and only need coaching? Send John an email. He loves helping fellow bike travelers plan a great trip. Materials and su …
- *(a)* Ask about trip planning

### `/waitlist-2027/` — 13

- *(title)* Join the 2027 Tour Waitlist \| BikeTourFrance.net
- *(meta description)* Join the BikeTourFrance.net 2027 tour waitlist and hear first when 2027 tours are finalized.
- *(h1)* Join the BikeTourFrance.net 2027 Tour Waitlist
- *(p)* Be among the first to hear when our 2027 tours are ready.
- *(p)* The waitlist is the simplest way to show interest in a 2027 tour. Tell us your name and the season you prefer. When 2027 tours are finalized, you will hear from …
- *(h2)* You're on the list.
- *(p)* Thank you for joining the 2027 waitlist. A confirmation email is on its way. If you don't see it within a few minutes, check your spam folder.
- *(label)* First name
- *(label)* Either
- *(label)* Send me BikeTourFrance.net updates by email
- *(label)* Leave this field empty
- *(p)* By clicking Join the 2027 Waitlist, I agree to receive BikeTourFrance.net emails about tours, route guides, and services. I can unsubscribe at any time.
- *(button)* Join the 2027 Waitlist

## Source locations

152 occurrences across 17 files. The owner-reported case is
`src/pages/tours/index.astro:20`.

### `src/data/resources.ts` — 27

- `src/data/resources.ts:15` *(data field)* Complete Canal des Deux Mers audio route guide
- `src/data/resources.ts:18` *(data field)* Introduction
- `src/data/resources.ts:20` *(data field)* Riding day 1: Bordeaux to La Réole
- `src/data/resources.ts:24` *(data field)* Riding day 2: La Réole to Agen
- `src/data/resources.ts:27` *(data field)* Riding day 3: Agen to Moissac
- `src/data/resources.ts:29` *(data field)* Riding day 4: Moissac to Toulouse
- `src/data/resources.ts:32` *(data field)* Toulouse rest day
- `src/data/resources.ts:34` *(data field)* Riding day 5: Toulouse to Castelnaudary
- `src/data/resources.ts:38` *(data field)* Riding day 6: Castelnaudary to Carcassonne
- `src/data/resources.ts:42` *(data field)* Riding day 7: Carcassonne to Lézignan-Corbières
- `src/data/resources.ts:46` *(data field)* Riding day 8: Lézignan-Corbières to Capestang
- `src/data/resources.ts:50` *(data field)* Riding day 9: Capestang to Sète
- `src/data/resources.ts:53` *(data field)* Conclusion
- `src/data/resources.ts:57` *(data field)* The Cooking of Southwest France: introduction
- `src/data/resources.ts:69` *(data field)* Bicycle Touring Pack List v2
- `src/data/resources.ts:77` *(data field)* Canal des Deux Mers historical narrative, mobile version
- `src/data/resources.ts:84` *(data field)* EuroVelo
- `src/data/resources.ts:85` *(data field)* France Vélo Tourisme
- `src/data/resources.ts:86` *(data field)* Komoot
- `src/data/resources.ts:88` *(data field)* AF3V (French greenways)
- `src/data/resources.ts:89` *(data field)* SNCF Connect
- `src/data/resources.ts:90` *(data field)* IGN (French national geographic institute)
- `src/data/resources.ts:91` *(data field)* Vélo & Territoires
- `src/data/resources.ts:92` *(data field)* FreeWheelingFrance.com
- `src/data/resources.ts:94` *(data field)* Adventure Cycling Association: what to look for in a touring bike
- `src/data/resources.ts:97` *(data field)* Peak & Coast Cycling Camp
- `src/data/resources.ts:98` *(data field)* Azure Cycle Tours

### `src/data/photos.ts` — 20

- `src/data/photos.ts:35` *(data field)* A cyclist riding away on a paved canal path, with water and green vegetation on both sides and trees in the di …
- `src/data/photos.ts:39` *(data field)* Five riders in cycling jerseys sharing coffee at a café table.
- `src/data/photos.ts:43` *(data field)* John and friends seated together at a table, smiling at the camera.
- `src/data/photos.ts:47` *(data field)* Two loaded touring bikes parked in front of a wooden building with a sign reading "Créon fête le vélo".
- `src/data/photos.ts:52` *(data field)* Two green signs for the Canal du Midi cycle route, one pointing left and one pointing right.
- `src/data/photos.ts:53` *(data field)* Canal du Midi route signs
- `src/data/photos.ts:57` *(data field)* A touring bike leaning against the front of a small hotel with a blue balcony.
- `src/data/photos.ts:61` *(data field)* Three riders with loaded bikes standing on the pavement outside a hotel entrance.
- `src/data/photos.ts:65` *(data field)* A rider on a pale gravel path beside a straight canal with grass on both sides.
- `src/data/photos.ts:69` *(data field)* A rider far ahead on a narrow cobbled strip between two stretches of calm water.
- `src/data/photos.ts:73` *(data field)* A rider in a red helmet smiling at the camera on a shaded canal path, with a second rider behind.
- `src/data/photos.ts:77` *(data field)* A paved path through tall pine trees with a rider in the distance.
- `src/data/photos.ts:81` *(data field)* A small stone church with a bell tower, with a bicycle leaning near its door.
- `src/data/photos.ts:85` *(data field)* A rider taking a selfie on a train next to loaded touring bikes.
- `src/data/photos.ts:89` *(data field)* Two people working on a bicycle wheel together in a workshop.
- `src/data/photos.ts:93` *(data field)* Riders in matching cycling jerseys on a tree-lined path, with more riders behind them.
- `src/data/photos.ts:97` *(data field)* Three riders in cycling kit posing beside a bike in a town square with a palm tree.
- `src/data/photos.ts:101` *(data field)* A long straight paved greenway through pine woods, with one rider ahead in the distance.
- `src/data/photos.ts:105` *(data field)* Illustration of a panda arriving at Bordeaux Airport with a bike case and a backpack.
- `src/data/photos.ts:109` *(data field)* Illustration of a panda in an orange scarf standing beside a loaded touring bike, with the words BikeTourFranc …

### `src/pages/canal-des-deux-mers/index.astro` — 15

- `src/pages/canal-des-deux-mers/index.astro:22` *(title)* Canal des Deux Mers by bike, 2027 small-group tour
- `src/pages/canal-des-deux-mers/index.astro:23` *(description)* Ride from Bordeaux to Sète along the Canal des Deux Mers with a small, self-supported group. Four departures i …
- `src/pages/canal-des-deux-mers/index.astro:28` *(<p>)* 2027 small-group tour
- `src/pages/canal-des-deux-mers/index.astro:29` *(<h1>)* Canal des Deux Mers by bike, Bordeaux to Sète
- `src/pages/canal-des-deux-mers/index.astro:41` *(<button>)* Ask a question
- `src/pages/canal-des-deux-mers/index.astro:60` *(<h2>)* The tour at a glance
- `src/pages/canal-des-deux-mers/index.astro:70` *(<li>)* The route is the same on every departure.
- `src/pages/canal-des-deux-mers/index.astro:81` *(<h2>)* The route and the week
- `src/pages/canal-des-deux-mers/index.astro:82` *(<p>)* From the Atlantic to the Mediterranean, the tour passes through these stops:
- `src/pages/canal-des-deux-mers/index.astro:83` *(aria-label)* Route stops in order
- `src/pages/canal-des-deux-mers/index.astro:88` *(<h3>)* How the week runs
- `src/pages/canal-des-deux-mers/index.astro:97` *(<h3>)* Dinner in Toulouse
- `src/pages/canal-des-deux-mers/index.astro:113` *(<h2>)* Self-supported means you carry your own gear
- `src/pages/canal-des-deux-mers/index.astro:138` *(<h2>)* Earlier tours on this route
- `src/pages/canal-des-deux-mers/index.astro:149` *(<h2>)* Photos from the route

### `src/pages/canal-des-deux-mers/practical-info/index.astro` — 13

- `src/pages/canal-des-deux-mers/practical-info/index.astro:60` *(title)* Bordeaux Airport to Gare Saint-Jean: tram or airport bus
- `src/pages/canal-des-deux-mers/practical-info/index.astro:61` *(description)* How to get from Bordeaux Airport (Mérignac) to Gare Saint-Jean station and nearby hotels: Tram Line F or the 3 …
- `src/pages/canal-des-deux-mers/practical-info/index.astro:66` *(<p>)* Practical information
- `src/pages/canal-des-deux-mers/practical-info/index.astro:67` *(<h1>)* Bordeaux Airport to Gare Saint-Jean and your hotel
- `src/pages/canal-des-deux-mers/practical-info/index.astro:68` *(<p>)* Gare Saint-Jean is Bordeaux's main railway station. All recommended hotels are within about 500 m of the stati …
- `src/pages/canal-des-deux-mers/practical-info/index.astro:94` *(<h2>)* Your two options
- `src/pages/canal-des-deux-mers/practical-info/index.astro:97` *(<h3>)* Tram Line F
- `src/pages/canal-des-deux-mers/practical-info/index.astro:105` *(<h3>)* 30'Direct airport bus
- `src/pages/canal-des-deux-mers/practical-info/index.astro:118` *(<h2>)* Which should I choose?
- `src/pages/canal-des-deux-mers/practical-info/index.astro:121` *(<h3>)* Choose Tram Line F if:
- `src/pages/canal-des-deux-mers/practical-info/index.astro:129` *(<h3>)* Choose the 30'Direct airport bus if:
- `src/pages/canal-des-deux-mers/practical-info/index.astro:148` *(<h3>)* Tram Line F
- `src/pages/canal-des-deux-mers/practical-info/index.astro:152` *(<h3>)* 30'Direct airport bus

### `src/pages/tours/index.astro` — 12

- `src/pages/tours/index.astro:13` *(title)* Bike tours in France: small-group and self-guided
- `src/pages/tours/index.astro:14` *(description)* BikeTourFrance.net offers small-group, self-supported bicycle tours in France, a self-guided tour package, and …
- `src/pages/tours/index.astro:20` *(<h1>)* Ways to ride in France with BikeTourFrance.net
- `src/pages/tours/index.astro:21` *(<p>)* All BikeTourFrance.net tours are self-supported. You carry your own gear from place to place, and John helps y …
- `src/pages/tours/index.astro:31` *(<h2>)* Canal des Deux Mers, 2027
- `src/pages/tours/index.astro:37` *(<button>)* See the 2027 tour
- `src/pages/tours/index.astro:58` *(<p>)* If you prefer to travel on your own schedule, John offers a self-guided tour package. He builds the routes, bo …
- `src/pages/tours/index.astro:63` *(<p>)* Details and rates are shared by email, because each trip is different.
- `src/pages/tours/index.astro:65` *(<button>)* Ask about self-guided
- `src/pages/tours/index.astro:74` *(<h2>)* Trip-planning help
- `src/pages/tours/index.astro:75` *(<p>)* Want to plan your own adventure in France and only need coaching? Send John an email. He loves helping fellow  …
- `src/pages/tours/index.astro:80` *(<button>)* Ask about trip planning

### `src/pages/terms/index.astro` — 10

- `src/pages/terms/index.astro:10` *(description)* Terms for using the BikeTourFrance.net website: tour information may change, no bookings are taken on this sit …
- `src/pages/terms/index.astro:15` *(<p>)* How to read the information on this website. Last updated October 2, 2026.
- `src/pages/terms/index.astro:18` *(<h2>)* Tour information
- `src/pages/terms/index.astro:19` *(<p>)* The tour descriptions on this website are plans, and they can change. Exact dates and pricing for the 2027 tou …
- `src/pages/terms/index.astro:24` *(<h2>)* No bookings on this website
- `src/pages/terms/index.astro:25` *(<p>)* You cannot book or pay for a tour on this website. Asking to join the waitlist by email does not reserve a pla …
- `src/pages/terms/index.astro:30` *(<h2>)* Advice and planning help
- `src/pages/terms/index.astro:31` *(<p>)* Information here, including the Practical Information and Resources pages, is general guidance from John's own …
- `src/pages/terms/index.astro:37` *(<h2>)* Links to other sites
- `src/pages/terms/index.astro:38` *(<p>)* This website links to other websites and to files stored elsewhere. BikeTourFrance.net does not control them.

### `src/pages/waitlist-2027.astro` — 10

- `src/pages/waitlist-2027.astro:100` *(<h1>)* Join the BikeTourFrance.net 2027 Tour Waitlist
- `src/pages/waitlist-2027.astro:101` *(<p>)* Be among the first to hear when our 2027 tours are ready.
- `src/pages/waitlist-2027.astro:105` *(<p>)* The waitlist is the simplest way to show interest in a 2027 tour. Tell us your name and the season you prefer. …
- `src/pages/waitlist-2027.astro:111` *(<h2>)* You're on the list.
- `src/pages/waitlist-2027.astro:112` *(<p>)* Thank you for joining the 2027 waitlist. A confirmation email is on its way. If you don't see it within a few  …
- `src/pages/waitlist-2027.astro:117` *(<label>)* First name
- `src/pages/waitlist-2027.astro:132` *(<label>)* Either
- `src/pages/waitlist-2027.astro:139` *(<label>)* Send me BikeTourFrance.net updates by email
- `src/pages/waitlist-2027.astro:144` *(<label>)* Leave this field empty
- `src/pages/waitlist-2027.astro:149` *(<button>)* Join the 2027 Waitlist

### `src/pages/privacy/index.astro` — 9

- `src/pages/privacy/index.astro:10` *(description)* What the BikeTourFrance.net website does and does not collect, and how email you send to John is handled.
- `src/pages/privacy/index.astro:15` *(<p>)* This page describes what this website does today. Last updated October 2, 2026.
- `src/pages/privacy/index.astro:18` *(<h2>)* What this website collects
- `src/pages/privacy/index.astro:24` *(<h2>)* When you email John
- `src/pages/privacy/index.astro:31` *(<h2>)* Hosting and technical logs
- `src/pages/privacy/index.astro:32` *(<p>)* Web servers normally record technical details of each visit, such as the page requested and the visitor's IP a …
- `src/pages/privacy/index.astro:38` *(<h2>)* Other sites and media
- `src/pages/privacy/index.astro:39` *(<p>)* The Resources page loads audio files from BikeTourFrance.net's media storage only when you press play. It also …
- `src/pages/privacy/index.astro:45` *(<h2>)* Questions

### `src/data/cdm2027.ts` — 8

- `src/data/cdm2027.ts:19` *(data field)* departures in 2027
- `src/data/cdm2027.ts:20` *(data field)* riding days
- `src/data/cdm2027.ts:54` *(data field)* Arrive in Bordeaux. Collect a rental e-bike if you booked one.
- `src/data/cdm2027.ts:55` *(data field)* Ride briefing at breakfast, then wheels roll in the morning.
- `src/data/cdm2027.ts:58` *(data field)* The group rides the canal path from Bordeaux to Sète, with one rest day and two nights in Toulouse.
- `src/data/cdm2027.ts:60` *(data field)* Final group night in Sète.
- `src/data/cdm2027.ts:61` *(data field)* Guests are on their own from the morning.
- `src/data/cdm2027.ts:78` *(data field)* The second evening in Toulouse includes a dinner at a Michelin restaurant.

### `src/pages/cookies/index.astro` — 8

- `src/pages/cookies/index.astro:9` *(description)* This BikeTourFrance.net website does not set cookies of its own and runs no analytics or advertising tools.
- `src/pages/cookies/index.astro:14` *(<p>)* What this website stores in your browser. Last updated October 2, 2026.
- `src/pages/cookies/index.astro:17` *(<h2>)* Cookies and tracking on this site
- `src/pages/cookies/index.astro:18` *(<p>)* This website's code does not set cookies, and it runs no analytics, advertising, or social-media tracking tool …
- `src/pages/cookies/index.astro:23` *(<h2>)* If that changes
- `src/pages/cookies/index.astro:24` *(<p>)* If analytics or marketing tools are added later, this page will be updated first, and the site will ask for yo …
- `src/pages/cookies/index.astro:29` *(<h2>)* Other sites
- `src/pages/cookies/index.astro:30` *(<p>)* Links on the Resources page lead to Google Docs, Google Sheets, and other websites. Those sites may set their  …

### `src/pages/contact/index.astro` — 7

- `src/pages/contact/index.astro:10` *(title)* Contact John
- `src/pages/contact/index.astro:11` *(description)* Email John Brooks with questions about the 2027 Canal des Deux Mers tours, the waitlist, or planning your own  …
- `src/pages/contact/index.astro:16` *(<h1>)* Contact John
- `src/pages/contact/index.astro:17` *(<p>)* Email is the best way to reach BikeTourFrance.net.
- `src/pages/contact/index.astro:25` *(<h2>)* Choose a starting point
- `src/pages/contact/index.astro:42` *(<h2>)* About the waitlist and the mailing list
- `src/pages/contact/index.astro:43` *(<p>)* This website does not have an online sign-up form yet. To hear about exact 2027 dates and pricing when they ar …

### `src/pages/about/index.astro` — 4

- `src/pages/about/index.astro:13` *(title)* About John Brooks
- `src/pages/about/index.astro:14` *(description)* John Brooks leads small, self-supported bicycle tours in France. Learn who he is, how the tours work, and why  …
- `src/pages/about/index.astro:40` *(<h2>)* How the tours work
- `src/pages/about/index.astro:48` *(<h2>)* Who is planning your trip

### `src/pages/resources/index.astro` — 4

- `src/pages/resources/index.astro:28` *(<h1>)* Resources for planning and riding
- `src/pages/resources/index.astro:61` *(<h3>)* Audio guides for the Canal des Deux Mers
- `src/pages/resources/index.astro:64` *(<p>)* A short history guide for each riding day, from Bordeaux to Sète. Press play to listen here, or download a fil …
- `src/pages/resources/index.astro:104` *(<h3>)* Reading

### `src/pages/404.astro` — 2

- `src/pages/404.astro:15` *(description)* That page is not on the BikeTourFrance.net website. Use these links to find the tour, resources, or contact pa …
- `src/pages/404.astro:21` *(<p>)* These pages can help:

### `src/components/Footer.astro` — 1

- `src/components/Footer.astro:19` *(alt)* BikeTourFrance.net logo: a bicycle over a map of France

### `src/components/Header.astro` — 1

- `src/components/Header.astro:21` *(alt)* BikeTourFrance.net logo: a bicycle over a map of France

### `src/data/site.ts` — 1

- `src/data/site.ts:28` *(data field)* Practical information

## What this requires

1. **Restore the reverse check.** Make `verify-rendered.mjs` fail when a visible string, title,
   meta description, `alt` or `aria-label` has no approved field, with a short explicit
   allow-list for genuine chrome so the exemption is reviewed rather than implicit.
2. **Rebuild the manifest to full coverage**, starting from `docs/COPY_FIELD_MAP_REVIEW.md`
   (224 fields) and reconciling against the current 12 routes.
3. **Add the missing rows to the Sheet**, marked YELLOW until approved.
4. **Re-point the components** at `COPY` so text comes from the Sheet rather than literals.

Steps 1 and 2 are the durable fix. Without step 1 the same drift recurs silently.

**Not done in this audit:** no copy changed, no Sheet row added or edited, no component re-pointed.
This document reports only.
