# v01_CDM_GALLERY_PUBLISH_CODEX_PROMPT

## Role and authority

You are implementing owner-approved editorial changes to the CDM photo gallery on the BikeTourFrance Astro site and publishing them. This prompt is the owner's explicit approval of every change listed below. It approves nothing else.

## Environment

* **Local repo root:** `/Users/jkbrookspersonal/LocalSiteBuildFiles/00_BTF_MAIN_SITE_CLOUDFLARE_ROOT`
* **GitHub:** `https://github.com/jkbrooks1/biketourfrance.git`. The deployment branch is `main`.
* **Working branch:** `feature/cdm-combined-gallery` (the 49-photo combined-gallery build)
* **Cloudflare Pages project:** `btf-production` (`btf-production.pages.dev`). `main` deploys automatically.
* **Content authority:** Google Sheet `BTF_Approved_Site_Copy` (Environment variable: `BTF_COPY_SHEET_ID`). All public copy must flow through it and pass `npm run predeploy:approved-copy`.
* **Canonical procedure:** `docs/BUILD_AND_DEPLOY_RUNBOOK.md`. Read it first and follow it for branching, preview, the approval gate, the production merge, and post-deploy verification. Where the runbook and this prompt conflict, stop and report. Do not choose between them yourself.
* **Prior evidence:** `proof/2026-10-06_cdm_combined_gallery/` (`REPORT.md`, `audit/locations.json`, contact sheets). Read `REPORT.md` before changing anything.
* **New evidence directory for this run:** `proof/2026-10-06_cdm_gallery_publish/`

## Build log (mandatory)

* Append a timestamped entry to `/Users/jkbrookspersonal/LocalSiteBuildFiles/00_GENERAL_BUILD_LOG.md` at each of these points: start of run, Sheet updates complete, build and re-audit complete, merge to main, post-deploy verification complete, and any STOP.
* If the runbook designates a project-specific build log (`00_BUILD_LOG.md`), append the same entries there as well.
* **Never** write to `/Users/jkbrookspersonal/JBLocal FilesTEMP/00_GENERAL_BUILDLOG.md`. It is deprecated.
* Each entry states: what was done, commit SHA(s) where applicable, evidence paths, and pass/fail status.

## Scripts

Save a copy of any script you create to `/Users/jkbrookspersonal/00_SCRIPTS/`. Put the version first with two digits (e.g. `v01_cdm_gallery_alt_sync.py`). Also save a copy of this prompt there as `v01_CDM_GALLERY_PUBLISH_CODEX_PROMPT.md`.

## Hard guardrails

* Never delete, overwrite, or edit original photo files. Only reversible derivatives are allowed through the existing pipeline.
* Preserve every permanent Photo ID, the EXIF date and estimated-date (EST) provenance, the GPS and estimated-location provenance, and the ten estimated location assignments exactly as they are.
* Add no images: no stock, no AI-generated photos, no photos from other trips.
* Make no pixel changes other than the `IMG_4528.JPG` derivative crop specified below. Do not adjust `IMG_4633.JPG`.
* Captions stay blank. Add no place headings to the page.
* Add no copy implying past trips can be booked.
* Do not perform a domain cutover. Do not change Cloudflare project settings, DNS, or build configuration.
* Do not force-push or rewrite history on `main`.
* Do not alter any page other than `/cdm-photo-gallery/`, except for shared components the CTA strictly requires.
* Do not claim anything is published, verified, or complete unless it is supported by command output, file inspection, or a fetch of the live URL. Report status; do not declare the project complete.

## Approved changes

### 1. Page identity (via BTF_Approved_Site_Copy)

* **H1:** Canal des Deux Mers Photo Gallery
* **Intro:** Photos from two Canal des Deux Mers cycling tours along the Bordeaux-to-Sète route in France.
* **Page title:** The H1 text, followed by the site's existing page-title suffix convention.
* **Meta description:** Photos from two Canal des Deux Mers cycling tours along the Bordeaux-to-Sète route, grouped by location from Créon to Sète.
* Remove every remaining metadata reference describing the page as separate CDM1/CDM2 collections.
* If the page, its metadata, or any rendered text states a photo count, it must read **47**.

### 2. Removals (reversible)

Set `Delete?=Y` in the gallery review Sheet for `IMG_4470.JPG` and `IMG_4497.JPG`. Do not touch their originals or their review thumbnails. The gallery must render exactly 47 photos.

