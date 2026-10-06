# CDM Photo Gallery Audit — http://127.0.0.1:4322/cdm-photo-gallery/

**Overall result: NEEDS WORK**

Audit date: 6 October 2026. **Scope correction:** the owner subsequently clarified that these photos are from two tours and requested one combined gallery grouped by GPS location, including approximate placements for photos without GPS. The earlier single-trip requirement is superseded; no additional photos were introduced. This is the unpublished 49-photo combined-gallery build on `feature/cdm-combined-gallery`. The public [BikeTourFrance gallery](https://biketourfrance.net/cdm-photo-gallery/) still displays the previous 61-photo release, verified separately; it is not the 49-photo page reviewed here. No stock, AI-generated or other-trip images were added. All 49 selected originals are retained unchanged, with only existing Astro derivatives delivered.

## Trip identity and truthfulness

- **Route shown:** Owner identifies two Canal des Deux Mers tours; the combined album follows the Bordeaux-to-Sète route. Visible/GPS evidence spans Créon/Espiet, La Réole, Moissac, Montech, Toulouse, Carcassonne, Béziers and Sète. The page does not currently say that route or completed status.
- **Evidence of Bordeaux-to-Sète narrative:** 39 retained GPS positions now resolve to municipalities, including six rural positions resolved through the government boundary API. All 49 photos are grouped into 22 locations, from Créon to Sète, combining both tours at shared stops. Ten approximate assignments are explicitly marked Estimated in the review Sheet, with evidence/confidence; no coordinates were invented. Earlier chronological ordering returned from Sète to Créon because there are two tours; this is now explained, and geographic grouping is applied. No image establishes Bordeaux city arrival or a sea-arrival celebration.
- **Accurate self-supported-trip representation: NEEDS WORK.** Panniers, bicycles, mounted phones and social riding are visible. Ownership and Ride with GPS cannot be verified from a mounted phone alone; approve factual explanatory copy from the owner.
- **Misleading implication found: Yes.** Several alts misidentify subjects, and the page still lacks two-tour identity. The geographic restart has been resolved by owner clarification and grouping. **No** implication that this past trip can still be booked was found at the top.
- **Required correction:** Make completed-trip identity explicit through approved copy; identify the two tours accurately, correct factual alts, review the geographic estimates and improve visual order within the groups and add a clearly future-tour waitlist invitation.

Place names in this report are **inferences from retained EXIF GPS and the nearest IGN/BAN municipality**, supported where possible by visible signs; they do not prove the identity of every landmark or the timing of a stop. Ten photos have no GPS, including the nine explicit EST date estimates; the owner explicitly authorized approximate locations for them. Six rural GPS positions had no nearby IGN address but were resolved by the [government municipality API](https://geo.api.gouv.fr/decoupage-administratif). GPS and estimated location provenance remain distinct from EXIF and estimated capture-date provenance. [IGN service documentation](https://cartes.gouv.fr/aide/fr/guides-utilisateur/utiliser-les-services-de-la-geoplateforme/geocodage/) and the exact per-photo responses/URLs are preserved in [locations.json](proof/2026-10-06_cdm_combined_gallery/audit/locations.json). The Montech structure identification also agrees with [VNF's water-slope description](https://www.vnf.fr/vnf/points-d-interetss/la-pente-deau-de-montech/).

## Photo inventory

- **Intended photos:** 49.
- **Photos displayed:** 49, each once, with blank optional captions and no Delete?=Y marks.
- **Missing or broken:** None in the audited build. All 49 supported folder photos map by exact hash to retained originals.
- **Duplicates or near-duplicates:** Zero exact-file or orientation-normalized-pixel duplicates. Two true visual near-duplicate pairs: IMG_4470.JPG/IMG_4471.JPG and IMG_4496.JPG/IMG_4497.JPG.
- **Photos recommended for removal:** Optionally IMG_4470.JPG and IMG_4497.JPG, each only because the companion is stronger and retains the story. No removal has been applied; the complete proposed order below still includes all 49.
- **Photos recommended for repositioning:** The group image to the opening; IMG_4633.JPG/IMG_4634.JPG to verified early-route context; IMG_4606.JPG/IMG_4607.JPG to the Sète ending; IMG_4797.JPG into the Béziers chapter; near-duplicate pairs separated and people/food interleaved as listed below. Geographic grouping is applied; the finer visual order below is a proposal and has not been applied.

## Applied location grouping

All 22 groups are contiguous in west-to-east order. Within each group the build retains date/counter order; the review Sheet now shows Location group, GPS/Estimated basis, confidence and evidence. There are no location-unconfirmed photos left. The site retains one continuous masonry/lightbox view; named location headings have not been added outside approved copy.

| Group | Photos |
|---|---|
| Créon | 3 |
| Espiet | 1 |
| Saint-Brice | 1 |
| La Réole | 3 |
| Montpouillan | 2 |
| Bruch | 1 |
| Moissac | 11 |
| Saint-Porquier | 1 |
| Montech | 2 |
| Toulouse | 4 |
| Ayguesvives | 1 |
| Vieillevigne | 2 |
| Castelnaudary | 2 |
| Pexiora | 1 |
| Montréal | 1 |
| Carcassonne | 3 |
| La Redorte | 1 |
| Paraza | 2 |
| Sallèles-d'Aude | 1 |
| Capestang | 1 |
| Béziers | 3 |
| Sète | 2 |

**Ten owner-authorized approximate assignments:**

| Filename | Estimated group | Confidence | Evidence |
|---|---|---|---|
| IMG_6115.jpeg | La Réole | High | Suspension-bridge scene matches the GPS-located bridge in IMG_4416.JPG; nearby series date. |
| IMG_6117.jpeg | La Réole | Low | Same early riding series as IMG_6115.jpeg and IMG_4416.JPG; church/fountain appearance. Approximate stop, not recovered GPS. |
| IMG_6125.jpeg | Moissac | High | Aqueduct riding scene matches IMG_4462.JPG and the Cacor route context; exact source GPS is absent. |
| IMG_6143.jpeg | Moissac | High | Circular openings and brick/stone aqueduct match Cacor architecture and IMG_6146.jpeg; comparison with the official Cacor page image. |
| IMG_6146.jpeg | Moissac | High | Brick/stone arches and circular openings match the official Cacor aqueduct image; source GPS is absent. |
| IMG_6155.jpeg | Moissac | Low | Nearby bridge-riding series with IMG_6143.jpeg/IMG_6146.jpeg/IMG_6175.jpeg; rough area assignment, no source GPS. |
| IMG_6158.jpeg | Moissac | Low | Same under-bridge view as IMG_6155.jpeg; approximate area assignment, no source GPS. |
| IMG_6175.jpeg | Moissac | Medium | Brick parapet and tree-lined canal match the surrounding aqueduct/bridge series; approximate Cacor/Moissac context. |
| IMG_4600.JPG | Béziers | Low | Capture date 2026-09-07 and sequence between GPS-located IMG_4596.JPG in Béziers and IMG_4606.JPG in Sète; restaurant location not independently identified. |
| 9f4a9960-26b2-4d36-a8a3-4db68d666749_A4F2DBC7-C58D-460E-A289-3894F082CA8E.jpg | Créon | Low | Early CDM2 source series and existing estimated date near Créon bike-stop photos IMG_4633.JPG/IMG_4634.JPG; rough route-area assignment. |

## Strengths

- Real cyclists, panniers, bottle filling, ordinary meals and market stops make the travel credible.
- Group riding, selfies and shared tables bring warmth without inflated travel claims.
- Broad route evidence includes French towns and working canal structures, not only postcard scenery.
- Every selected photo remains accessible, with stable IDs and reversible Keep/Delete? decisions.
- Natural aspect ratios, responsive masonry and a functional accessible lightbox preserve subjects.
- Six viewport checks and all gallery image requests pass; first-photo priority and modern formats are in place.
- Cold-load fixes materially reduce image transfer and avoid the mobile menu collapsing after first paint.

## Requirement verdicts

| Item | Requirement | Result | Evidence |
|---|---|---|---|
| 1 | Historical two-tour Bordeaux-to-Sète identity | **FAIL** | H1 is only CDM Photo Gallery; intro does not expand the route or identify a completed trip. Metadata still refers to CDM1/CDM2 collections. |
| 2 | Past trip cannot still be booked | **PASS** | Top-of-page gallery copy makes no booking or availability claim. Global Tours navigation is separate; proposed wording must preserve this distinction. |
| 3 | Strong opening hero | **NEEDS WORK** | The new first photo, IMG_4633.JPG, shows loaded bikes at Créon but has strong glare and no prominent faces; no dedicated hero. Group image 9f4a9960-26b2-4d36-a8a3-4db68d666749_A4F2DBC7-C58D-460E-A289-3894F082CA8E.jpg is a stronger opening. |
| 4 | 49 images load | **PASS** | 49/49 display in intended build; zero broken gallery images at six widths; 343 delivery variants and 61 retained review thumbnails verified. |
| 5 | Duplicate control | **NEEDS WORK** | Zero exact-file or normalized-pixel duplicates. Two true visual near-duplicate pairs: IMG_4470.JPG/IMG_4471.JPG and IMG_4496.JPG/IMG_4497.JPG. |
| 6 | Bordeaux-to-Sète sequence | **PASS** | Owner clarified two tours; all 49 are now grouped by location west to east, combining the tours at shared stops. Capture date/counter remains stable within each group; estimates are marked in the Sheet. |
| 7 | Beginning, middle and end | **NEEDS WORK** | Riding and middle-trip coverage are strong. Créon gives early-route context; no Bordeaux city arrival is established. GPS-backed Sète market shots now end the gallery; no verified Mediterranean arrival or finish celebration. |
| 8 | Self-supported small-group representation | **NEEDS WORK** | Loaded bicycles and panniers are visible in IMG_4633.JPG/IMG_4634.JPG and the group image; mounted phones are visible in the group image. Bike ownership and the app being Ride with GPS cannot be certified visually. |
| 9 | Balanced mix of subjects | **NEEDS WORK** | Riders, paths, towns, markets, meals and equipment are present. No photo clearly establishes lodging/hosts or an arrival at the Mediterranean; IMG_4658.JPG is a cloister, not demonstrated accommodation. |
| 10 | People and shared enjoyment | **PASS** | Riding group, selfies and tables show several adults sharing ordinary cycling and social moments; no demographic or identity claim inferred. |
| 11 | Credible ordinary trip details | **PASS** | Panniers, varied paths, a cycle junction, bottle filling, food counters and meals provide useful everyday evidence. |
| 12 | No misleading travel category | **PASS** | No visible support van, luggage-transfer service, racing event, camping equipment or luxury-travel promise. Jerseys and helmets alone do not imply racing or an extreme challenge. |
| 13 | Range of riding conditions and light | **PASS** | Sun/shade, gravel/paved/stone surfaces, towns, rural paths, market stops and indoor meals are represented. Do not manufacture missing weather or lodging coverage. |
| 14 | Avoid repetitive runs | **NEEDS WORK** | The Moissac group contains 11 images, including an extended bridge/path series before its later faces/cloister. Montech and Vieillevigne each contain a near-duplicate pair. Grouping is correct but visual contrast within groups needs improvement. |
| 15 | Vary visual scale and energy | **NEEDS WORK** | Portrait canal views dominate several runs; the strongest group portrait is third in the Créon group; Moissac has an 11-image bridge/path cluster. The proposed order interleaves faces, bikes, food and wide views. |
| 16 | Orientation and technical soundness | **NEEDS WORK** | No broken images, severe blur, incorrect rotation or poor enlargement found. IMG_4497.JPG and IMG_4528.JPG include an accidental fingertip at the lower edge; IMG_4633.JPG has strong glare; slight lean appears in IMG_4497.JPG. |
| 17 | Natural editing | **PASS** | No obvious AI artifacts, artificial HDR or heavy filters seen across all 49 contact views and selected larger comparisons. Normal strong blues, evening light and glare occur; original editing history cannot be certified from pixels. |
| 18 | Specific factual alt text | **FAIL** | Several descriptions are materially wrong: IMG_4517.JPG (military entrance), IMG_4528.JPG (street, no canal), IMG_4470.JPG (water slope, not aqueduct), IMG_4687.JPG (aubergines/cucumbers, not peppers). Other known places are omitted. |
| 19 | Optional accurate captions | **PASS** | All 49 captions are blank, which is allowed. Scenario tests verify that captions remain independent of inclusion and alt text. Do not invent locations or final-meal claims when adding captions. |
| 20 | Responsive layout and controls | **PASS** | Six views at 320/375/768/1024/1440/1920; no horizontal overflow, tile overlap, missing alt, broken images or lost order. Desktop tiles span about 19–33%; lightbox keyboard, focus, Escape and 44px touch targets pass. |
| 21 | Responsive modern formats | **PASS** | AVIF sources and WebP fallback have 320/640/960 variants; WebP detail is up to 1200px, with originals retained. Lazy photos use auto sizing with explicit fallbacks. |
| 22 | Reasonable image delivery size | **PASS** | 343 selected-gallery derivatives checked; largest 306,276 bytes, within existing 300 KiB limit. Reduced mobile initial resource transfer from 1,767,234 to 588,985 bytes; sampled derivatives look usable at intended sizes. |
| 23 | First-photo priority and lazy loading | **PASS** | First visible photo is eager with fetchpriority=high; remaining 48 are lazy. Controlled offset test loads only the first image before scroll and activates a lazy photo on entering view. |
| 24 | Layout shift and lab responsiveness | **PASS** | After fixes, three cold mobile lab runs have median LCP 1.06s, max CLS 0.085, and next-button response about 22–30ms. Largest task 189ms under 4× CPU slowdown; total blocking time at most 139ms. Field Core Web Vitals are not established. |
| 25 | Future-tour call to action | **FAIL** | Gallery ends with viewer help and the general footer; it lacks a specific future-CDM invitation. No claim that this completed trip is bookable should be introduced. |

## Issues requiring correction

| Priority | Audit item | Affected photo(s) or page area | Problem | Exact required fix |
|---|---|---|---|---|
| High | 1 | Page H1, intro and metadata | Trip identity and completed status are absent; metadata describes two collections. | Put completed-trip route wording in the approved Sheet, obtain owner review, then render it. Suggested intro: “Photos from two Canal des Deux Mers cycling tours along the Bordeaux-to-Sète route in France.” Update metadata to describe this one gallery. |
| Medium | 7, 18 | Ten estimated-location photos; page intro and group metadata | Geographic sequence is now applied, but approximate locations must not become exact landmark claims. | Review the ten assignments in the location table below. Render historical two-tour wording through approved copy. Do not change assigned dates or IDs; the public page currently groups the order but does not add unapproved place headings. |
| High | 18 | IMG_4517.JPG, IMG_4528.JPG, IMG_4470.JPG, IMG_4471.JPG, IMG_4687.JPG, IMG_4462.JPG | Wrong subject, structure, produce or path material. | Replace their approved Sheet alt fields with the exact proposed descriptions in the alt table after review. Use water slope for Montech, military entrance for Danjou, street for Carcassonne, aubergines/cucumbers for the stall, and cobbled rather than gravel crossing. |
| High | 25 | Below gallery, above footer | No specific future-trip CTA. | Add an approved-copy field containing the owner-proposed text: “Interested in riding the Canal des Deux Mers with us? Join the waitlist for a future Bike Tour France trip.” Link it to the existing future-tour waitlist flow. Label it future, never book this past trip. |
| Medium | 3 | IMG_4633.JPG; 9f4a9960-26b2-4d36-a8a3-4db68d666749_A4F2DBC7-C58D-460E-A289-3894F082CA8E.jpg; opening area | Current first bike-stop image has glare and no prominent faces; the group photo is stronger. | Approve the group image as the first, larger lead tile within the allowed one-third desktop range; retain natural aspect ratio, no crop, eager/high priority. Use it once as an opening preview, not a claim about the literal first day. |
| Medium | 5 | IMG_4470.JPG, IMG_4471.JPG | Same water-slope channel; one view is a wider version of essentially the same scene. | Optional removal: mark IMG_4470.JPG Y after owner review; IMG_4471.JPG gives a tighter view of the channel/machinery without the distracting overhead wire. If all 49 must stay, keep both in Montech as different scales; do not falsify a town assignment merely to separate them. |
| Medium | 5, 16 | IMG_4496.JPG, IMG_4497.JPG | Almost identical empty path; IMG_4497.JPG adds a fingertip and more camera lean. | Optional removal: mark IMG_4497.JPG Y after owner review and retain IMG_4496.JPG. If retaining all 49, keep both in Vieillevigne and use a reversible approved derivative correction; preserve the original. |
| Medium | 8 | Intro; group image; IMG_4633.JPG, IMG_4634.JPG | Photos support panniers/phones but do not prove bike ownership or app identity. | Confirm those factual trip details with the owner before adding concise approved text about own bikes, carried luggage and phone-mounted Ride with GPS. Do not imply a support van or luggage transfer. |
| Medium | 9, 7 | IMG_4658.JPG; IMG_4606.JPG, IMG_4607.JPG; trip coverage | Lodging/hosts and Mediterranean arrival are not demonstrated. | Ask whether any of these 49 show lodging/hosts; identify only verified scenes. Accurately label the Sète market as destination context. If none show a sea arrival or lodging, accept and disclose the coverage gap; do not repurpose the cloister or add another-trip imagery. |
| Medium | 14, 15 | Moissac group: IMG_4459.JPG, IMG_4462.JPG, IMG_6125.jpeg, IMG_6143.jpeg, IMG_6146.jpeg, IMG_6155.jpeg, IMG_6158.jpeg, IMG_6175.jpeg, IMG_4651.JPG, IMG_4652.JPG, IMG_4658.JPG | Correct geographic grouping creates a long canal/bridge run before its faces/cloister. | Use the proposed within-Moissac order below to alternate rider, face, canal, cloister, crossing, wide water and bike details. Keep all Moissac photos together; do not move them into another town to break the run. |
| Medium | 16 | IMG_4528.JPG; IMG_4633.JPG | Fingertip intrudes on street view; bicycle-stop image is veiled by glare. | For IMG_4528.JPG, approve a small reversible derivative crop or local repair of the lower-edge fingertip, retaining the original and important subjects. Give IMG_4634.JPG greater visual emphasis; consider only modest natural exposure/contrast correction to a retained-original derivative of IMG_4633.JPG. |
| Medium | 18 | All rows marked NEEDS WORK in the alt table; GPS group labels are currently review metadata | Useful known place names or visible travel details are missing; some water-body assumptions are uncertain. | Review the exact proposed alts below and update them through Approved Site Copy. IGN/GPS resolves 39 GPS positions to municipalities; unknown scenes keep a factual visible-subject description rather than invented place names. |

## Recommended final order

**Provisional visual order within the now-applied geographic groups.** All 49 remain represented. GPS-based groups and owner-authorized approximate assignments anchor the route; review the estimates below before making stronger visitor-facing claims. This is an editorial proposal, not confirmed capture chronology. The owner’s geographic grouping is already in the manifest. This proposal varies visual scale within those groups, rather than requiring a chronological single-trip interpretation. Preserve every permanent Photo ID and the original EXIF/EST distinction. The opening group shot is a preview of the shared experience; its first position must not imply the literal first event. If either optional near-duplicate is removed, the final total will be 47 or 48 rather than 49, and that count must be stated honestly.

1. **9f4a9960-26b2-4d36-a8a3-4db68d666749_A4F2DBC7-C58D-460E-A289-3894F082CA8E.jpg** — Shaded group riding, panniers and phones; strongest invitation to the shared experience. Treat as an opening preview, not a dated first event.
2. **IMG_4633.JPG** — Créon bike stop; early equipment context, after owner confirms the timing.
3. **IMG_4634.JPG** — Créon rider and luggage; alternate people and travel details rather than adjacent bike-only shots.
4. **IMG_4406.JPG** — First riding context near Espiet; moves from preparation into travel.
5. **IMG_4411.JPG** — Saint-Brice cycle junction; shows practical wayfinding.
6. **IMG_4416.JPG** — La Réole bridge; establish the river crossing before the activity view.
7. **IMG_6115.jpeg** — Cyclist crossing a suspension bridge; show the crossing experience. Exact bridge identification still needs confirmation.
8. **IMG_6117.jpeg** — Bottle-filling stop; ordinary self-supported travel detail, not a claim about lodging.
9. **IMG_4421.JPG** — Boat lock near Montpouillan; people and working canal life.
10. **IMG_4423.JPG** — Lock detail near Montpouillan; a visual cutaway within the early canal chapter, not strict minute-by-minute chronology.
11. **IMG_4428.JPG** — Towpath near Bruch; open the canal-riding rhythm.
12. **IMG_4459.JPG** — Moissac canal rider; introduce the next verified route town.
13. **IMG_4651.JPG** — Moissac selfie; a face interrupts scenic views.
14. **IMG_4652.JPG** — Moissac moorings; establish the waterside setting.
15. **IMG_4658.JPG** — Moissac cloister; include culture without claiming overnight hospitality.
16. **IMG_4462.JPG** — Moissac cobbled crossing with a cyclist; show riding conditions.
17. **IMG_6143.jpeg** — Water and arched bridge at dusk; contrast light and scale. Confirm the place before attaching it to this chapter.
18. **IMG_6125.jpeg** — Cyclist on an aqueduct; restore activity after the wide view. Exact place remains unconfirmed.
19. **IMG_6175.jpeg** — Bicycle and bags; equipment detail within the riding chapter, place unconfirmed.
20. **IMG_6155.jpeg** — Narrow under-bridge riding; practical cutaway separates near-duplicate Montech views. Verify its town before final order.
21. **IMG_6146.jpeg** — Brick aqueduct and cyclist; architectural angle, exact place unconfirmed.
22. **IMG_6158.jpeg** — Cyclist under a bridge; interrupt the two similar empty-path scenes. Exact place remains unconfirmed.
23. **IMG_4463.JPG** — Tree-lined path near Saint-Porquier; transition toward Montech.
24. **IMG_4470.JPG** — Montech water-slope overview; retained wider near-duplicate candidate, optional removal decision pending.
25. **IMG_4471.JPG** — Montech water-slope close view; retain as stronger of the two channel views.
26. **IMG_4484.JPG** — The Danu in Toulouse; urban stop and local character.
27. **IMG_4492.JPG** — Cyclists on a Toulouse street; show riding in town.
28. **IMG_4687.JPG** — Toulouse produce stall; add food and a close detail.
29. **IMG_4708.JPG** — Toulouse shared restaurant table; warmth and connection, not a final meal or luxury claim.
30. **IMG_4495.JPG** — Ayguesvives waterside building; resume the eastward route.
31. **IMG_4496.JPG** — Tree-lined path; strongest of the near-duplicate pair, exact commune unresolved.
32. **IMG_4497.JPG** — Second tree-lined path; retained weaker near-duplicate pending owner decision, now separated from IMG_4496.JPG.
33. **IMG_4516.JPG** — Castelnaudary boats and bridge; next verified town context.
34. **IMG_4517.JPG** — Foreign Legion entrance near Castelnaudary; small route-detail stop, not accommodation.
35. **IMG_4518.JPG** — Field-side memorial; countryside detail, identity and place not assumed.
36. **IMG_4520.JPG** — Canal in Montréal, Aude; route context before Carcassonne.
37. **IMG_4528.JPG** — Carcassonne café street; establish the town, correct its current canal misdescription.
38. **IMG_4529.JPG** — Carcassonne cyclist selfie; combine place and a person.
39. **IMG_4533.JPG** — Carcassonne meal; show an ordinary restaurant stop.
40. **IMG_4553.JPG** — La Redorte façade; town texture between meals and water views.
41. **IMG_4572.JPG** — Rough stone canal crossing; give practical route-surface context, exact commune unresolved.
42. **IMG_4574.JPG** — Reeds and canal-wall detail; a closer scale, exact commune unresolved.
43. **IMG_4578.JPG** — Sallèles-d’Aude selfie; bring a face back into the route.
44. **IMG_4785.JPG** — Late-route gravel riding; GPS east of Sallèles-d’Aude and west of Béziers, municipality unresolved.
45. **IMG_4596.JPG** — Béziers canal view; verified late-route setting.
46. **IMG_4797.JPG** — Béziers church plaque; contextual detail before the closing chapter, not the finish image.
47. **IMG_4600.JPG** — Shared restaurant selfie; a closing social memory before Sète, exact place unconfirmed; do not label final dinner.
48. **IMG_4607.JPG** — Sète market fish; GPS-backed destination context, not a sea-arrival photograph.
49. **IMG_4606.JPG** — Sète red-mullet counter; end in the verified destination with local food and follow immediately with the future-tour waitlist CTA.

## Alt-text audit

These are proposed replacements for review in the approved-copy Sheet, not live copy edits. **FAIL** identifies a factual error; **NEEDS WORK** identifies a useful known location/details missing or an uncertain label; **PASS** means the current description is useful even if an optional refinement is suggested. None uses filenames or “image/photo of.” Do not add inferred names of guests, lodging or unverified landmarks.

| Filename | Current alt text | Recommended alt text | Status |
|---|---|---|---|
| IMG_4406.JPG | A cyclist riding away on a paved path between hedges and trees under a blue sky. | A cyclist with luggage rides along a paved path between hedges and trees near Espiet. | NEEDS WORK |
| IMG_4411.JPG | A cycle path curves past a blue bicycle sign at a road junction. | A marked cycle path curves past a blue bicycle sign at a road junction in Saint-Brice. | NEEDS WORK |
| IMG_4416.JPG | A suspension bridge crosses a river beyond a stone wall under cloudy skies. | A suspension bridge spans the river at La Réole under cloudy skies. | NEEDS WORK |
| IMG_4421.JPG | People stand beside a white boat in a canal lock, next to a small control cabin. | People stand beside a white boat in a canal lock near Montpouillan. | NEEDS WORK |
| IMG_4423.JPG | Water fills a stone-lined canal lock between grassy banks and trees. | Water fills a stone-lined canal lock between grassy banks near Montpouillan. | NEEDS WORK |
| IMG_4428.JPG | A gravel towpath follows a canal beneath trees, with sunlight on the water. | A gravel towpath follows the canal beneath trees near Bruch, with sunlight on the water. | NEEDS WORK |
| IMG_6115.jpeg | A cyclist rides across a suspension bridge toward its central tower under cloudy skies. | A cyclist with panniers rides across a suspension bridge toward its central tower. | PASS |
| IMG_6117.jpeg | A cyclist bends over a small stone fountain beside an old church entrance. | A cyclist fills a bottle at a small wall fountain beside a stone church entrance. | NEEDS WORK |
| IMG_4459.JPG | A cyclist rides away on a shaded paved path beside a canal. | A cyclist rides along a shaded paved canal path in Moissac. | NEEDS WORK |
| IMG_4462.JPG | A cyclist crosses a narrow gravel bridge with water on both sides. | A cyclist crosses a cobbled aqueduct path beside water in Moissac. | FAIL |
| IMG_4463.JPG | A shaded canal path passes beneath tall trees beside a wooden railing. | A shaded canal path passes beneath tall trees beside a wooden railing near Saint-Porquier. | NEEDS WORK |
| IMG_4470.JPG | A long channel of water crosses a concrete aqueduct with paths on both sides. | The long concrete channel of the Montech water slope, with paths on both sides. | FAIL |
| IMG_4471.JPG | Boats sit beside a long concrete water channel stretching toward trees. | A closer view along the Montech water slope, with machinery at the far end. | FAIL |
| IMG_6125.jpeg | A cyclist crosses a narrow gravel aqueduct path beside a railing and water. | A cyclist with panniers crosses a narrow aqueduct path beside the water and a railing. | PASS |
| IMG_4484.JPG | A riverside pub with a sign reading The Danu stands above a stone bridge arch. | The Danu pub above a stone bridge arch beside the water in Toulouse. | NEEDS WORK |
| IMG_6143.jpeg | A canal reflects trees and a bridge with circular openings beneath a pale moon. | Still water reflects trees and an arched bridge with circular openings beneath a pale moon. | NEEDS WORK |
| IMG_6146.jpeg | A brick bridge with patterned stonework crosses a canal bordered by trees. | A cyclist crosses a brick aqueduct with circular openings above its arches. | NEEDS WORK |
| IMG_6155.jpeg | A cyclist in a yellow top rides through a narrow path under a graffiti-covered bridge. | A cyclist in yellow rides through a narrow path beneath a graffiti-covered bridge. | PASS |
| IMG_6158.jpeg | A cyclist in a patterned jersey approaches along a narrow canal path beneath a bridge. | A cyclist in a patterned jersey approaches along a narrow path beneath a bridge. | PASS |
| IMG_6175.jpeg | A blue touring bicycle leans against a brick bridge parapet above a tree-lined canal. | A blue bicycle with bags rests against a brick parapet beside a tree-lined canal. | NEEDS WORK |
| IMG_4492.JPG | Two cyclists ride along a town street with a large 30 road marking. | Two cyclists ride along a Toulouse street past a painted 30 speed limit. | NEEDS WORK |
| IMG_4495.JPG | A canal reflects trees and a pale building beneath a clear blue sky. | A canal reflects trees and a pale waterside building in Ayguesvives. | NEEDS WORK |
| IMG_4496.JPG | A paved path runs straight beneath tall trees with dappled sunlight. | A paved cycle path runs beneath plane trees, with dappled shadows and fields alongside. | PASS |
| IMG_4497.JPG | Long tree shadows fall across a paved path beside green fields. | A paved cycle path between plane trees, with strong shadows and fields to the right. | PASS |
| IMG_4516.JPG | Moored boats sit below an old stone bridge reflected in a canal. | Moored boats and a stone bridge reflected in the canal at Castelnaudary. | NEEDS WORK |
| IMG_4517.JPG | A low building beside a road carries the sign Les Vergers du Canal. | Entrance to the Légion étrangère’s Quartier Capitaine Danjou near Castelnaudary. | FAIL |
| IMG_4518.JPG | A pale stone memorial stands on a square base beside a ploughed field. | A stone obelisk memorial stands beside a harvested field under a blue sky. | PASS |
| IMG_4520.JPG | A stone-edged canal passes homes and a tall narrow tree beneath blue skies. | A stone-edged canal passes homes and a tall cypress in Montréal, Aude. | NEEDS WORK |
| IMG_4528.JPG | A town street follows a canal between old buildings, with a tower in the distance. | A Carcassonne street with cafés, old buildings and a tower in the distance. | FAIL |
| IMG_4529.JPG | A smiling cyclist wearing yellow glasses takes a selfie in front of round stone towers. | A smiling cyclist wearing yellow glasses in front of stone towers in Carcassonne. | NEEDS WORK |
| IMG_4533.JPG | A restaurant table holds a plate of meat and vegetables with sliced tomatoes and drinks. | A restaurant plate of meat, salad and sliced tomatoes with drinks in Carcassonne. | NEEDS WORK |
| IMG_4553.JPG | A weathered yellow building has a blue wooden garage door and a small shuttered window. | A weathered building in La Redorte with a blue garage door and shuttered window. | NEEDS WORK |
| IMG_4572.JPG | A broad gravel path crosses calm water beside reeds and trees. | A rough stone path crosses calm water beside reeds and trees. | NEEDS WORK |
| IMG_4574.JPG | Reeds grow beside the stone wall of a canal crossing, with trees beyond. | Reeds beside the stone wall of a canal crossing, with trees beyond. | PASS |
| IMG_4578.JPG | A cyclist in yellow glasses takes a selfie beside a tree-lined canal and towpath. | A cyclist wearing yellow glasses takes a selfie beside a canal towpath in Sallèles-d’Aude. | NEEDS WORK |
| IMG_4596.JPG | A canal curves past a stone towpath, moored boats and tall trees. | A canal curves past stone paths, moored boats and cypress trees in Béziers. | NEEDS WORK |
| IMG_4600.JPG | Three smiling people take a selfie around a restaurant table. | Three smiling people at a restaurant table, with a bar and wall decorations behind them. | NEEDS WORK |
| IMG_4606.JPG | A fish counter displays rows of red and silver fish on ice beneath price labels. | Rows of red mullet on ice at a fish counter in Sète. | NEEDS WORK |
| IMG_4607.JPG | Large silver fish lie on ice at a market counter beside smaller red fish. | Large silver fish on ice beside smaller red fish at a market counter in Sète. | NEEDS WORK |
| IMG_4633.JPG | Loaded touring bicycles stand against a wooden building with the words Créon Fête le vélo. | Loaded touring bicycles beside a wooden building marked “Créon Fête le vélo” in Créon. | NEEDS WORK |
| IMG_4634.JPG | Touring bicycles and a cyclist stand beside a wooden building beneath a deep roof overhang. | A cyclist and loaded touring bicycles rest beneath a wooden roof overhang in Créon. | NEEDS WORK |
| 9f4a9960-26b2-4d36-a8a3-4db68d666749_A4F2DBC7-C58D-460E-A289-3894F082CA8E.jpg | A group of cyclists rides toward the camera on a shaded path beneath leafy trees. | A small group rides toward the camera on a shaded path, with panniers and handlebar-mounted phones. | NEEDS WORK |
| IMG_4651.JPG | A smiling cyclist in sunglasses takes a selfie above a canal lined with moored boats. | A smiling cyclist in sunglasses above a canal lined with boats in Moissac. | NEEDS WORK |
| IMG_4652.JPG | Moored boats line a canal bordered by trees and waterside buildings under blue skies. | Moored boats and waterside buildings reflected in a canal in Moissac. | NEEDS WORK |
| IMG_4658.JPG | Stone columns frame the arches and green courtyard of a cloister in sunlight. | Stone columns and arches surround a sunlit cloister courtyard in Moissac. | NEEDS WORK |
| IMG_4687.JPG | Dark purple vegetables and peppers are arranged on a market stall beside handwritten signs. | Round purple aubergines and long cucumbers with handwritten prices at a Toulouse market stall. | FAIL |
| IMG_4708.JPG | Five people sit around a restaurant table with plates, drinks and large windows behind them. | Five people share a restaurant table with plates and drinks in Toulouse. | NEEDS WORK |
| IMG_4785.JPG | A cyclist rides toward the camera on a gravel towpath beside shrubs and a canal. | A cyclist with panniers rides toward the camera on a gravel towpath beside a canal. | NEEDS WORK |
| IMG_4797.JPG | A wall-mounted information plaque titled L’église de la Madeleine includes text, a church photograph and QR codes. | A plaque about L’église de la Madeleine on a stone wall in Béziers, with text, a church picture and QR codes. | NEEDS WORK |

## Performance and responsive-design findings

- **PASS:** 49 tiles at 320, 375, 768, 1024, 1440 and 1920px. Desktop tile widths span about 19–33% of the gallery; tablet spans about 32–49%; phone portraits use two columns and wider images use the available width. No horizontal scrolling, overlaps, missing dimensions, missing alt or broken gallery requests. Natural aspect ratios and contain-fit details avoid subject cropping.
- **PASS:** Next/previous buttons and arrows, wrapping, Escape, native modal focus, focus confinement and return to opener pass. Phone targets are at least 44px. A three-viewport local scenario proves Y overrides checked Keep and a populated caption; the next kept caption renders, and blank-caption photos remain. Originals and all 61 review thumbnails persist. The scenario was restored; no owner photo is marked Y now.
- **PASS:** AVIF/WebP responsive variants, WebP details and reserved dimensions. First photo uses eager/high priority; other 48 use lazy loading. Lazy `sizes="auto"` follows the [HTML Standard](https://html.spec.whatwg.org/dev/images.html) with explicit fallback sizes. Source order remains intact through layout and resizing.
- **PASS in lab, field data unmeasured:** Three cold Chromium mobile loads, 375×900, 4× CPU slowdown, 1,600Kbps down/750Kbps up/150ms latency: median LCP **1.06s**, maximum CLS **0.085**, and next-button response **22–30ms**. Worst individual task **189ms**, at most **139ms** lab blocking time. About **4.9KiB of executable inline JavaScript**, no framework hydration. Real field INP and public-CDN Core Web Vitals remain unmeasured; these local results do not certify them.
- Initial observed resource bytes fell from **1,767,234 to 588,985** under the same lab conditions. Before fixes, median LCP was **5.616s**, max CLS **0.357**. The required fixes were applied: smaller appropriate mobile source sizes, first-image priority, and mobile navigation initialized closed in HTML while no-JS navigation stays visible through the existing CSS.
- All **343** selected-gallery derivatives exist and have verified dimensions; largest **306,276 bytes**, within the existing 300KiB policy. Retained thumbnails include 12 archived photos for recovery; those photos do not appear in the gallery. Reported initial bytes include native near-viewport preloading, not a claim that only visible photos download.
- **Exact remaining performance check:** After approved publication, repeat cold-load measurements on the deployed URL and collect field data before claiming public Core Web Vitals. No image compression, source-file deletion or infrastructure change is required by this audit.

## Final recommendation

- **Ready to publish: No.** The infrastructure and interaction checks pass; the requested editorial/truthfulness standard still needs the following work.
- **Minimum fixes required before publication:**
  1. Approve and render explicit historical two-tour Bordeaux-to-Sète identity and accurate one-gallery metadata through the existing Sheet workflow.
  2. Correct the factual alt errors and review the known-town refinements in the 49-row table.
  3. Review the ten approximate locations, then approve finer within-group ordering and the stronger group opening. The geographic sequence and truthful Sète destination grouping are already applied. Confirm the absence or identity of lodging coverage; do not claim a sea-arrival celebration that is not shown.
  4. Review the two near-duplicate recommendations and visible fingertip/glare issues. Keep all 49 until an explicit Keep/Delete? decision is made; do not silently remove or edit originals.
  5. Add the owner-proposed future-CDM waitlist CTA through approved copy, with no past-trip booking implication.

The owner-authorized location grouping and ten explicit estimates have been applied. No removals, finer editorial ordering, caption changes or approved alt-text corrections have been silently applied. The 49-image gallery and Delete? infrastructure remain on the feature branch; main/public deployment is unchanged. The [implementation report](proof/2026-10-06_cdm_combined_gallery/REPORT.md) records inventory, hashes, commands, preservation and rollback. Contact sheets and larger comparisons in that evidence directory support the visual review; desktop/mobile screenshots and native Sheet snapshots are linked there.
