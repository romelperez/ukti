import { test } from 'vitest'
import { createUktiTranslator } from '../'

test('Should type-safe first level translation definitions', () => {
  type Definition = {
    x: undefined
    y: [{ a: number, b: string }]
  }
  const translator = createUktiTranslator<Definition>({
    translations: {
      en: {
        x: 'x',
        y: 'y'
      }
    }
  })
  const t = translator('en')
  // @ts-expect-error test
  t.x({})
  // @ts-expect-error test
  t.x({ a: 1, b: '2' })
  // @ts-expect-error test
  t.y()
  // @ts-expect-error test
  t.y({ b: 2 })
  // @ts-expect-error test
  t.s()
  // @ts-expect-error test
  t.s({})
})

test('Should type-safe second level translation definitions', () => {
  type Definition = {
    w: undefined
    p: {
      x: undefined
      y: [{ a: number, b: string }]
    }
  }
  const translator = createUktiTranslator<Definition>({
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
  const t = translator('en')
  // @ts-expect-error test
  t.p.x({})
  // @ts-expect-error test
  t.p.x({ a: 1, b: '2' })
  // @ts-expect-error test
  t.p.y()
  // @ts-expect-error test
  t.p.y({ b: 2 })
  // @ts-expect-error test
  t.s()
  // @ts-expect-error test
  t.s({})
  // @ts-expect-error test
  t.p.s()
  // @ts-expect-error test
  t.p.s({})
})

test('Should accept custom languages and default language', () => {
  type Definition = {
    a: undefined
  }
  type Languages = 'fr' | 'hi' | 'zh'
  type LanguageDefault = 'hi'
  const translator1 = createUktiTranslator<Definition, Languages, LanguageDefault>({
    languageDefault: 'hi',
    translations: { hi: { a: 'a' } }
  })
  // @ts-expect-error test
  translator1('es')
  createUktiTranslator<Definition, Languages, LanguageDefault>({
    // @ts-expect-error test
    languageDefault: 'xx',
    translations: { hi: { a: 'a' } }
  })

  createUktiTranslator<Definition, Languages, LanguageDefault>({
    languageDefault: 'hi',
    translations: {
      // @ts-expect-error test
      es: {
        a: 'a'
      }
    }
  })
})

test('Should type-safe regions', () => {
  type Definition = {
    a: undefined
  }
  type Languages = 'fr' | 'hi' | 'zh'
  type LanguageDefault = 'hi'
  createUktiTranslator<Definition, Languages, LanguageDefault>({
    languageDefault: 'hi',
    translations: {
      hi: {
        a: 'a',
        regions: {
          CO: {
            a: 'b'
          },
          // @ts-expect-error test
          X: {
            a: 'y'
          }
        }
      }
    }
  })
  createUktiTranslator<Definition, Languages, LanguageDefault>({
    languageDefault: 'hi',
    translations: {
      hi: {
        a: 'a',
        regions: {
          CO: {
            // @ts-expect-error test
            b: 'b'
          }
        }
      }
    }
  })
})

test('Should type-safe custom regions', () => {
  type Definition = {
    a: undefined
  }
  type Languages = 'fr' | 'hi' | 'zh'
  type LanguageDefault = 'hi'
  type Regions = 'X' | 'Y'
  createUktiTranslator<Definition, Languages, LanguageDefault, Regions>({
    languageDefault: 'hi',
    translations: {
      hi: {
        a: 'a',
        regions: {
          X: {
            a: 'b'
          },
          // @ts-expect-error test
          Z: {
            a: 'c'
          }
        }
      }
    }
  })
  createUktiTranslator<Definition, Languages, LanguageDefault, Regions>({
    languageDefault: 'hi',
    translations: {
      hi: {
        a: 'a',
        regions: {
          Y: {
            // @ts-expect-error test
            b: 'b'
          }
        }
      }
    }
  })
})
