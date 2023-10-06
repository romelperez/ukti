import { test, expect } from 'vitest'
import { createUktiTranslator } from '../'

test('Should get basic translation of defined locale', () => {
  type Definition = {
    x: undefined
    y: undefined
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
  expect(t('x')).toBe('x')
  expect(t('y')).toBe('y')
})

test('Should get basic translation and interpolate variables of defined locale', () => {
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
  expect(t('y', { a: 1, b: '2' })).toBe('y')
})

test('Should get nested translation of defined locale', () => {
  type Definition = {
    x: {
      h: undefined
      i: undefined
    }
  }
  const t = createUktiTranslator<Definition>({
    locale: 'en',
    translations: {
      en: {
        x: {
          h: 'x.h',
          i: 'x.i'
        }
      }
    }
  })
  expect(t('x.h')).toBe('x.h')
  expect(t('x.i')).toBe('x.i')
})

test('Should interpolate defined variables for a specific nested translation', () => {
  type Definition = {
    x: {
      a: undefined
      b: [{ name: string, age: number }]
    }
  }
  const t = createUktiTranslator<Definition>({
    locale: 'en',
    translations: {
      en: {
        x: {
          a: 'Random text',
          b: 'My name is {{name}} and I am {{age}} years old'
        }
      }
    }
  })
  expect(t('x.a')).toBe('Random text')
  expect(t('x.b', { name: 'Ukti', age: 21 })).toBe('My name is Ukti and I am 21 years old')
})

test('Should get default locale translation if no provided locale translation is available', () => {
  type Definition = {
    x: {
      a: undefined
    }
  }
  const t = createUktiTranslator<Definition>({
    locale: 'fr',
    translations: {
      en: {
        x: {
          a: 'x.a'
        }
      }
    }
  })
  expect(t('x.a')).toBe('x.a')
})

test('Should process nested translations', () => {
  type Definition = {
    a: undefined
    b: [{ age: number }]
    x: {
      p: undefined
      q: [{ name: string }]
    }
  }
  const t = createUktiTranslator<Definition>({
    locale: 'en',
    translations: {
      en: {
        a: 'a',
        b: '{{age}} yo',
        x: {
          p: 'x.p',
          q: 'hello {{name}}'
        }
      }
    }
  })
  expect(t('a')).toBe('a')
  expect(t('b', { age: 21 })).toBe('21 yo')
  expect(t('x.p')).toBe('x.p')
  expect(t('x.q', { name: 'Romel' })).toBe('hello Romel')
})

test('Should accept custom locales and default locale', () => {
  type Definition = {
    a: undefined
    x: {
      p: undefined
    }
  }
  type Locales = 'fr' | 'hi' | 'zh'
  type LocaleDefault = 'hi'
  const t = createUktiTranslator<Definition, Locales, LocaleDefault>({
    locale: 'hi',
    localeDefault: 'hi',
    translations: {
      hi: {
        a: 'a',
        x: {
          p: 'x.p'
        }
      }
    }
  })
  expect(t('a')).toBe('a')
  expect(t('x.p')).toBe('x.p')
})

test('Should get default locale translation if no provided locale translation is available with custom locales', () => {
  type Definition = {
    x: {
      a: undefined
    }
  }
  type Locales = 'fr' | 'hi' | 'zh'
  type LocaleDefault = 'hi'
  const t = createUktiTranslator<Definition, Locales, LocaleDefault>({
    locale: 'zh',
    localeDefault: 'hi',
    translations: {
      fr: {
        x: {
          a: 'fr.x.a'
        }
      },
      hi: {
        x: {
          a: 'hi.x.a'
        }
      }
    }
  })
  expect(t('x.a')).toBe('hi.x.a')
})
