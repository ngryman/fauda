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
        PASTA_COOKING_TIME: '200',
        PASTA_SEASONING: "['Salt', 'Pepper', 'Tomato Sauce']",
        NODE_ENV: 'development'
      },
      namespace: 'pasta',
      schema: await getSchema()
    }
    const configuration = await load(options)
    expect(configuration).toMatchInlineSnapshot(`
      Object {
        "cookingTime": 200,
        "seasoning": Array [
          "['Salt', 'Pepper', 'Tomato Sauce']",
        ],
        "type": "Fettuccine",
      }
    `)
  })
})

describe('given command line arguments', () => {
  it('loads them mixed with defaults', async () => {
    const options = {
      args: [
        '--cooking-time=200',
        '--seasoning=Salt',
        '--seasoning=Pepper',
        "--seasoning='Tomato Sauce'"
      ],
      cwd: '',
      env: {},
      schema: await getSchema()
    }
    const config = await load(options)
    expect(config).toMatchInlineSnapshot(`
      Object {
        "cookingTime": 200,
        "seasoning": Array [
          "Salt",
          "Pepper",
          "'Tomato Sauce'",
        ],
        "type": "Fettuccine",
      }
    `)
  })
})

describe('given a configuration file', () => {
  it('loads it mixed with defaults', async () => {
    const testProject = new TestProject()
    try {
      await testProject.setup()
      const config = await load({
        args: [],
        cwd: testProject.rootDir,
        env: {},
        namespace: 'fauda',
        schema: await getSchema()
      })
      expect(config).toMatchInlineSnapshot(`
        Object {
          "cookingTime": 200,
          "seasoning": Array [
            "Salt",
            "Pepper",
            "Tomato Sauce",
          ],
          "type": "Fettuccine",
        }
      `)
    } catch (err) {
      throw err
    } finally {
      await testProject.teardown()
    }
  })
})
