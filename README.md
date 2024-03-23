![](https://github.com/romelperez/ukti/raw/main/ukti.png)

# Ukti (उक्ति)

[![version](https://img.shields.io/npm/v/ukti)](https://npmjs.org/package/ukti)
[![tests](https://github.com/romelperez/ukti/workflows/tests/badge.svg)](https://github.com/romelperez/ukti/actions)
[![codefactor](https://www.codefactor.io/repository/github/romelperez/ukti/badge)](https://www.codefactor.io/repository/github/romelperez/ukti)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/ukti.svg)](https://bundlephobia.com/package/ukti)
[![downloads](https://img.shields.io/npm/dm/ukti.svg)](https://npmjs.org/package/ukti)
[![github stars](https://img.shields.io/github/stars/romelperez/ukti.svg?style=social&label=stars)](https://github.com/romelperez/ukti)
[![license](https://img.shields.io/github/license/romelperez/ukti.svg)](https://github.com/romelperez/ukti/blob/main/LICENSE)

~1kB Type-safe i18n and l10n JavaScript utility.

Ukti uses [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) for language codes
and [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) for region codes
by default.

"Ukti" from Sanskrit "उक्ति" translates Speech or Language.

## Install

For any ESM and CommonJS JavaScript environment. If TypeScript is used, version 4.5+ is required.

```bash
npm i ukti
```

For UMD version:

```ts
import { createUktiTranslator } from 'ukti/build/umd/ukti.umd.cjs'
```

```html
<script src="https://cdn.jsdelivr.net/npm/ukti/build/umd/ukti.umd.cjs" />
```

```html
<script src="https://unpkg.com/ukti/build/umd/ukti.umd.cjs" />
```

## Basic Usage

Ukti accepts any [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)
language codes for translations.

```ts
import { createUktiTranslator } from 'ukti'

type Definition = {
  title: undefined
  form: {
    label: undefined
    error: [{ name: string }]
  }
}

const translator = createUktiTranslator<Definition>({
  translations: {
    en: {
      title: 'Language',
      form: {
        label: 'Type your language',
        error: 'The language {{name}} is invalid.'
      }
    },
    es: {
      title: 'Idioma',
      form: {
        label: 'Escribe tu idioma',
        error: 'El idioma {{name}} no está soportado.'
      }
    }
  }
})

const t = translator('en')

console.log(t.title()) // 'Language'
console.log(t.form.label()) // 'Type your language'
console.log(t.form.error({ name: 'Spanglish' })) // 'The language Spanglish is invalid.'
```

If the language used is not defined in the translations, the default language is used.
If no configured, `'en'` (English) is used.

The translations object definition can only have two levels of depth for simplicity.

## Constraints

The available languages and default language can be specified to constraint the translations.
All translations are optional, except the default one. They can be any string but
[ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) codes are recommended.

```ts
import { createUktiTranslator } from 'ukti'

type Definition = {
  name: undefined
}
type Languages = 'es' | 'fr' | 'hi'
type LanguagesDefault = 'es'

const translator = createUktiTranslator<Definition, Languages, LanguagesDefault>({
  languageDefault: 'es',
  translations: {
    es: {
      name: 'Nombre'
    },
    fr: {
      name: 'Nom'
    }
  }
})

const t = translator('hi')

console.log(t.name()) // 'Nombre'
```

If the specified language to be used is not defined (`'hi'`) then the default
language (`'es'`) is used.

Language translations are optional (except the default one) but all definition
properties have to be specified in each one.

If there is an incomplete language translation defined (such as partially defined),
an empty string is returned when trying to translate it. This is to prevent
inconsistent translations with some parts in one language and others in another one.

## Regionalization

Ukti can optionally have regions by language.
[ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) country codes
list is used by default.

```ts
import { createUktiTranslator } from 'ukti'

type Definition = {
  friend: undefined
}

const translator = createUktiTranslator<Definition>({
  translations: {
    en: {
      friend: 'Friend',
      regions: {
        US: { // United States
          friend: 'Dude'
        },
        CA: { // Canada
          friend: 'Buddy'
        }
      }
    },
    es: {
      friend: 'Amigo',
      regions: {
        CO: { // Colombia
          friend: 'Parce'
        },
        VN: { // Venezuela
          friend: 'Pana'
        }
      }
    }
  }
})

const t = translator('es', 'CO') // Spanish from Colombia

console.log(t.friend()) // 'Parce'
```

If an unknown region is specified, the general language translation is used.

Custom regions can be specified similar to the [IETF language tag](https://en.wikipedia.org/wiki/IETF_language_tag) spec.

```ts
import { type UktiLanguages, createUktiTranslator } from 'ukti'

type Definition = {
  friend: undefined
}
type LanguageDefault = 'en'
type Regions = 'USA' | 'Canada'

const translator = createUktiTranslator<Definition, UktiLanguages, LanguageDefault, Regions>({
  translations: {
    en: {
      friend: 'Friend',
      regions: {
        USA: {
          friend: 'Dude'
        },
        Canada: {
          friend: 'Buddy'
        }
      }
    }
  }
})

const t = translator('en', 'Canada')

console.log(t.friend()) // 'Buddy'
```

## Templates

Translations texts are templates supporting variables interpolations.
e.g. displaying different words based on conditions.

```ts
import { createUktiTranslator } from 'ukti'

type Definition = {
  stock: [{ qty: number }]
}

const translator = createUktiTranslator<Definition>({
  translations: {
    en: {
      stock: "There {{qty == 1 ? 'is' : 'are'}} {{qty}} product{{qty == 1 ? '' : 's'}} available"
    }
  }
})

const t = translator('en')

console.log(t.stock({ qty: 1 })) // 'There is 1 product available'
console.log(t.stock({ qty: 3 })) // 'There are 3 products available'
```

The variables can be formatted using the native JavaScript [`Intl`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)
object methods before providing them to the translator.

```ts
import { createUktiTranslator } from 'ukti'

type Definition = {
  list: [{ items: string, length: number, location: string }]
}

const translator = createUktiTranslator<Definition>({
  translations: {
    en: {
      list: 'The land vehicle{{length == 1 ? "" : "s"}} used {{length == 1 ? "is" : "are"}} {{items}} in the {{location}}.'
    }
  }
})

const t = translator('en')

const items = new Intl
  .ListFormat('en', { style: 'long', type: 'conjunction' })
  .format(['motorcycle', 'bus', 'car'])

console.log(t.list({ items, length: items.length, location: 'countryside' }))
// 'The land vehicles used are motorcycle, bus, and car in the countryside.'

console.log(t.list({ items: 'car', length: 1, location: 'city' }))
// 'The land vehicle used is car in the city.'
```

Ukti supports the comparison operators `==`, `===`, `!=`, `!==`, `>`, `>=`, `<`, `<=`
in the template conditionals. All comparators are strict, so `==` and `===` are interchangeably.

If the template requires variables but they are not provided or `undefined` when
calling the translation, an empty string is returned to prevent incorrect translations.
An error message is logged in the console too.

## Modularization

Ukti provides some type utilities to allow modularization in translations.

```ts
import {
  type UktiLanguages, // Language code list of ISO 639-1
  type UktiRegions, // Countries code list of ISO 3166-1 alpha-2
  type UktiTranslations, // UktiTranslations<Definition, Languages?, DefaultLocale = 'en', Regions?>
  type UktiTranslation, // UktiTranslation<Definition, Regions?>
  type UktiTranslationData, // UktiTranslationData<Definition>
  type UktiTranslationDataPartial, // UktiTranslationDataPartial<Definition>
  createUktiTranslator
} from 'ukti'

type Definition = {
  friend: undefined
}

const translation_EN_Core: UktiTranslationData<Definition> = {
  friend: 'Friend'
}

const translation_EN_US: UktiTranslationDataPartial<Definition> = {
  friend: 'Dude'
}

const translation_EN_CA: UktiTranslationDataPartial<Definition> = {
  friend: 'Buddy'
}

const translation_EN: UktiTranslation<Definition, UktiRegions> = {
  ...translation_EN_Core,
  regions: {
    US: translation_EN_US,
    CA: translation_EN_CA
  }
}

type LanguageDefault = 'en'

const translations: UktiTranslations<Definition, UktiLanguages, LanguageDefault, UktiRegions> = {
  en: translation_EN
}

const translator = createUktiTranslator<Definition, UktiLanguages, LanguageDefault, UktiRegions>({
  translations
})

const language = 'en' as const satisfies UktiLanguages
const region = 'CA' as const satisfies UktiRegions
const t = translator(language, region)

console.log(t.friend()) // 'Buddy'
```
