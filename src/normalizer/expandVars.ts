import { isArray, isObject, isString, map, mapValues } from 'lodash'
import { JsonValue } from 'type-fest'

const varRegex = /([\\])?\${([\w]+)}/g

function expandVar(value: JsonValue, env: NodeJS.ProcessEnv): JsonValue {
  return isString(value)
    ? value.replace(varRegex, (_s, escaped, name) =>
        !escaped ? env[name] ?? '' : `\${${name}}`
      )
    : value
}

export function expandVars<T>(value: T, env: NodeJS.ProcessEnv): T {
  return (isArray(value)
    ? map(value, vv => expandVars(vv, env))
    : isObject(value)
    ? mapValues(value, vv => expandVars(vv, env))
    : expandVar(value, env)) as T
}
