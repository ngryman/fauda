import { normalize } from './normalize'

describe('given configuration', () => {
  it('merges default configuration', async () => {
    expect(await normalize({}, 'test/fixtures/schema.json'))
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
      await normalize({ port: '${PORT}' }, 'test/fixtures/schema.json', {
        ...process.env,
        PORT: '8080'
      })
    ).toMatchObject({ port: 8080 })
  })

  it('throws an error for invalid values', async () => {
    await expect(async () =>
      normalize({ port: 'nope' }, 'test/fixtures/schema.json')
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      "validate: Validation failed
      .port should be number"
    `)
  })
})
