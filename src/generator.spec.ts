import { promises as fs } from 'fs'
import { generateTypes } from './generator'

async function getSchema() {
  return JSON.parse(
    await fs.readFile('test/fixtures/required-schema.json', 'utf8')
  )
}

describe('given a schema object', () => {
  it('generate the associated types', async () => {
    const schema = await getSchema()
    const source = await generateTypes(schema)
    expect(source).toMatchInlineSnapshot(`
      "export interface Configuration {
        /**
         * Path to my app's schema.
         */
        $schema?: string;
        /**
         * The port the server listens to.
         */
        port?: number;
        /**
         * Open in a browser tab if true.
         */
        open?: boolean;
        /**
         * Mode of the app.
         */
        mode?: \\"development\\" | \\"test\\" | \\"production\\";
        /**
         * A list of public pages.
         */
        publicPages: string[];
      }
      "
    `)
  })

  it('accepts Prettier options to format the output', async () => {
    const schema = await getSchema()
    const source = await generateTypes(schema, {
      style: {
        semi: false
      }
    })
    expect(source).toMatchInlineSnapshot(`
      "export interface Configuration {
        /**
         * Path to my app's schema.
         */
        $schema?: string
        /**
         * The port the server listens to.
         */
        port?: number
        /**
         * Open in a browser tab if true.
         */
        open?: boolean
        /**
         * Mode of the app.
         */
        mode?: \\"development\\" | \\"test\\" | \\"production\\"
        /**
         * A list of public pages.
         */
        publicPages: string[]
      }
      "
    `)
  })
})

describe('given a schema file', () => {
  it('generate the associated types', async () => {
    const source = await generateTypes('test/fixtures/schema.json')
    expect(source).toMatchInlineSnapshot(`
      "export interface Configuration {
        /**
         * Path to my app's schema.
         */
        $schema?: string;
        /**
         * The port the server listens to.
         */
        port?: number;
        /**
         * Open in a browser tab if true.
         */
        open?: boolean;
        /**
         * Mode of the app.
         */
        mode?: \\"development\\" | \\"test\\" | \\"production\\";
        /**
         * A list of public pages.
         */
        publicPages?: string[];
      }
      "
    `)
  })

  it('accepts Prettier options to format the output', async () => {
    const source = await generateTypes('test/fixtures/schema.json', {
      style: {
        semi: false
      }
    })
    expect(source).toMatchInlineSnapshot(`
      "export interface Configuration {
        /**
         * Path to my app's schema.
         */
        $schema?: string
        /**
         * The port the server listens to.
         */
        port?: number
        /**
         * Open in a browser tab if true.
         */
        open?: boolean
        /**
         * Mode of the app.
         */
        mode?: \\"development\\" | \\"test\\" | \\"production\\"
        /**
         * A list of public pages.
         */
        publicPages?: string[]
      }
      "
    `)
  })
})
