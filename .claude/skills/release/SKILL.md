---
name: release
description: Use when releasing the kit after an MR merged into main, or when updating a consumer app (web) to a new kit version — choosing the semver bump, the version commit and tag, and the bump in the app's package.json and lockfile. Triggers include "release the kit", "выпусти кит", "поставь тег", "обнови кит в web", "bump ui-kit".
---

# Releasing the kit and updating consumers

Apps install the kit from this repo by tag — web pins
`"ted-ui": "github:Fedos2589/TedUI#vX.Y.Z"`. Nothing merged into `main`
reaches an app until it is tagged **and** the app bumps the tag.

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

| What changed since `LAST` | Bump |
|---|---|
| a file renamed, moved or deleted; a prop removed or renamed; a default changed; a union value removed; a new required peer dependency | **major** |
| a new component, variant, colorScheme, size, prop, hook, util, token, locale key | minor |
| fixes only — styles, behaviour, a11y attributes, translations | patch |

File paths are public API: web deep-imports `ted-ui/<Folder>/<File>`, so any
rename under a component folder is a major even when no export changed. For a major,
grep the consumers for the old paths before releasing, so the bump MR in each app is
ready to fix them:

```bash
grep -rn "ted-ui/<OldPath>" ~/developement/intch/web/{src,components,pages,_system}
```

Show the commits, the proposed version and the reason, and **wait for the user to
confirm** before writing anything.

## 3. Kit: commit, tag, push

```bash
npm version X.Y.Z --no-git-tag-version   # package.json + package-lock.json
git add package.json package-lock.json
git commit -m "chore: X.Y.Z"
```

`main` is protected: only Maintainers push to it. A Maintainer pushes the version
commit straight onto `main` (`git push origin main`), as previous releases did
(`chore: 0.5.0`). A Developer gets `pre-receive hook declined` — push the commit to a
`release/X.Y.Z` branch, open an MR into `main`, and tag only after it merges.

Tag the commit that is on `origin/main` — after an MR merge, `git pull --ff-only`
first:

```bash
git tag vX.Y.Z
git push origin vX.Y.Z
```

Tags are lightweight, `v` + the version. Never move or re-push an existing tag: apps'
lockfiles pin the commit behind it, and a moved tag gives two machines two different
kits under one version.

## 4. Consumer (web): bump the tag

In the app repo (`~/developement/intch/web`), on the feature branch of the change that
needs the new kit — or on its own branch if the bump is the whole task (web's branch
prefixes drive its CI: `feature/b2c/…` or `feature/b2b/…`):

```bash
# package.json: "ted-ui": "github:Fedos2589/TedUI#vX.Y.Z"
npm install
grep -A3 '"node_modules/ted-ui"' package-lock.json   # resolved …#<sha>
git -C ../TedUI rev-list -n1 vX.Y.Z                         # must be the same sha
```

Then run what web's CI runs:

```bash
npm run typecheck
npm run test:unit
npm run lint:ci
npm run i18n:check     # checks web's ui-kit keys against the installed kit's locales
```

Commit `package.json` and `package-lock.json` **together with** the web change that uses
the new kit — web keeps one commit per task.

## 5. Consumer agents: reload the rules

web's `CLAUDE.md` imports `node_modules/ted-ui/docs/agents/usage.md`, so the kit
rules an agent sees are those of the kit that was installed when its session started.
After a bump, `npm ci` and restart the session before writing UI code; web's
SessionStart hook warns when the installed kit doesn't match `package.json`.

## Red flags

- Tagging something that isn't on `origin/main`, or tagging before the MR merged.
- `package.json` version and the tag disagree.
- A rename shipped as a minor or a patch.
- `npm link` or edits in `node_modules/ted-ui` instead of a tag bump.
- Bumping web's `package.json` without the regenerated `package-lock.json`.
- Moving, deleting or force-pushing an existing tag.
