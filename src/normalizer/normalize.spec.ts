import { promises as fs } from 'fs'
import { normalize } from './normalize'

async function getSchema() {
  return JSON.parse(await fs.readFile('test/fixtures/schema.json', 'utf8'))
}

describe('given settings', () => {
  it('merges default settings', async () => {
    expect(normalize({ string: 'bar' }, { schema: await getSchema() }))
      .toMatchInlineSnapshot(`
      Object {
        "boolean": true,
        "list": Array [
          "foo",
        ],
        "number": 1337,
        "string": "bar",
      }
    `)
  })

  it('expands environment variables', async () => {
    expect(
      normalize(
        { number: '${NUMBER}' },
        { env: { NUMBER: '42' }, schema: await getSchema() }
      )
    ).toMatchInlineSnapshot(`
      Object {
        "boolean": true,
        "list": Array [
          "foo",
        ],
        "number": 42,
        "string": "foo",
      }
    `)
  })

  it('throws an error for invalid values', async () => {
    await expect(async () =>
      normalize({ number: 'nope' }, { schema: await getSchema() })
    ).rejects.toThrowErrorMatchingInlineSnapshot(`".number should be number"`)
  })
})

describe('given empty settings', () => {
  it('returns the default settings', async () => {
    expect(normalize({}, { schema: await getSchema() })).toMatchInlineSnapshot(`
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
})
