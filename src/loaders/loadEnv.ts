import { camelCase, chain, replace, snakeCase, trim } from 'lodash'
import { JsonObject } from 'type-fest'
import { parseArray } from './utils'

export function loadFromEnv(
  namespace: string,
  env: NodeJS.ProcessEnv
): JsonObject {
  const prefix = `${snakeCase(namespace).toUpperCase()}_`
  return chain(env)
    .pickBy((_v, k) => k.startsWith(prefix))
    .mapKeys((_v, k) => replace(k, prefix, ''))
    .mapKeys((_v, k) => camelCase(k))
    .mapValues(trim)
    .mapValues(parseArray)
    .value() as JsonObject
}
