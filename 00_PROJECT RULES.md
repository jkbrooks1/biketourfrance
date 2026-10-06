# BikeTourFrance native Astro project rules

This native website's rules govern the CDM Photo Gallery task. The CDM Status Successor reference belongs to a separate application. The owner clarified the earlier “yes” concerned Pages main/deployment, then explicitly instructed “publish it” for the gallery on 2026-10-05 (America/Los_Angeles).

## Source and deployment

- Canonical local root: `/Users/jkbrookspersonal/LocalSiteBuildFiles/00_BTF_MAIN_SITE_CLOUDFLARE_ROOT`.
- GitHub: `https://github.com/jkbrooks1/biketourfrance.git`; development and production base branch: `main`.
- Work on descriptive `feature/` branches created from verified current `main`; preserve pre-change state in Git and stage only intended changes. Retired roots and branches are recovery material.
- Current Pages project: `btf-production`, Git-connected, production branch `main`, preview setting `all`, build `npx astro build`, output `dist`, root `.`. Verified by read-only API inspection in this task. Existing domains include `biketourfrance.net` and `www.biketourfrance.net`; assume a main push can affect the public site.
- No push to main, public deployment, DNS change, Pages setting change, domain-routing change, secret change, Framer work, or Wrangler direct upload without separate explicit owner approval. The owner’s explicit “publish it” instruction authorizes this validated CDM Photo Gallery release through GitHub/main to the existing btf-production project. Preserve DNS, Pages settings, live-domain routing, secrets and build commands.

## Copy and assets

- Copy authority: Google Sheet `BTF_Approved_Site_Copy` (`1vzlhoekeVcx437ajMMFU--1kIrE7DfKYvi8rKhlE9aw`), named tab `Approved Site Copy`. The CDM Status Successor Sheet is not this website's authority.
- All new visitor-facing prose, image descriptions, and accessibility labels follow the existing Sheet → fixture/field manifest → generated `src/data/approved-copy.ts` workflow. Never weaken the approved-copy gate. Mark new unreviewed copy yellow; a validation pass does not certify owner approval.
- Preserve source photos unchanged. No deployed symlinks to mounted volumes. Retain originals in managed source assets before making optimized derivatives.
- For CDM Photo Gallery, use every distinct image content once across the whole section. Exact file SHA-256 and orientation-normalized RGB pixel duplicates are assigned to the first collection in input order (CDM1, then CDM2); record every excluded duplicate and its retained equivalent. Do not curate other photos.
- Follow existing site typography, colors, responsive behavior, header/footer, focus styles, and Astro image delivery. The owner's gallery requirement overrides the old square-crop convention for these new pages: preserve aspect ratios, vary widths in a justified or masonry layout, and provide accessible image navigation.
- Git holds native source, managed photo originals/derivatives, lockfiles, and technical docs. Drive holds source assets, reviews, briefs, and handoffs. Never upload secrets, dependencies, caches, builds, Git metadata, or preservation archives to Drive.
- Drive migration folder remains `BTF_Migration` (`1XmvuhM_iyMbZWPf5qH1TqvaHmtaCMW2R`); approved Sheet remains unmoved.

## Validation and history

- Run canonical-root, Astro checks, build, approved-copy validation/rendered checks and regression tests, and live-Sheet predeploy verification before a copy-affecting commit. Verify galleries visually and interactively at desktop/tablet/phone sizes, including counts, uniqueness, links/images, lazy loading/dimensions, keyboard and focus behavior.
- Append meaningful progress to `docs/BUILD_LOG.md` and `/Users/jkbrookspersonal/JBLocalBuildLogs/00_GENERAL_BUILDLOG.md`.
- Consult and append material system dependencies/warnings to `/Users/jkbrookspersonal/LocalSiteBuildFiles/00_A.SYSTEMS_CHANGES_REGISTER/SYSTEM_CHANGES_REGISTER.md`; never replace its history or record secrets.
- Every ten interactions, review this file and existing `AGENTS.md`, `AGENTS.override.md`, `CLAUDE.md`, and `GEMINI.md` wrappers. Update this canonical file first if needed and log the update in both build logs. Do not create unused wrappers.
- Report actual counts, exceptions, before/after commits, changed files, validation evidence, preview state, rollback, and deployment boundaries. A build alone is not completion.
