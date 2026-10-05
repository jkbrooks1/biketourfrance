# Owner staging project — pending branch alignment

Prepared 2026-10-05T22:04:52Z. No Cloudflare write or deployment was executed.

Owner staging address: https://btf-production.pages.dev
Project: btf-production; account: 84f228323707bc1d08ba30d9f76146be.

The stable host is bound to the old remediation branch. Current main is a successful preview.

## Exact proposed changes

1. Re-read project and main HEAD, confirming no newer conflicting change.
2. Confirm successful live-Sheet predeploy and GitHub CI for the main commit to publish. Current verified commit is 53d3ef64afeb2bb18c3db168aa2c7a6c19bbaedc; CI run 37379113260 passed.
3. PATCH https://api.cloudflare.com/client/v4/accounts/84f228323707bc1d08ba30d9f76146be/pages/projects/btf-production with project-update.pending.json. It changes only the two production-branch settings to main.
4. Read back both branch settings and compare preserved build/source/deployment controls with projects-before.json.
5. If a current main production deployment was not already triggered, POST one Git-connected build to the project's /deployments endpoint with branch=main. No direct upload.
6. Wait for that deployment once; stop on failure. Verify production environment, main commit SHA and canonical deployment.
7. Verify updated copy at the stable staging host, including Tours/CDM and the exact self-guided CTA. Reconcile active project guidance/metadata and required logs with this target.

Build command stays npx astro build; output stays dist; root stays .; Git source stays jkbrooks1/biketourfrance. No DNS, custom-domain, live-domain, Sheet, credential, or temp-btf change is proposed.

## Rollback

Reconcile newer changes first. Apply project-rollback.json to restore both old branch settings. The prior production deployment is 60497f41-bb17-4277-9429-b4cad3686c05 (commit a6b0ed2beef5f1358e912132880ddc2196a2a910); use its production rollback if needed and verify stable-host content. Preserve all newer deployments and history.

## Approval requirement

Active root AGENTS.md explicitly says: “Do not change Pages settings, DNS, or the live domain without separate approval.” The owner corrected the intended staging address; approval for this concrete Pages setting change and Git-connected rebuild remains pending.
