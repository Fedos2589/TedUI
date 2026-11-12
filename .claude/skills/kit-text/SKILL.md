---
name: kit-text
description: Use when a kit component renders text or you add/change an i18n key — the ui-kit namespace, all 10 locale files, plurals, consumer-data exception. Triggers: useTranslation, i18n/locales, aria-label default text, tr.json.
---

# Text (i18n)

Part of the kit rules from `AGENTS.md`, split out so it loads only when the work touches it.

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
