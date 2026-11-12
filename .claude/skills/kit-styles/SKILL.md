---
name: kit-styles
description: Use when writing or changing SCSS or styling in the kit — colors and tokens, color props, dvh vs vh, spacing, typography, breakpoints, global rules, MUI-style APIs. Triggers: .module.scss, color prop, media query, breakpoint, font, spacing.
---

# Styles

Part of the kit rules from `AGENTS.md`, split out so it loads only when the work touches it.

- **Colors are tokens.** In SCSS: `var(--color-grey-500)`, `var(--color-blue-300)` from
  `tokens.scss`. In TSX, where a raw value is unavoidable (canvas, a 3rd-party config,
  SVG props): `colors` from `colors.ts`. Never a hex/rgba literal in a module —
  literals are what make a theme (dark, a product palette) impossible later.
- **Screen height** — `dvh` (or `svh` / `lvh`), never `vh`: on phones `100vh` is taller
  than the screen while the browser bars show and ignores the keyboard.
  `styles/viewportUnits.test.ts` fails on a plain `vh` in any `.scss` / `.tsx`.
- **Spacing and radius** — `var(--spacing-4…32)`, `var(--radius-sm|md)` where a token
  fits; a one-off number is fine when the design really has one.
- **Text color** — `<Typography color="grey-500">`: the prop takes a `--color-*` token
  name (`ColorToken` from `colors.ts`) and applies it as a class. Not `style={{ color }}`,
  not a raw value.
- **Any prop that picks a color** works the same way (`Spinner color`, `AvatarsRow
borderColor`): typed `ColorToken`, turned into a class by
  `@include color-token-classes(<prefix>, <property>)` from `styles/_colorTokens.scss`.
  The property can be a custom one (`--ring-color`) that child classes read. Inline
  styles carry geometry only — sizes, offsets, opacity — never a color.
- **No MUI-style APIs.** Sizes are unions (`'small' | 'medium' | 'large'`), not pixel
  numbers; no `sx`/spacing props (`mt`, `mb`, `align`); no bags of another component's
  props (`buttonProps`, `tooltipProps`) — expose the few props that are needed.
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
  no `:global` in modules: the kit is dropped into an app with its own resets, and a
  global rule from us rewrites their screens.
