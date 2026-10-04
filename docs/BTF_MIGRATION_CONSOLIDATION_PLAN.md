# BTF Native Astro Migration — Reversible Consolidation Plan

Status: PLANNING ONLY — 2026-10-04. This plan creates no authorization for Git, Drive, Cloudflare, GitHub, source, copy-gate, or deployment work.

## Execution outcome — 2026-10-04

Approved execution completed the local and Drive consolidation. The active root is now `/Users/jkbrookspersonal/LocalSiteBuildFiles/00_BTF_MAIN_SITE_CLOUDFLARE_ROOT`, a standalone clone on `rebuild/2026-10-02-audit-remediation` at `d394f730e8c65b2d263a29c8dd0d2ac29c91fa3c`. Former native, wrapper, stale, and scaffold roots are retained under `99_ARCHIVE/BTF_MIGRATION_2026-10-04`; no source was merged from wrapper/Framer material.

`BTF_Migration` was created under `BTF_Website`; the approved-copy Sheet remains unmoved. Native `npm run build` and `npm run check` passed. The old verifier/copy gate remains inactive and fails against its stale snapshot; this is not a deployment authorization.

## Target structure

| Role | Target | Status |
|---|---|---|
| Sole active local build root | `/Users/jkbrookspersonal/LocalSiteBuildFiles/00_BTF_MAIN_SITE_CLOUDFLARE_ROOT` | Approved destination; **not yet native** |
| Active development branch | `rebuild/2026-10-02-audit-remediation` | PROVEN source branch at `d394f730e8c65b2d263a29c8dd0d2ac29c91fa3c` |
| GitHub repository | `jkbrooks1/biketourfrance` / `https://github.com/jkbrooks1/biketourfrance.git` | PROVEN |
| Pages relationship | `temp-btf`; production branch `main` | PROVEN from Pages deployment history; production cutover unapproved |
| BTF Drive operational home | `04_BikeTourFrance.net.GD-BTF` (`1B1CmJmIxcESa7oxhXJKsLx12sy34xOlo`) > `BTF_Website` (`1azP1B1_ybQHS6Rtxn0R1W8ZELwFl8_wq`) > proposed `BTF_Migration` | Parent and existing access PROVEN; folder creation pending approval |
| Approved-copy authority | `BTF_Approved_Site_Copy` (`1vzlhoekeVcx437ajMMFU--1kIrE7DfKYvi8rKhlE9aw`) under `OO_BTF_GOOG_SITE_ROOT` (`1-acJrUL2VjIndc0yAXP96vBz5HebH01U`) | PROVEN; keep in place |

## Source-of-truth map

| Authority | Holds |
|---|---|
| Git | Native Astro code, optimized runtime assets, lockfiles, config, validation scripts, technical documentation. |
| Drive | Editorial source, original photographs, reviews, briefs, and shareable operational deliverables. Original assets map to Git derivatives through a future asset register containing Drive file ID, source filename, Git derivative path, transform/version, and checksum. |
| Local secure storage | Credentials, tokens, environment files, and service-account material. Never commit, archive in the proof ZIP, or copy to Drive. |
| Local proof archive | Detailed technical evidence, preservation manifests, and sanitized handoff ZIPs. |

The Google Sheet is authoritative for approved copy. Git snapshots, fixtures, generated exports, field manifests, and rendered content are derived technical artifacts. This plan does not activate or repair the gate.

Naming rule for future execution: use lowercase `docs/` and `copy/` only. The wrapper’s uppercase `DOCS/` and `COPY/` remain in its archive until manual review. This avoids case-insensitive local ambiguity and case-sensitive deployment failures.

## Ordered execution plan

