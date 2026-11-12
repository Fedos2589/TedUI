# ted-ui

The Ted design system. It is not published to npm: an app installs it straight from
this repository by git tag. The kit's only consumer is
[BookedUp-front](https://github.com/Fedos2589/BookedUp-front) (React + Vite).

The package ships source (`.tsx` + `.module.scss`), with no build step. The app
compiles it itself; in BookedUp-front that is Vite.

## Installation

The package is installed from the public repository [Fedos2589/TedUI](https://github.com/Fedos2589/TedUI)
by version tag:

```bash
npm install github:Fedos2589/TedUI#v0.1.0
```

The app's `package.json` gets `"ted-ui": "github:Fedos2589/TedUI#v0.1.0"`.
Without a tag npm installs the current `main` — don't: the kit version in the app would
then depend on when `npm install` happened to run.

After that the app is configured once: `vite-plugin-svgr` for `*.svg`,
`optimizeDeps` for the kit's sources, `sass`, `ted-ui/tokens.scss`, the Montserrat font,
`registerUIKitTranslations(i18n)`, `ToastProvider` and the base resets. What exactly
and why is in the table [“Setup an app needs once”](docs/agents/usage.md#setup-an-app-needs-once).

Imports go by file path, with no barrel: `ted-ui/Button/Button`,
`ted-ui/colors`, `ted-ui/tokens.scss`.

### Dependencies on the app side

Everything the kit needs at runtime it pulls in itself — except `dayjs`: only
`DatePicker` needs it, and it sits in `peerDependencies` as optional. An app that uses
the picker has to install it (`npm i dayjs`) and import the component by its folder
path (`ted-ui/DatePicker`) — it is deliberately not exported from the root `index.tsx`,
otherwise an app without dayjs would break on any import from the root. Details for
agents are in [`docs/agents/usage.md`](docs/agents/usage.md).

## Release

1. Changes land in `main` through a PR.
2. Bump `version` in `package.json`, tag `vX.Y.Z` and push the tag.
3. In BookedUp-front change the tag in the dependency and run `npm install ted-ui`
   so that `package-lock.json` is updated.

## Developing together with the app

```bash
git clone https://github.com/Fedos2589/TedUI.git   # next to BookedUp-front
# in BookedUp-front
npm install --no-save --install-links ../TedUI
```

`--install-links` copies the kit into the app's `node_modules` instead of symlinking
it, so the kit's files take `react`, `react-i18next` and `i18next` from the app. With
`npm link` they pick up the copies from the kit's clone — “Invalid hook call” and keys
instead of texts. Repeat the command after every change in the kit. `--no-save` leaves
`package.json` and the lockfile alone; to go back to the tagged version run `npm ci`
in the app.

## Commands

- `npm run storybook` — Storybook on :6007
- `npm run typecheck` — tsgo
- `npm run lint` — ESLint (+ prettier)

## Rules for agents

- [`AGENTS.md`](AGENTS.md) — for those who edit the kit itself (Claude Code reads it
  through `CLAUDE.md`). Decoupling from the app, component anatomy, styles,
  breakpoints, strings, accessibility, dependencies, releasing.
- `.claude/skills/` — step-by-step procedures for those rules: `add-component` (a new
  component or variant) and `release` (version, tag and updating the kit in
  BookedUp-front).
- [`docs/agents/usage.md`](docs/agents/usage.md) — for agents in an app that uses the
  kit. The file ships inside the package; BookedUp-front pulls it in with the line
  `@node_modules/ted-ui/docs/agents/usage.md` in its `AGENTS.md`, so the rules always
  match the installed kit version.
