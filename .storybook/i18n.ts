import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import { registerUIKitTranslations, UIKIT_NS } from '../i18n/resources'

// Storybook пакета не имеет доступа к initLocales приложения — и не должен.
// Пакет обязан уметь поднять свои строки сам: если тут чего-то не хватает,
// значит не хватит и в любом другом потребителе.
export const initStorybookI18n = () => {
  void i18next.use(initReactI18next).init({
    lng: 'en',
    fallbackLng: 'en',
    ns: [UIKIT_NS],
    defaultNS: UIKIT_NS,
    interpolation: { escapeValue: false },
  })

  registerUIKitTranslations(i18next)

  return i18next
}
