import { promises as fs } from 'fs'
import { validate } from './validate'

async function getSchema() {
  return JSON.parse(await fs.readFile('test/fixtures/schema.json', 'utf8'))
}

test('set default values to missing properties', async () => {
  expect(validate({}, await getSchema())).toMatchInlineSnapshot(`
    Object {
      "boolean": true,
      "list": Array [
        "foo",
      ],
      "number": 1337,
      "string": "foo",
    }
  `)
})

test('remove additional properties', async () => {
  expect(validate({ foo: 'bar' }, await getSchema())).not.toHaveProperty('foo')
})

test('coerce a string to number when the type is a number', async () => {
  expect(
    validate(
      {
        number: '42'
      },
      await getSchema()
    )
  ).toMatchObject({ number: 42 })
})

test('coerce a string to an array when the type is an array', async () => {
  expect(
    validate(
      {
        list: 'foo'
      },
      await getSchema()
    )
  ).toMatchObject({ list: ['foo'] })
})

test('throw an error for invalid values', async () => {
  await expect(async () =>
    validate({ number: 'nope', list: {} }, await getSchema())
  ).rejects.toThrowErrorMatchingInlineSnapshot(`
    ".number should be number
    .list should be array"
  `)
})
