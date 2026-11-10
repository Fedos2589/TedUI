# Using ted-ui — rules for agents in BookedUp-front

You are in BookedUp-front (React + Vite), the app that uses `ted-ui` (Ted's design
system) — its only consumer. This file ships inside the package, so it always matches
the installed version; the app loads it with `@node_modules/ted-ui/docs/agents/usage.md`.

Rules are written as "do X, because otherwise Y breaks". When the app's own `CLAUDE.md`
says something more specific (a legacy fallback, an app-only token), the app wins for
that app.

The component catalogue with every prop is the kit's Storybook (`npm run storybook` in
the kit repo). This file is about approach and
boundaries, not props.

## Setup an app needs once

Install the kit by tag, then do everything in the table once. In an app that already
has the kit, this is listed so you recognise it and don't "clean it up".

```bash
npm install github:Fedos2589/TedUI#vX.Y.Z   # → "ted-ui": "github:Fedos2589/TedUI#vX.Y.Z"
```

| What | Why |
|---|---|
| `optimizeDeps.exclude: ['ted-ui']` in `vite.config.ts` | The kit ships `.tsx` + `.module.scss` sources; Vite compiles them like app code instead of pre-bundling |
| `optimizeDeps.include` listing every package the kit imports (`'ted-ui > classnames'`, `'ted-ui > @base-ui/react/<part>'`, dayjs and its plugins…) | Excluding the kit also skips its imports; their CommonJS then reaches the browser raw — "does not provide an export named 'default'". Dev only: `build` passes, `npm run test:e2e` catches it |
| `vite-plugin-svgr` with `include: '**/*.svg'`, `exportType: 'default'` | Kit components import SVGs as React components without `?react`; without it they render "Element type is invalid" |
| `verbatimModuleSyntax: false` in `tsconfig.app.json` | tsc checks the kit's sources too, and they import types without `import type` |
| `sass` installed | Kit styles are SCSS modules |
| `import 'ted-ui/tokens.scss'` once, in `src/main.tsx` | Components read `var(--color-*)`; the kit doesn't load its tokens itself |
| Montserrat loaded with the literal family name `'Montserrat'` (`index.html`) | Kit modules set `font-family: 'Montserrat'`; a renamed family falls back to sans-serif silently |
| i18next initialised + `registerUIKitTranslations(i18n)` from `ted-ui/i18n/resources` | Kit components call `useTranslation('ui-kit')`; without it they print keys |
| `ToastProvider` from `ted-ui/Toast/Toast`, once | Only if the app calls `toast()` |
| Base resets: `*, *::before, *::after { box-sizing: border-box }`, `body { margin: 0 }`, form controls `font: inherit` | Kit components are measured assuming them |
| Viewport meta `width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content` | `viewport-fit=cover` makes `env(safe-area-inset-*)` non-zero (`ActionBar` pads by it); `interactive-widget` makes Chrome shrink the layout (and `dvh`) for the on-screen keyboard instead of covering the page |

The kit is installed from GitHub by tag (`github:Fedos2589/TedUI#vX.Y.Z`), not from
the npm registry; always pin a tag, never the bare repo (that tracks `main`).
`node_modules/ted-ui` is an install artifact — **never edit it**;
the next `npm ci` wipes the change. To change the kit, see "When the kit lacks something".

## Imports

```tsx
import { Button } from 'ted-ui/Button'            // component folder — preferred
import { Input } from 'ted-ui/Input/Input'        // exact file — also fine
import { Typography } from 'ted-ui'               // root — works, but see below
```

- The root entry pulls every component in the kit into the module graph. Prefer folder/file imports in new
  code; in an app that already imports from the root everywhere, match the file you're
  in.
- Some components are **not** re-exported from the root at all — `TagsInput`,
  `IconButton`, `Label`, `LiveRegion`, `Popover` — import them by folder/file.

## Use the kit, not your own

