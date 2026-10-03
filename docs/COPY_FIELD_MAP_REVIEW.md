# Copy field map for review

Prepared 2026-10-03 from the **current staging site**. Nothing here has been approved, and the Sheet `BTF_Approved_Site_Copy` is **not** yet the required production source. This map is for review first.

## How this map was checked

- Every row's copy was confirmed present, in display order, on the pages built from this branch (`npm run copy:check-local`, 11 pages, 224 fields).
- The same check was run against the HTML of the deployed Cloudflare Pages preview of the staging site (`e476b72c.temp-btf.pages.dev`) and passed on all 11 pages.
- It also confirms no page shows text, image alt text, a title, or a description that is missing from this map. A mismatch anywhere would have failed that check.

## At a glance

| | |
|---|---|
| Fields | 224 (220 required, 4 optional) |
| Text | 147 |
| CTA (button labels) | 12 |
| Link text | 16 |
| Image alt text | 14 |
| Structured content (lists, sections, link lists, multi-line answers) | 35 |

Each field is one editable block. "Required" means the current public site needs that block. Four fields are optional: the staging banner and the draft-review note (staging only), and two photo captions.

## Points to check while reviewing

1. **Pricing** stays unpublished and marked TBD. The wording is in `home/whats_included_notice`, `cdm-tour/whats_included_notice`, `cdm-tour/dates_pricing_notice`, and `tours/group_body`, and is mentioned in `contact/lists_body` and `terms/page_copy`. No dollar amount appears anywhere in the map.
2. **Mailing list.** The site has no mailing list, and this map has no mailing-list field. The existing Contact page heading `contact/lists_heading` still says "the waitlist and the mailing list" and its body says there is no online sign-up form. The wording is shown exactly as it is on the site today, so you can decide whether to change it.
3. **Dated wording.** `site/footer_copyright` (2026), `privacy/page_lede`, `terms/page_lede`, `cookies/page_lede` ("Last updated October 2, 2026"), `practical-information/data_notice` ("last checked in June 2026"), and `cdm-tour/history_body` ("September 2026").
4. **Policy pages** (`privacy/page_copy`, `terms/page_copy`, `cookies/page_copy`) are factual shells that still need your legal review. See `docs/PRODUCTION_CUTOVER_PREFLIGHT.md`.
5. **Copy carried over from the old Framer site** and not in your confirmed 2027 facts is listed in `docs/2027_CDM_CONTENT_AUTHORITY.md`.
6. Link destinations and email subjects are not part of this map. They stay in code.

## All pages (header, footer, shared labels)

Route: `*`

| Page | `page/field_name` | Current rendered copy | Content type | Required |
|---|---|---|---|---|
| All pages (header, footer, shared labels) | `site/skip_link` | Skip to main content | text | Yes |
| All pages (header, footer, shared labels) | `site/staging_banner` | Staging preview. This site is not indexed by search engines and is not the live BikeTourFrance.net site. | text | No (staging only) |
| All pages (header, footer, shared labels) | `site/brand_name` | BikeTourFrance.net | text | Yes |
| All pages (header, footer, shared labels) | `site/menu_button` | Menu | text | Yes |
| All pages (header, footer, shared labels) | `site/nav_tours` | Tours | link text | Yes |
| All pages (header, footer, shared labels) | `site/nav_cdm_tour` | Canal des Deux Mers | link text | Yes |
| All pages (header, footer, shared labels) | `site/nav_practical_information` | Practical Information | link text | Yes |
| All pages (header, footer, shared labels) | `site/nav_resources` | Resources | link text | Yes |
| All pages (header, footer, shared labels) | `site/nav_about` | About | link text | Yes |
| All pages (header, footer, shared labels) | `site/nav_contact` | Contact | link text | Yes |
| All pages (header, footer, shared labels) | `site/footer_tagline` | Small-group, self-supported bicycle tours in France, led by John Brooks. Eat. Sleep. Roll. Repeat. | text | Yes |
| All pages (header, footer, shared labels) | `site/footer_email` | john@biketourfrance.net | link text | Yes |
| All pages (header, footer, shared labels) | `site/footer_explore_heading` | Explore | text | Yes |
| All pages (header, footer, shared labels) | `site/footer_legal_heading` | Legal | text | Yes |
| All pages (header, footer, shared labels) | `site/legal_privacy` | Privacy | link text | Yes |
| All pages (header, footer, shared labels) | `site/legal_terms` | Terms | link text | Yes |
| All pages (header, footer, shared labels) | `site/legal_cookies` | Cookies | link text | Yes |
| All pages (header, footer, shared labels) | `site/footer_copyright` | © 2026 BikeTourFrance.net | text | Yes |
| All pages (header, footer, shared labels) | `site/cta_waitlist_label` | Ask to join the 2027 waitlist | CTA | Yes |
| All pages (header, footer, shared labels) | `site/cta_email_label` | Email john@biketourfrance.net | CTA | Yes |
| All pages (header, footer, shared labels) | `site/review_note` | **Draft for owner review.** This page states only facts that can be confirmed from this website's code. The owner must review it, and any legal or service-provider details, before launch. The open items are listed in docs/PRODUCTION_CUTOVER_PREFLIGHT.md. | text | No (staging only) |

## Home

Route: `/`

