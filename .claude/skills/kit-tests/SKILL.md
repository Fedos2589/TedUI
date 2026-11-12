---
name: kit-tests
description: Use when writing or debugging a kit test (vitest) — where tests live, node vs happy-dom, the 1024px viewport and focusin gotchas, what is worth testing.
---

# Tests

Part of the kit rules from `AGENTS.md`, split out so it loads only when the work touches it.

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
