import { isString } from 'lodash'
import { Primitive } from 'type-fest'

export function parseArray(value: Primitive): Primitive | Primitive[] {
  if (!isString(value)) return value
  if (!value.startsWith('[') || !value.endsWith(']')) return value
  try {
    return JSON.parse(value)
  } catch (e) {
    return String(value)
  }
}