| Page | `page/field_name` | Current rendered copy | Content type | Required |
|---|---|---|---|---|
| Home | `home/seo_title` | BikeTourFrance.net: small-group bicycle tours in France | text | Yes |
| Home | `home/seo_description` | Small-group, self-supported bicycle tours in France led by John Brooks, including four Canal des Deux Mers departures in 2027, plus help planning your own trip. | text | Yes |
| Home | `home/hero_eyebrow` | Small-group bike tours in France | text | Yes |
| Home | `home/hero_heading` | Choose your own bike adventure in France | text | Yes |
| Home | `home/hero_body` | Join a small, self-supported group tour in 2027, or plan an independent trip with help from someone who has ridden it. | text | Yes |
| Home | `home/hero_cta_tour` | See the 2027 Canal des Deux Mers tour | CTA | Yes |
| Home | `home/tour_waitlist_cta` | Ask to join the waitlist | CTA | Yes |
| Home | `home/ways_heading` | Two ways to ride | text | Yes |
| Home | `home/ways_group_heading` | Small-group tour, 2027 | text | Yes |
| Home | `home/ways_group_body` | Four Canal des Deux Mers departures in 2027, in small groups of up to twelve riders. John leads the ride and explains each day's plan in detail. | text | Yes |
| Home | `home/ways_group_link` | Read about the 2027 tour | link text | Yes |
| Home | `home/ways_own_heading` | Plan your own trip | text | Yes |
| Home | `home/ways_own_body` | Want to plan your own adventure in France and just need coaching? Send John an email. Planning sessions are by arrangement, and John will tell you how they work. Materials for independent tours are coming soon. | text | Yes |
| Home | `home/ways_own_link` | Email John about trip planning | link text | Yes |
| Home | `home/cdm_eyebrow` | Canal des Deux Mers, 2027 | text | Yes |
| Home | `home/cdm_heading` | Cross France by bike along the great canals | text | Yes |
| Home | `home/cdm_summary` | Bordeaux (Atlantic) to Sète (Mediterranean), the same route on every departure. Nine riding days, one rest day in Toulouse, and 11 nights. | text | Yes |
| Home | `home/cdm_stats` | • **4** departures in 2027<br>• **9** riding days<br>• **1** rest day in Toulouse<br>• **11** nights | structured content | Yes |
| Home | `home/cdm_departures` | Four departures in 2027: two between May 15 and June 15, and two in September. Exact dates are forthcoming. | text | Yes |
| Home | `home/cdm_cta` | Learn about the Canal des Deux Mers tour | CTA | Yes |
| Home | `home/whats_included_heading` | What is included, and what you arrange separately | text | Yes |
| Home | `home/whats_included_notice` | **Dates and pricing are not final.** Exact dates are forthcoming. Pricing is to be determined and will be announced before bookings open. | text | Yes |
| Home | `home/whats_included_label` | Included | text | Yes |
| Home | `home/whats_included` | • Friday arrival night in Bordeaux.<br>• Lodging for every tour night through the final night in Sète.<br>• All breakfasts.<br>• All dinners, except two independent evenings: the arrival evening in Toulouse and the evening in Carcassonne.<br>• A Michelin restaurant dinner on the second evening in Toulouse.<br>• A ride briefing each morning at breakfast.<br>• Routes in a BikeTourFrance.net RideWithGPS collection built for this tour.<br>• Route notes on lunch, water, and restroom options for each riding day.<br>• Access to planning resources: packing lists, French phrases to practice, audio history guides for each riding day, and background reading by ride day and region. | structured content | Yes |
| Home | `home/what_you_arrange_separately_label` | You arrange separately | text | Yes |
| Home | `home/what_you_arrange_separately` | • Your travel to Bordeaux and home from Sète. Guests are on their own from Tuesday morning after the final group night.<br>• Your bicycle. Guests bring their own bikes.<br>• An e-bike, if you want one. BikeTourFrance.net helps identify a vetted local rental agency in Bordeaux. You contract directly with that agency and must arrive early enough in Bordeaux to collect the bike.<br>• Front and rear panniers. They are required, and you carry all your own clothing and equipment.<br>• A phone with a handlebar mount. RideWithGPS navigation on your phone is required.<br>• Lunches and snacks.<br>• Your two independent dinners, in Toulouse and Carcassonne. | structured content | Yes |
| Home | `home/about_eyebrow` | About BikeTourFrance.net | text | Yes |
| Home | `home/about_heading` | Eat. Sleep. Roll. Repeat. | text | Yes |
| Home | `home/about_body` | I'm John, the cyclist behind BikeTourFrance.net. I help riders carry out extraordinary bicycle tours in France. I lead small, self-supported group tours, so I can plan each day with you, explain it in depth, and give the group the attention it needs. | text | Yes |
| Home | `home/about_link` | More about John and how the tours work | link text | Yes |
| Home | `home/gallery_heading` | Tour gallery | text | Yes |
| Home | `home/gallery_link` | More photos on the Canal des Deux Mers page | link text | Yes |
| Home | `home/ready_to_ride_heading` | Ready to ride? | text | Yes |
| Home | `home/contact_cta` | Email John with your questions, or ask to be added to the 2027 waitlist. He answers every message himself. | text | Yes |

## Tours

Route: `/tours/`

