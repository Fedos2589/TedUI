# ScheduleGrid — Implementation Plan

> **For the executor (Sonnet):** one task = one fresh session (`/clear` between tasks). Work inline,
> no subagents. Read only the files the task names plus AGENTS.md (and the skills it points to).
> If the task turns out bigger than described, stop and say so — it gets split, not pushed through.
> Tick the task's box when its check passes, commit, don't push.

**Status: done** — merged in `main`, released in `v0.5.0`, the consumer pins it. Kept as history.

**Goal:** a generic day / week grid: columns of items placed by minutes after midnight. The kit
knows nothing about bookings or masters — the consumer turns its own data (and time zone) into
minutes and columns.

**Where it came from:** the consumer's epic E6 (calendar of bookings), common plan in
`~/work/BookedUp-back/docs/superpowers/plans/2026-11-12-e6-calendar.md`. Nothing in it is needed
to work on the kit.

## Global constraints

- AGENTS.md + `add-component`, `kit-styles`, `kit-a11y`, `kit-tests`.
- Minutes are the consumer's local minutes after midnight; the grid never reads a clock or a time
  zone (a clock change is the consumer's business). Midnight at the end is `1440`.
- Checks: `npm run typecheck && npm run lint && npm test && npm run build-storybook`.
- Commit messages via `git commit -F - <<'EOF'`.

---

## Step K — branch `feature/schedule-grid`

### - [x] K1: layout math

**Files:** create `ScheduleGrid/layout.ts`, `ScheduleGrid/layout.test.ts`.

`layoutItems(items: {id, startMinute, endMinute}[], range: {startMinute, endMinute})` →
`{id, top, height, lane, lanes}[]` in fractions of the range: items clipped to the range,
overlapping items side by side (greedy lanes, `lanes` = width of their overlap group). Also
`visibleRange(items, fallback)` — from the earliest start to the latest end rounded to whole hours.

**Check:** `npm test -- layout` — no overlap → one lane; three mutually overlapping → 3 lanes;
A–B overlap and B–C overlap but not A–C → 2 lanes; an item past the range end is clipped.
Commit `feat(ScheduleGrid): layout of items in a column`.

### - [x] K2: `ScheduleGrid` component

**Files:** create `ScheduleGrid/{ScheduleGrid.tsx,ScheduleGrid.module.scss,ScheduleGrid.stories.tsx,index.tsx}`;
root `index.tsx`. Read first: `.claude/skills/add-component/SKILL.md`, `kit-a11y`, `kit-styles`.

Props: `columns: {id, label: ReactNode, items: {id, startMinute, endMinute, children: ReactNode, colorScheme?}[]}[]`,
`startMinute`, `endMinute`, `onItemClick?(columnId, itemId)`, `onEmptyClick?(columnId, minute)`
(rounded down to `stepMinutes`, default 15), `aria-label`. Hour lines and labels on the left;
columns scroll horizontally on narrow screens with the hour labels sticky; items are buttons when
`onItemClick` is set. No hex colors; tokens only.

**Check:** Storybook stories: day with 3 columns, overlapping items, 12 columns (scroll), empty;
a11y panel clean; `npm run build-storybook` passes; a happy-dom test that clicking an item calls
`onItemClick` with its ids. Commit `feat(ScheduleGrid): day/week grid of items by minutes`.

### - [x] K3: release and bump in the consumer

Follow `.claude/skills/release/SKILL.md` (minor). In the consumer:
`npm install github:Fedos2589/TedUI#vX.Y.Z`; lockfile sha == tag sha. Version commit and tag only
with the user's explicit ok. (Done: `v0.5.0`.)
