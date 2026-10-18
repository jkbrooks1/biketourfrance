# Canonical-root guard (`npm run canonical:check`)

Implementation: `scripts/assert-canonical-root.mjs`. Marker: `.btf-canonical-root.json` (canonical local root, GitHub remote, development and production branches).

## Default behavior (unchanged)

- In a CI environment (`CI`, `GITHUB_ACTIONS`, `GITLAB_CI`, `BUILDKITE`, or `CF_PAGES` set), the local-root comparison is skipped, as before.
- Locally, the current directory must be the canonical checkout named in the marker. Otherwise the guard fails with `Wrong local root`.
- Native structure, Framer-wrapper, origin-remote, and branch checks apply in every mode.

## Release-worktree mode (explicit opt-in)

Set `BTF_RELEASE_WORKTREE` to the absolute path of the release worktree, and run the command from that same directory:

```
BTF_RELEASE_WORKTREE=/absolute/path/to/worktree npm run canonical:check
```

The opt-in alone is never accepted. The guard also requires all of the following for the current directory:

1. The path in `BTF_RELEASE_WORKTREE` resolves to the current directory.
2. The current directory is not the canonical checkout.
3. `.git` is a worktree pointer file, not a directory. This rejects copied folders and separate clones.
4. The worktree's Git common directory is the canonical repository's common directory (both resolved to real paths).
5. The worktree's metadata directory is under that common directory's `worktrees/` folder, and it is not the main working tree.
6. `git worktree list --porcelain` run in the canonical checkout lists this exact directory, and the entry is not prunable.
7. The origin URL matches the marker's GitHub remote.
8. The checked-out commit and branch match the registered worktree entry.
9. The working tree is clean.
10. The branch is `feature/*` (validation branch), or the marker's development branch with HEAD equal to `origin/main`.

On success the guard prints the accepted worktree, common repository, branch, and SHA:

```
canonical-root: PASS (release worktree) worktree=<path> common=<path> branch=<name> sha=<sha>
```

## What the mode does not do

- It adds no skip flag and no unconditional success.
- It does not change the marker, global Git configuration, or any other check.
- It does not relocate or replace the canonical checkout.

## Full production gate

`npm run predeploy:approved-copy` runs `canonical:check` inside `verify`. To run the full gate from a release worktree, export the opt-in for that shell:

```
cd /absolute/path/to/worktree
export BTF_RELEASE_WORKTREE=/absolute/path/to/worktree
BTF_DEPLOY_ENV=production npm run predeploy:approved-copy
```

Run `npm run copy:test` before the gate. Its rendered check overwrites shared `.copy/` artifacts with fixture values (see the system register WARNING for 20261017-BTFSITETES-007).

## Qualification tests

`npm run guard:test` runs `scripts/guard/assert-canonical-root.test.mjs`. It builds temporary fixtures and checks: default rejection, explicit rejection of a plain directory, a copied folder, and an unrelated repository, rejection without opt-in, spoofed opt-in, acceptance of a registered release worktree, rejection of uncommitted changes, the branch check in default mode, and the default canonical pass.

## Rollback

Revert the commit that added this mode (`git revert <sha>` on `main`). Default behavior is unchanged by this mode, so reverting it only removes the opt-in.