| Page | `page/field_name` | Current rendered copy | Content type | Required |
|---|---|---|---|---|
| Tours | `tours/seo_title` | Bike tours in France: small-group and self-guided | text | Yes |
| Tours | `tours/seo_description` | BikeTourFrance.net offers small-group, self-supported bicycle tours in France, a self-guided tour package, and trip-planning help from John Brooks. | text | Yes |
| Tours | `tours/page_eyebrow` | Tours | text | Yes |
| Tours | `tours/page_heading` | Ways to ride in France with BikeTourFrance.net | text | Yes |
| Tours | `tours/page_lede` | All BikeTourFrance.net tours are self-supported. You carry your own gear from place to place, and John helps you plan the rest. | text | Yes |
| Tours | `tours/group_heading` | Canal des Deux Mers, 2027 | text | Yes |
| Tours | `tours/group_body` | Bordeaux (Atlantic) to Sète (Mediterranean), the same route on every departure.<br><br>Four departures in 2027: two between May 15 and June 15, and two in September. Exact dates are forthcoming. Pricing is to be determined and will be announced before bookings open. | structured content | Yes |
| Tours | `tours/group_cta` | See the 2027 tour | CTA | Yes |
| Tours | `tours/group_waitlist_cta` | Ask to join the waitlist | CTA | Yes |
| Tours | `tours/self_guided_heading` | Self-guided tour package | text | Yes |
| Tours | `tours/self_guided_body` | If you prefer to travel on your own schedule, John offers a self-guided tour package. He builds the routes, books your accommodations, and gives practical support as you prepare. You ride independently, with a sound plan and help when you need it.<br><br>Details and rates are shared by email, because each trip is different. | structured content | Yes |
| Tours | `tours/self_guided_cta` | Email John about a self-guided trip | CTA | Yes |
| Tours | `tours/coaching_heading` | Trip-planning help | text | Yes |
| Tours | `tours/coaching_body` | Want to plan your own adventure in France and only need coaching? Send John an email. He loves helping fellow bike travelers plan a great trip. Materials and support for independent tours are coming soon. | text | Yes |
| Tours | `tours/coaching_cta` | Ask about trip planning | CTA | Yes |
| Tours | `tours/ready_to_ride_heading` | Ready to ride? | text | Yes |
| Tours | `tours/contact_cta` | Email John with your questions, or ask to be added to the 2027 waitlist. He answers every message himself. | text | Yes |

## Canal des Deux Mers

Route: `/canal-des-deux-mers/`

| Page | `page/field_name` | Current rendered copy | Content type | Required |
|---|---|---|---|---|
| Canal des Deux Mers | `cdm-tour/seo_title` | Canal des Deux Mers by bike, 2027 small-group tour | text | Yes |
| Canal des Deux Mers | `cdm-tour/seo_description` | Ride from Bordeaux to Sète along the Canal des Deux Mers with a small, self-supported group. Four departures in 2027: nine riding days, one rest day in Toulouse, 11 nights. | text | Yes |
| Canal des Deux Mers | `cdm-tour/hero_eyebrow` | 2027 small-group tour | text | Yes |
| Canal des Deux Mers | `cdm-tour/hero_heading` | Canal des Deux Mers by bike, Bordeaux to Sète | text | Yes |
| Canal des Deux Mers | `cdm-tour/hero_body` | Bordeaux (Atlantic) to Sète (Mediterranean), the same route on every departure. Nine riding days, one rest day in Toulouse, and 11 nights, led by John Brooks. | text | Yes |
| Canal des Deux Mers | `cdm-tour/dates_pricing_notice` | **Dates and pricing are not final.** Four departures in 2027: two between May 15 and June 15, and two in September. Exact dates are forthcoming. Pricing is to be determined and will be announced before bookings open. | text | Yes |
| Canal des Deux Mers | `cdm-tour/hero_cta_question` | Ask a question | CTA | Yes |
| Canal des Deux Mers | `cdm-tour/glance_heading` | The tour at a glance | text | Yes |
| Canal des Deux Mers | `cdm-tour/glance_stats` | • **4** departures in 2027<br>• **9** riding days<br>• **1** rest day in Toulouse<br>• **11** nights | structured content | Yes |
| Canal des Deux Mers | `cdm-tour/glance_points` | • The route is the same on every departure.<br>• Groups run with a minimum of 6 riders. The target is 8, and the maximum is 12. | structured content | Yes |
| Canal des Deux Mers | `cdm-tour/route_heading` | The route and the week | text | Yes |
| Canal des Deux Mers | `cdm-tour/route_intro` | From the Atlantic to the Mediterranean, the tour passes through these stops: | text | Yes |
| Canal des Deux Mers | `cdm-tour/route_stops` | • Bordeaux<br>• La Réole<br>• Agen<br>• Moissac<br>• Toulouse (rest day)<br>• Castelnaudary<br>• Carcassonne<br>• Lézignan-Corbières<br>• Capestang<br>• Sète | structured content | Yes |
| Canal des Deux Mers | `cdm-tour/week_heading` | How the week runs | text | Yes |
| Canal des Deux Mers | `cdm-tour/week_plan` | • **Friday** Arrive in Bordeaux. Collect a rental e-bike if you booked one.<br>• **Saturday** Ride briefing at breakfast, then wheels roll in the morning.<br>• **Nine riding days** The group rides the canal path from Bordeaux to Sète, with one rest day and two nights in Toulouse.<br>• **Monday** Final group night in Sète.<br>• **Tuesday** Guests are on their own from the morning. | structured content | Yes |
| Canal des Deux Mers | `cdm-tour/toulouse_dinner_heading` | Dinner in Toulouse | text | Yes |
| Canal des Deux Mers | `cdm-tour/toulouse_dinner` | The second evening in Toulouse includes a dinner at a Michelin restaurant. Dress expectation: a collared shirt such as a polo for men, and business-casual clothing for women. | text | Yes |
| Canal des Deux Mers | `cdm-tour/whats_included_heading` | What is included, and what you arrange separately | text | Yes |
| Canal des Deux Mers | `cdm-tour/whats_included_notice` | **Dates and pricing are not final.** Exact dates are forthcoming. Pricing is to be determined and will be announced before bookings open. | text | Yes |
| Canal des Deux Mers | `cdm-tour/whats_included_label` | Included | text | Yes |
| Canal des Deux Mers | `cdm-tour/whats_included` | • Friday arrival night in Bordeaux.<br>• Lodging for every tour night through the final night in Sète.<br>• All breakfasts.<br>• All dinners, except two independent evenings: the arrival evening in Toulouse and the evening in Carcassonne.<br>• A Michelin restaurant dinner on the second evening in Toulouse.<br>• A ride briefing each morning at breakfast.<br>• Routes in a BikeTourFrance.net RideWithGPS collection built for this tour.<br>• Route notes on lunch, water, and restroom options for each riding day.<br>• Access to planning resources: packing lists, French phrases to practice, audio history guides for each riding day, and background reading by ride day and region. | structured content | Yes |
| Canal des Deux Mers | `cdm-tour/what_you_arrange_separately_label` | You arrange separately | text | Yes |
| Canal des Deux Mers | `cdm-tour/what_you_arrange_separately` | • Your travel to Bordeaux and home from Sète. Guests are on their own from Tuesday morning after the final group night.<br>• Your bicycle. Guests bring their own bikes.<br>• An e-bike, if you want one. BikeTourFrance.net helps identify a vetted local rental agency in Bordeaux. You contract directly with that agency and must arrive early enough in Bordeaux to collect the bike.<br>• Front and rear panniers. They are required, and you carry all your own clothing and equipment.<br>• A phone with a handlebar mount. RideWithGPS navigation on your phone is required.<br>• Lunches and snacks.<br>• Your two independent dinners, in Toulouse and Carcassonne. | structured content | Yes |
| Canal des Deux Mers | `cdm-tour/self_supported_heading` | Self-supported means you carry your own gear | text | Yes |
| Canal des Deux Mers | `cdm-tour/self_supported_points` | • There is no support van and no luggage transport. You carry everything you bring.<br>• The Canal des Deux Mers is fairly flat, but space on the bike still matters. Pack less than you think you need.<br>• Guests ride with RideWithGPS navigation on a phone mounted to the handlebars. | structured content | Yes |
| Canal des Deux Mers | `cdm-tour/practical_link` | Getting from Bordeaux Airport to the station and hotels | link text | Yes |
| Canal des Deux Mers | `cdm-tour/history_heading` | Earlier tours on this route | text | Yes |
| Canal des Deux Mers | `cdm-tour/history_body` | BikeTourFrance.net rode the Canal des Deux Mers in September 2026. That tour is finished and is not open for booking. The audio route guides and a historical narrative written for it are still useful for planning, and they live on the [Resources page](/resources/). | structured content | Yes |
| Canal des Deux Mers | `cdm-tour/gallery_heading` | Photos from the route | text | Yes |
| Canal des Deux Mers | `cdm-tour/ready_to_ride_heading` | Ready to ride? | text | Yes |
| Canal des Deux Mers | `cdm-tour/contact_cta` | Email John with your questions, or ask to be added to the 2027 waitlist. He answers every message himself. | text | Yes |

