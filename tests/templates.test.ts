import { test, expect, vi, afterEach } from 'vitest'
import { renderUktiTemplate } from '../'

afterEach(() => {
  vi.restoreAllMocks()
})

test('Should render template variable', () => {
  const template = '{{v}} a {{ v}} b {{v }} c {{ v }}'
  expect(renderUktiTemplate(template, { v: 7 })).toBe('7 a 7 b 7 c 7')
})

test('Should render template truthy variable in conditional with string/numeric values with double quotes', () => {
  const template = 'a {{v ? "p" : "q"}} b {{v ? 10 : 20}} c'
  expect(renderUktiTemplate(template, { v: true })).toBe('a p b 10 c')
  expect(renderUktiTemplate(template, { v: false })).toBe('a q b 20 c')
})

test('Should render template truthy variable in conditional with string/numeric values with single quotes', () => {
  const template = "a {{v ? 'p' : 'q'}} b {{v ? 10 : 20}} c"
  expect(renderUktiTemplate(template, { v: true })).toBe('a p b 10 c')
  expect(renderUktiTemplate(template, { v: false })).toBe('a q b 20 c')
})

test('Should render template conditional values for scapes quotes', () => {
  const template = 'a {{v ? \'\'p\'\' : ""q""}} b {{v ? 10 : 20}} c'
  expect(renderUktiTemplate(template, { v: true })).toBe("a 'p' b 10 c")
  expect(renderUktiTemplate(template, { v: false })).toBe('a "q" b 20 c')
})

test('Should render template conditional with empty strings', () => {
  const template = 'There {{isUnit ? "is" : "are"}} {{qty}} product{{isUnit ? "" : "s"}} available'
  expect(renderUktiTemplate(template, { qty: 1, isUnit: true })).toBe(
    'There is 1 product available'
  )
  expect(renderUktiTemplate(template, { qty: 3, isUnit: false })).toBe(
    'There are 3 products available'
  )
})

test('Should render template conditional with "==" comparator', () => {
  const template = 'product{{w == 1 ? "" : "s"}}'
  expect(renderUktiTemplate(template, { w: 1 })).toBe('product')
  expect(renderUktiTemplate(template, { w: 3 })).toBe('products')
})

test('Should render template conditional with "===" comparator', () => {
  const template = 'product{{w === 1 ? "" : "s"}}'
  expect(renderUktiTemplate(template, { w: 1 })).toBe('product')
  expect(renderUktiTemplate(template, { w: 3 })).toBe('products')
})

test('Should render template conditional with "!=" comparator', () => {
  const template = 'product{{w != 1 ? "s" : ""}}'
  expect(renderUktiTemplate(template, { w: 1 })).toBe('product')
  expect(renderUktiTemplate(template, { w: 3 })).toBe('products')
})

test('Should render template conditional with "!==" comparator', () => {
  const template = 'product{{w !== 1 ? "s" : ""}}'
  expect(renderUktiTemplate(template, { w: 1 })).toBe('product')
  expect(renderUktiTemplate(template, { w: 3 })).toBe('products')
})

test('Should render template conditional with ">" comparator', () => {
  const template = '{{w > 1 ? "a" : "b"}}'
  expect(renderUktiTemplate(template, { w: 1 })).toBe('b')
  expect(renderUktiTemplate(template, { w: 2 })).toBe('a')
})

test('Should render template conditional with ">=" comparator', () => {
  const template = '{{w >= 1 ? "a" : "b"}}'
  expect(renderUktiTemplate(template, { w: 0 })).toBe('b')
  expect(renderUktiTemplate(template, { w: 1 })).toBe('a')
  expect(renderUktiTemplate(template, { w: 2 })).toBe('a')
})

test('Should render template conditional with "<" comparator', () => {
  const template = '{{w < 1 ? "a" : "b"}}'
  expect(renderUktiTemplate(template, { w: 0 })).toBe('a')
  expect(renderUktiTemplate(template, { w: 1 })).toBe('b')
  expect(renderUktiTemplate(template, { w: 2 })).toBe('b')
})

test('Should render template conditional with "<=" comparator', () => {
  const template = '{{w <= 1 ? "a" : "b"}}'
  expect(renderUktiTemplate(template, { w: 0 })).toBe('a')
  expect(renderUktiTemplate(template, { w: 1 })).toBe('a')
  expect(renderUktiTemplate(template, { w: 2 })).toBe('b')
})

