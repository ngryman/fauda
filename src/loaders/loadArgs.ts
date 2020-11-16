import getopts from 'getopts'
import { camelCase, chain } from 'lodash'
import { parseArray } from './utils'
import { JsonObject } from 'type-fest'

/**
 * Loads configuration from command line arguments.
 *
 * Arguments name describe a path to the desired options using `-` as
 * separator.
 *
 * @example
 * ```
 * $ --cooking-time=200
 * $ --types="['Fettuccine', 'Tagliatelle']"
 * $ --directives=Fettuccine --directives=Tagliatelle
 * ```
 * @see https://github.com/jorgebucaran/getopts
 */
export function loadFromArgs(args: string[]): JsonObject {
  return chain(getopts(args))
    .omit('_')
    .mapKeys((_v, k) => camelCase(k))
    .mapValues(parseArray)
    .value()
}
