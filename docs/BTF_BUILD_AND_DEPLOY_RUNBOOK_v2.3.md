# Historical BikeTourFrance.net Build & Deployment Runbook v2.2

Superseded on 2026-10-06 by `docs/BUILD_AND_DEPLOY_RUNBOOK.md`, reconciled with read-only current deployment facts under owner authorization. The branch-alignment and Framer-hosting statements below are historical. Do not execute them as current operational instructions.

**Status:** Operational reference  
**Last updated:** 2026-10-05  
**Applies to:** Native Astro rebuild deployed through GitHub to Cloudflare Pages  
**Canonical project root:** `/Users/jkbrookspersonal/LocalSiteBuildFiles/00_BTF_MAIN_SITE_CLOUDFLARE_ROOT`

## 1. Purpose and Scope

This runbook defines the controlled process for changing, validating, deploying, and verifying the native Astro version of `biketourfrance.net`.

It covers local source changes, approved-site-copy changes, GitHub validation, Cloudflare Pages staging deployment, production-cutover preparation, audit logging, and rollback.

The public domains `biketourfrance.net` and `www.biketourfrance.net` remain on Framer until an explicit owner-approved DNS cutover. A Cloudflare Pages deployment alone does not change either public domain.

## 2. Authoritative Systems

| Area | Authority | Rule |
| --- | --- | --- |
| Local source root | `/Users/jkbrookspersonal/LocalSiteBuildFiles/00_BTF_MAIN_SITE_CLOUDFLARE_ROOT` | Work only from this root. Ignore retired paths containing `ROOT_ON_CLOUDFLARE`. |
| Git repository | `https://github.com/jkbrooks1/biketourfrance.git` | `main` is the current deployment branch. |
| Framework | Native Astro | Do not use Framer as a source for new work. |
| Visible-copy authority | Google Sheet `BTF_Approved_Site_Copy`, tab `Approved Site Copy` | Single content authority. |
| Generated copy | `src/data/approved-copy.ts` | This committed file is what Pages builds. |
| Staging deployment | Cloudflare Pages project `btf-production` at `https://btf-production.pages.dev` | Git-driven deployment only; do not deploy with Wrangler. |
| Copy gate | `.github/workflows/approved-copy-check.yml` | Validates the live Sheet; it does not deploy. |
| Project log | `docs/BUILD_LOG.md` | Append-only project record. |
| General log | `/Users/jkbrookspersonal/JBLocalBuildLogs/00_GENERAL_BUILDLOG.md` | Append-only cross-project record. |
| Systems register | `/Users/jkbrookspersonal/LocalSiteBuildFiles/00_A.SYSTEMS_CHANGES_REGISTER/SYSTEM_CHANGES_REGISTER.md` | Record material system changes, risks, dependencies, and rollback information. |

## 3. Deployment Architecture

The diagram below is the intended staging flow after the branch alignment described in section 10.

```text
Approved Site Copy Sheet
        │
        ├── Local and CI copy validation and generation
        │       └── src/data/approved-copy.ts
        │
        └── Git commit to main
                │
                ├── GitHub Actions: validates the approved-copy gate
                └── Cloudflare Pages: runs npx astro build
                        └── https://btf-production.pages.dev
```

### Critical distinction

Cloudflare Pages runs `npx astro build`. It builds from committed `src/data/approved-copy.ts`; it does not read the Google Sheet and it does not run the approved-copy gate.

A Sheet edit is therefore not deployable until the generated TypeScript copy file is regenerated from the live Sheet, verified, committed, and pushed. This is the current documented architecture.

## 4. Approved-Copy Model

### 4.1 Synchronized sources

The following must remain aligned:

1. The live Google Sheet tab `Approved Site Copy`.
2. `copy/fixture/fixture-rows.json`.
3. `copy/field-manifest.json`.

`src/data/approved-copy.ts` is generated output. Regenerate it from the live Sheet before a deployment commit.

### 4.2 Generated interfaces

`scripts/copy/generate-ts.mjs` generates:

- `COPY`: structured fields used by the application.
- `TEXT`: every approved Sheet field keyed by its exact Sheet path.

Examples:

```ts
COPY.notFound.heading
TEXT['/tours/heading_1']
```

### 4.3 Gate behavior

The rendered-copy gate checks both directions:

1. **Sheet to page:** required fields, page titles, and metadata must render on their intended route.
2. **Page to Sheet:** rendered copy must be supplied by approved fields, except for the deliberately narrow allow-list.

Do not weaken, delete, or broaden the rendered-copy check to make a build pass. If the page needs new copy, add an approved field through the Sheet, fixture, and manifest workflow.

### 4.4 Field count

Do not state a permanent field count in this runbook. It is controlled data that can change with approved fields. The current successful `npm run predeploy:approved-copy` output is the authoritative count check.

## 5. Local Prerequisites

Confirm the current toolchain and repository state before editing:

```bash
cd "/Users/jkbrookspersonal/LocalSiteBuildFiles/00_BTF_MAIN_SITE_CLOUDFLARE_ROOT"
node --version
git status --short --branch
```

