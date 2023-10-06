import { test, expect, vi, afterEach } from 'vitest'
import { createUktiTranslator } from '../'

afterEach(() => {
  vi.restoreAllMocks()
})

test('Should render template variable', () => {
  type Definition = {
    x: [{ v: number }]
  }
  const t = createUktiTranslator<Definition>({
    locale: 'en',
    translations: {
      en: {
        x: '{{v}} a {{ v}} b {{v }} c {{ v }}'
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

test('Should render template conditional with "==" comparator', () => {
  type Definition = { x: [{ w: number }] }
  const t = createUktiTranslator<Definition>({
    locale: 'en',
    translations: { en: { x: 'product{{w == 1 ? "" : "s"}}' } }
  })
  expect(t('x', { w: 1 })).toBe('product')
  expect(t('x', { w: 3 })).toBe('products')
})

test('Should render template conditional with "===" comparator', () => {
  type Definition = { x: [{ w: number }] }
  const t = createUktiTranslator<Definition>({
    locale: 'en',
    translations: { en: { x: 'product{{w === 1 ? "" : "s"}}' } }
  })
  expect(t('x', { w: 1 })).toBe('product')
  expect(t('x', { w: 3 })).toBe('products')
})

test('Should render template conditional with "!=" comparator', () => {
  type Definition = { x: [{ w: number }] }
  const t = createUktiTranslator<Definition>({
    locale: 'en',
    translations: { en: { x: 'product{{w != 1 ? "s" : ""}}' } }
  })
  expect(t('x', { w: 1 })).toBe('product')
  expect(t('x', { w: 3 })).toBe('products')
})

test('Should render template conditional with "!==" comparator', () => {
  type Definition = { x: [{ w: number }] }
  const t = createUktiTranslator<Definition>({
    locale: 'en',
    translations: { en: { x: 'product{{w !== 1 ? "s" : ""}}' } }
  })
  expect(t('x', { w: 1 })).toBe('product')
  expect(t('x', { w: 3 })).toBe('products')
})

test('Should render template conditional with ">" comparator', () => {
  type Definition = { x: [{ w: number }] }
  const t = createUktiTranslator<Definition>({
    locale: 'en',
    translations: { en: { x: '{{w > 1 ? "a" : "b"}}' } }
  })
  expect(t('x', { w: 1 })).toBe('b')
  expect(t('x', { w: 2 })).toBe('a')
})

test('Should render template conditional with ">=" comparator', () => {
  type Definition = { x: [{ w: number }] }
  const t = createUktiTranslator<Definition>({
    locale: 'en',
    translations: { en: { x: '{{w >= 1 ? "a" : "b"}}' } }
  })
  expect(t('x', { w: 0 })).toBe('b')
  expect(t('x', { w: 1 })).toBe('a')
  expect(t('x', { w: 2 })).toBe('a')
})

test('Should render template conditional with "<" comparator', () => {
  type Definition = { x: [{ w: number }] }
  const t = createUktiTranslator<Definition>({
    locale: 'en',
    translations: { en: { x: '{{w < 1 ? "a" : "b"}}' } }
  })
  expect(t('x', { w: 0 })).toBe('a')
  expect(t('x', { w: 1 })).toBe('b')
  expect(t('x', { w: 2 })).toBe('b')
})

test('Should render template conditional with "<=" comparator', () => {
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

test('Should console error if required variable is not defined', () => {
  const consoleError = vi.spyOn(console, 'error')
  type Definition = {
    example: [{ a: number, b: number, c: number, d: number }]
  }
  const t = createUktiTranslator<Definition>({
    locale: 'en',
    translations: {
      en: {
        example: '{{a}}'
      }
    }
  })
  expect(t('example', {} as any)).toBe('')
  expect(consoleError).toHaveBeenCalledTimes(1)
  expect(consoleError).toHaveBeenCalledWith('Ukti template requires defined variable "a" to render.')
  expect(t('example', { a: undefined } as any)).toBe('')
  expect(consoleError).toHaveBeenCalledTimes(2)
  expect(consoleError).toHaveBeenCalledWith('Ukti template requires defined variable "a" to render.')
})

test('Should console error if required variable in conditional is not defined', () => {
  const consoleError = vi.spyOn(console, 'error')
  type Definition = {
    example: [{ a: number, b: number, c: number, d: number }]
  }
  const t = createUktiTranslator<Definition>({
    locale: 'en',
    translations: {
      en: {
        example: '{{a ? b : c}}'
      }
    }
  })
  expect(t('example', { b: 2, c: 3 } as any)).toBe('')
  expect(consoleError).toHaveBeenCalledTimes(1)
  expect(consoleError).toHaveBeenCalledWith('Ukti template requires defined variable "a" to render.')
  expect(t('example', { a: true, c: 3 } as any)).toBe('')
  expect(consoleError).toHaveBeenCalledTimes(2)
  expect(consoleError).toHaveBeenCalledWith('Ukti template requires defined variable "b" to render.')
  expect(t('example', { a: false, b: 3 } as any)).toBe('')
  expect(consoleError).toHaveBeenCalledTimes(3)
  expect(consoleError).toHaveBeenCalledWith('Ukti template requires defined variable "c" to render.')
  expect(t('example', { a: true, b: 3, c: 4 } as any)).toBe('3')
  expect(consoleError).toHaveBeenCalledTimes(3)
})

test('Should console error if required variable in conditional with comparator is not defined', () => {
  const consoleError = vi.spyOn(console, 'error')
  type Definition = {
    example: [{ a: number, b: number, c: number, d: number }]
  }
  const t = createUktiTranslator<Definition>({
    locale: 'en',
    translations: {
      en: {
        example: '{{a > b ? c : d}}'
      }
    }
  })
  expect(t('example', { b: 0, c: 3, d: 4 } as any)).toBe('')
  expect(consoleError).toHaveBeenCalledTimes(1)
  expect(consoleError).toHaveBeenCalledWith('Ukti template requires defined variable "a" to render.')
  expect(t('example', { a: 0, c: 3, d: 4 } as any)).toBe('')
  expect(consoleError).toHaveBeenCalledTimes(2)
  expect(consoleError).toHaveBeenCalledWith('Ukti template requires defined variable "b" to render.')
  expect(t('example', { a: 1, b: 0, d: 4 } as any)).toBe('')
  expect(consoleError).toHaveBeenCalledTimes(3)
  expect(consoleError).toHaveBeenCalledWith('Ukti template requires defined variable "c" to render.')
  expect(t('example', { a: 1, b: 2, c: 3 } as any)).toBe('')
  expect(consoleError).toHaveBeenCalledTimes(4)
  expect(consoleError).toHaveBeenCalledWith('Ukti template requires defined variable "d" to render.')
  expect(t('example', { a: 1, b: 2, c: 3, d: 4 } as any)).toBe('4')
  expect(consoleError).toHaveBeenCalledTimes(4)
})

test('Should throw error if required variable is not defined and "throwIfError" enabled', () => {
  type Definition = {
    products: [{ qty: number }]
  }
  const t = createUktiTranslator<Definition>({
    locale: 'en',
    throwIfError: true,
    translations: {
      en: {
        products: '{{qty}} products'
      }
    }
  })
  expect(() => t('products', {} as any)).toThrowError('Ukti template requires defined variable "qty" to render.')
})