### 3. Derivative crop

`IMG_4528.JPG` gets a minimal reversible derivative crop that removes the fingertip at the lower edge. Do not cut into the street, cafés, buildings, or the distant tower. Keep the original unchanged. Record the crop parameters in the gallery manifest/data files and in `proof/2026-10-06_cdm_gallery_publish/REPORT.md`. Regenerate only that photo's AVIF/WebP variants and keep them within the existing 300 KiB per-derivative policy.

### 4. Opening tile

`9f4a9960-26b2-4d36-a8a3-4db68d666749_A4F2DBC7-C58D-460E-A289-3894F082CA8E.jpg` is position 1, rendered as a larger lead tile:

* At most one-third of the desktop gallery width, natural aspect ratio, no crop.
* `loading="eager"` and `fetchpriority="high"`.
* `IMG_4633.JPG` becomes lazy-loaded like the other photos.

### 5. Final order (47 photos)

Render exactly this order. It keeps every geographic group contiguous from west to east:

1. `9f4a9960-26b2-4d36-a8a3-4db68d666749_A4F2DBC7-C58D-460E-A289-3894F082CA8E.jpg`
2. `IMG_4633.JPG`
3. `IMG_4634.JPG`
4. `IMG_4406.JPG`
5. `IMG_4411.JPG`
6. `IMG_4416.JPG`
7. `IMG_6115.jpeg`
8. `IMG_6117.jpeg`
9. `IMG_4421.JPG`
10. `IMG_4423.JPG`
11. `IMG_4428.JPG`
12. `IMG_4459.JPG`
13. `IMG_4651.JPG`
14. `IMG_4652.JPG`
15. `IMG_4658.JPG`
16. `IMG_4462.JPG`
17. `IMG_6143.jpeg`
18. `IMG_6125.jpeg`
19. `IMG_6175.jpeg`
20. `IMG_6155.jpeg`
21. `IMG_6146.jpeg`
22. `IMG_6158.jpeg`
23. `IMG_4463.JPG`
24. `IMG_4471.JPG`
25. `IMG_4484.JPG`
26. `IMG_4492.JPG`
27. `IMG_4687.JPG`
28. `IMG_4708.JPG`
29. `IMG_4495.JPG`
30. `IMG_4496.JPG`
31. `IMG_4516.JPG`
32. `IMG_4517.JPG`
33. `IMG_4518.JPG`
34. `IMG_4520.JPG`
35. `IMG_4528.JPG`
36. `IMG_4529.JPG`
37. `IMG_4533.JPG`
38. `IMG_4553.JPG`
39. `IMG_4572.JPG`
40. `IMG_4574.JPG`
41. `IMG_4578.JPG`
42. `IMG_4785.JPG`
43. `IMG_4596.JPG`
44. `IMG_4797.JPG`
45. `IMG_4600.JPG`
46. `IMG_4607.JPG`
47. `IMG_4606.JPG`

### 6. Alt text (via approved-copy workflow; verbatim, including curly quotes and apostrophes)

