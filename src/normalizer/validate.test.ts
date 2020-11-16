import { promises as fs } from 'fs'
import { validate } from './validate'

async function getSchema() {
  return JSON.parse(await fs.readFile('test/fixtures/schema.json', 'utf8'))
}

test('set default values to missing properties', async () => {
  expect(validate({}, await getSchema())).toMatchInlineSnapshot(`
    Object {
      "cookingTime": 300,
      "seasoning": Array [
        "Salt",
        "Pepper",
        "Olive Oil",
        "Pecorino",
      ],
      "type": "Fettuccine",
    }
  `)
})

test('coerce a string to number when the type is a number', async () => {
  expect(
    validate(
      {
        cookingTime: '200'
      },
      await getSchema()
    )
  ).toMatchObject({ cookingTime: 200 })
})

test('coerce a string to an array when the type is an array', async () => {
  expect(
    validate(
      {
        seasoning: 'Salt'
      },
      await getSchema()
    )
  ).toMatchObject({ seasoning: ['Salt'] })
})

test('throw an error for invalid values', async () => {
  await expect(async () =>
    validate({ cookingTime: 'nope', seasoning: {} }, await getSchema())
  ).rejects.toThrowErrorMatchingInlineSnapshot(`
          "validate: Validation failed
          .cookingTime should be number
          .seasoning should be array"
        `)
})
