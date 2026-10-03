# Production cutover preflight

Written 2026-10-02. **Nothing in this document has been done.** Cutover is a separate step that needs the owner's explicit approval. This file supersedes the step list in `docs/cutover.md`; that file keeps the original process and safeguards.

Read first: the system-change register entries of 2026-10-02 ("biketourfrance.net Framer cutover: DNS snapshot and prerequisites" and the temp-btf Git-integration entry).

## 1. Current state (read-only checks, 2026-10-02)

| Item | State |
|---|---|
| Live main site | Framer. The apex has two A records (31.43.160.6 and 31.43.161.6, DNS only). `www` is a CNAME to `sites.framer.app` and answers 308 to the apex. |
| Email | Google Workspace MX (`aspmx.l.google.com` plus `alt1` to `alt4`), SPF that includes Google and MailerLite, Google site verification, MailerLite domain verification. **None of this may change.** |
| New site | Native Astro build in GitHub `jkbrooks1/biketourfrance`, Cloudflare Pages project `temp-btf`, branch `rebuild/2026-10-02-audit-remediation`. Production auto-deploys are off. |
| Staging protections | `SITE.indexingEnabled = false` (`src/data/site.ts`), `public/_headers` (`X-Robots-Tag`), `public/robots.txt` (`Disallow: /`), and a staging banner on every page. |
| Security headers | Unchanged. The apex returns HSTS `max-age=31536000` from Framer. |

## 2. Owner decisions needed before cutover

1. **Contact route.** The site's only contact method is `mailto:john@biketourfrance.net`. Approve it, or supply a form or WhatsApp destination.
2. **Mailing list and waitlist.** No sign-up form exists. The DNS shows a MailerLite account, but its group, form endpoint, and consent wording are not documented. A form needs the endpoint, the fields, the consent text, and a proven test submission (delivery and confirmation) before the Contact page can say it works.
3. **Planning-session price.** The live site shows $250. The new pages say "by arrangement". Restore it or keep it off.
4. **Host-dinner claim.** The live site says three dinners with local hosts at Maison d'Hôtes. It is not in the confirmed 2027 facts and was left out. Confirm or supply the wording.
5. **Lunches.** The site says lunches are not included, inferred from the facts list. Confirm.
6. **Carried copy.** Confirm the live-site items listed in `docs/2027_CDM_CONTENT_AUTHORITY.md` ("carried from the live site"), including the route stops and the "four tours each year" statement.
7. **Navigation labels.** The owner style guide lists three approved labels. The site uses the six links the remediation brief required. See `docs/STYLE_GUIDE.md`, deviation 1.
8. **2026 history.** Confirm the wording "BikeTourFrance.net rode the Canal des Deux Mers in September 2026".
9. **Legal and privacy review (TR-001).** The Privacy, Terms, and Cookies pages state only what the site's code does today. The owner must review them, and confirm:
   - the legal name of the business and who answers privacy requests;
   - how email is handled (Google Workspace) and any retention period;
   - whether the old "webinar registration and calendar data" practice still exists (the old text claimed it; the new site cannot verify it);
   - the use of MailerLite, if any, and its consent flow;
   - whether GDPR or CCPA statements are wanted, and in what words;
   - the disclaimer and liability wording the old Framer page carried ("not liable for injuries..."). It was removed because it is a legal claim that cannot be proven from the tooling. Add replacement text only with legal advice;
   - that the site really is hosted on Cloudflare Pages at launch (the Privacy page says so).
10. **Review notes.** The orange "Draft for owner review" box on the three policy pages shows only while `indexingEnabled` is false. It disappears at launch, so the review must be done first.
11. **Redirects.** Approve each redirect in `docs/SUBDOMAIN_MIGRATION_AUDIT.md` separately. None is approved yet.
12. **Lodging and French audio.** The new site has no lodging page and no French-audio pages. Decide whether the cutover waits for them or whether `lodging.*` and `resources.*` stay as separate subdomains for now (the recommendation).

