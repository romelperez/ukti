import { test } from 'vitest'
import { createUktiTranslator } from '../'

test('Should type-safe first level translation definitions', () => {
  type Definition = {
    x: undefined
    y: [{ a: number, b: string }]
  }
  const t = createUktiTranslator<Definition>({
    locale: 'en',
    translations: {
      en: {
        x: 'x',
        y: 'y'
      }
    }
  })
  // @ts-expect-error test
  t('x', {})
  // @ts-expect-error test
  t('x', { a: 1, b: '2' })
  // @ts-expect-error test
  t('y')
  // @ts-expect-error test
  t('y', { b: 2 })
  // @ts-expect-error test
  t('s')
  // @ts-expect-error test
  t('s', {})
})

test('Should type-safe second level translation definitions', () => {
  type Definition = {
    w: undefined
    p: {
      x: undefined
      y: [{ a: number, b: string }]
    }
  }
  const t = createUktiTranslator<Definition>({
    locale: 'en',
    translations: {
      en: {
        w: 'w',
        p: {
          x: 'x',
          y: 'y'
        }
      }
    }
  })
  // @ts-expect-error test
  t('p.x', {})
  // @ts-expect-error test
  t('p.x', { a: 1, b: '2' })
  // @ts-expect-error test
  t('p.y')
  // @ts-expect-error test
  t('p.y', { b: 2 })
  // @ts-expect-error test
  t('s')
  // @ts-expect-error test
  t('s', {})
  // @ts-expect-error test
  t('p.s')
  // @ts-expect-error test
  t('p.s', {})
})

test('Should accept custom locales and default locale', () => {
  type Definition = {
    a: undefined
  }
  type Locales = 'fr' | 'hi' | 'zh'
  type LocaleDefault = 'hi'
  createUktiTranslator<Definition, Locales, LocaleDefault>({
    // @ts-expect-error test
    locale: 'es',
    translations: { hi: { a: 'a' } }
  })
  createUktiTranslator<Definition, Locales, LocaleDefault>({
    locale: 'hi',
    // @ts-expect-error test
    localeDefault: 'xx',
    translations: { hi: { a: 'a' } }
  })
  createUktiTranslator<Definition, Locales, LocaleDefault>({
    locale: 'fr',
    localeDefault: 'hi',
    // @ts-expect-error test
    translations: { es: { a: 'a' } }
  })
})
