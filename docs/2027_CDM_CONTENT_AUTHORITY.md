# 2027 Canal des Deux Mers: content authority

> **Planned change (not active).** After the owner approves activation, the Google Sheet **BTF_Approved_Site_Copy** becomes the authority for public text, and a production-only check compares the built site to it (`docs/APPROVED_COPY_GATE.md`). Until then, this document and the files in `src/` remain the source.

Single source of truth for public 2027 tour facts. The code reads them from `src/data/cdm2027.ts`. The home page (`src/pages/index.astro`), the CDM page (`src/pages/canal-des-deux-mers/index.astro`), and the shared `src/components/Included.astro` all use that file. Change a fact there and every page follows.

Last reviewed: 2026-10-02. Owner confirmation source: the owner's remediation brief of 2026-10-02 ("confirmed 2027 CDM facts").

## Confirmed facts (published)

| Fact | Where it appears |
|---|---|
| Four departures in 2027: two between May 15 and June 15, two in September. | Home, CDM, Tours |
| Exact dates are not final and are not published. | Home, CDM, Tours, Included |
| Bordeaux (Atlantic) to Sète (Mediterranean), same route on every departure. | Home, CDM, Tours |
| Nine riding days, one rest day in Toulouse, 11 nights, two nights in Toulouse. | Home, CDM |
| Arrive Friday in Bordeaux. Wheels roll Saturday morning. Final group night Monday in Sète. Guests are on their own from Tuesday morning. | CDM (week plan), Included |
| Minimum six riders, target eight, maximum twelve. | CDM, About ("no more than twelve") |
| Self-supported. No support van. No luggage transport. | CDM, Included |
| Guests carry their own clothing and equipment in required front and rear panniers. | CDM, Included |
| Guests bring their own bicycles. | Included |
| E-bike guests contract directly with a local rental agency. BikeTourFrance helps identify a vetted agency. Guests must arrive early enough in Bordeaux to collect the bike. | Included |
| RideWithGPS navigation on a handlebar-mounted phone is required. | CDM, Included |
| Included: Friday arrival lodging in Bordeaux; all tour-night lodging through the final night in Sète; all breakfasts; all dinners except independent evenings on arrival in Toulouse and in Carcassonne. | Included |
| The second Toulouse evening includes a Michelin restaurant dinner. Dress: collared shirt such as a polo for men, business-casual for women. | CDM |
| Pricing is to be determined. | Home, CDM, Tours, Included |

## Carried from the live Framer site (owner to confirm)

These came from the current live copy and are not contradicted by the brief. They are published, so the owner should confirm them.

| Item | Source |
|---|---|
| A ride briefing each morning at breakfast. | Live home page "What's included" |
| Routes in a BikeTourFrance RideWithGPS collection built for the tour. | Live home page |
| Route notes on lunch, water, and restroom options for each riding day. | Live home page |
| Access to planning resources (packing lists, French phrases, audio history guides, background reading). | Live home page |
| Route stop names (Bordeaux, La Réole, Agen, Moissac, Toulouse, Castelnaudary, Carcassonne, Lézignan-Corbières, Capestang, Sète). | Titles of the existing audio guides on the resources site |
| "I personally lead four very small, self-supported group tours each year"; DELF B2; Cascade Bicycle Club ride leader. | Live About copy |
| Self-guided tour package (owner builds routes, books accommodations, gives support). | Live About copy |

## Inferred (owner to confirm)

| Item | Why inferred |
|---|---|
| Lunches and snacks are not included. | The brief lists breakfasts and dinners only. |

## Deliberately not published

| Item | Reason |
|---|---|
| Any tour price, deposit, payment term, or cancellation term (including the earlier provisional figures). | Owner instruction: pricing stays unpublished and marked TBD. |
| Exact 2027 dates. | Not final. |
| The $250 planning-session price that is on the live site. | It is a published financial term. The new pages say planning sessions are "by arrangement". Owner decision: restore it or keep it off. |
| "Three dinners with local hosts" and the British ex-pat host story on the live site. | Not in the confirmed facts, and it conflicts with the general dinner statement. Owner decision. |
| "Fewer than 12 riders" (live site). | Replaced by the confirmed maximum of twelve. |
| Any claim that the September 2026 tour is upcoming. | That tour has finished. |
| Event and Offer structured data. | Held until dates and prices are approved. |

## 2026 material kept as history only

- The CDM page says the route was ridden in September 2026, that the tour is finished, and points to the Resources page.
- The Resources page keeps the audio guides (their file names say 2026) and the mobile historical narrative. It notes the narrative was written for the 2026 tour.
- The old `cdm-sep2026.biketourfrance.net` site is untouched. No redirect is configured. See `docs/SUBDOMAIN_MIGRATION_AUDIT.md`.

## Rule for future edits

Do not add a date, price, deposit, cancellation term, or supplier promise to `src/data/cdm2027.ts` until the owner approves it in writing. `scripts/verify-dist.mjs` fails the build check if a dollar amount, a 2026 "upcoming" phrase, or consent-by-use wording appears in any page.