Use the Node version required by the committed project configuration and the Pages build environment. At the 2026-10-05 handoff, the verified local toolchain was Node `v24.14.1` and npm `11.17.0`; verify again before work because versions can change.

Install dependencies when needed:

```bash
cd "/Users/jkbrookspersonal/LocalSiteBuildFiles/00_BTF_MAIN_SITE_CLOUDFLARE_ROOT"
npm install
```

## 6. Normal Change Workflow

### 6.1 Branch from current main

```bash
cd "/Users/jkbrookspersonal/LocalSiteBuildFiles/00_BTF_MAIN_SITE_CLOUDFLARE_ROOT"
git switch main
git pull --ff-only origin main
git switch -c "feature/descriptive-change-name"
```

Use a descriptive branch name. Do not revive retired remediation branches without owner direction.

### 6.2 Change rules

- Put visible text in the approved Sheet, not in generator code or scattered page literals.
- Keep the Sheet, fixture, and manifest aligned when adding or removing a copy field.
- Do not add copy text to `scripts/copy/generate-ts.mjs`.
- Do not use unsafe quote-scanning codemods across `.ts` or `.astro` files.
- Never place `John Brooks` or `john@biketourfrance.net` in source, approved copy, or built output. Use `John` and `contact@biketourfrance.net` where appropriate.

### 6.3 CTA rule

Primary CTA labels must be **42 characters or fewer after HTML entity decoding**. Validate the visible label, not only the source-string length.

## 7. Required Local Validation

Run all commands from the canonical root before committing:

```bash
cd "/Users/jkbrookspersonal/LocalSiteBuildFiles/00_BTF_MAIN_SITE_CLOUDFLARE_ROOT"
npm run check
npm run canonical:check
npm run verify
npm run copy:test
```

Expected results:

- `npm run check`: zero errors.
- `npm run canonical:check`: native Astro canonical-root check passes.
- `npm run verify`: rendered-site verification passes for the expected routes.
- `npm run copy:test`: all approved-copy tests pass, including the regression test for unapproved rendered text.

### Fixture-build warning

`npm run build` uses fixture mode and can rewrite `src/data/approved-copy.ts` from `copy/fixture/fixture-rows.json`. It is not sufficient proof that the live Sheet is synchronized and must not be the sole publishing check.

## 8. Live-Sheet Predeploy Gate

Before committing a change that affects generated copy, run:

```bash
cd "/Users/jkbrookspersonal/LocalSiteBuildFiles/00_BTF_MAIN_SITE_CLOUDFLARE_ROOT"
export BTF_COPY_SHEET_ID="1vzlhoekeVcx437ajMMFU--1kIrE7DfKYvi8rKhlE9aw"
npm run predeploy:approved-copy
```

This must complete successfully using the live Sheet. Review the resulting diff and confirm the reported Sheet, fixture, and manifest counts agree.

Then check for prohibited personal information:

```bash
cd "/Users/jkbrookspersonal/LocalSiteBuildFiles/00_BTF_MAIN_SITE_CLOUDFLARE_ROOT"
grep -rl "John Brooks" src/ copy/ dist/ || true
grep -rl "john@biketourfrance.net" src/ copy/ dist/ || true
```

Both commands must print no matching file paths. A match is a stop condition until corrected.

## 9. Commit and Push

Inspect the intended change before staging it:

```bash
cd "/Users/jkbrookspersonal/LocalSiteBuildFiles/00_BTF_MAIN_SITE_CLOUDFLARE_ROOT"
git status --short
git diff --check
git diff -- src/data/approved-copy.ts copy/fixture/fixture-rows.json copy/field-manifest.json
```

Stage only intended files and use a commit message that states the reason for the change:

```bash
cd "/Users/jkbrookspersonal/LocalSiteBuildFiles/00_BTF_MAIN_SITE_CLOUDFLARE_ROOT"
git add "path/to/intended-file"
git commit -m "fix(copy): explain the operational reason"
git push origin main
```

Do not use `git add .` for a controlled deployment. If branch protection or review policy applies, push the feature branch and merge only after approval.

## 10. GitHub and Cloudflare Pages

### GitHub Actions

The `Approved copy check` workflow validates the current live Sheet using configured repository secrets. It is a validation gate and evidence source; it does not deploy the site.

### Cloudflare Pages

The owner-designated staging project is `btf-production`, serving `https://btf-production.pages.dev`. Cloudflare's term **production deployment** means the build attached to this project's stable Pages address; it does not mean the public-domain cutover has happened.

**Current configuration, verified through the Cloudflare API on 2026-10-05T22:04:52Z:**

- Repository: `jkbrooks1/biketourfrance`.
- Both `production_branch` and `source.config.production_branch` are still `rebuild/2026-10-02-audit-remediation`.
- The stable staging address serves deployment `60497f41-bb17-4277-9429-b4cad3686c05`, commit `a6b0ed2beef5f1358e912132880ddc2196a2a910`, from that older branch.
- Current `main` commit `53d3ef64afeb2bb18c3db168aa2c7a6c19bbaedc` built successfully as a **preview** at `https://c438759e.btf-production.pages.dev`, also available at `https://main.btf-production.pages.dev`.
- Build command: `npx astro build`; output: `dist`; root: `.`; production deployments enabled.

