import getopts from 'getopts'
import { camelCase, chain } from 'lodash'
import { parseArray } from './utils'
import { JsonObject } from 'type-fest'

export function loadFromArgs(args: string[]): JsonObject {
  return chain(getopts(args))
    .omit('_')
    .mapKeys((_v, k) => camelCase(k))
    .mapValues(parseArray)
    .value()
}
