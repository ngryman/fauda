import { promises as fs } from 'fs'
import { normalize } from './normalize'

async function getSchema() {
  return JSON.parse(await fs.readFile('test/fixtures/schema.json', 'utf8'))
}

describe('given configuration', () => {
  it('merges default configuration', async () => {
    expect(normalize({ cookingTime: 200 }, { schema: await getSchema() }))
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
      normalize(
        { cookingTime: '${NUMBER}' },
        { env: { NUMBER: '200' }, schema: await getSchema() }
      )
    ).toMatchObject({ cookingTime: 200 })
  })

  it('throws an error for invalid values', async () => {
    await expect(async () =>
      normalize({ cookingTime: 'nope' }, { schema: await getSchema() })
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `".cookingTime should be number"`
    )
  })
})

describe('given empty configuration', () => {
  it('returns the default configuration', async () => {
    expect(normalize({}, { schema: await getSchema() })).toMatchInlineSnapshot(`
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
