import type { UktiLocales, UktiDefinition, UktiTranslations, UktiTranslator } from './types'
import { UKTI_LOCALE_DEFAULT } from './constants'
import { renderUktiTemplate } from './renderUktiTemplate'

const createUktiTranslator = <
  Definition extends UktiDefinition,
  Locales extends UktiLocales = UktiLocales,
  LocaleDefault extends UktiLocales = typeof UKTI_LOCALE_DEFAULT
>(
    props: {
      translations: UktiTranslations<Definition, Locales, LocaleDefault>
      throwIfError?: boolean
      locale: Locales
    } & (
      LocaleDefault extends typeof UKTI_LOCALE_DEFAULT ? {
        localeDefault?: LocaleDefault
      } : {
        localeDefault: LocaleDefault
      }
    )
  ): UktiTranslator<Definition> => {
  const { translations, throwIfError, locale, localeDefault } = props

  const definitionDefault = translations[(localeDefault ?? UKTI_LOCALE_DEFAULT) as LocaleDefault]
  const definition = translations[locale] ?? definitionDefault

  const getTranslation = (template: string, variables?: Record<string, unknown>): string =>
    renderUktiTemplate(template, variables, { throwIfError })

  const proxy = new Proxy({}, {
    get (target, property1) {
      const structure1 = definitionDefault[property1 as keyof Definition]
      const level1 = definition[property1 as keyof Definition]

      if (structure1 !== null && typeof structure1 === 'object') {
        return new Proxy({}, {
          get (target, property2) {
            const level2 = (level1 as Record<string, unknown> || structure1)[property2 as string]

            return (variables?: Record<string, unknown>) => {
              if (!level2) {
                return ''
              }
              return getTranslation(level2 as string, variables)
            }
          }
        })
      }

      return (variables?: Record<string, unknown>) => {
        if (!level1) {
          return ''
        }
        return getTranslation(level1 as string, variables)
      }
    }
  }) as UktiTranslator<Definition>

  return proxy
}

export { createUktiTranslator }