| Instead of | Use |
|---|---|
| `<button>`, an `<a>`/`<div>` styled as a button | `Button` with explicit `variant` (`solid \| ghost`) and `colorScheme` (`black \| grey \| white \| lightBlue \| blue \| red \| lightRed \| outline`); link-style text buttons are `variant="ghost"` |
| an icon-only button | `IconButton` with `aria-label` naming the action |
| `<input>`, `<textarea>` | `Input`, `Input/Textarea` (`autoGrow`, `minRows`, `maxRows`) with `label` |
| an error message next to a field | the field's `error` + `errorText` |
| `<h1>`–`<h6>`, `<p>`, `<span>` with text | `Typography` with a `variant`; need a tag → `component="h1"` |
| a chip group to pick from | `TagSelect` (`multiple` or single) |
| a static pill / status | `Tag` or `Label` |
| an unread/notification count badge | `Counter` (`size` `S \| M`, `variant` `number \| dot`, `colorScheme` `red \| green \| grey \| white`) |
| radio buttons / checkboxes | `RadioGroup` + `Radio`, `Checkbox` |
| a dropdown with search | `Combobox` |
| a date or date-range field | `DatePicker` — needs dayjs, see below |
| tabs | `Tabs`, `TabsRounded` |
| a dialog / bottom sheet | `Modal` |
| a form's or a step's main action(s) at the bottom | `ActionBar` around the `Button`s, inside the `<form>` after the fields: on mobile it is pinned to the bottom, above the home indicator and the on-screen keyboard |
| a floating menu | `Popover` |
| a hint on hover | `Tooltip` |
| a spinner / skeleton / progress | `Spinner`, `Skeleton`, `ProgressBar` |
| a notification | `toast` + `ToastProvider` |
| announcing something to a screen reader | `LiveRegion` |
| an avatar, a row of avatars | `Avatar`, `AvatarsRow` |

Using the kit component is not only about looks: `Button` handles `loading` and
disabled-while-loading, `Input` wires label, hint and error to the field for screen
readers, `Modal` traps and returns focus. A hand-rolled copy silently drops all of it.

## DatePicker: the one component that needs something installed

`DatePicker` is built on **dayjs**, and the kit does not ship it: dayjs is an
**optional peer dependency**: without a picker the app wouldn't need to install it.
BookedUp-front installs its own copy, so the app and the picker share one dayjs
instance — a plugin either of them extends is then there for both.

To use it:

1. `npm i dayjs` (`^1.11`). `peerDependenciesMeta` marks it optional, so npm says
   nothing if you forget — the build fails on the import instead.
2. Import it by folder path:

   ```tsx
   import { DatePicker } from 'ted-ui/DatePicker'
   ```

   It is deliberately **not** re-exported from the root `ted-ui`. The root entry
   pulls in every component, so an app importing `Button` from it without dayjs
   installed would stop building.
3. Nothing else. The component registers the dayjs plugins it needs
   (`customParseFormat`, `localizedFormat`) and the kit's 10 locales itself, as a side
   effect of the import; the app's own `dayjs.extend(…)` calls are unaffected.

The value crossing the boundary is always the stored string `YYYY-MM-DD` (`''` = not
picked), never a `Date` or a `Dayjs` — `mode="range"` makes it `{ from, to }` of the
same. What the user sees is formatted from the locale, so don't format it yourself:

```tsx
const [date, setDate] = useState('')

<DatePicker mode="single" value={date} onChange={setDate} label="Start date" />
```

Everything else — `views` (which steps the picker walks), `minDate`/`maxDate`, `locale`,
and the `Input` props the trigger passes through — is in Storybook.

## Styles to keep — don't restyle the kit from the app

- **Pass `className` for layout only**: margin, width, grid/flex placement. Don't change
  a kit component's colors, paddings, radius, font or height from app CSS. It works
  today only because of stylesheet order, breaks on the next kit release, and forks the
  design system per screen.
- **Need a different look → it's a kit change** (a new `variant`/`colorScheme`/`size`),
  not an override.
- **Don't target kit internals**: no `:global([class*="Button"])`, no selectors on the
  kit's hashed module classes or its DOM structure. Both change without notice.

## Colors

