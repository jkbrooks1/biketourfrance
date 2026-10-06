# CDM Photo Gallery publication — STOP / rollback verified

The47-photo release was deployed, then reverted because the required live-domain regression check failed. The public site now serves the previous61-photo gallery. Further gallery changes/publication are stopped under the owner’s explicit failure rule; this does not declare the project complete.

## Verified source and commits

- Root: /Users/jkbrookspersonal/LocalSiteBuildFiles/00_BTF_MAIN_SITE_CLOUDFLARE_ROOT; GitHub jkbrooks1/biketourfrance; Pages btf-production, production branchmain.
- Public/main before:1785d5f45dcd71bb84fb1f4c4c635e8485a3e96d. Run-before:fec3e7f879875a90bab4e0c6edf18bfcd5728b9d.
- Pre-editorial checkpoint:2c8152e3f05b186661f8c6723b0f972a73579f8c.
- Preserved47-photo feature:feature/cdm-combined-gallery,adce2966c36740816b562248ef3d3991b2c41dd5.
- Approved normal main merge:98be1d38cbe6835f9c5591c8cac96354e62f4270.
- Currentmain after required normal revert:eb462fd76771669af1731146d794188d65dc5dfe. Its versioned tree matches1785d5f exactly. No history rewrite.

## Execution status

| Step | Result | Evidence |
|---|---|---|
| Rules/history/runbook/prior handoff | DONE; owner authorized reconciliation of stale procedure | HISTORY.md; feature docs/BUILD_AND_DEPLOY_RUNBOOK.md |
| Approved Sheet identity/47alts/twoDeleteY/CTA | DONE; native before/after verified | sheet-compliance*,sheet-identity*,sheet-editorial*,sheet-cta-brand* |
| Crop/lead/order/CTA implementation | DONE; retained on feature | src/data/cdm-gallery-editorial.json atadce296; derivative-change-verification.json |
| Local build/copy/site/re-audit | PASS | final-predeploy.txt,local-browser.txt,local-reaudit.txt |
| Git-driven preview | PASS | preview-browser.txt,preview-reaudit.txt,preview/ |
| Approvedmain merge/production deployment | DONE, then REVERTED | RELEASE.json; project-production-progress.json |
| Live47 editorial/image checks | PASS bothhosts47 unique/329variants | pages-reaudit.txt,public-reaudit.txt,live-host-identity.json |
| Live47 responsive/lightbox regression | Pages PASS; public FAIL at1440pxCLS | pages-browser.txt,public-browser.txt; public/gallery-browser-verification.json |
| Threecoldmobile loads per livehost | NOT RUN; mandatory regression STOP preceded these tests | Local three-run metrics retained separately |
| Required normal revert/deployment verification | PASS bothhosts restored61-photo before-state | rollback-verification.json,project-rollback-progress.json |
| Publication acceptance | STOP; no successful47-photo live release remains | This report |

## Inventory, inclusion and exceptions

Authoritative source /Volumes/JB_Tier2Storage/CDM1and2 readable:50 files;49 supported images (41JPG,8JPEG),0 corrupt/unreadable,0 exact-content/orientation-normalized-pixel duplicates. Total185847413bytes; supported images185841265bytes. All49 match already-managed originals; mounted originals unchanged. Feature/preview/attemptedrelease47unique photos; current revertedpublicgallery61. The49reviewrows,61originals/thumbs/permanent IDs and all provenance are retained in Sheet/feature; no loss of originals or renumbering.

Exact unsupported path: /Volumes/JB_Tier2Storage/CDM1and2/.DS_Store,6148bytes, filesystem metadata. Exact owner-authorized removals: /Volumes/JB_Tier2Storage/CDM1and2/IMG_4470.JPG and /Volumes/JB_Tier2Storage/CDM1and2/IMG_4497.JPG, Delete?=Y; originals/review thumbnails/removed-photo stored alts retained. Twelve earlier managed photos absent from the authoritative folder were excluded from the47feature: IMG_4507.PNG,IMG_4638.PNG,IMG_4664.PNG,IMG_4665.PNG,IMG_4691.PNG,IMG_4692.PNG,IMG_4694.PNG,IMG_4696.PNG,IMG_4697.PNG,IMG_4781.JPG,IMG_4783.JPG,IMG_4784.JPG. exceptions.json records every full absolute pathname/reason. Historical original-folder inventory and49-photo audit remain in feature docs/proof/2026-10-06_cdm_combined_gallery and docs/CDM_PHOTO_GALLERY_AUDIT.md. No silent omission.

