import { promises as fs } from 'fs'
import { validate } from './validate'

async function getSchema(name = 'schema') {
  return JSON.parse(await fs.readFile(`test/fixtures/${name}.json`, 'utf8'))
}

test('set default values to missing properties', async () => {
  expect(validate({}, await getSchema(), process.env)).toMatchInlineSnapshot(`
    Object {
      "mode": "test",
      "open": false,
      "port": 3000,
      "publicPages": Array [
        "/hi",
      ],
    }
  `)
})

test('coerce a string to number when the type is a number', async () => {
  expect(
    validate({ port: '8080' }, await getSchema(), process.env)
  ).toMatchObject({ port: 8080 })
})

test('coerce a string to an array when the type is an array', async () => {
  expect(
    validate({ publicPages: '/home' }, await getSchema(), process.env)
  ).toMatchObject({ publicPages: ['/home'] })
})

test('throw an error for invalid values', async () => {
  await expect(async () =>
    validate({ port: 'nope' }, await getSchema(), process.env)
  ).rejects.toThrowErrorMatchingInlineSnapshot(`
    "validate: Validation failed
    .port should be number"
  `)
})

test('throw an error for missing values', async () => {
  await expect(async () =>
    validate({}, await getSchema('required-schema'), process.env)
  ).rejects.toThrowErrorMatchingInlineSnapshot(`
    "validate: Validation failed
    should have required property 'publicPages'"
  `)
})