- In SCSS: CSS variables from the kit — `var(--color-grey-500)`, `var(--color-blue-300)`,
  groups `bw grey grey-blue blue green emerald red orange yellow beige gainsborough`,
  steps `50…600`. Spacing `var(--spacing-4…32)`, radius `var(--radius-sm|md)`.
- Text: `Typography`'s `color` prop takes a token name — `color="grey-500"`,
  `color="blue-300"`, `color="bw-white"` (`ColorToken` from `ted-ui/colors`).
- Where only a raw value works (a plain style object, canvas, a 3rd-party config like
  react-hot-toast): `colors` from `ted-ui/colors`
  (`colors.greyscale[500]`).
- Never a `#hex`/`rgba()` literal or a local color constant: it doesn't follow the
  palette and blocks theming.

## Typography

`Typography` is plain text in one of the variants below. Its props are `variant`,
`color` (a token name), `component` (the tag, `span` by default) and the native
element's props. Alignment, margins and width come from your own class:

```tsx
<Typography variant="t3" color="grey-400" className={styles.hint}>…</Typography>
```

```scss
.hint {
  text-align: center;
  margin-top: var(--spacing-8);
}
```

The class always wins over `Typography`'s defaults (black, no margin), whatever the
stylesheet order. Color goes through the prop, not `style={{ color }}` and not a raw
value. The MUI-style props of `0.x` — `align`, `textAlign`, `mb`, `mt`, `width`,
`fontSize`, `fontWeight`, `textTransform`, `whiteSpace`, and `color` as a path
(`"greyscale.500"`) — are gone. Don't bring `fontSize`/`fontWeight` back through a
class: pick a variant.

Variants, desktop sizes (font-size / line-height):

| Variant | Size | Weight |
|---|---|---|
| `h1` | 32/40 (mobile 20/28) | 600 |
| `h2` | 24/32 | 600 |
| `h3` | 20/28 | 600 |
| `h4` | 18/24 | 600 |
| `h5` | 16/22 | 600 |
| `h6` | 14/20 | 600 |
| `h7` | 13/18 | 600 |
| `h8` | 11/14 | 600 |
| `bh1`–`bh7` | as `h1`–`h7` | 700 |
| `t1` | 16/22 | 500 |
| `t2` | 14/22 | 500 |
| `t3` | 13/20 | 500 |
| `t4` | 12/18 | 500 |
| `t5` | 10/16 | 500 |
| `t6` | 9/10 | 500 |

Pick the nearest variant instead of a custom size — a 15px here and a 13.5px there is how
a product stops looking like the design system. There is nothing above 32px and no
weight above 700; if a screen genuinely needs a display size, raise it with the design
system (a kit change), don't hard-code one.

## Breakpoints and mobile

- **Breakpoints — only the kit's mixins**, never a raw `@media (max-width: …)`:

  ```scss
  @use 'ted-ui/styles/breakpoints' as *;   // or the app's re-export, e.g. '@/styles/breakpoints'

  @include mobile  { … }   // max-width: 767px — the mobile/desktop threshold
  @include desktop { … }   // min-width: 768px
  @include bp-up($bp-lg)  { … }   // $bp-sm 600px, $bp-md 768px, $bp-lg 1280px
  @include bp-down(480px) { … }   // one-offs go through the mixin too
  @include isPwa   { … }   // installed PWA (display-mode: standalone)
  ```

  Raw queries drift (767 here, 768 there) and the layout jumps between them.
- **In TSX:** `useBreakpoints()` from `ted-ui/hooks/useBreakpoints` →
  `{ isMobile, isDesktop }`. The server and first paint assume **mobile** and reconcile
  on hydration — don't branch markup on it where a CSS mixin would do, or desktop users
  see the mobile layout flash.
- **Primary action on mobile stays reachable**: the main CTA of a step/flow goes in
  `ActionBar` (`fullWidth` buttons), not left below the fold after long content or under
  the keyboard. A hand-rolled `position: sticky; bottom: 0` bar ends up under the keys on
  iOS Safari, which lays the keyboard over the page; `ActionBar` rises by
  `useKeyboardInset()` (`ted-ui/hooks/useKeyboardInset`) — use that hook for anything
  else pinned to the bottom.
