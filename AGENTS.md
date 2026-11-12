If you are an agent working in a repo that **uses** the kit, you want
[`docs/agents/usage.md`](docs/agents/usage.md) instead.

This file is the rules. The step-by-step procedures that apply them live next to it —
read the matching one before starting:

| When you're…                                                        | Read                                                                             |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| adding a component, or a variant / size / colorScheme / prop to one | [`.claude/skills/add-component/SKILL.md`](.claude/skills/add-component/SKILL.md) |
| writing SCSS, colors, breakpoints, typography                       | [`.claude/skills/kit-styles/SKILL.md`](.claude/skills/kit-styles/SKILL.md)       |
| rendering text / adding an i18n key                                 | [`.claude/skills/kit-text/SKILL.md`](.claude/skills/kit-text/SKILL.md)           |
| anything interactive, or accessibility work                         | [`.claude/skills/kit-a11y/SKILL.md`](.claude/skills/kit-a11y/SKILL.md)           |
| writing a test                                                      | [`.claude/skills/kit-tests/SKILL.md`](.claude/skills/kit-tests/SKILL.md)         |
| releasing a new version, or bumping the kit in BookedUp-front       | [`.claude/skills/release/SKILL.md`](.claude/skills/release/SKILL.md)             |

## How the package is shipped

- **The only consumer is BookedUp-front** (React + Vite, github.com/Fedos2589/BookedUp-front).
  "Consumer" below means it.
- **Source, not a build.** `main` is `./index.tsx`; the consumer compiles `.tsx` and
  `.module.scss` itself (Vite, see `docs/agents/usage.md`). There is no `dist/`, no bundler
  config, no `exports` map — adding an `exports` map breaks every deep import
  (`ted-ui/Button/Button`), because bundlers stop resolving extensions and
  `index` files through it.
- **File paths are public API.** Consumers import `ted-ui/<Component>` and
  `ted-ui/<Component>/<File>`. Renaming or moving a file is a breaking change for
  them even if no export changed — treat it like one (see Releasing).
- **What ships** is decided by `.npmignore`: Storybook, stories, lint and CI
  configs stay out, and so do this file and `CLAUDE.md` (in a consumer's
  `node_modules` they would hand kit-editing rules to an agent that only uses the kit).
  `docs/` ships on purpose — consumers' agents read
  `node_modules/ted-ui/docs/agents/usage.md`.

## The kit knows nothing about its consumers

Never import from an app: no `@/…` paths, no `@mui/*`, `@emotion/*`, `next/*`, no app
stores, API clients, analytics or routes. The kit has no `@/*` tsconfig paths, so such an
import fails `npm run typecheck` here. One kind of coupling fails nothing:

- **A string `className`** that names a class some app declares globally
  (`className="lineThrough"`). It compiles, and in the app that happens to have that
  global class it even looks right; everywhere else the style silently disappears. Every
  class a component renders comes from its own `*.module.scss`.

These must stay empty before you finish:

```bash
grep -rE "from '@/(src|components|assets|styles)" --include='*.ts*' --include='*.scss' . --exclude-dir=node_modules
grep -rE "from '(@mui|@emotion|next)/" --include='*.ts*' . --exclude-dir=node_modules
grep -rE "@(use|import) '@/styles" --include='*.scss' . --exclude-dir=node_modules
grep -rnE 'className=\{?"[^"]+"' --include='*.tsx' . --exclude-dir=node_modules | grep -v '.stories.'
```

When a component needs something from the outside, **invert it**: take a prop or a
callback (`onSubmit`, `onAnalytics`, `getRouteUrl`, `currentLanguage`), or accept a
`ReactNode` slot. Hooks and pure utils the kit needs live in `_internal/hooks`,
`_internal/utils` (private) or `hooks/`, `utils/` (public).

## Anatomy of a component

```
Button/
  Button.tsx            the component
  Button.module.scss    its styles, and only its styles
  Button.stories.tsx    required — see below
  index.tsx             re-export; the public entry `ted-ui/Button`
```

The per-folder `index.tsx` is the package's public entry point, not a "barrel" in the
consumer-app sense: keep it to re-exports of that folder. Imports **inside** the kit are
relative (`../Spinner/Spinner`), never through the package name and never through the
root `index.tsx` — the root index pulls in every component, and a cycle through it
breaks the build in consumers that don't import it.

