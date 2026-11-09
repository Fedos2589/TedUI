---
name: release
description: Use when releasing the kit after a PR merged into main, or when updating BookedUp-front (the kit's only consumer) to a new kit version — choosing the semver bump, the version commit and tag, and the bump in BookedUp-front's package.json and lockfile. Triggers include "release the kit", "выпусти кит", "поставь тег", "обнови кит в BookedUp", "bump ui-kit".
---

# Releasing the kit and updating BookedUp-front

The kit has one consumer: BookedUp-front (`~/work/BookedUp-front`,
github.com/Fedos2589/BookedUp-front). It installs the kit from this repo by tag —
`"ted-ui": "github:Fedos2589/TedUI#vX.Y.Z"`. Nothing merged into `main` reaches it
until it is tagged **and** BookedUp-front bumps the tag.

## 1. Kit: sync

```bash
git status --porcelain          # must be empty
git switch main
git pull --ff-only              # not a fast-forward → stop, ask
git fetch --tags
```

## 2. Kit: pick the version

```bash
LAST=$(git describe --tags --abbrev=0)
git log --oneline $LAST..main
git diff --stat $LAST..main
```

Nothing since the last tag → nothing to release.

The version is `version` in `package.json`; it must equal `LAST` without the `v`. If it
doesn't, stop and ask — someone tagged by hand.

| What changed since `LAST`                                                                                                             | Bump      |
| ------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| a file renamed, moved or deleted; a prop removed or renamed; a default changed; a union value removed; a new required peer dependency | **major** |
| a new component, variant, colorScheme, size, prop, hook, util, token, locale key                                                      | minor     |
| fixes only — styles, behaviour, a11y attributes, translations                                                                         | patch     |

File paths are public API: BookedUp-front deep-imports `ted-ui/<Folder>/<File>`, so any
rename under a component folder is a major even when no export changed. For a major,
grep BookedUp-front for what changed before releasing, so its bump is ready to fix them:

```bash
grep -rn "ted-ui/<OldPath>" ~/work/BookedUp-front/src
```

Show the commits, the proposed version and the reason, and **wait for the user to
confirm** before writing anything.

## 3. Kit: commit, tag, push

```bash
npm version X.Y.Z --no-git-tag-version   # package.json + package-lock.json
git add package.json package-lock.json
git commit -m "chore: X.Y.Z"
```

Push the version commit to `main` and tag the commit that is on `origin/main` — only
after the user said to push:

```bash
git push origin main
git tag vX.Y.Z
git push origin vX.Y.Z
```

Tags are lightweight, `v` + the version. Never move or re-push an existing tag:
BookedUp-front's lockfile pins the commit behind it, and a moved tag gives two machines
two different kits under one version.

## 4. BookedUp-front: bump the tag

In `~/work/BookedUp-front`, on the branch of the change that needs the new kit — or on
its own branch if the bump is the whole task:

```bash
# package.json: "ted-ui": "github:Fedos2589/TedUI#vX.Y.Z"
npm install
grep -A3 '"node_modules/ted-ui"' package-lock.json   # resolved …#<sha>
git -C ../ted-ui rev-list -n1 vX.Y.Z                 # must be the same sha
```

Then run its checks:

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e   # dev server: catches kit imports Vite didn't pre-bundle
```

If the kit now imports a package it didn't before, add it to `optimizeDeps.include` in
BookedUp-front's `vite.config.ts` — `test:e2e` fails on it, `build` doesn't.

Commit `package.json` and `package-lock.json` **together with** the change that uses the
new kit.

## 5. BookedUp-front agents: reload the rules

BookedUp-front's `AGENTS.md` imports `node_modules/ted-ui/docs/agents/usage.md`, so the
kit rules an agent sees are those of the kit installed when its session started. After
a bump, `npm ci` and restart the session before writing UI code.

## Red flags

- Tagging something that isn't on `origin/main`, or tagging before the PR merged.
- `package.json` version and the tag disagree.
- A rename shipped as a minor or a patch.
- `npm link` or edits in `node_modules/ted-ui` instead of a tag bump.
- Bumping BookedUp-front's `package.json` without the regenerated `package-lock.json`.
- Moving, deleting or force-pushing an existing tag.
