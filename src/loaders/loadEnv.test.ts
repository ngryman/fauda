import { JsonObject } from 'type-fest'
import { loadFromEnv } from './loadEnv'

const TEST_CASES: [string, NodeJS.ProcessEnv, JsonObject][] = [
  [
    'map name to camelcase without namespace',
    { MY_APP_FOO: 'bar' },
    { foo: 'bar' }
  ],
  [
    'parse an array value',
    { MY_APP_FOO: '["bar", 1337]' },
    { foo: ['bar', 1337] }
  ],
  ['trim the value', { MY_APP_FOO: '  1337  ' }, { foo: '1337' }],
  ['remove variables without namespace', { FOO: '1337' }, {}]
]

test.each(TEST_CASES)('%s', (_title, env, expected) => {
  expect(loadFromEnv('my-app', env)).toEqual(expected)
})
