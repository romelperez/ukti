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
locale codes for translations.

```ts
import { createUktiTranslator } from 'ukti'

type Definition = {
  title: undefined
  form: {
    label: undefined
    error: [{ name: string }]
  }
}

const t = createUktiTranslator<Definition>({
  locale: 'en',
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

console.log(t.title()) // 'Language'
console.log(t.form.label()) // 'Type your language'
console.log(t.form.error({ name: 'Spanglish' })) // 'The language Spanglish is invalid.'
```

If the used locale is not defined in the translations, the default locale is used.
If no configured, `'en'` (English) is used.

The translations object definition can only have two levels of depth for simplicity.

## Locales Constraint

The availables locales and default locale can be specified to constraint the translations.
All translations are optional, except the default one.

```ts
import { createUktiTranslator } from 'ukti'

type Definition = {
  title: undefined
  form: {
    label: undefined
    error: [{ name: string }]
  }
}
type Locales = 'es' | 'fr' | 'hi'
type LocaleDefault = 'es'

const t = createUktiTranslator<Definition, Locales, LocaleDefault>({
  locale: 'hi',
  localeDefault: 'es',
  translations: {
    es: {
      title: 'Idioma',
      form: {
        label: 'Escribe tu idioma',
        error: 'El idioma {{name}} no está soportado.'
      }
    },
    fr: {
      title: 'Langue',
      form: {
        label: 'Tapez votre langue',
        error: "La langue {{name}} n'est pas valide."
      }
    }
  }
})

console.log(t.title()) // 'Idioma'
console.log(t.form.label()) // 'Escribe tu idioma'
console.log(t.form.error({ name: 'Spanglish' })) // 'El idioma Spanglish no está soportado.'
```

If the specified locale to be used is not defined (`'hi'`) then the default
locale (`'es'`) is used.

Locales translations are optional (except the default one) but the all definition
properties have to be specified.

If there is an incomplete locale translation defined (such as partially defined),
an empty string is returned when trying to translate it. This is to prevent
inconsistent translations with some parts in one language and others in another one.

## Templates

Translations texts are templates supporting variables interpolations.
e.g. displaying different words based on conditions.

```ts
import { createUktiTranslator } from 'ukti'

type Definition = {
  stock: [{ qty: number }]
}

const t = createUktiTranslator<Definition>({
  locale: 'en',
  translations: {
    en: {
      stock: "There {{qty == 1 ? 'is' : 'are'}} {{qty}} product{{qty == 1 ? '' : 's'}} available"
    }
  }
})

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

const t = createUktiTranslator<Definition>({
  locale: 'en',
  translations: {
    en: {
      list: 'The land vehicle{{length == 1 ? "" : "s"}} used {{length == 1 ? "is" : "are"}} {{items}} in the {{location}}.'
    }
  }
})

const items = new Intl
  .ListFormat('en', { style: 'long', type: 'conjunction' })
  .format(['motorcycle', 'bus', 'car'])

console.log(t.list({ items, length: items.length, location: 'countryside' }))
// 'The land vehicles used are motorcycle, bus, and car in the countryside.'

console.log(t.list({ items: 'car', length: 1, location: 'city' }))
// 'The land vehicle used is car in the city.'
```

Ukti supports the comparison operators `==`, `===`, `!=`, `!==`, `>`, `>=`, `<`, `<=`
in the template conditionals.

If the template requires variables but they are not provided or `undefined` when
calling the translation, an empty string is returned to prevent incorrect translations.
An error message is logged in the console too.