## Practical information

Route: `/canal-des-deux-mers/practical-info/`

| Page | `page/field_name` | Current rendered copy | Content type | Required |
|---|---|---|---|---|
| Practical information | `practical-information/seo_title` | Bordeaux Airport to Gare Saint-Jean: tram or airport bus | text | Yes |
| Practical information | `practical-information/seo_description` | How to get from Bordeaux Airport (Mérignac) to Gare Saint-Jean station and nearby hotels: Tram Line F or the 30'Direct airport bus, with times, costs, and bike rules. | text | Yes |
| Practical information | `practical-information/page_eyebrow` | Practical information | text | Yes |
| Practical information | `practical-information/page_heading` | Bordeaux Airport to Gare Saint-Jean and your hotel | text | Yes |
| Practical information | `practical-information/page_intro` | Gare Saint-Jean is Bordeaux's main railway station. All recommended hotels are within about 500 m of the station. | text | Yes |
| Practical information | `practical-information/data_notice` | Schedules and fares come from the transport operators and were last checked in June 2026. Confirm them with TBM and 30'Direct before you travel. | text | Yes |
| Practical information | `practical-information/options_heading` | Your two options | text | Yes |
| Practical information | `practical-information/tram_heading` | Tram Line F | text | Yes |
| Practical information | `practical-information/tram_summary` | • Cost: €1.90<br>• Travel time: about 45 minutes<br>• Frequency: every 10–15 minutes<br>• Bike in a case: always allowed<br>• Tickets: TBM app or machines<br>• Best for: lowest cost and flexibility | structured content | Yes |
| Practical information | `practical-information/bus_heading` | 30'Direct airport bus | text | Yes |
| Practical information | `practical-information/bus_summary` | • Cost: €9–10<br>• Travel time: about 30 minutes<br>• Schedule: limited window<br>• Bike in a case: accepted<br>• Tickets: online or onboard<br>• Best for: fastest public option | structured content | Yes |
| Practical information | `practical-information/choose_heading` | Which should I choose? | text | Yes |
| Practical information | `practical-information/tram_choose_heading` | Choose Tram Line F if: | text | Yes |
| Practical information | `practical-information/tram_choose` | • Lowest cost matters<br>• You arrive early or late<br>• You have a bike case<br>• You want flexibility | structured content | Yes |
| Practical information | `practical-information/bus_choose_heading` | Choose the 30'Direct airport bus if: | text | Yes |
| Practical information | `practical-information/bus_choose` | • Fastest journey matters<br>• You arrive during operating hours<br>• Extra cost is okay<br>• You want the simplest trip | structured content | Yes |
| Practical information | `practical-information/details_heading` | Details | text | Yes |
| Practical information | `practical-information/detail_1_question` | What is it? | text | Yes |
| Practical information | `practical-information/detail_1_tram` | Direct tram connection from Bordeaux Airport (Mérignac) to Gare Saint-Jean (main train station). Launched Dec 6, 2025. | text | Yes |
| Practical information | `practical-information/detail_1_bus` | Direct coach shuttle from Bordeaux Airport to Gare Saint-Jean. No intermediate stops, no transfers. | text | Yes |
| Practical information | `practical-information/detail_2_question` | How often does it run? | text | Yes |
| Practical information | `practical-information/detail_2_tram` | Every 10 min (Mon–Sat) / Every 15 min (Sun/holidays). First: ~5am. Last: Midnight (Mon–Wed), 1am (Thu–Sat) | text | Yes |
| Practical information | `practical-information/detail_2_bus` | Limited: 07:30–20:05 daily. Mon–Fri: ~22 runs. Sat/Sun: ~14 runs. Not available early morning or late evening. | text | Yes |
| Practical information | `practical-information/detail_3_question` | How long does it take? | text | Yes |
| Practical information | `practical-information/detail_3_tram` | ~45 minutes. Direct, no transfers. | text | Yes |
| Practical information | `practical-information/detail_3_bus` | ~30 minutes (traffic dependent) | text | Yes |
| Practical information | `practical-information/detail_4_question` | How much does it cost? | text | Yes |
| Practical information | `practical-information/detail_4_tram` | €1.90 per ticket | text | Yes |
| Practical information | `practical-information/detail_4_bus` | €9 online / €10 on board | text | Yes |
| Practical information | `practical-information/detail_5_question` | What about my bike? | text | Yes |
| Practical information | `practical-information/detail_5_tram` | ✅ Bikes in cases: Always<br>✅ Bikes not in cases: 9am–4pm only<br>❌ NOT 7am–9am or 4pm–7pm<br>Pack in case to avoid rush hours.<br>TBM Bicycle Rules: 05 57 57 88 88 | structured content | Yes |
| Practical information | `practical-information/detail_5_bus` | ✅ Bikes in cases: Yes<br>✅ Bikes not in cases: Yes<br>Requirement: Closed bag, labeled with name, phone, address.<br>Carrier may refuse oversized items.<br>Bikes not in cases = anytime transport (no restrictions).<br>30'Direct FAQ: 30direct.com | structured content | Yes |
| Practical information | `practical-information/detail_6_question` | How do I book? | text | Yes |
| Practical information | `practical-information/detail_6_tram` | No booking required. Buy ticket at tram stop (vending machine), TBM mobile app (Bordeaux transit app), or Relay newsstand at airport.<br><br>To board: Validate your ticket on the platform or onboard validators (card readers, white validators, or TBM app via Bluetooth). Self-validate and board—no ticket inspection. | structured content | Yes |
| Practical information | `practical-information/detail_6_bus` | Book online at 30direct.com or pay €10 on board. Book in advance for €9 rate.<br><br>To board: Show your ticket to the driver (printed, phone e-ticket, or mobile). Tickets can be purchased directly from the driver. Visa/Mastercard accepted onboard (American Express not accepted). | structured content | Yes |
| Practical information | `practical-information/ready_to_ride_heading` | Questions about getting to Bordeaux? | text | Yes |
| Practical information | `practical-information/contact_cta` | Email John and he will help you plan your arrival. | text | Yes |