## 3. Technical gates

0. **The approved copy gate is live** (`docs/APPROVED_COPY_GATE.md`): the sheet BTF_Approved_Site_Copy is filled in and approved by the owner; `BTF_COPY_GOOGLE_SA_JSON` and `BTF_COPY_SHEET_ID` are stored in GitHub and in the Cloudflare Pages project (Preview and Production); the service account has read-only access to the sheet; branch protection on `main` requires the check **Approved copy check**; and `npm run predeploy` passes against the real sheet. Production cannot deploy otherwise.

1. `npm run check`, `npm run build`, and `npm run verify` pass on the branch to be merged.
2. The preview deployment is checked in a browser at 320, 375, 390, 768, 1024, and 1440 px, and with the keyboard.
3. Merging the branch to `main` is approved separately. Production auto-deploy stays off until the owner turns it on.
4. Search Console and analytics data per hostname are pulled and kept as the "before" record.
5. A fresh read-only DNS snapshot of both zones (`biketourfrance.net` and `biketourfrance.com`) is saved, including all MX and TXT records.

## 4. Cutover sequence (for the approved task only)

1. Add `biketourfrance.net` to the Pages project through the Cloudflare custom-domain workflow. Wait for the certificate. Do not hand-edit DNS in place of this workflow.
2. Write down the exact DNS change Cloudflare proposes. Confirm it touches only the apex A records and the `www` CNAME. Confirm MX, SPF, DKIM, DMARC, verification TXT, and CAA records are untouched.
3. Test the new site on the custom hostname before sending traffic. Keep Framer published as the fallback.
4. Apply the change. Check `https://biketourfrance.net/`, `https://www.biketourfrance.net/` (redirects to the apex), and `/canal-des-deux-mers/`.
5. Send a test email to and from `john@biketourfrance.net` to prove mail still works.
6. **Then, and only then,** turn indexing on (section 5).
7. Submit the sitemap in Search Console. Watch Search Console and the Pages logs for several days.
8. Add the 301 redirects from the old subdomains one at a time, after each is tested (see the test commands in `docs/SUBDOMAIN_MIGRATION_AUDIT.md`).

## 5. Turning indexing on (production only)

All four must change together, and only after step 4 passes:

1. `src/data/site.ts`: set `indexingEnabled` to `true` (removes the `noindex` meta tag and the staging banner, and shows no review notes).
2. `public/_headers`: remove the `X-Robots-Tag: noindex, nofollow, noarchive` rule.
3. `public/robots.txt`: replace `Disallow: /` with `Allow: /` and add `Sitemap: https://biketourfrance.net/sitemap-index.xml`.
4. Update `scripts/verify-dist.mjs` so it expects the production settings instead of the staging ones.

## 6. Rollback

| Change | Rollback | Time |
|---|---|---|
| Apex or `www` DNS | Put the apex A records back to 31.43.160.6 and 31.43.161.6 and `www` back to `sites.framer.app`, from the saved snapshot. Framer stays published until the owner confirms. | Minutes, plus DNS caching |
| Pages custom domain | Remove the custom domain from `temp-btf`. | Minutes |
| A bad deployment | Cloudflare Pages dashboard: promote the previous deployment. | Under a minute |
| Indexing turned on too early | Revert the four changes in section 5 and redeploy. Request removal in Search Console if pages were crawled. | Minutes, but crawlers are slow to forget |
| A redirect | Remove the rule from the old project's `_redirects` file. Browsers cache 301 responses, so test with 302 first. | Minutes |

Each step must be recorded in `docs/BUILD_LOG.md`, the general build log, and the system-change register.

## 7. Left for later

- A report-only Content Security Policy and any HSTS change: see `docs/SECURITY_CSP_AUDIT.md`. Do not combine them with the cutover.
- The `biketourfrance.com` primary-domain project. It is blocked by email on `.net` and is not part of this cutover.
- Exact 2027 dates, pricing, deposits, and cancellation terms, and the Event and Offer structured data that depend on them.
