import { test, expect } from 'vitest'
import { createUktiTranslator } from '../'

test('Should render template variable', () => {
  type Definition = {
    x: [{ v: number }]
  }
  const t = createUktiTranslator<Definition>({
    locale: 'en',
    translations: {
      en: {
        x: '{{v}} a {{v}} b {{v}} c {{v}}'
      }
    }
  })
  expect(t('x', { v: 7 })).toBe('7 a 7 b 7 c 7')
})

test('Should render template truthy variable in conditional with string/numeric values with double quotes', () => {
  type Definition = {
    x: [{ v: boolean }]
  }
  const t = createUktiTranslator<Definition>({
    locale: 'en',
    translations: {
      en: {
        x: 'a {{v ? "p" : "q"}} b {{v ? 10 : 20}} c'
      }
    }
  })
  expect(t('x', { v: true })).toBe('a p b 10 c')
  expect(t('x', { v: false })).toBe('a q b 20 c')
})

test('Should render template truthy variable in conditional with string/numeric values with single quotes', () => {
  type Definition = {
    x: [{ v: boolean }]
  }
  const t = createUktiTranslator<Definition>({
    locale: 'en',
    translations: {
      en: {
        x: 'a {{v ? \'p\' : \'q\'}} b {{v ? 10 : 20}} c'
      }
    }
  })
  expect(t('x', { v: true })).toBe('a p b 10 c')
  expect(t('x', { v: false })).toBe('a q b 20 c')
})

test('Should render template conditional values for scapes quotes', () => {
  type Definition = {
    x: [{ v: boolean }]
  }
  const t = createUktiTranslator<Definition>({
    locale: 'en',
    translations: {
      en: {
        x: 'a {{v ? \'\'p\'\' : ""q""}} b {{v ? 10 : 20}} c'
      }
    }
  })
  expect(t('x', { v: true })).toBe('a \'p\' b 10 c')
  expect(t('x', { v: false })).toBe('a "q" b 20 c')
})

test('Should render template conditional with empty strings', () => {
  type Definition = {
    stock: [{ qty: number, isUnit: boolean }]
  }
  const t = createUktiTranslator<Definition>({
    locale: 'en',
    translations: {
      en: {
        stock: 'There {{isUnit ? "is" : "are"}} {{qty}} product{{isUnit ? "" : "s"}} available'
      }
    }
  })
  expect(t('stock', { qty: 1, isUnit: true })).toBe('There is 1 product available')
  expect(t('stock', { qty: 3, isUnit: false })).toBe('There are 3 products available')
})
