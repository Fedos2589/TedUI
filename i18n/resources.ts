import type { i18n } from 'i18next'
import en from './locales/en.json'
import es from './locales/es.json'
import fr from './locales/fr.json'
import it from './locales/it.json'
import pt from './locales/pt.json'
import de from './locales/de.json'
import pl from './locales/pl.json'
import id from './locales/id.json'
import ru from './locales/ru.json'
import tr from './locales/tr.json'

export const UIKIT_NS = 'ui-kit'

export const uiKitResources = { en, es, fr, it, pt, de, pl, id, ru, tr }

// Registers UI-KIT's own translation bundle under the `ui-kit` namespace on the
// host app's i18next instance. UI-KIT components call useTranslation('ui-kit'),
// so the package ships and owns its chrome strings instead of relying on the
// consumer to have the right keys. Data-driven t() calls (post content, category
// config keys) still resolve against the app namespace via i18next `fallbackNS`.
export const registerUIKitTranslations = (instance: i18n) => {
  Object.entries(uiKitResources).forEach(([lng, bundle]) => {
    instance.addResourceBundle(lng, UIKIT_NS, bundle, true, true)
  })
}
