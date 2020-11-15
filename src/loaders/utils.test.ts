import { parseArray } from './utils'

test('parse a serialized array', () => {
  expect(parseArray('[1, 2]')).toEqual([1, 2])
})

test('return identity if the serialized array is incomplete', () => {
  const value = '[1, 2'
  expect(parseArray(value)).toBe(value)
})

test('return identity if parsing fails', () => {
  const value = '[,2]'
  expect(parseArray(value)).toEqual(value)
})

test('return identity if value is not a string', () => {
  const value = true
  expect(parseArray(value)).toBe(value)
})