* `9f4a9960-26b2-4d36-a8a3-4db68d666749_A4F2DBC7-C58D-460E-A289-3894F082CA8E.jpg`: A small group rides toward the camera on a shaded path, with panniers and handlebar-mounted phones.
* `IMG_4633.JPG`: Loaded touring bicycles beside a wooden building marked “Créon Fête le vélo” in Créon.
* `IMG_4634.JPG`: A cyclist and loaded touring bicycles rest beneath a wooden roof overhang in Créon.
* `IMG_4406.JPG`: A cyclist with luggage rides along a paved path between hedges and trees near Espiet.
* `IMG_4411.JPG`: A marked cycle path curves past a blue bicycle sign at a road junction in Saint-Brice.
* `IMG_4416.JPG`: A suspension bridge spans the river at La Réole under cloudy skies.
* `IMG_6115.jpeg`: A cyclist with panniers rides across a suspension bridge toward its central tower.
* `IMG_6117.jpeg`: A cyclist fills a bottle at a small wall fountain beside a stone church entrance.
* `IMG_4421.JPG`: People stand beside a white boat in a canal lock near Montpouillan.
* `IMG_4423.JPG`: Water fills a stone-lined canal lock between grassy banks near Montpouillan.
* `IMG_4428.JPG`: A gravel towpath follows the canal beneath trees near Bruch, with sunlight on the water.
* `IMG_4459.JPG`: A cyclist rides along a shaded paved canal path in Moissac.
* `IMG_4651.JPG`: A smiling cyclist in sunglasses above a canal lined with boats in Moissac.
* `IMG_4652.JPG`: Moored boats and waterside buildings reflected in a canal in Moissac.
* `IMG_4658.JPG`: Stone columns and arches surround a sunlit cloister courtyard in Moissac.
* `IMG_4462.JPG`: A cyclist crosses a cobbled aqueduct path beside water in Moissac.
* `IMG_6143.jpeg`: Still water reflects trees and an arched bridge with circular openings beneath a pale moon.
* `IMG_6125.jpeg`: A cyclist with panniers crosses a narrow aqueduct path beside the water and a railing.
* `IMG_6175.jpeg`: A blue bicycle with bags rests against a brick parapet beside a tree-lined canal.
* `IMG_6155.jpeg`: A cyclist in yellow rides through a narrow path beneath a graffiti-covered bridge.
* `IMG_6146.jpeg`: A cyclist crosses a brick aqueduct with circular openings above its arches.
* `IMG_6158.jpeg`: A cyclist in a patterned jersey approaches along a narrow path beneath a bridge.
* `IMG_4463.JPG`: A shaded canal path passes beneath tall trees beside a wooden railing near Saint-Porquier.
* `IMG_4471.JPG`: A closer view along the Montech water slope, with machinery at the far end.
* `IMG_4484.JPG`: The Danu pub above a stone bridge arch beside the water in Toulouse.
* `IMG_4492.JPG`: Two cyclists ride along a Toulouse street past a painted 30 speed limit.
* `IMG_4687.JPG`: Round purple aubergines and long cucumbers with handwritten prices at a Toulouse market stall.
* `IMG_4708.JPG`: Five people share a restaurant table with plates and drinks in Toulouse.
* `IMG_4495.JPG`: A canal reflects trees and a pale waterside building in Ayguesvives.
* `IMG_4496.JPG`: A paved cycle path runs beneath plane trees, with dappled shadows and fields alongside.
* `IMG_4516.JPG`: Moored boats and a stone bridge reflected in the canal at Castelnaudary.
* `IMG_4517.JPG`: Entrance to the Légion étrangère’s Quartier Capitaine Danjou near Castelnaudary.
* `IMG_4518.JPG`: A stone obelisk memorial stands beside a harvested field under a blue sky.
* `IMG_4520.JPG`: A stone-edged canal passes homes and a tall cypress in Montréal, Aude.
* `IMG_4528.JPG`: A Carcassonne street with cafés, old buildings and a tower in the distance.
* `IMG_4529.JPG`: A smiling cyclist wearing yellow glasses in front of stone towers in Carcassonne.
* `IMG_4533.JPG`: A restaurant plate of meat, salad and sliced tomatoes with drinks in Carcassonne.
* `IMG_4553.JPG`: A weathered building in La Redorte with a blue garage door and shuttered window.
* `IMG_4572.JPG`: A rough stone path crosses calm water beside reeds and trees.
* `IMG_4574.JPG`: Reeds beside the stone wall of a canal crossing, with trees beyond.
* `IMG_4578.JPG`: A cyclist wearing yellow glasses takes a selfie beside a canal towpath in Sallèles-d’Aude.
* `IMG_4785.JPG`: A cyclist with panniers rides toward the camera on a gravel towpath beside a canal.
* `IMG_4596.JPG`: A canal curves past stone paths, moored boats and cypress trees in Béziers.
* `IMG_4797.JPG`: A plaque about L’église de la Madeleine on a stone wall in Béziers, with text, a church picture and QR codes.
* `IMG_4600.JPG`: Three smiling people at a restaurant table, with a bar and wall decorations behind them.
* `IMG_4607.JPG`: Large silver fish on ice beside smaller red fish at a market counter in Sète.
* `IMG_4606.JPG`: Rows of red mullet on ice at a fish counter in Sète.

Leave the stored alts for the removed photos (`IMG_4470.JPG`, `IMG_4497.JPG`) unchanged.

### 7. Future-tour CTA (via BTF_Approved_Site_Copy)

