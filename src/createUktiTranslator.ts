/* eslint-disable @typescript-eslint/explicit-function-return-type */

// TODO: Refactor to nested object structure using proxies:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy.

import type {
  UktiLocales,
  UktiDefinitionItemVariables,
  UktiDefinitionItem,
  UktiDefinition,
  UktiTranslations
} from './types'
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
  ) => {
  const { translations, throwIfError, locale, localeDefault } = props

  return <
    Dictionary extends {
      [A in keyof Definition]: Definition[A] extends Record<string, unknown>
        ? {
            [B in keyof Definition[A]]: [`${string & A}.${string & B}`, Definition[A][B]]
          }[keyof Definition[A]]
        : [`${string & A}`, Definition[A]]
    }[keyof Definition],
    Path extends Dictionary extends [infer A, UktiDefinitionItem] ? A : never,
    Item extends Dictionary extends [Path, infer B] ? B : never,
    Params extends Item extends UktiDefinitionItemVariables ? Item : [undefined?]
  >(
    path: Path,
    ...params: Params
  ): string => {
    const definition = translations[locale] ?? translations[(localeDefault ?? UKTI_LOCALE_DEFAULT) as LocaleDefault]

    if (!definition) {
      return ''
    }

    const fragments = path.split('.')
    const [parent, child] = fragments
    const [variables] = params as [Record<string, unknown>]

    const template =
      fragments.length === 1 // Parent provided.
        ? definition[parent]
        : fragments.length === 2 // Parent.Child provided.
          ? (definition[parent] as any)?.[child]
          : null // Unknown number of fragments provided.

    if (!template) {
      return ''
    }

    if (variables) {
      return renderUktiTemplate(template, variables, { throwIfError })
    }

    return template
  }
}

export { createUktiTranslator }
