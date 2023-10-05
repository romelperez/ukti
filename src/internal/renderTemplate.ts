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

    if (variablesKeys.includes(result)) {
      result = String(variables[result])
    }
    else if (/.+\?.+:.+/.test(result)) {
      const [condition, truthy, falsy] = result.split(/[?:]/)
      result = variables[condition.trim()] ? truthy : falsy
      result = result.trim().replace(/^["']/, '').replace(/["']$/, '')
    }
    else {
      throw new Error(`Ukti template requires variable "${result}" to render.`)
    }

    return text.replace(item, result)
  }, template)
}

export { renderTemplate }
