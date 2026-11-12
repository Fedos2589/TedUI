---
name: kit-a11y
description: Use when adding or changing anything interactive in the kit, or doing accessibility work — buttons, aria-*, form wiring, keyboard, focus, Storybook a11y panel, jsx-a11y lint.
---

# Accessibility

Part of the kit rules from `AGENTS.md`, split out so it loads only when the work touches it.

A primitive's a11y bug repeats on every screen, so the bar here is higher than in the app.

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
