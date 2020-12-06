import { loadSchema } from './loadSchema'

test('return the schema when given an object', async () => {
  expect(await loadSchema(`test/fixtures/schema.json`)).toMatchInlineSnapshot(`
    Object {
      "$schema": "http://json-schema.org/draft-07/schema",
      "properties": Object {
        "$schema": Object {
          "description": "Path to my app's schema.",
          "type": "string",
        },
        "mode": Object {
          "default": "\${NODE_ENV}",
          "description": "Mode of the app.",
          "enum": Array [
            "development",
            "test",
            "production",
          ],
          "type": "string",
        },
        "open": Object {
          "default": false,
          "description": "Open in a browser tab if true.",
          "type": "boolean",
        },
        "port": Object {
          "default": 3000,
          "description": "The port the server listens to.",
          "type": "number",
        },
        "publicPages": Object {
          "default": Array [
            "/hi",
          ],
          "description": "A list of public pages.",
          "items": Object {
            "type": "string",
          },
          "type": "array",
        },
      },
      "title": "My awesome app configuration",
      "type": "object",
    }
  `)
})

test('load and return the schema when given a string', async () => {
  expect(await loadSchema({ foo: 'bar ' })).toMatchInlineSnapshot(`
    Object {
      "foo": "bar ",
    }
  `)
})
