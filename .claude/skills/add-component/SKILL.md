---
name: add-component
description: Use when adding a new component, variant, colorScheme, size or prop to the kit — the end-to-end procedure from deciding it belongs here, through the folder, styles, strings, story and exports, to checking it inside a consumer app and opening the MR. The rules it relies on are in AGENTS.md; this is the order to apply them in.
---

# Adding a component (or a variant) to the kit

`AGENTS.md` holds the rules — decoupling, anatomy, styles, text, a11y, dependencies.
This is the order of work. Read `AGENTS.md` first if it isn't in context.

## 0. Does it belong in the kit?

- Generic — knows nothing about any product's domain — and an app needs it, or a second
  product would → **kit**.
- Knows a domain (a touchpoint card, a paywall block, a CRM row) → the **app**, built
  from kit components and tokens. Stop here.
- A different look for something that exists → a new `variant` / `colorScheme` /
  `size` on that component, not a new component and not an override from app SCSS.
  Check Storybook and the folders first: it may already exist under another name.

## 1. Branch

```bash
git switch main && git pull --ff-only
git switch -c feature/<component-or-topic>
```

Commits are conventional with the component as the scope:
`feat(Tag): add a big size`, `fix(DatePicker): …`.

## 2. The folder

New component `Foo` — the folder name is the public path (`ted-ui/Foo`), so pick
it once: renaming later is a major release.

```
Foo/
  Foo.tsx             component
  Foo.module.scss     its styles only
  Foo.stories.tsx     required
  index.tsx           re-exports Foo and its prop types — the entry consumers import
```

`index.tsx` is required for new components: consumer docs tell apps to import by folder
(`ted-ui/Foo`) first. Older components without one exist; don't copy that.
Only re-exports in it — no code.

## 3. The component

Model it on `Tag/Tag.tsx` (props, schemes, a translated aria-label) or
`Counter/Counter.tsx` (the smallest complete one).

- `'use client'` on the first line if it uses hooks, context, refs, `useTranslation` or
  base-ui.
- Exported `FooProps` interface; visual choices as exported string-union types with
  defaults in the destructuring: `variant = 'solid'`, `size = 'medium'`.
- Extend the native element's props (`ComponentProps<'div'>`, or the base-ui
  component's) and spread the rest onto it, so `aria-*`, `disabled`, `type`, `ref` work.
- `className` is merged last with `classnames` and is for outside layout only.
- Map unions to classes through a `Record<Union, string>`, not chains of ternaries.
- Interactive pieces are real buttons/links or base-ui primitives; state styled via
  `[data-*]` attributes when base-ui provides them.
- Imports inside the kit are relative to the file (`../Typography`,
  `../IconButton/IconButton`); never `ted-ui/…`, never the root `index.tsx`.
- Need a hook or util? Reuse `hooks/`, `utils/`, `_internal/`. Something from an app
  (route, store, analytics) becomes a prop or a callback.

## 4. Styles

`Foo.module.scss`, nothing global:

- colors `var(--color-*)` from `tokens.scss`; spacing and radius tokens where they fit;
- breakpoints: `@use '../styles/breakpoints' as *;` then `@include mobile { … }` etc.;
- text sizes from the `Typography` scale — better, render `Typography` itself;
- every class the component renders comes from this module.

## 5. Strings

Any visible or announced text (labels, `aria-label`, placeholders, empty states):

1. `const { t } = useTranslation('ui-kit')`.
2. Add the key under a `foo.` prefix to **all 10** `i18n/locales/*.json` —
   `en es fr de it pt pl id ru tr`, a real translation in each.
3. Numbers → plural keys (`_one/_other`, plus `_few/_many` for `ru` and `pl`) with
   `{ count }`.

Apps check the keys they use against these files, so a missing locale fails their CI,
not ours.

## 6. The story

`Foo.stories.tsx`, following `Counter/Counter.stories.tsx`:

- `title: 'UI-KIT/Foo'`, `component: Foo`, `tags: ['autodocs']`;
- `parameters.design` with the Figma node URL of the component (ask for it if the task
  didn't give one — designers review from that link);
- `argTypes` with `inline-radio` controls for every union prop;
- a `Default` story driven by `args`, plus one story per axis that renders all values
  side by side (`AllSizes`, `AllVariants`, `AllColorSchemes`) and the states that matter
  (disabled, loading, error, long text);
- layout through `_storybook/Stack` or plain inline styles — no app components, no MUI.

Open the **Accessibility** panel for each story: 0 violations.

## 7. Exports

- Add `Foo` and its public types to the root `index.tsx`, next to similar components.
- Exception: a component that needs an optional peer dependency (like `DatePicker` and
  dayjs) stays out of the root — and its consumer setup goes into
  `docs/agents/usage.md`.

## 8. Consumer docs

`docs/agents/usage.md` ships inside the package and is what agents in apps read. If the
component replaces something apps would otherwise hand-roll, add a row to the
**"Use the kit, not your own"** table. A new variant of an existing component: update
that component's row if it lists the unions (`Button` does). If `Foo` stays out of the
root `index.tsx`, add it to the list of components imported by folder.

## 9. Checks

```bash
npm run typecheck
npm run lint
npm run build-storybook
```

And the decoupling greps from `AGENTS.md` — all four must print nothing.

## 10. Try it in a consumer

```bash
npm install --no-save --install-links ../TedUI
```

Re-run after every kit edit. Use the component on a real screen, check desktop and
mobile width. `npm ci` in the app returns it to the tagged kit. Never `npm link`, never
edit `node_modules/ted-ui` directly.

## 11. MR

MR into `main`. In the description: what was added, the Figma link, the Storybook story
name. After it merges, release it — the `release` skill.

## Red flags

- An `@/…`, `@mui`, `@emotion` or `next/` import, or a string `className`.
- A hex/rgba literal or a raw `@media`.
- A prop that restyles internals (`innerClassName`, `labelStyle`).
- Text not through `useTranslation('ui-kit')`, or a key missing from any locale.
- No story, or a story that needs an app to render.
- A new runtime `dependency` added without asking the team.
- Renaming or moving an existing file "while you're here" — that's a major release.
