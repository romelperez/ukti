const testIsVariable = /^[a-zA-Z]\w*$/
const testIsNumeric = /^-?\d+(.\d+)?$/
const formatFragment = (value: string): string => value.trim().replace(/^["']/, '').replace(/["']$/, '')

/**
 * Render a template string with optional variables if required.
 * All interpolations have to be wrapped in "{{" and "}}".
 * It suppots the following template interpolations:
 * - "{{variable}}" for raw strings, numbers and symbols.
 * - "{{variable ? "a" : "b"}}" for variable as booleanish.
 * - "{{variable ? 'a' : 'b'}}" for variable as booleanish.
 * - "{{variable ? 10 : 20}}" for variable as booleanish.
 * @param text Template text.
 * @param variables Optional variables.
 * @returns Interpolated template string with variables.
 */
const renderTemplate = <Vars extends Record<string, unknown> = Record<string, unknown>>(
  template: string,
  variables: Vars
): string => {
  if (!variables || typeof variables !== 'object') {
    return template
  }

  const matches = template.match(/{{([\s\S]+?)}}/g)

  if (!matches?.length) {
    return template
  }

  const variablesKeys = Object.keys(variables) as Array<keyof Vars>

  return [...matches].reduce((text, item) => {
    let result = item
      .replace(/^{{/, '')
      .replace(/}}$/, '')
      .trim()

    // Is basic interpolation.
    if (variablesKeys.includes(result)) {
      result = String(variables[result])
    }
    // Is a conditional.
    else if (/.+\?.+:.+/.test(result)) {
      const [condition, truthy, falsy] = result.split(/[?:]/)
      let isValid = false

      // Has comparator in format " statement comparator statement ".
      if (/^[\s\S]+(===?|!==?|>=?|<=?)[\s\S]+$/.test(condition)) {
        const [a, comparator, b] = condition.split(/(===?|!==?|>=?|<=?)/)

        let x: number | string = formatFragment(a)
        x = testIsVariable.test(x)
          ? variables[x] as string
          : testIsNumeric.test(x)
            ? Number(x)
            : x

        let y: number | string = formatFragment(b)
        y = testIsVariable.test(y)
          ? variables[y] as string
          : testIsNumeric.test(y)
            ? Number(y)
            : y

        switch (comparator) {
          case '==':
          case '===': isValid = x === y; break
          case '!=':
          case '!==': isValid = x !== y; break
          case '>': isValid = x > y; break
          case '>=': isValid = x >= y; break
          case '<': isValid = x < y; break
          case '<=': isValid = x <= y; break
        }
      }
      else {
        isValid = !!variables[condition.trim()]
      }

      result = isValid ? truthy : falsy
      result = formatFragment(result)
    }
    else {
      throw new Error(`Ukti template requires variable "${result}" to render.`)
    }

    return text.replace(item, result)
  }, template)
}

export { renderTemplate }