**Required alignment, pending separate owner approval:** change both production-branch settings to `main`, then run a Git-connected deployment of current `main` and verify the stable staging address. After alignment:

- a push to `main` updates `btf-production.pages.dev`;
- a push to another branch creates a preview deployment; and
- Pages continues building committed generated copy with `npx astro build`.

The existing `temp-btf` project currently deploys `main`, but it is not the owner's designated staging review address. A green check there does not prove that `btf-production.pages.dev` is current. Existing project guidance and metadata naming `temp-btf` are superseded for staging selection by the owner's correction; reconcile those references with the approved branch alignment. Neither existing project has been changed or removed by this documentation correction.

Do not use Wrangler direct upload for this project. Git-connected and Direct Upload Pages projects are distinct deployment modes.

## 11. Post-Push Verification

After GitHub Actions and the Pages deployment finish:

1. Confirm the `Approved copy check` workflow succeeded.
2. Confirm the `btf-production` Pages deployment for the pushed commit succeeded and is the **production** deployment selected by that project. A successful preview does not update its stable address.
3. Open `https://btf-production.pages.dev`.
4. Test expected routes, navigation, primary CTAs, mail links, WhatsApp links, and enabled form or waitlist actions.
5. Confirm approved copy, page titles, metadata, images, and layout render as expected.
6. Record the commit SHA, workflow result, deployment result, and known exceptions in the project build log.

Do not claim a production-domain release while `biketourfrance.net` still resolves to Framer.

## 12. Production Cutover Prerequisites

Owner-approved cutover requires resolution and documentation of all applicable preflight conditions, including:

- staging owner review;
- approved-copy status;
- DNS and rollback readiness;
- redirects and SEO decisions;
- legal and privacy review;
- accessibility and cross-browser verification;
- critical CTA and form verification; and
- a defined monitoring plan.

Production cutover changes DNS from Framer to the approved Cloudflare Pages deployment. It is separate from a normal staging deployment.

## 13. Rollback

### Staging rollback

Identify the last known-good commit, revert the unwanted commit through Git, and push the revert to `main`. Cloudflare Pages will deploy the reverted committed state.

### DNS rollback after production cutover

Keep the working Framer DNS configuration and the approved Pages deployment identifier before a DNS change. If cutover fails and rollback criteria are met, restore the prior DNS configuration, verify resolution, and record the change in required logs and the systems register.

Never use rollback to conceal an unrecorded change. Preserve the commit, deployment, symptom, corrective action, and proof.

## 14. Required Logging

For material build, deployment, copy-authority, or infrastructure work, append chronological entries to:

1. `docs/BUILD_LOG.md`.
2. `/Users/jkbrookspersonal/JBLocalBuildLogs/00_GENERAL_BUILDLOG.md`.
3. `/Users/jkbrookspersonal/LocalSiteBuildFiles/00_A.SYSTEMS_CHANGES_REGISTER/SYSTEM_CHANGES_REGISTER.md` when the change affects future system behavior, dependencies, risks, rollback, or operations.

Use real UTC timestamps:

```bash
date -u +%Y-%m-%dT%H:%M:%SZ
```

Logs are append-only. Never edit, remove, or reorder older entries. Never put secrets, tokens, private keys, service-account JSON, passwords, or cookies in a log.

## 15. Stop Conditions

Stop and obtain owner direction before changing:

- the Cloudflare Pages build command or secret configuration;
- the committed-generated-copy architecture;
- branch-protection policy;
- owner approval status for newly added Sheet copy;
- DNS records or public domain routing;
- a retired branch or unpushed historical commits; or
- approved-copy data when a source-code reader still exists.

When validation fails, do not bypass it. Preserve the failure output, determine whether the issue is in source, Sheet, fixture, manifest, generated copy, build, or deployment state, correct the source of truth, and rerun the relevant checks.

## 16. Quick Release Checklist

- [ ] Working directory is the canonical BTF root.
- [ ] Git state is understood and no unrelated changes are staged.
- [ ] Copy changes are aligned in the live Sheet, fixture, and manifest.
- [ ] `npm run check` passes.
- [ ] `npm run canonical:check` passes.
- [ ] `npm run verify` passes.
- [ ] `npm run copy:test` passes.
- [ ] `npm run predeploy:approved-copy` passes using the live Sheet.
- [ ] Prohibited personal-information scans return no matches.
- [ ] The diff has been reviewed.
- [ ] Required logs have been appended with real UTC timestamps.
- [ ] The intended commit is pushed through GitHub.
- [ ] GitHub Actions succeeds.
- [ ] Cloudflare Pages succeeds for a `btf-production` production deployment of the intended commit.
- [ ] `https://btf-production.pages.dev` is verified.
