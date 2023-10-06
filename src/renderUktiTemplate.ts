/**
 * Render a template string with optional variables if required.
 * All interpolations have to be wrapped in "{{" and "}}".
 * It suppots the following template interpolations:
 * - "{{value}}" for basic interpolation.
 * - "{{value ? value : value}}" for interpolation with comparison.
 * - "{{value comparator value ? value : value}}" for interpolation with comparison
 * with comparator.
 * @param text Template text.
 * @param variables Optional variables.
 * @returns Interpolated template string with variables.
 */
const renderUktiTemplate = <Vars extends Record<string, unknown> = Record<string, unknown>>(
  template: string,
  variables?: Vars,
  config?: { throwIfError?: boolean }
): string => {
  if (!variables || typeof variables !== 'object') {
    return template
  }

  const matches = template.match(/{{([\s\S]+?)}}/g)

  if (!matches?.length) {
    return template
  }

  const { throwIfError } = { ...config }

  const showTemplateVariableError = (variableName: string): void => {
    const error = `Ukti template requires defined variable "${variableName}" to render.`
    if (throwIfError) {
      throw new Error(error)
    }
    else {
      console.error(error)
    }
  }

  const getTemplateInterpolation = (data: string): number | string | undefined => {
    const value = data.trim()

    // Is variable.
    if (/^[a-zA-Z]\w*$/.test(value)) {
      if (variables[value] === undefined) {
        showTemplateVariableError(value)
      }
      return variables[value] as string
    }
    // Is numeric.
    else if (/^-?\d+(.\d+)?$/.test(value)) {
      return Number(value)
    }

    // Is string.
    return value.trim()
      .replace(/^["']/, '')
      .replace(/["']$/, '')
  }

  return [...matches].reduce((text, item) => {
    let result = item
      .replace(/^{{/, '')
      .replace(/}}$/, '')
      .trim()

    // Is basic interpolation.
    if (Object.keys(variables).includes(result)) {
      if (variables[result] === undefined) {
        showTemplateVariableError(result)
        return ''
      }
      result = variables[result] as string
    }
    // Is a conditional.
    else if (/^.+\?.+:.+$/.test(result)) {
      const [condition, truthy, falsy] = result.split(/[?:]/)
      let isValid = false

      // Conditional has comparator in format " statement comparator statement ".
      if (/^[\s\S]+(===?|!==?|>=?|<=?)[\s\S]+$/.test(condition)) {
        const fragments = condition.split(/(===?|!==?|>=?|<=?)/)

        const x = getTemplateInterpolation(fragments[0])
        const comparator = fragments[1]
        const y = getTemplateInterpolation(fragments[2])

        if (x === undefined || y === undefined) {
          return ''
        }

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
      // Conditional has truthy variable.
      else {
        const variable = getTemplateInterpolation(condition)
        if (variable === undefined) {
          return ''
        }
        isValid = !!variable
      }

      const value = getTemplateInterpolation(isValid ? truthy : falsy)

      if (value === undefined) {
        return ''
      }

      result = value as string
    }
    else {
      showTemplateVariableError(result)
      return ''
    }

    return text.replace(item, result)
  }, template)
}

export { renderUktiTemplate }
