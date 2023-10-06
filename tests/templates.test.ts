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

test('Should render template conditional with comparator "=="', () => {
  type Definition = { x: [{ w: number }] }
  const t = createUktiTranslator<Definition>({
    locale: 'en',
    translations: { en: { x: 'product{{w == 1 ? "" : "s"}}' } }
  })
  expect(t('x', { w: 1 })).toBe('product')
  expect(t('x', { w: 3 })).toBe('products')
})

test('Should render template conditional with comparator "==="', () => {
  type Definition = { x: [{ w: number }] }
  const t = createUktiTranslator<Definition>({
    locale: 'en',
    translations: { en: { x: 'product{{w === 1 ? "" : "s"}}' } }
  })
  expect(t('x', { w: 1 })).toBe('product')
  expect(t('x', { w: 3 })).toBe('products')
})

test('Should render template conditional with comparator "!="', () => {
  type Definition = { x: [{ w: number }] }
  const t = createUktiTranslator<Definition>({
    locale: 'en',
    translations: { en: { x: 'product{{w != 1 ? "s" : ""}}' } }
  })
  expect(t('x', { w: 1 })).toBe('product')
  expect(t('x', { w: 3 })).toBe('products')
})

test('Should render template conditional with comparator "!=="', () => {
  type Definition = { x: [{ w: number }] }
  const t = createUktiTranslator<Definition>({
    locale: 'en',
    translations: { en: { x: 'product{{w !== 1 ? "s" : ""}}' } }
  })
  expect(t('x', { w: 1 })).toBe('product')
  expect(t('x', { w: 3 })).toBe('products')
})

test('Should render template conditional with comparator ">"', () => {
  type Definition = { x: [{ w: number }] }
  const t = createUktiTranslator<Definition>({
    locale: 'en',
    translations: { en: { x: '{{w > 1 ? "a" : "b"}}' } }
  })
  expect(t('x', { w: 1 })).toBe('b')
  expect(t('x', { w: 2 })).toBe('a')
})

test('Should render template conditional with comparator ">="', () => {
  type Definition = { x: [{ w: number }] }
  const t = createUktiTranslator<Definition>({
    locale: 'en',
    translations: { en: { x: '{{w >= 1 ? "a" : "b"}}' } }
  })
  expect(t('x', { w: 0 })).toBe('b')
  expect(t('x', { w: 1 })).toBe('a')
  expect(t('x', { w: 2 })).toBe('a')
})

test('Should render template conditional with comparator "<"', () => {
  type Definition = { x: [{ w: number }] }
  const t = createUktiTranslator<Definition>({
    locale: 'en',
    translations: { en: { x: '{{w < 1 ? "a" : "b"}}' } }
  })
  expect(t('x', { w: 0 })).toBe('a')
  expect(t('x', { w: 1 })).toBe('b')
  expect(t('x', { w: 2 })).toBe('b')
})

test('Should render template conditional with comparator "<="', () => {
  type Definition = { x: [{ w: number }] }
  const t = createUktiTranslator<Definition>({
    locale: 'en',
    translations: { en: { x: '{{w <= 1 ? "a" : "b"}}' } }
  })
  expect(t('x', { w: 0 })).toBe('a')
  expect(t('x', { w: 1 })).toBe('a')
  expect(t('x', { w: 2 })).toBe('b')
})

test('Should render template with multiple variables', () => {
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
    // @ts-expect-error browser api
    .ListFormat('en', { style: 'long', type: 'conjunction' })
    .format(['Motorcycle', 'Bus', 'Car'])

  expect(t('list', { items, length: items.length, location: 'countryside' }))
    .toBe('The land vehicles used are Motorcycle, Bus, and Car in the countryside.')
})
