import { TestProject } from '../test/utils/testProject'
import { fauda } from './fauda'
import { FaudaOptions } from './types'

describe('given a JSON schema', () => {
  it('loads environment variables', async () => {
    const options: FaudaOptions = {
      args: [],
      cwd: '',
      env: {
        PASTA_COOKING_TIME: '200',
        PASTA_SEASONING: "['Salt', 'Pepper', 'Tomato Sauce']",
        NODE_ENV: 'development'
      }
    }
    const configuration = await fauda(
      'pasta',
      'test/fixtures/schema.json',
      options
    )
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

  it('loads command-line arguments', async () => {
    const options: FaudaOptions = {
      args: [
        '--cooking-time=200',
        '--seasoning=Salt',
        '--seasoning=Pepper',
        "--seasoning='Tomato Sauce'"
      ],
      cwd: '',
      env: {}
    }
    const config = await fauda('pasta', 'test/fixtures/schema.json', options)
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

  it('loads a configurationn file', async () => {
    const testProject = new TestProject()
    try {
      await testProject.setup()
      const options: FaudaOptions = {
        args: [],
        cwd: testProject.rootDir,
        env: {}
      }
      const config = await fauda('pasta', 'test/fixtures/schema.json', options)
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
    } finally {
      await testProject.teardown()
    }
  })
})

describe('given invalid arguments', () => {
  it('throws an error if the schema does not exists', async () => {
    await expect(() => fauda('pasta', '/the/void')).rejects
      .toThrowErrorMatchingInlineSnapshot(`
        "load: Error loading schema
        ENOENT: no such file or directory, open '/the/void'"
      `)
  })
})
