import { vi, test, expect, afterEach } from 'vitest'
import { createUktiTranslator } from '../'

afterEach(() => {
  vi.restoreAllMocks()
})

test('Should get basic translation of defined language', () => {
  type Definition = {
    x: undefined
    y: undefined
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
  expect(t.x()).toBe('x')
  expect(t.y()).toBe('y')
})

test('Should get default language translation if nonexistent provided language', () => {
  type Definition = {
    x: undefined
    y: undefined
  }
  const translator = createUktiTranslator<Definition>({
    translations: {
      en: {
        x: 'x',
        y: 'y'
      }
    }
  })
  // @ts-expect-error test
  expect(translator('x').x()).toBe('x')
  // @ts-expect-error test
  expect(translator('xyz').y()).toBe('y')
})

test('Should throw error if default language translation is not defined', () => {
  type Definition = {
    x: undefined
    y: undefined
  }
  expect(() => {
    createUktiTranslator<Definition>({
      translations: {
        hi: {
          x: 'x',
          y: 'y'
        }
      } as any
    })
  }).toThrowError('Ukti requires the translations to have at least the default language.')
})

test('Should get basic translation and interpolate variables of defined language', () => {
  type Definition = {
    x: undefined
    y: [{ a: number, b: string }]
  }
  const translator = createUktiTranslator<Definition>({
    translations: {
      en: {
        x: 'x',
        y: 'a={{a}} b={{b}}'
      }
    }
  })
  const t = translator('en')
  expect(t.x()).toBe('x')
  expect(t.y({ a: 1, b: '2' })).toBe('a=1 b=2')
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
  const translator = createUktiTranslator<Definition>({
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
  const t = translator('en')
  expect(t.a()).toBe('a')
  expect(t.b({ age: 21 })).toBe('21 yo')
  expect(t.x.p()).toBe('x.p')
  expect(t.x.q({ name: 'Romel' })).toBe('hello Romel')
})

test('Should get default language translation if no provided language translation is available', () => {
  type Definition = {
    x: {
      a: undefined
    }
  }
  const translator = createUktiTranslator<Definition>({
    translations: {
      en: {
        x: {
          a: 'x.a'
        }
      }
    }
  })
  const t = translator('fr')
  expect(t.x.a()).toBe('x.a')
})

test('Should accept custom locales and default language', () => {
  type Definition = {
    a: undefined
    x: {
      p: undefined
    }
  }
  type Languages = 'fr' | 'hi' | 'zh'
  type LanguageDefault = 'hi'
  const translator = createUktiTranslator<Definition, Languages, LanguageDefault>({
    languageDefault: 'hi',
    translations: {
      hi: {
        a: 'a',
        x: {
          p: 'x.p'
        }
      }
    }
  })
  const t = translator('hi')
  expect(t.a()).toBe('a')
  expect(t.x.p()).toBe('x.p')
})

test('Should get default language translation if no provided language translation is available with custom locales', () => {
  type Definition = {
    x: {
      a: undefined
    }
  }
  type Languages = 'hi' | 'fr' | 'zh'
  type LanguageDefault = 'hi'
  const translator = createUktiTranslator<Definition, Languages, LanguageDefault>({
    languageDefault: 'hi',
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
  const t = translator('zh')
  expect(t.x.a()).toBe('hi.x.a')
})

test('Should get regional translation if provided and defined, otherwise the core language translation', () => {
  type Definition = {
    friend: undefined
    parents: {
      mom: undefined
    }
  }
  const translator = createUktiTranslator<Definition>({
    translations: {
      en: {
        friend: 'Friend',
        parents: {
          mom: 'Mom'
        },
        regions: {
          US: {
            friend: 'Dude',
            parents: {
              mom: 'Mamma'
            }
          },
          CA: {
            friend: 'Buddy'
          }
        }
      },
      es: {
        friend: 'Amigo',
        parents: {
          mom: 'Mamá'
        },
        regions: {
          CO: {
            friend: 'Parce',
            parents: {
              mom: 'Ma'
            }
          },
          VN: {
            friend: 'Pana'
          }
        }
      }
    }
  })

  expect(translator('en').friend()).toBe('Friend')
  expect(translator('en').parents.mom()).toBe('Mom')
  expect(translator('en', 'US').friend()).toBe('Dude')
  expect(translator('en', 'US').parents.mom()).toBe('Mamma')
  expect(translator('en', 'CA').friend()).toBe('Buddy')
  expect(translator('en', 'CA').parents.mom()).toBe('Mom')
  expect(translator('en', 'ZW').friend()).toBe('Friend')
  expect(translator('en', 'ZW').parents.mom()).toBe('Mom')

  expect(translator('es').friend()).toBe('Amigo')
  expect(translator('es').parents.mom()).toBe('Mamá')
  expect(translator('es', 'CO').friend()).toBe('Parce')
  expect(translator('es', 'CO').parents.mom()).toBe('Ma')
  expect(translator('es', 'VN').friend()).toBe('Pana')
  expect(translator('es', 'VN').parents.mom()).toBe('Mamá')
  expect(translator('es', 'ZW').friend()).toBe('Amigo')
  expect(translator('es', 'ZW').parents.mom()).toBe('Mamá')

  // @ts-expect-error test
  expect(translator('es', 'X').friend()).toBe('Amigo')
  // @ts-expect-error test
  expect(translator('es', 'XYZ').friend()).toBe('Amigo')
})

test('Should get custom regional translation if provided', () => {
  type Definition = {
    friend: undefined
  }
  const translator = createUktiTranslator<Definition, 'en', 'en', 'A' | 'B' | 'C'>({
    translations: {
      en: {
        friend: 'Friend',
        regions: {
          A: {
            friend: 'Dude'
          },
          B: {
            friend: 'Buddy'
          }
        }
      }
    }
  })
  expect(translator('en').friend()).toBe('Friend')
  expect(translator('en', 'A').friend()).toBe('Dude')
  expect(translator('en', 'B').friend()).toBe('Buddy')
  expect(translator('en', 'C').friend()).toBe('Friend')
  // @ts-expect-error test
  expect(translator('en', 'X').friend()).toBe('Friend')
})

test('Should get empty string if provided language translation is available with incomplete nesting', () => {
  type Definition = {
    x: {
      a: undefined
    }
  }
  type Languages = 'hi' | 'fr' | 'zh'
  type LanguageDefault = 'hi'
  const translator = createUktiTranslator<Definition, Languages, LanguageDefault>({
    languageDefault: 'hi',
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
  const t = translator('zh')
  expect(t.x.a()).toBe('')
})

test('Should return empty string if trying to translate and undefined item', () => {
  type Definition = {
    x: undefined
    y: {
      z: undefined
    }
  }
  const translator = createUktiTranslator<Definition>({
    translations: {
      en: {
        x: 'x',
        y: {
          z: 'y.z'
        }
      }
    }
  })
  const t = translator('en')
  expect(t.x()).toBe('x')
  expect(t.y.z()).toBe('y.z')
  // @ts-expect-error test
  expect(t.z()).toBe('')
  // @ts-expect-error test
  expect(t.y.a()).toBe('')
})

test('Should get console error if translator receives "regions" as first parameter', () => {
  const consoleError = vi.spyOn(console, 'error')
  type Definition = {
    name: undefined
  }
  const translator = createUktiTranslator<Definition>({
    translations: {
      en: {
        name: ''
      }
    }
  })
  const t = translator('en')
  expect(consoleError).not.toHaveBeenCalled()
  // @ts-expect-error test
  expect(t.regions()).toBe('')
  expect(consoleError).toHaveBeenCalledWith('Ukti translations have the word "regions" reserved.')
})
