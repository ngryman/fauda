import { promises as fs } from 'fs'
import { normalize } from './normalize'

async function getSchema() {
  return JSON.parse(await fs.readFile('test/fixtures/schema.json', 'utf8'))
}

describe('given configuration', () => {
  it('merges default configuration', async () => {
    expect(normalize({ cookingTime: 200 }, await getSchema(), process.env))
      .toMatchInlineSnapshot(`
      Object {
        "cookingTime": 200,
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

  it('expands environment variables', async () => {
    expect(
      normalize({ cookingTime: '${NUMBER}' }, await getSchema(), {
        NUMBER: '200'
      })
    ).toMatchObject({ cookingTime: 200 })
  })

  it('throws an error for invalid values', async () => {
    await expect(async () =>
      normalize({ cookingTime: 'nope' }, await getSchema(), process.env)
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
            "validate: Validation failed
            .cookingTime should be number"
          `)
  })
})

describe('given empty configuration', () => {
  it('returns the default configuration', async () => {
    expect(normalize({}, await getSchema(), process.env))
      .toMatchInlineSnapshot(`
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
})
