import { promises as fs } from 'fs'
import { normalize } from './normalize'

async function getSchema() {
  return JSON.parse(await fs.readFile('test/fixtures/schema.json', 'utf8'))
}

describe('given configuration', () => {
  it('merges default configuration', async () => {
    expect(normalize({}, await getSchema(), process.env))
      .toMatchInlineSnapshot(`
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

  it('expands environment variables', async () => {
    expect(
      normalize({ port: '${PORT}' }, await getSchema(), {
        ...process.env,
        PORT: '8080'
      })
    ).toMatchObject({ port: 8080 })
  })

  it('throws an error for invalid values', async () => {
    await expect(async () =>
      normalize({ port: 'nope' }, await getSchema(), process.env)
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
            "validate: Validation failed
            .port should be number"
          `)
  })
})
