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
  expect(t.x()).toBe('x')
  expect(t.y()).toBe('y')
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
  expect(t.x()).toBe('x')
  expect(t.y({ a: 1, b: '2' })).toBe('y')
})

test('Should interpolate defined variables for a specific nested translation', () => {
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
  expect(t.a()).toBe('a')
  expect(t.b({ age: 21 })).toBe('21 yo')
  expect(t.x.p()).toBe('x.p')
  expect(t.x.q({ name: 'Romel' })).toBe('hello Romel')
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
  expect(t.x.a()).toBe('x.a')
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
  expect(t.a()).toBe('a')
  expect(t.x.p()).toBe('x.p')
})

test('Should get default locale translation if no provided locale translation is available with custom locales', () => {
  type Definition = {
    x: {
      a: undefined
    }
  }
  type Locales = 'hi' | 'fr' | 'zh'
  type LocaleDefault = 'hi'
  const t = createUktiTranslator<Definition, Locales, LocaleDefault>({
    locale: 'zh',
    localeDefault: 'hi',
    translations: {
      hi: {
        x: {
          a: 'hi.x.a'
        }
      },
      fr: {
        x: {
          a: 'fr.x.a'
        }
      }
    }
  })
  expect(t.x.a()).toBe('hi.x.a')
})

test('Should get empty string if provided locale translation is available with incomplete nesting', () => {
  type Definition = {
    x: {
      a: undefined
    }
  }
  type Locales = 'hi' | 'fr' | 'zh'
  type LocaleDefault = 'hi'
  const t = createUktiTranslator<Definition, Locales, LocaleDefault>({
    locale: 'zh',
    localeDefault: 'hi',
    translations: {
      hi: {
        x: {
          a: 'hi.x.a'
        }
      },
      fr: {
        x: {
          a: 'fr.x.a'
        }
      },
      zh: {} as any // Used incomplete translation.
    }
  })
  expect(t.x.a()).toBe('')
})

test('Should return empty string if trying to translate and undefined item', () => {
  type Definition = {
    x: undefined
    y: {
      z: undefined
    }
  }
  const t = createUktiTranslator<Definition>({
    locale: 'en',
    translations: {
      en: {
        x: 'x',
        y: {
          z: 'y.z'
        }
      }
    }
  })
  expect(t.x()).toBe('x')
  expect(t.y.z()).toBe('y.z')
  // @ts-expect-error test
  expect(t.z()).toBe('')
  // @ts-expect-error test
  expect(t.y.a()).toBe('')
})