* **Text:** Interested in riding the Canal des Deux Mers with us? Join the waitlist for a future Bike Tour France trip.
* **Placement:** Directly below the gallery and above the footer, immediately after `IMG_4606.JPG`.
* **Link target:** `/waitlist-2027/` (confirm route exists in repo).
* **Styling:** Reuse existing BTF link/button components following BTF Style Guide v4.4 (Primary Green `#2D5016`, Montserrat). Do not create a new visual style.
* If `BTF_Approved_Site_Copy` has no field for this CTA, add one following the Sheet's existing schema conventions.

## Execution sequence

1. Read `docs/BUILD_AND_DEPLOY_RUNBOOK.md` and `proof/2026-10-06_cdm_combined_gallery/REPORT.md`. Confirm a clean working tree on `feature/cdm-combined-gallery`, then log the start to `00_GENERAL_BUILD_LOG.md`.
2. Write the copy and alt changes (sections 1, 6, and 7) to `BTF_Approved_Site_Copy` and the `Delete?=Y` marks (section 2) to the review Sheet. Snapshot the Sheet before and after into `proof/2026-10-06_cdm_gallery_publish/`. Log.
3. Implement the crop, opening tile, order, and CTA rendering (sections 3, 4, 5, and 7). Commit with descriptive messages.
4. Build and run `npm run predeploy:approved-copy`. It must pass.
5. Run a targeted re-audit on the local preview, saving evidence and screenshots to `proof/2026-10-06_cdm_gallery_publish/`.
* Re-check changed items: page identity, opening tile, duplicate control, the Moissac run and visual variety, the `IMG_4528` fingertip, all 47 alts verbatim, and the CTA (text, placement, link target, no booking implication).
* Re-run regression checks:
* Exactly 47 photos, none broken, each displayed once.
* The six viewports (320, 375, 768, 1024, 1440, 1920): no horizontal overflow or tile overlap, correct order, and every image has alt text.
* Lightbox: next/previous, Escape, focus handling, 44px touch targets.
* AVIF/WebP variants present; every derivative within 300 KiB.
* First photo eager/high priority; the other 46 lazy.
* Three cold mobile lab loads with throttling (375×900, 4× CPU, 1600/750 Kbps, 150 ms). Report median LCP, max CLS, and next-button response.

6. Log build and re-audit results. Produce a Cloudflare preview deployment per the runbook and record its URL.
7. Merge `feature/cdm-combined-gallery` into `main` per the runbook and push. Record the merge SHA. Log.
8. Wait for the `btf-production` deployment of that SHA to finish. Record the deployment ID.
9. Post-deploy verification:
* Fetch `https://btf-production.pages.dev/cdm-photo-gallery/` and `https://biketourfrance.net/cdm-photo-gallery/`.
* On each, confirm 47 photos, the new H1, intro, CTA, opening tile, and zero broken images.
* Run three cold mobile lab loads against each URL that serves the new build.
* If `biketourfrance.net` still serves a different build, report which host serves it and stop there; do not attempt an unauthorized cutover.
* Log.

10. Write `proof/2026-10-06_cdm_gallery_publish/REPORT.md` covering: changes made; Sheet before/after snapshots; commit SHAs, preview URL, deployment ID; verification results with evidence paths; rollback instructions; and anything not done and why.

## Stop conditions (stop, log, report; do not improvise)

* The runbook conflicts with this prompt.
* No write access to `BTF_Approved_Site_Copy` or the review Sheet. Do not hardcode copy in the repo to bypass the Sheet.
* `npm run predeploy:approved-copy` fails, or any re-audit or regression check fails before the merge.
* Missing or ambiguous waitlist target route.
* Merge conflicts on `main`.
* After deployment, the live page shows broken images, a wrong photo count, or a failed regression check. In that case, revert the merge on `main` with a new revert commit (no force-push), confirm the revert deployment, then stop and report.

## Final report to the owner

Give a concise summary of each section above: done, not done, or stopped, with the evidence path for each. Include the commit SHAs, the preview URL, the deployment ID, and the live verification results. Do not declare the project complete; the owner decides that.

---

## Subsequent owner directions retained with this copy

- “authorized”: reconcile the missing/stale runbook, finish the earlier combined report, preserve intended gallery work in Git.
- “can you fix the sheet so it is compliant?”: fill required legacy fields using already-approved combined wording; keep copy gate unchanged.
- “publish the site” and “publish the site now”: publish the current Sheet-backed site after the approved gallery changes/checks.
- Owner answered “yes” to: “May I change that phrase to BikeTourFrance in the Sheet and continue publishing?” Only the CTA brand phrase changes; all 47 alts remain verbatim.