test('Should render template with multiple variables', () => {
  const template =
    'The land vehicle{{length == 1 ? "" : "s"}} used {{length == 1 ? "is" : "are"}} {{items}} in the {{location}}.'
  const items = new // @ts-expect-error browser api
  Intl.ListFormat('en', { style: 'long', type: 'conjunction' }).format(['Motorcycle', 'Bus', 'Car'])

  expect(
    renderUktiTemplate(template, { items, length: items.length, location: 'countryside' })
  ).toBe('The land vehicles used are Motorcycle, Bus, and Car in the countryside.')
})

test('Should console error if required variable is not defined', () => {
  const consoleError = vi.spyOn(console, 'error')
  const template = '{{a}}'
  expect(renderUktiTemplate(template, {} as any)).toBe('')
  expect(consoleError).toHaveBeenCalledTimes(1)
  expect(consoleError).toHaveBeenCalledWith(
    'Ukti template requires defined variable "a" to render.'
  )
  expect(renderUktiTemplate(template, { a: undefined } as any)).toBe('')
  expect(consoleError).toHaveBeenCalledTimes(2)
  expect(consoleError).toHaveBeenCalledWith(
    'Ukti template requires defined variable "a" to render.'
  )
})

test('Should console error if required variable in conditional is not defined', () => {
  const consoleError = vi.spyOn(console, 'error')
  const template = '{{a ? b : c}}'
  expect(renderUktiTemplate(template, { b: 2, c: 3 } as any)).toBe('')
  expect(consoleError).toHaveBeenCalledTimes(1)
  expect(consoleError).toHaveBeenCalledWith(
    'Ukti template requires defined variable "a" to render.'
  )
  expect(renderUktiTemplate(template, { a: true, c: 3 } as any)).toBe('')
  expect(consoleError).toHaveBeenCalledTimes(2)
  expect(consoleError).toHaveBeenCalledWith(
    'Ukti template requires defined variable "b" to render.'
  )
  expect(renderUktiTemplate(template, { a: false, b: 3 } as any)).toBe('')
  expect(consoleError).toHaveBeenCalledTimes(3)
  expect(consoleError).toHaveBeenCalledWith(
    'Ukti template requires defined variable "c" to render.'
  )
  expect(renderUktiTemplate(template, { a: true, b: 3, c: 4 } as any)).toBe('3')
  expect(consoleError).toHaveBeenCalledTimes(3)
})

test('Should console error if required variable in conditional with comparator is not defined', () => {
  const consoleError = vi.spyOn(console, 'error')
  const template = '{{a > b ? c : d}}'
  expect(renderUktiTemplate(template, { b: 0, c: 3, d: 4 } as any)).toBe('')
  expect(consoleError).toHaveBeenCalledTimes(1)
  expect(consoleError).toHaveBeenCalledWith(
    'Ukti template requires defined variable "a" to render.'
  )
  expect(renderUktiTemplate(template, { a: 0, c: 3, d: 4 } as any)).toBe('')
  expect(consoleError).toHaveBeenCalledTimes(2)
  expect(consoleError).toHaveBeenCalledWith(
    'Ukti template requires defined variable "b" to render.'
  )
  expect(renderUktiTemplate(template, { a: 1, b: 0, d: 4 } as any)).toBe('')
  expect(consoleError).toHaveBeenCalledTimes(3)
  expect(consoleError).toHaveBeenCalledWith(
    'Ukti template requires defined variable "c" to render.'
  )
  expect(renderUktiTemplate(template, { a: 1, b: 2, c: 3 } as any)).toBe('')
  expect(consoleError).toHaveBeenCalledTimes(4)
  expect(consoleError).toHaveBeenCalledWith(
    'Ukti template requires defined variable "d" to render.'
  )
  expect(renderUktiTemplate(template, { a: 1, b: 2, c: 3, d: 4 } as any)).toBe('4')
  expect(consoleError).toHaveBeenCalledTimes(4)
})

test('Should throw error if required variable is not defined and "throwIfError" enabled', () => {
  const template = '{{qty}} products'
  expect(() => renderUktiTemplate(template, {} as any, { throwIfError: true })).toThrowError(
    'Ukti template requires defined variable "qty" to render.'
  )
})
