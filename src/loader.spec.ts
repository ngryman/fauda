import { promises as fs } from 'fs'
import { TestProject } from '../test/utils/testProject'
import { load } from './loader'
import { FaudaOptions } from './types'

async function getSchema() {
  return JSON.parse(await fs.readFile('test/fixtures/schema.json', 'utf8'))
}

describe('given environment variables', () => {
  it('loads them mixed with defaults', async () => {
    const options: FaudaOptions = {
      args: [],
      cwd: '',
      env: {
        FAUDA_LIST: 'bar',
        FAUDA_NUMBER: '42',
        FAUDA_STRING: 'bar',
        NODE_ENV: 'development'
      },
      namespace: 'fauda',
      schema: await getSchema()
    }
    const settings = await load(options)
    expect(settings).toMatchInlineSnapshot(`
      Object {
        "boolean": true,
        "list": Array [
          "bar",
        ],
        "number": 42,
        "string": "bar",
      }
    `)
  })
})

describe('given command line arguments', () => {
  it('loads them mixed with defaults', async () => {
    const options = {
      args: ['--list=bar', '--list=baz', '--number', '42', '--string', 'bar'],
      cwd: '',
      env: {},
      schema: await getSchema()
    }
    const settings = await load(options)
    expect(settings).toMatchInlineSnapshot(`
      Object {
        "boolean": true,
        "list": Array [
          "bar",
          "baz",
        ],
        "number": 42,
        "string": "bar",
      }
    `)
  })
})

describe('given a configuration file', () => {
  it('loads it mixed with defaults', async () => {
    const testProject = new TestProject()
    try {
      await testProject.setup()
      const settings = await load({
        args: [],
        cwd: testProject.rootDir,
        env: {},
        namespace: 'fauda',
        schema: await getSchema()
      })
      expect(settings).toMatchInlineSnapshot(`
        Object {
          "boolean": true,
          "list": Array [
            "bar",
          ],
          "number": 42,
          "string": "bar",
        }
      `)
    } catch (err) {
      throw err
    } finally {
      await testProject.teardown()
    }
  })
})