## Resources

Route: `/resources/`

| Page | `page/field_name` | Current rendered copy | Content type | Required |
|---|---|---|---|---|
| Resources | `resources/seo_title` | Resources for planning a self-supported bike tour in France | text | Yes |
| Resources | `resources/seo_description` | Free planning resources from BikeTourFrance.net: a packing list template, audio route guides for the Canal des Deux Mers, a historical narrative, and trusted cycling and travel sites. | text | Yes |
| Resources | `resources/page_eyebrow` | Resources | text | Yes |
| Resources | `resources/page_heading` | Resources for planning and riding | text | Yes |
| Resources | `resources/intro_copy` | Planning a successful self-supported bike tour in France takes good structure. These are the templates, audio guides, and sites John uses and trusts. They are free. Change them to fit your trip. | text | Yes |
| Resources | `resources/page_nav` | On this page: [Templates](#templates), [Audio guides](#audio), [Reading](#narratives), [Trusted sites](#sites). | structured content | Yes |
| Resources | `resources/templates_heading` | Templates | text | Yes |
| Resources | `resources/templates_list` | • [Bicycle Touring Pack List v2](https://docs.google.com/spreadsheets/d/1m4sdHeE_FftAAI5PKp1RMLtDgJ0QS6-lvSRmqauX9-U/edit?gid=1305445451#gid=1305445451) — A Google Sheet. Copy it and change it to fit your trip. | structured content | Yes |
| Resources | `resources/audio_heading` | Audio guides for the Canal des Deux Mers | text | Yes |
| Resources | `resources/audio_intro` | A short history guide for each riding day, from Bordeaux to Sète. Press play to listen here, or download a file to listen offline. The files load only when you press play. | text | Yes |
| Resources | `resources/audio_guides` | • [Complete Canal des Deux Mers audio route guide](https://pub-248f360f2c014eee9d9621b9c416e07c.r2.dev/CDM_BTF_TourAudioOverview/00.CDM2026_CompleteAudio.m4b)<br>• [Introduction](https://pub-248f360f2c014eee9d9621b9c416e07c.r2.dev/CDM_BTF_TourAudioOverview/001.CDM_Intro.mp3)<br>• [Riding day 1: Bordeaux to La Réole](https://pub-248f360f2c014eee9d9621b9c416e07c.r2.dev/CDM_BTF_TourAudioOverview/002.CDM_RD01.mp3)<br>• [Riding day 2: La Réole to Agen](https://pub-248f360f2c014eee9d9621b9c416e07c.r2.dev/CDM_BTF_TourAudioOverview/003.CDM_RD02.mp3)<br>• [Riding day 3: Agen to Moissac](https://pub-248f360f2c014eee9d9621b9c416e07c.r2.dev/CDM_BTF_TourAudioOverview/004.CDM_RD03.mp3)<br>• [Riding day 4: Moissac to Toulouse](https://pub-248f360f2c014eee9d9621b9c416e07c.r2.dev/CDM_BTF_TourAudioOverview/005.CDM_RD04.mp3)<br>• [Toulouse rest day](https://pub-248f360f2c014eee9d9621b9c416e07c.r2.dev/CDM_BTF_TourAudioOverview/005.5.CDM_REST.mp3)<br>• [Riding day 5: Toulouse to Castelnaudary](https://pub-248f360f2c014eee9d9621b9c416e07c.r2.dev/CDM_BTF_TourAudioOverview/006.CDM_RD05.mp3)<br>• [Riding day 6: Castelnaudary to Carcassonne](https://pub-248f360f2c014eee9d9621b9c416e07c.r2.dev/CDM_BTF_TourAudioOverview/007.CDM_RD06.mp3)<br>• [Riding day 7: Carcassonne to Lézignan-Corbières](https://pub-248f360f2c014eee9d9621b9c416e07c.r2.dev/CDM_BTF_TourAudioOverview/008.CDM_RD07.mp3)<br>• [Riding day 8: Lézignan-Corbières to Capestang](https://pub-248f360f2c014eee9d9621b9c416e07c.r2.dev/CDM_BTF_TourAudioOverview/009.CDM_RD08.mp3)<br>• [Riding day 9: Capestang to Sète](https://pub-248f360f2c014eee9d9621b9c416e07c.r2.dev/CDM_BTF_TourAudioOverview/010.CDM_RD09.mp3)<br>• [Conclusion](https://pub-248f360f2c014eee9d9621b9c416e07c.r2.dev/CDM_BTF_TourAudioOverview/011.CDM_CONCLUSION.mp3) | structured content | Yes |
| Resources | `resources/audio_fallback` | Your browser cannot play this audio. Use the download link instead. | text | Yes |
| Resources | `resources/audio_download_label` | Download | link text | Yes |
| Resources | `resources/food_heading` | Food | text | Yes |
| Resources | `resources/food_audio` | • [The Cooking of Southwest France: introduction](https://pub-248f360f2c014eee9d9621b9c416e07c.r2.dev/CDM_Food/Wolferts-Cooking_of_SW_France_Cookbook_Intro.m4b) | structured content | Yes |
| Resources | `resources/french_heading` | French practice | text | Yes |
| Resources | `resources/french_copy` | Simple French phrases to listen to and repeat are in the BikeTourFrance.net resource library: [French learning audio](https://resources.biketourfrance.net/media_francais). | structured content | Yes |
| Resources | `resources/narratives_heading` | Reading | text | Yes |
| Resources | `resources/narratives_list` | • [Canal des Deux Mers historical narrative, mobile version](https://docs.google.com/document/d/18O_3__-hTaXNORT5mtfvYAQsS0xZUIbGRaOEVwhp0A8/edit?usp=sharing) — Written for the 2026 tour. The history of the route has not changed. Formatted for a phone. | structured content | Yes |
| Resources | `resources/helpful_sites_heading` | Trusted cycling and travel sites | text | Yes |
| Resources | `resources/helpful_sites_intro` | These are sites John trusts for accuracy, depth, and real-world relevance when planning bike tours. | text | Yes |
| Resources | `resources/helpful_sites_list` | • [EuroVelo](https://en.eurovelo.com/)<br>• [France Vélo Tourisme](https://en.francevelotourisme.com/)<br>• [Komoot](https://www.komoot.com/)<br>• [RideWithGPS](https://ridewithgps.com/)<br>• [AF3V (French greenways)](https://af3v.org/)<br>• [SNCF Connect](https://www.sncf-connect.com/)<br>• [IGN (French national geographic institute)](https://www.ign.fr/)<br>• [Vélo & Territoires](https://www.velo-territoires.org/)<br>• [FreeWheelingFrance.com](https://www.freewheelingfrance.com/)<br>• [Adventure Cycling Association: what to look for in a touring bike](https://www.adventurecycling.org/blog/what-to-look-for-touring-bike/)<br>• [Peak & Coast Cycling Camp](https://pccyclingcamp.com/)<br>• [Azure Cycle Tours](https://azurcycletours.com/) | structured content | Yes |
| Resources | `resources/ready_to_ride_heading` | Missing something? | text | Yes |
| Resources | `resources/contact_cta` | Tell John what would make planning easier and he will consider adding it. | text | Yes |

## About

Route: `/about/`

| Page | `page/field_name` | Current rendered copy | Content type | Required |
|---|---|---|---|---|
| About | `about/seo_title` | About John Brooks | text | Yes |
| About | `about/seo_description` | John Brooks leads small, self-supported bicycle tours in France. Learn who he is, how the tours work, and why he plans each day in detail. | text | Yes |
| About | `about/page_eyebrow` | About BikeTourFrance.net | text | Yes |
| About | `about/page_heading` | Eat. Sleep. Roll. Repeat. | text | Yes |
| About | `about/page_lede` | I'm John, the cyclist behind BikeTourFrance.net. I help riders carry out extraordinary bicycle tours in France. | text | Yes |
| About | `about/intro_body` | I personally lead four very small, self-supported group tours each year. Groups have no more than twelve riders, so I can lead the ride, explain each day's plan in depth, and give the group the attention it needs.<br><br>If you prefer to travel on your own schedule, I offer a self-guided tour package. I build the routes, book your accommodations, and give practical support as you prepare for the trip. | structured content | Yes |
| About | `about/how_heading` | How the tours work | text | Yes |
| About | `about/how_body` | All BikeTourFrance.net tours are self-supported. You carry your own gear from place to place. The Canal des Deux Mers is fairly flat, so you do not need to obsess over every gram, but space still matters. Pack less than you think you need.<br><br>Planning a bicycle tour in France gets complex fast. Where you ride, how far you go, where you eat, where you sleep, how trains fit in, and when you stop to see a place all affect one another. A small choice early in the plan can cause a hard day later. | structured content | Yes |
| About | `about/who_heading` | Who is planning your trip | text | Yes |
| About | `about/who_body` | I have planned and ridden self-supported tours across France, and I have traveled on foot in many parts of the country. I know what works on the ground: routes that make sense, days that fit real riders, places to stay, food stops, train options, and the small details that keep a trip moving well. I also know that coordinating your arrival time with your lodging makes a big difference for everyone.<br><br>Outside of touring, I lead rides for Cascade Bicycle Club in Seattle, work in enterprise technology, and hold DELF B2 certification in French. I'm not a camper. I like a good route, a real bed, a warm shower, and a solid meal at the end of the day. It is France, after all, and I love to eat well. | structured content | Yes |
| About | `about/ready_to_ride_heading` | Want to talk it through? | text | Yes |
| About | `about/contact_cta` | Email John with your questions about the 2027 tours or about planning your own trip. | text | Yes |

## Contact

Route: `/contact/`

| Page | `page/field_name` | Current rendered copy | Content type | Required |
|---|---|---|---|---|
| Contact | `contact/seo_title` | Contact John | text | Yes |
| Contact | `contact/seo_description` | Email John Brooks with questions about the 2027 Canal des Deux Mers tours, the waitlist, or planning your own bike trip in France. | text | Yes |
| Contact | `contact/page_eyebrow` | Contact | text | Yes |
| Contact | `contact/page_heading` | Contact John | text | Yes |
| Contact | `contact/page_lede` | Email is the best way to reach BikeTourFrance.net. | text | Yes |
| Contact | `contact/starting_heading` | Choose a starting point | text | Yes |
| Contact | `contact/starting_list` | • [Ask to join the 2027 Canal des Deux Mers waitlist](mail:waitlist)<br>• [Ask about planning your own trip](mail:planning)<br>• [Ask any other question](mail:general) | structured content | Yes |
| Contact | `contact/starting_note` | Each link opens your email program with a short message ready to fill in. If it does not open, write to john@biketourfrance.net directly. | text | Yes |
| Contact | `contact/lists_heading` | About the waitlist and the mailing list | text | Yes |
| Contact | `contact/lists_body` | This website does not have an online sign-up form yet. To hear about exact 2027 dates and pricing when they are announced, email John and ask to be added to the waitlist. | text | Yes |

## Privacy

Route: `/privacy/`

| Page | `page/field_name` | Current rendered copy | Content type | Required |
|---|---|---|---|---|
| Privacy | `privacy/seo_title` | Privacy | text | Yes |
| Privacy | `privacy/seo_description` | What the BikeTourFrance.net website does and does not collect, and how email you send to John is handled. | text | Yes |
| Privacy | `privacy/page_heading` | Privacy | text | Yes |
| Privacy | `privacy/page_lede` | This page describes what this website does today. Last updated October 2, 2026. | text | Yes |
| Privacy | `privacy/page_copy` | ## What this website collects<br><br>This website has no sign-up form, no account system, and no analytics or advertising tools. It does not set cookies of its own. See the [Cookies page](/cookies/).<br><br>## When you email John<br><br>If you write to [john@biketourfrance.net](mail:general), John receives your message and your email address in his BikeTourFrance.net email account. He uses them to reply to you. Nothing in this website's code sends your message anywhere else.<br><br>## Hosting and technical logs<br><br>Web servers normally record technical details of each visit, such as the page requested and the visitor's IP address. This website is hosted on Cloudflare Pages, which handles those records. John does not receive a copy of them through this website.<br><br>## Other sites and media<br><br>The Resources page loads audio files from BikeTourFrance.net's media storage only when you press play. It also links to Google Docs and Google Sheets and to other websites. Those sites have their own privacy practices.<br><br>## Questions<br><br>Write to [john@biketourfrance.net](mail:general). | structured content | Yes |

## Terms

Route: `/terms/`

| Page | `page/field_name` | Current rendered copy | Content type | Required |
|---|---|---|---|---|
| Terms | `terms/seo_title` | Terms | text | Yes |
| Terms | `terms/seo_description` | Terms for using the BikeTourFrance.net website: tour information may change, no bookings are taken on this site, and links lead to other sites. | text | Yes |
| Terms | `terms/page_heading` | Terms | text | Yes |
| Terms | `terms/page_lede` | How to read the information on this website. Last updated October 2, 2026. | text | Yes |
| Terms | `terms/page_copy` | ## Tour information<br><br>The tour descriptions on this website are plans, and they can change. Exact dates and pricing for the 2027 tours have not been announced. Deposit, payment, and cancellation terms have not been published.<br><br>## No bookings on this website<br><br>You cannot book or pay for a tour on this website. Asking to join the waitlist by email does not reserve a place. Any booking terms will be given to you in writing before you commit.<br><br>## Advice and planning help<br><br>Information here, including the Practical Information and Resources pages, is general guidance from John's own experience. Transport schedules, fares, and rules come from other organizations and change. Check them with the operator before you travel.<br><br>## Links to other sites<br><br>This website links to other websites and to files stored elsewhere. BikeTourFrance.net does not control them.<br><br>## Contact<br><br>Write to [john@biketourfrance.net](mail:general). | structured content | Yes |

## Cookies

Route: `/cookies/`

| Page | `page/field_name` | Current rendered copy | Content type | Required |
|---|---|---|---|---|
| Cookies | `cookies/seo_title` | Cookies | text | Yes |
| Cookies | `cookies/seo_description` | This BikeTourFrance.net website does not set cookies of its own and runs no analytics or advertising tools. | text | Yes |
| Cookies | `cookies/page_heading` | Cookies | text | Yes |
| Cookies | `cookies/page_lede` | What this website stores in your browser. Last updated October 2, 2026. | text | Yes |
| Cookies | `cookies/page_copy` | ## Cookies and tracking on this site<br><br>This website's code does not set cookies, and it runs no analytics, advertising, or social-media tracking tools. Because of that, it shows no cookie banner and asks for no consent.<br><br>## If that changes<br><br>If analytics or marketing tools are added later, this page will be updated first, and the site will ask for your choice before any non-essential tool runs.<br><br>## Other sites<br><br>Links on the Resources page lead to Google Docs, Google Sheets, and other websites. Those sites may set their own cookies once you open them. | structured content | Yes |

## 404 page

Route: `404 page`

| Page | `page/field_name` | Current rendered copy | Content type | Required |
|---|---|---|---|---|
| 404 page | `404/seo_title` | Page not found | text | Yes |
| 404 page | `404/seo_description` | That page is not on the BikeTourFrance.net website. Use these links to find the tour, resources, or contact page. | text | Yes |
| 404 page | `404/eyebrow` | Error 404 | text | Yes |
| 404 page | `404/heading` | We could not find that page | text | Yes |
| 404 page | `404/body` | The link may be old, or the page may have moved. These pages can help: | text | Yes |
| 404 page | `404/home_button` | Go to the home page | CTA | Yes |
| 404 page | `404/tour_button` | See the 2027 tour | CTA | Yes |

## Image alt text and captions (shared)

Route: `various`

| Page | `page/field_name` | Current rendered copy | Content type | Required |
|---|---|---|---|---|
| Image alt text and captions (shared) | `photos/hero_alt` | A rider with loaded panniers on a gravel towpath beside a canal, under a blue sky with a few clouds. | image alt text | Yes |
| Image alt text and captions (shared) | `photos/two_riders_shade_alt` | A rider in a red helmet smiling at the camera on a shaded canal path, with a second rider behind. | image alt text | Yes |
| Image alt text and captions (shared) | `photos/creon_alt` | Two loaded touring bikes parked in front of a wooden building with a sign reading "Créon fête le vélo". | image alt text | Yes |
| Image alt text and captions (shared) | `photos/rider_canal_path_alt` | A rider on a pale gravel path beside a straight canal with grass on both sides. | image alt text | Yes |
| Image alt text and captions (shared) | `photos/route_signs_alt` | Two green signs for the Canal du Midi cycle route, one pointing left and one pointing right. | image alt text | Yes |
| Image alt text and captions (shared) | `photos/cafe_table_alt` | Five riders in cycling jerseys sharing coffee at a café table. | image alt text | Yes |
| Image alt text and captions (shared) | `photos/narrow_bank_alt` | A rider far ahead on a narrow cobbled strip between two stretches of calm water. | image alt text | Yes |
| Image alt text and captions (shared) | `photos/three_riders_town_alt` | Three riders in cycling kit posing beside a bike in a town square with a palm tree. | image alt text | Yes |
| Image alt text and captions (shared) | `photos/church_alt` | A small stone church with a bell tower, with a bicycle leaning near its door. | image alt text | Yes |
| Image alt text and captions (shared) | `photos/greenway_alt` | A long straight paved greenway through pine woods, with one rider ahead in the distance. | image alt text | Yes |
| Image alt text and captions (shared) | `photos/matching_jerseys_alt` | Riders in matching cycling jerseys on a tree-lined path, with more riders behind them. | image alt text | Yes |
| Image alt text and captions (shared) | `photos/wheel_repair_alt` | Two people working on a bicycle wheel together in a workshop. | image alt text | Yes |
| Image alt text and captions (shared) | `photos/pine_forest_alt` | A paved path through tall pine trees with a rider in the distance. | image alt text | Yes |
| Image alt text and captions (shared) | `photos/panda_airport_alt` | Illustration of a panda arriving at Bordeaux Airport with a bike case and a backpack. | image alt text | Yes |
| Image alt text and captions (shared) | `photos/creon_caption` | Créon | text | No (optional caption) |
| Image alt text and captions (shared) | `photos/route_signs_caption` | Canal du Midi route signs | text | No (optional caption) |