## Changes preserved

Exact47-owner-order,47verbatim alts, approvedtwo-tour identity, newfuturewaitlistCTA viaSheet; captions blank/no place headings. Lead UUID riderphoto naturalratio, <=one-thirddesktop,eager/high; other46lazy includingIMG_4633. CTA belowgallery/abovefooter links existing /waitlist-2027/ using existing green/Montserrat Button. Owner subsequently corrected only brand spelling toBikeTourFrance; copy/brand gates unchanged.

Only IMG_4528.JPG derivative crop: EXIF-oriented3024x4032; bboxleft0,top0,width3024,height3620; removes412bottompixels/fingertip while retainingstreet/cafés/buildings/distanttower. Original/thumb unchanged. Other46 derivative sets unchanged;329references≤300KiB,max306276bytes. Managed61originals213695229bytes retained; attempted dist516files54302571bytes.39GPS+10estimated locations,40EXIF+9estimated dates across49eligible photos and entire61-IDregistry unchanged. No invented coordinates or new imagery.

Files changed during attemptedrelease: published-file-list.txt. This includes review/ID/selection pipeline, generatedSheetcopy/fixtures/fieldmanifest, gallerycomponent/page/layout/data, redirect rules, hourlyreview snapshot persistence, tests, runbook/rules, audit/reviewdocs andproofs. Existingfour stored approved-copy edits fromd958c837 (/terms/body_3,/tours/meta_description,/waitlist/body_2,/cdm-facts/copy_12) were included under renewed publish-current-site authority; no new wording edits to those pages. The revert restores previous versionedsource; implementedwork remains onfeature. Older unrelated docs/BUILD_LOG.md and discoveryREPORT notes and alluntrackedolderproofs were preserved, never discarded.

## Commands and results

- npm run check:35files,0errors/0warnings,2pre-existinghints — astro-check.txt.
- npm run gallery:test:8PASS — gallery-tests.txt.
- npm run copy:test:4unit+10negative/regression PASS — copy-tests.txt.
- npm run predeploy:approved-copy:439livefields,13pages,47of49,61IDs/thumbs PASS; includes canonicalroot/renderedcopy/gallery/site/deployability — final-predeploy.txt. No gate changes.
- python3 scripts/gallery/browser.py: six320/375/768/1024/1440/1920 widths; local/preview/Pageslive PASS; publiclive FAIL exactly1440pxCLS0.29006041666666665 versus0.1limit. Otherpublicchecks passed, including47order/alt/dimensions/overflow/overlap/brokenimages/lightboxnext/previous/Escape/focustrap/return and44pxtargets. The cause is not diagnosed; font/header timing remains a hypothesis, not a finding. No retry used to dismiss the failure.
- python3 scripts/gallery/v01_cdm_gallery_reaudit.py: local/preview/bothlivehosts PASS47exactorder/alts/identity/CTA/crop,oneeager+46lazy and329HTTP200variant/detail references withinbudget. Screenshots in local/,preview/,pages/,public/. LoadedMoissacvariety andfinalphoto/CTA screenshots inpreview/.
- Source/ID/location/hash/budget checks PASS — manifest-verification.json,derivative-change-verification.json,source-delivery-verification.txt.
- Guestjourney13routes/338links/24CTAs/oneform/12hooks PASS; technicalSEO13pages/13JSONLD/sitemap PASS — guest-journey.txt,technical-seo.txt.
- python3 scripts/gallery/audit-performance.py locally: threecold375x900,CPU4x,1600/750Kbps,150ms; medianLCP1468ms,maxCLS0.099378125,nextbuttonpaint27.3–30.3ms — local-performance-final.txt/local-performance/performance.json. Initial overlapped-build measurement timedout; retaineddiagnostic thenstableoutput retry passed. These are labmetrics, not real-user CoreWebVitals. Live coldmobile tests notrun aftermandatorySTOP.
- GitHub release approved-copycheck37539296726 SUCCESS. Revert check37540897359 FAIL: /cdm-gallery/future_tour_cta atSheetrow501 is absent from restoredold438-fieldmanifest — github-rollback-failure.txt. This is a known reconciliation blocker; Sheet was not silently reset.
- git revert -m1 98be1d38cbe6835f9c5591c8cac96354e62f4270; git push originmain — normalreverteb462fd. Firstrevert safelyrefuseddirtylogs/evidence; preservedallfiles/stashthenretried.
- Read-onlyCloudflareAPI confirms rollback canonicalSHAeb462fd; curlHTTP200bothhosts; manifests structurallyidenticaltosavedbefore61-photo payload — rollback-verification.json and rollbackmanifests/HTML.

