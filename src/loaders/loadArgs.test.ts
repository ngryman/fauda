import { loadFromArgs } from './loadArgs'

const TEST_CASES: [string, string[], {}][] = [
  ['camelCase a flag', ['--foo-bar'], { fooBar: true }],
  ['accept a value as option', ['--foo=bar'], { foo: 'bar' }],
  ['accept a value as flags', ['--foo', 'bar'], { foo: 'bar' }],
  [
    'parse a stringified array value',
    ['--foo', '["bar", 1337]'],
    { foo: ['bar', 1337] }
  ],
  [
    'parse multiple occurences of the same options as an array',
    ['--foo', 'bar', '--foo', '1337'],
    { foo: ['bar', 1337] }
  ],
  ['trim the value', ['--foo', '  1337  '], { foo: 1337 }]
]

test.each(TEST_CASES)('%s', (_title, args, expected) => {
  expect(loadFromArgs(args)).toEqual(expected)
})