**Props.**

- Visual choices are explicit string unions with a default: `variant`, `colorScheme`,
  `size` (see `Button`: `variant?: 'solid' | 'ghost'`, `colorScheme?: 'black' | …`,
  `size?: 'small' | 'medium' | 'large'`). Not booleans like `primary`/`big` — they don't
  compose and every new look becomes another boolean.
- Spread the native element's props (`ComponentProps<typeof BaseButton>`) so consumers
  get `type`, `disabled`, `aria-*`, `ref` without the kit re-declaring them.
- A `className` prop is for **layout from the outside** (margin, width, grid placement).
  Don't add props that let a consumer restyle internals (`innerClassName`,
  `labelStyle`) — that is how the look forks per product. If a consumer needs a
  different look, it becomes a new `variant`/`colorScheme` here.
- No doc comment per prop: a plainly named prop needs none. Comment only the
  non-obvious — why a value, what a union encodes, a workaround.

**State in styles.** Components built on `@base-ui/react` expose state as data
attributes — style `[data-selected]`, `[data-disabled]`, `[data-open]`,
`[data-highlighted]` (see `Tabs/styles.module.scss`), not a parallel `isActive` class
toggled from React. The attribute is what base-ui already keeps in sync with focus,
keyboard and ARIA; a hand-rolled class drifts from it.

**`'use client'`.** Any component that uses hooks, context, refs or base-ui starts with
`'use client'`. It costs nothing in a Vite SPA and keeps the kit importable from React
Server Components, where without it the import dies on `createContext` at build time. Hooks files don't need it —
the boundary is the component that calls them.

## Styles, in short

Nothing checks these two automatically (only `vh` has a test), so they are on you:

- No hex/rgba literals in a module — colors are `var(--color-*)` tokens.
- No element selectors and no `:global` — the kit lands in apps with their own resets.

The rest (breakpoints, spacing, color props, typography): the `kit-styles` skill.

## Dependencies

A new runtime dependency is a conversation with the team, not an author's decision:
every `dependency` here is installed and bundled by every consumer, and every
`peerDependency` is a version constraint on their app. Prefer the platform, base-ui
(already here) and `@remixicon/react` for icons. SVGs that aren't in Remix live in
`assets/` and are imported as React components (consumers configure svgr).

One library is deliberately not a `dependency`: `DatePicker` needs **dayjs**, so dayjs
sits in `peerDependencies` with `peerDependenciesMeta.dayjs.optional` (and in
`devDependencies`, so typecheck and Storybook run here). Only consumers that render a
picker install it and pay for it — which is also why `DatePicker` is the one component
missing from the root `index.tsx`: the root pulls every component in, and an app
importing `Button` from it without dayjs installed would stop building. Use the same
shape for the next heavy library only one component needs, and write the consumer's half
of it into `docs/agents/usage.md`.

## A component isn't done without a story

Storybook is the design system's catalogue — `npm run storybook` — and it is where
designers and consumers check a component. A component or a new variant without a story
does not exist for them. Stories render
without any app: no MUI, no app stores, no app globals — if a story needs something from
an app, the component is coupled.

## Checks

```bash
npm run typecheck        # tsgo
npm run lint             # ESLint + prettier (lint:ci — the same without --fix)
npm test                 # vitest (test:watch while working)
npm run build-storybook  # the catalogue still builds
```

There is no CI: run all four before every PR. Writing a test: the `kit-tests` skill.

## Releasing

PR into `main`; after merge bump `version`, tag `vX.Y.Z`, push the tag. A new
component/variant/prop is a minor; renaming/moving a file, removing a prop or changing a
default is a **major** — consumers deep-import files. Procedure, and the bump in
BookedUp-front: [`.claude/skills/release/SKILL.md`](.claude/skills/release/SKILL.md).

Working on the kit together with BookedUp-front: in it,
`npm install --no-save --install-links <path to this clone>`, and reinstall after each
change. Not `npm link`: the app would load this clone's own `react` and `i18next` — see
`docs/agents/usage.md`.
