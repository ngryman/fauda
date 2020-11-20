import { JsonObject } from 'type-fest'
import { expandVars } from './expandVars'

const TEST_CASES: [string, NodeJS.ProcessEnv, JsonObject, JsonObject][] = [
  [
    'expand an existing env var to its value',
    { BAR: 'bar' },
    { foo: '${BAR}' },
    { foo: 'bar' }
  ],
  [
    'expand a missing env var to an empty string',
    {},
    { foo: '${BAR}' },
    { foo: '' }
  ],
  [
    'expand multiple references',
    { BAR: 'bar', BAZ: 'baz' },
    { foo: '${BAR} ${BAZ}' },
    { foo: 'bar baz' }
  ],
  [
    'expand an array',
    { BAR: 'bar' },
    { foo: ['${BAR}', '${BAR}'] },
    { foo: ['bar', 'bar'] }
  ],
  [
    'expand a nested value',
    { BAZ: 'baz' },
    { foo: { bar: '${BAZ}' } },
    { foo: { bar: 'baz' } }
  ],
  [
    'do not expand if $ is escaped',
    { BAR: 'bar' },
    { foo: '\\${BAR}' },
    { foo: '${BAR}' }
  ],
  ['do not crash on other primitives', {}, { foo: 1337 }, { foo: '1337' }]
]

test.each(TEST_CASES)('%s', (_title, env, config, expected) => {
  expect(expandVars(config, env)).toEqual(expected)
})