1. **Freeze and identify live processes.** Exact targets: both worktrees and `/Users/jkbrookspersonal/btf-migration`. Operation: stop or wait for any build, editor process, Git client, or automation using them; collect `ps`/open-file evidence without killing anything unless separately approved. Prerequisite: owner approval and a clean activity record. Verify no active process uses either Git directory. Rollback: no state change. Approval: required.
2. **Create immutable preservation set before Git changes.** Source: every manifest entry and relevant Git refs from each checkout. Operation: copy unique uncommitted/untracked/ignored material into a new dated, access-restricted local archive; create a Git bundle containing all refs plus `git fsck` evidence. Prerequisite: per-file manifest hashes and a secret scan that records presence only. Verify archive hashes, restore test into a separate empty location, and bundle ref list. Rollback: retain original trees unchanged and discard only verified duplicate archive copies. Approval: required.
3. **Capture Git metadata and recovery points.** Source: target main repository `.git`, linked-worktree administrative directory, native worktree `.git` file, and stale checkout refs. Operation: record `git worktree list --porcelain`, all refs, remotes, config names excluding values, and a worktree-aware recovery procedure. Prerequisite: step 2 backup acceptance. Verify the linked native path and target metadata resolve before action. Rollback: restore the Git metadata archive and use its recorded worktree repair commands only in the approved execution run. Approval: required.
4. **Preserve the wrapper checkout as a separate archive, not a merge source.** Source: target root’s `rebuild/initial` worktree and `/Users/jkbrookspersonal/btf-migration`. Operation: retain each in dated read-only archive/checkout locations after their unique local material is safely captured. Do not merge `site/`, `overrides/`, or Framer render code into native `src/`. Prerequisite: step 2 comparisons and owner sign-off on dispositions. Verify archived checkouts resolve at their recorded commits. Rollback: reactivate the archived checkout by a Git-aware worktree add/clone; do not reuse it as active source. Approval: required.
5. **Make the target root the native branch using Git-aware worktree operations.** Exact destination: `/Users/jkbrookspersonal/LocalSiteBuildFiles/00_BTF_MAIN_SITE_CLOUDFLARE_ROOT`. Operation: after the target branch is vacated and backed up, remove/register worktrees through Git commands, then create the native branch worktree at the target. Do not use Finder or `mv` to relocate either current worktree. Prerequisite: steps 1–4; no unpreserved local edits; verified Git metadata recovery copy. Verify target has branch `rebuild/2026-10-02-audit-remediation`, expected full SHA or approved successor SHA, `origin`, and `git worktree list` shows no retired-path dependency. Rollback: re-add the saved wrapper worktree at a new archive path and reconstruct native worktree at its pre-change path from bundle/archive.
6. **Restore only accepted native local work.** Source: preservation archive items selected for native use. Operation: restore the native `docs/BUILD_LOG.md`, proof image, and planning records; retain wrapper-only files separately pending manual content review. Prerequisite: a signed disposition table. Verify hashes against the manifest and review no `DOCS`/`COPY` case collision exists. Rollback: restore preserved copies and leave Git clean. Approval: required.
7. **Create the Drive operational folder without moving authorities.** Exact destination: `BTF_Website` (`1azP1B1_ybQHS6Rtxn0R1W8ZELwFl8_wq`) > `BTF_Migration`. Operation: create one folder, preserve existing access, and create only lean operational subfolders if needed: `Source Assets`, `Reviews and Briefs`, and `Handoffs`. Keep `BTF_Approved_Site_Copy` in `OO_BTF_GOOG_SITE_ROOT`; add a stable link/reference rather than move or duplicate it. Prerequisite: Drive permissions/custody readback and owner approval. Verify folder IDs, parent, custody, and unchanged sharing. Rollback: delete only the empty newly created folder if explicitly approved; otherwise leave it.
8. **Add final-root controls and update references.** Target: final native root. Operation: create/approve final `AGENTS.md`; update only known BTF project references from old paths in project docs, local workspace configuration, and documented launch commands. It must name sole root/branch, repository, Pages relation, Drive IDs, logs/register, approved Git build route, no Framer-account work, retired checkout prohibition, secret/backups/proof rules, and separate cutover approval. Prerequisite: final-path acceptance. Verify path-reference search limited to project files; validate no broken reference to retired paths. Rollback: restore archived pre-edit docs.
9. **Independent acceptance verification.** Source: a fresh isolated clone/worktree from the recorded final ref. Operation: install from lockfile and run check/build/verification only after explicit execution approval. Do not deploy or create a Pages preview. Verify native routes/components/layouts/assets/global CSS, no served Framer export, case-path safety, absence of tracked secrets, Drive IDs, and Pages branch evidence. Rollback: no production action; preserve results in the proof archive. Approval: required for the local build; a Pages preview requires separate approval.
10. **Retire duplicate roots only after acceptance.** Source: old worktree, stale checkout, and scaffold. Operation: label them as inactive in their archived handoffs; retain recoverable archives for an owner-defined period. Do not delete. Prerequisite: all acceptance tests pass and owner accepts. Verify no editor/automation points at them. Rollback: reactivate from archived Git checkout/bundle. Approval: separate approval before any deletion, even after retention.

## Required post-execution acceptance tests

- Target path, branch, full SHA, `origin`, common Git directory and worktree health are proven from fresh commands.
- No active worktree or `.git` file references a retired wrapper directory.
- Every manifest item is present in its accepted destination or archive with matching checksum; ignored source exports have a verified preservation inventory.
- The complete native Astro route set, components, `BaseLayout.astro`, `src/styles/global.css`, assets, config and lockfile are present; `site/` cannot be served by the Astro configuration.
- Git has no tracked secret; secret findings contain no values.
- An isolated verification worktree reproduces install/build from lockfile using recorded Node/npm versions.
- Case-conflict and stale absolute-path checks pass.
- Exactly one Drive operational folder exists under the verified BTF Website home with stable IDs and intended existing access; the approved-copy Sheet remains authoritative and unmoved.
- Read-only Pages evidence still identifies `temp-btf`, `jkbrooks1/biketourfrance`, and production branch `main`.
- No deployment, Pages preview, Cloudflare, GitHub, Drive-sharing, DNS, or production setting was changed.

## Known reference updates to plan, not apply

- `docs/BUILD_LOG.md` in both native and wrapper trees still names the former `00_BTF_MAIN_SITE_ROOT_ON_CLOUDFLARE` path.
- Wrapper `DOCS/v02_WAITLIST_BUILDOUT_PROOF.md` names the former path and notes its prior worktree repair.
- Wrapper `DOCS/BUILD_AND_DEPLOY_RUNBOOK.md` names the target as canonical while its checkout is still wrapper-based.
- The native worktree’s `.git` pointer and the target’s `.git/worktrees/00_BTF_AUDIT_REMEDIATION_WORKTREE/gitdir` are expected current dependencies that must change only through Git-aware operations.
