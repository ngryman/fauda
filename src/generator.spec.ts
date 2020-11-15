import { promises as fs } from 'fs'
import { generateTypes, generateTypesFromFile } from './generator'

async function getSchema() {
  return JSON.parse(await fs.readFile('test/fixtures/schema.json', 'utf8'))
}

describe('given a schema object', () => {
  it('generate the associated types', async () => {
    const schema = await getSchema()
    const source = await generateTypes(schema)
    expect(source).toMatchInlineSnapshot(`
      "export interface PartialSettings {
        /**
         * Path to this schema.
         */
        $schema?: string;
        /**
         * A string.
         */
        string?: string;
        /**
         * A number.
         */
        number?: number;
        /**
         * A boolean.
         */
        boolean?: boolean;
        /**
         * A list of things.
         */
        list?: string[];
      }
      export type Settings = Required<PartialSettings>
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
      "export interface PartialSettings {
        /**
         * Path to this schema.
         */
        $schema?: string
        /**
         * A string.
         */
        string?: string
        /**
         * A number.
         */
        number?: number
        /**
         * A boolean.
         */
        boolean?: boolean
        /**
         * A list of things.
         */
        list?: string[]
      }
      export type Settings = Required<PartialSettings>
      "
    `)
  })
})

describe('given a schema file', () => {
  it('generate the associated types', async () => {
    const source = await generateTypesFromFile('test/fixtures/schema.json')
    expect(source).toMatchInlineSnapshot(`
      "export interface PartialSettings {
        /**
         * Path to this schema.
         */
        $schema?: string;
        /**
         * A string.
         */
        string?: string;
        /**
         * A number.
         */
        number?: number;
        /**
         * A boolean.
         */
        boolean?: boolean;
        /**
         * A list of things.
         */
        list?: string[];
      }
      export type Settings = Required<PartialSettings>
      "
    `)
  })

  it('accepts Prettier options to format the output', async () => {
    const source = await generateTypesFromFile('test/fixtures/schema.json', {
      style: {
        semi: false
      }
    })
    expect(source).toMatchInlineSnapshot(`
      "export interface PartialSettings {
        /**
         * Path to this schema.
         */
        $schema?: string
        /**
         * A string.
         */
        string?: string
        /**
         * A number.
         */
        number?: number
        /**
         * A boolean.
         */
        boolean?: boolean
        /**
         * A list of things.
         */
        list?: string[]
      }
      export type Settings = Required<PartialSettings>
      "
    `)
  })
})
