import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'

// Month and weekday names come straight from dayjs, so every language the app
// ships has to be registered before a picker renders in it. English is built in.
import 'dayjs/locale/de'
import 'dayjs/locale/es'
import 'dayjs/locale/fr'
import 'dayjs/locale/id'
import 'dayjs/locale/it'
import 'dayjs/locale/pl'
import 'dayjs/locale/pt'
import 'dayjs/locale/ru'
import 'dayjs/locale/tr'

dayjs.extend(localizedFormat)

/**
 * `L` — the locale's own short date order — is a localizedFormat token, so it
 * resolves only because of the `extend` above; without the plugin dayjs prints
 * the letter itself. Consumers must reach the registration through this
 * constant rather than importing the module for its side effect alone: a bare
 * import carries no used binding, and a bundler that trusts the package's
 * `sideEffects` list drops the whole module from a production build. That is
 * what shipped a literal `L` in web's birthday field.
 */
export const LOCALIZED_DATE_FORMAT = 'L'
