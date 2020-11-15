import { loadFromEnv } from './loadEnv'

const TEST_CASES: [string, NodeJS.ProcessEnv, {}][] = [
  [
    'map name to camelcase without namespace',
    { FAUDA_FOO: 'bar' },
    { foo: 'bar' }
  ],
  [
    'parse an array value',
    { FAUDA_FOO: '["bar", 1337]' },
    { foo: ['bar', 1337] }
  ],
  ['trim the value', { FAUDA_FOO: '  1337  ' }, { foo: '1337' }],
  ['remove variables without namespace', { FOO: '1337' }, {}]
]

test.each(TEST_CASES)('%s', (_title, env, expected) => {
  expect(loadFromEnv(env, 'fauda')).toEqual(expected)
})
