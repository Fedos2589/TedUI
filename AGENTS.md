If you are an agent working in a repo that **uses** the kit, you want
[`docs/agents/usage.md`](docs/agents/usage.md) instead.

This file is the rules. The step-by-step procedures that apply them live next to it —
read the matching one before starting:

| When you're…                                                        | Read                                                                             |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| adding a component, or a variant / size / colorScheme / prop to one | [`.claude/skills/add-component/SKILL.md`](.claude/skills/add-component/SKILL.md) |
| releasing a new version, or bumping the kit in web                  | [`.claude/skills/release/SKILL.md`](.claude/skills/release/SKILL.md)             |

## How the package is shipped

- **Source, not a build.** `main` is `./index.tsx`; consumers compile `.tsx` and
  `.module.scss` themselves (Next `transpilePackages`). There is no `dist/`, no bundler
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
`'use client'`. Consumers on the Next App Router import the kit from Server Components
too; without the directive the import dies on `createContext` at build time, and the
consumer has to remember which of our components are safe. Hooks files don't need it —
the boundary is the component that calls them.

## Styles

- **Colors are tokens.** In SCSS: `var(--color-grey-500)`, `var(--color-blue-300)` from
  `tokens.scss`. In TSX, where a raw value is unavoidable (canvas, a 3rd-party config,
  SVG props): `colorsUIKIT` from `colors.ts`. Never a hex/rgba literal in a module —
  literals are what make a theme (dark, a product palette) impossible later.
- **Spacing and radius** — `var(--spacing-4…32)`, `var(--radius-sm|md)` where a token
  fits; a one-off number is fine when the design really has one.
- **Typography** — the scale lives in `Typography/Typography.module.scss`
  (h1–h8 weight 600, bh1–bh7 weight 700, t1–t6 weight 500). Components that render text
  use `Typography` or the same sizes; don't invent a 15px.
- **Font** — `'Montserrat', sans-serif` is set in component modules; the consumer loads
  the font files. Don't add another family.
- **Breakpoints** — only the mixins from `styles/_breakpoints.scss`:

  ```scss
  @use '../styles/breakpoints' as *;

  @include mobile  { … }   // max-width: 767px — the mobile/desktop threshold
  @include desktop { … }   // min-width: 768px
  @include bp-up($bp-lg)   { … }   // $bp-sm 600px, $bp-md 768px, $bp-lg 1280px
  @include bp-down(480px)  { … }   // one-offs go through the mixin too
  @include isPwa   { … }   // display-mode: standalone
  ```

  A raw `@media (max-width: …)` is how products end up with 767 here and 768 there.
  In TSX: `useBreakpoints()` / `useMediaQuery()` from `hooks/`, SSR-safe (guard
  `typeof window !== 'undefined'`).

- **Global rules don't exist here.** No element selectors (`button { }`, `h1 { }`) and
  no `:global` in modules: the kit is dropped into apps with their own resets, and a
  global rule from us rewrites their screens.

## Text

The kit owns its strings in the `ui-kit` i18n namespace:

1. `const { t } = useTranslation('ui-kit')` — not the bare `useTranslation()`.
2. The key goes into **all 10** `i18n/locales/{en,es,fr,it,pt,de,pl,id,ru,tr}.json`, same
   nested path, a real translation in each (`tr.json` is the one that gets forgotten).
3. A string with a number uses plural keys (`_one`/`_other`; `ru` also `_few`/`_many`)
   passed as `{ count }`.

Consumers register the bundle with `registerUIKitTranslations(i18n)`
(`i18n/resources.ts`) — nothing else is needed on their side. **Exception:** text that
comes from the consumer's data (a post title, a category key) stays on the default
namespace via `t(value)`; it resolves against the app's keys through `fallbackNS`.
Don't copy such keys into our locales.

## Accessibility

A primitive's a11y bug repeats on every screen, so the bar here is higher than in apps.

- Everything clickable is a real `<button>` (or base-ui `Button`) or `<a href>` — never
  `div onClick`. Reset the native look in the element's own class so nothing moves
  (`Tag`, the upload button of `Avatar`). When the clickable area contains a link or
  another control, don't nest them: make one element the button and stretch it with
  `::after`.
- Icon-only controls take an `aria-label` (default text from the `ui-kit` namespace).
- Form controls wire label, hint and error for the consumer: see
  `Input/InputShell/inputMessage.ts` — `aria-describedby`, `aria-invalid`, and the error
  announced through a live region. New fields reuse `InputShell`, not their own wiring.
- Selection controls expose selection semantically (`role="radio"`/`"checkbox"` +
  `aria-checked` in a named group, or base-ui's own) — not only a color.
- Keyboard: Tab reaches it, Enter/Space activates it, Escape closes overlays, focus
  returns to the trigger.
- Decorative icons get `aria-hidden` (Remix icons don't set it themselves).
- Accessibility work on an existing component adds attributes (`aria-*`, `alt`, names
  from the `ui-kit` namespace) and stops there. Its look and behaviour — focus styles,
  key handling, focus moves, markup, motion — are design decisions and don't change as
  a side effect.
- Storybook's **Accessibility** panel (`@storybook/addon-a11y`) runs axe on every story.
  A new or changed story lands with 0 violations. `color-contrast` is reported as
  "Inconclusive" until the palette is revised — don't add new pairs to that list.
- `eslint-plugin-jsx-a11y` runs at `error`, so `npm run lint` fails on a new violation.
  `eslint-disable` only with the reason after `--`, when the lint is wrong about it
  (a mouse-only shortcut for a control that is reachable elsewhere, an opt-in `autoFocus`).

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

There is no CI: run all four before every PR.

Tests live next to what they cover (`DatePicker/calendarModel.test.ts`), and
`.npmignore` keeps them out of the package like the stories. Most of them need no DOM
and run in `node`; a component test opts into one with a `// @vitest-environment
happy-dom` pragma on the first line. Two things about that environment are worth
knowing before they cost you an hour:

- it opens at **1024px**, so `useBreakpoints` reports desktop until the test sets a
  viewport (`window.happyDOM.setViewport({ width: 390 })`);
- a programmatic `element.focus()` moves `document.activeElement` without dispatching
  the `focusin` React listens to, so a test that focuses something has to send the
  event as well (`fireEvent.focus(element)`) or the component never learns about it.

Not every component needs a test — a story covers the look. Test the parts where being
wrong is invisible: date and range arithmetic, keyboard navigation, focus moves, the
state a component keeps.

## Releasing

1. MR into `main`.
2. After merge: bump `version` in `package.json`, tag `vX.Y.Z`, push the tag.
   Semver: a new component/variant/prop is a minor; renaming/moving a file, removing a
   prop or changing a default is a **major** — consumers deep-import files.
3. Consumers bump the tag in their `package.json` and run `npm install ted-ui`.

The full procedure — choosing the bump, the commit and tag, the bump and checks in web —
is in [`.claude/skills/release/SKILL.md`](.claude/skills/release/SKILL.md).

Working on the kit together with an app: in the app,
`npm install --no-save --install-links <path to this clone>`, and reinstall after each
change. Not `npm link`: the app would load this clone's own `react` and `i18next` — see
`docs/agents/usage.md`.
