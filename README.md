![](https://github.com/romelperez/ukti/raw/main/ukti.jpg)

# Ukti (उक्ति)

[![version](https://img.shields.io/npm/y/ukti.svg)](https://npmjs.org/package/ukti)
[![tests](https://github.com/romelperez/ukti/workflows/tests/badge.svg)](https://github.com/romelperez/ukti/actions)
[![codefactor](https://www.codefactor.io/repository/github/romelperez/ukti/badge)](https://www.codefactor.io/repository/github/romelperez/ukti)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/ukti.svg)](https://bundlephobia.com/package/ukti)
[![downloads](https://img.shields.io/npm/dm/ukti.svg)](https://npmjs.org/package/ukti)
[![github stars](https://img.shields.io/github/stars/romelperez/ukti.svg?style=social&label=stars)](https://github.com/romelperez/ukti)
[![license](https://img.shields.io/github/license/romelperez/ukti.svg)](https://github.com/romelperez/ukti/blob/main/LICENSE)

Type-safe l10n and i18n JavaScript utility.

"Ukti" from Sanskrit "उक्ति" translates Speech or Language.

## Install

For any ESM and CommonJS JavaScript environment. If TypeScript is used, version 4.5+ is required.

```bash
npm install ukti
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
    }
  }
})

console.log(t('title')) // 'Language'
console.log(t('form.label')) // 'Type your language'
console.log(t('form.error', { name: 'Spanglish' })) // 'The language Spanglish is invalid.'
```
