import type {
  UktiLanguages,
  UktiRegions,
  UktiDefinition,
  UktiTranslations,
  UktiTranslator,
  UktiTranslate
} from './types.js'
import { UKTI_LANGUAGE_DEFAULT } from './constants.js'
import { renderUktiTemplate } from './renderUktiTemplate.js'

const createUktiTranslator = <
  Definition extends UktiDefinition,
  Languages extends string = UktiLanguages,
  LanguageDefault extends string = typeof UKTI_LANGUAGE_DEFAULT,
  Regions extends string = UktiRegions
>(
  props: {
    translations: UktiTranslations<Definition, Languages, LanguageDefault, Regions>
    throwIfError?: boolean
  } & (LanguageDefault extends typeof UKTI_LANGUAGE_DEFAULT
    ? {
        languageDefault?: LanguageDefault
      }
    : {
        languageDefault: LanguageDefault
      })
): UktiTranslator<Definition, Languages, Regions> => {
  const { translations, throwIfError, languageDefault } = props

  const definitionDefault =
    translations[(languageDefault ?? UKTI_LANGUAGE_DEFAULT) as LanguageDefault]

  if (definitionDefault === null || typeof definitionDefault !== 'object') {
    throw new Error('Ukti requires the translations to have at least the default language.')
  }

  const getTranslation = (template: string, variables?: Record<string, unknown>): string =>
    renderUktiTemplate(template, variables, { throwIfError })

  return (language: Languages, region?: Regions): UktiTranslate<Definition> => {
    const definition = translations[language] ?? definitionDefault

    const proxy = new Proxy(
      {},
      {
        get(target, property1: string) {
          if (property1 === 'regions') {
            console.error('Ukti translations have the word "regions" reserved.')
            return () => ''
          }

          const structure1 = definitionDefault[property1 as keyof Definition]
          const level1 = definition[property1 as keyof Definition]

          if (structure1 !== null && typeof structure1 === 'object') {
            return new Proxy(
              {},
              {
                get(target, property2: string) {
                  const level2 = (level1 as Record<string, unknown>)?.[property2]

                  return (variables?: Record<string, unknown>): string => {
                    if (!level2) {
                      return ''
                    }

                    const regionText = region
                      ? (definition.regions?.[region]?.[property1] as Record<string, string>)?.[
                          property2
                        ]
                      : false

                    if (regionText) {
                      return getTranslation(regionText, variables)
                    }

                    return getTranslation(level2 as string, variables)
                  }
                }
              }
            )
          }

          return (variables?: Record<string, unknown>): string => {
            if (!level1) {
              return ''
            }

            const regionText = region
              ? (definition.regions?.[region]?.[property1] as string)
              : false

            if (regionText) {
              return getTranslation(regionText, variables)
            }

            return getTranslation(level1 as string, variables)
          }
        }
      }
    ) as UktiTranslate<Definition>

    return proxy
  }
}

export { createUktiTranslator }
