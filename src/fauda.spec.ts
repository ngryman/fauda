import { TestProject } from '../test/utils/testProject'
import { fauda } from './fauda'
import { FaudaOptions } from './types'

describe('given a JSON schema', () => {
  it('loads environment variables', async () => {
    const options: FaudaOptions = {
      args: [],
      cwd: '',
      env: {
        MY_APP_PORT: '8080',
        MY_APP_OPEN: 'true',
        MY_APP_PUBLIC_PAGES: "['/home', '/about']",
        NODE_ENV: 'development'
      }
    }
    const configuration = await fauda(
      'my-app',
      'test/fixtures/schema.json',
      options
    )
    expect(configuration).toMatchInlineSnapshot(`
      Object {
        "mode": "development",
        "open": true,
        "port": 8080,
        "publicPages": Array [
          "['/home', '/about']",
        ],
      }
    `)
  })

  it('loads command-line arguments', async () => {
    const options: FaudaOptions = {
      args: [
        '--port=8080',
        '--open',
        '--public-pages=/home',
        '--public-pages=/about'
      ],
      cwd: '',
      env: {
        NODE_ENV: 'development'
      }
    }
    const config = await fauda('my-app', 'test/fixtures/schema.json', options)
    expect(config).toMatchInlineSnapshot(`
      Object {
        "mode": "development",
        "open": true,
        "port": 8080,
        "publicPages": Array [
          "/home",
          "/about",
        ],
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
        env: {
          NODE_ENV: 'development'
        }
      }
      const config = await fauda('my-app', 'test/fixtures/schema.json', options)
      expect(config).toMatchInlineSnapshot(`
        Object {
          "mode": "development",
          "open": true,
          "port": 8080,
          "publicPages": Array [
            "/home",
            "/about",
          ],
        }
      `)
    } finally {
      await testProject.teardown()
    }
  })
})

describe('given invalid arguments', () => {
  it('throws an error if the schema does not exists', async () => {
    await expect(() => fauda('my-app', '/the/void')).rejects
      .toThrowErrorMatchingInlineSnapshot(`
        "load: Error loading schema
        ENOENT: no such file or directory, open '/the/void'"
      `)
  })
})