## Deployment facts and before/after

Preview PASS: https://0166b870.btf-production.pages.dev/cdm-photo-gallery/; ID0166b870-fce6-4cfe-ba9d-ac013b8f5b60; SHAadce296.
Attemptedproduction SUCCESS thenreverted: https://78545dd1.btf-production.pages.dev; ID78545dd1-930d-4669-84be-1cd50a541a88; SHA98be1d3.
Currentrollbackproduction SUCCESS2026-10-06T22:34:39.788782Z: https://f250aecf.btf-production.pages.dev; IDf250aecf-1d52-47e5-b1aa-b1057eca54e3; SHAeb462fd.
Both https://btf-production.pages.dev/cdm-photo-gallery/ and https://biketourfrance.net/cdm-photo-gallery/ nowserve61photos matchingbeforestate. Existing stagingbanner/indexing controls remain unchanged; outsidegallery-onlyscope.

## Preservation, logs, rollback and next blockers

47source intactonfeatureadce296; pre-editorial49statecheckpoint2c8152e. Allpostpublicationproofs/dirtynotes also preserved at /private/tmp/btf-cdm-gallery-failed-release-preserved-20261006 and Gitstashfddd8f94b9f515a280d7b21fe52aa9753db254ce; earliernotesstashd2324655082da09beaa6970766b2976719d3a011 retained. Evidenceandnotes restoredlocally. Newreport/proofs/append-onlylogs remainlocalafterrevert; no extra documentation-onlymainpushwasmade.

Sheet remainsowner-approved47editorialstate, includingnewCTA and twoYdecisions. Oldmain doesnotimplementthesereviewcontrols andrejectsnewCTAfield; caption/Keepchangesmustnotbeassumedlive. Beforeanotherpublication, diagnose/fix1440pxliveCLS, reconcileSheet/source schema withouterasingnewerdecisions, thenrerunallreleasechecks includingthreecoldmobileloadsforeachlivehost. No automaticfix or gateweakeningwasattempted afterSTOP.

Allmandatory START/Sheet/build/mainmerge/STOP/postdeployrollback milestones appendedto:
/Users/jkbrookspersonal/LocalSiteBuildFiles/00_GENERAL_BUILD_LOG.md;
/Users/jkbrookspersonal/LocalSiteBuildFiles/00_BTF_MAIN_SITE_CLOUDFLARE_ROOT/00_BUILD_LOG.md;
/Users/jkbrookspersonal/LocalSiteBuildFiles/00_BTF_MAIN_SITE_CLOUDFLARE_ROOT/docs/BUILD_LOG.md;
/Users/jkbrookspersonal/JBLocalBuildLogs/00_GENERAL_BUILDLOG.md.
Single systemsregister appended: /Users/jkbrookspersonal/LocalSiteBuildFiles/00_A.SYSTEMS_CHANGES_REGISTER/SYSTEM_CHANGES_REGISTER.md.
Fourcreatedscriptsandownerprompt archivedbyte-identically in /Users/jkbrookspersonal/00_SCRIPTS/; exactpaths/hashesinscript-archives.json.

No DNS, public-domaincutover, Pagesconfiguration, buildcommand, secrets, Framer, Wranglerdirectupload, forcepush or unapprovedmainpublication occurred. Owner-approvedmainpublication and mandatedrevert usedexistingGitintegration only.


Historical first-attempt STOP report. Owner subsequently renewed deployment approval; retry status/evidence: ../2026-10-06_cdm_gallery_retry/REPORT.md.
