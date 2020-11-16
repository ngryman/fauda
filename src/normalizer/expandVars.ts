import { isArray, map, mapValues } from 'lodash'
import { Primitive } from 'type-fest'

const varRegex = /([\\])?\${([\w]+)}/g

function expandVar(value: Primitive, env: NodeJS.ProcessEnv): Primitive {
  return String(value).replace(varRegex, (_s, escaped, name) =>
    !escaped ? env[name] ?? '' : `\${${name}}`
  )
}

export function expandVars(config: {}, env: NodeJS.ProcessEnv): {} {
  return mapValues(config, (v: Primitive) =>
    isArray(v)
      ? map(v, (vv: Primitive) => expandVar(vv, env))
      : expandVar(v, env)
  )
}
