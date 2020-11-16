import { camelCase, chain, replace, trim, upperCase } from 'lodash'
import { parseArray } from './utils'

/**
 * Loads configuration from environment variables.
 *
 * Environment variables are prefixed with the upper cased namespace.
 * The rest of the variable name describe a path to the desired option.
 *
 * @example
 *
 * GRAPH0_SERVER_PORT=1337
 * GRAPH0_DIRECTIVES="['@graph0/directives', './directives']"
 */
export function loadFromEnv(env: NodeJS.ProcessEnv, namespace: string): {} {
  const prefix = `${upperCase(namespace)}_`
  return chain(env)
    .pickBy((_v, k) => k.startsWith(prefix))
    .mapKeys((_v, k) => replace(k, prefix, ''))
    .mapKeys((_v, k) => camelCase(k))
    .mapValues(trim)
    .mapValues(parseArray)
    .value()
}
