import { camelCase, chain } from 'lodash'
import getopts from 'getopts'
import { parseArray } from './utils'

/**
 * Loads configuration from command line arguments.
 *
 * Arguments name describe a path to the desired options using `-` as
 * separator.
 *
 * @see https://github.com/jorgebucaran/getopts
 * @example
 *
 * --server-port=1337
 * --directives="['@graph0/directives', './directives']"
 * --directives=@graph0/directives --directives=./directives
 */
export function loadFromArgs(args: string[]): {} {
  return chain(getopts(args))
    .omit('_')
    .mapKeys((_v, k) => camelCase(k))
    .mapValues(parseArray)
    .value()
}