- **Screen height: `dvh`, never `vh`.** `100vh` is the height with the browser bars
  hidden, so on a phone a `100vh` box is taller than the screen while they show, and it
  ignores the keyboard. `min-height: 100dvh` for a full-screen shell; `svh` / `lvh` when
  you need the smallest / largest. The kit's own sources are held to this by a test.
- **Safe area**: anything pinned to the top or bottom offsets by
  `env(safe-area-inset-top|bottom, 0px)` (or the app's token built on it). It only works
  when the page's viewport meta has `viewport-fit=cover`; check the app sets it.
- **iOS zooms the page on focus when a field's font is below 16px.** Kit fields (`Input`,
  `Textarea`, `Combobox`, `TagsInput`) render 16px on mobile for that reason (13–14px on
  desktop). Don't suppress the zoom with `maximum-scale=1.0, user-scalable=no` in the
  viewport meta — that blocks pinch-zoom for everyone, an accessibility cost — and don't
  shrink your own fields below 16px.
- **Horizontal overflow is a bug**: `document.documentElement.scrollWidth` must equal
  the viewport width at 390px.
- Verify mobile in a mobile viewport (390×844, touch), not by resizing a desktop window.

## Icons

`@remixicon/react` (`Ri<Name>`, remixicon.com) — the kit uses it too. Not
`@mui/icons-material`, not an inline `<svg>`, not a local SVG component when a Remix
icon exists.

## Accessibility

| Building | Do | Not |
|---|---|---|
| something that goes somewhere | a link (`<a href>`, the router's `<Link>`) | `onClick` + `navigate()` |
| something that does something | `Button` / `IconButton` | `div onClick` |
| a form | `<form onSubmit noValidate>`, submit button `type="submit"`, others `type="button"` | Enter handled in `onKeyDown` |
| a field | kit `Input` with `label`; errors via `errorText` | placeholder as the only label |
| a failed submit | focus the first invalid field | leave focus on the button |
| a step change in a flow | move focus to the new step's heading | let focus drop to `<body>` |
| something that appears off-screen / a loader | `LiveRegion` | nothing |
| animation | respect `prefers-reduced-motion` | motion that can't be turned off |

Most of this comes free with kit components; the rules exist for the moments you step
outside them.

What the kit can't know and you have to pass:

- `Modal` without a `title` → `aria-label`. `Popover` → `aria-label` or `aria-labelledby`.
- `IconButton` and any icon-only control → `aria-label`.
- `Combobox` with a custom `trigger` → an `aria-label` on that trigger (it gets
  `role="combobox"`, which takes no name from its text).
- `Tabs`, `TabsRounded`, `TagSelect`, `RadioGroup` → a group name
  (`aria-label` / `aria-labelledby`) when there's no visible heading for them.
- `ProgressBar` without a `caption` → `aria-label`. A `Spinner` is decorative unless you
  give it `aria-label`; then it becomes a status.

## Text in the app vs text in the kit

App strings live in the app's i18n. The kit's own chrome strings (button defaults,
aria-labels) live in the kit's `ui-kit` namespace — don't add app keys for them and
don't edit the kit's locale files from the app.

## When the kit lacks something

1. Check Storybook — it may exist under another name, or be a `variant` of something.
2. If it's generic (no knowledge of BookedUp's domain): it goes **into the kit** — PR to
   `Fedos2589/TedUI`, tag, bump here. The kit's own rules are in its `AGENTS.md`.
3. If it knows your domain (a case card, a funnel step, a CRM table): build it in the
   app, **from** kit components and tokens.
4. Never copy a kit component into the app to tweak it — that is how the design system
   falls apart into forks.

Local loop while changing the kit: in the app,
`npm install --no-save --install-links ../TedUI` (path to the kit clone), re-run after
each kit edit; `npm ci` in the app returns to the tagged version. `--install-links`
copies the kit in, so its files resolve `react`, `react-i18next` and `i18next` from the
app. Not `npm link`: through the symlink the kit picks up the clone's own copies —
"Invalid hook call" and raw `ui-kit` keys on screen.
