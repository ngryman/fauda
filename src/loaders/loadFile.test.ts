import { TestProject } from '../../test/utils/testProject'
import { loadFromFile, getDefaultSearchPlaces } from './loadFile'

const SEARCH_PLACES = getDefaultSearchPlaces('my-app')

const TEST_CASES: [string, string][] = [
  ['load in current directory', '.'],
  ['load in parent directory', 'upward']
]

const EXPECTED = {
  port: 8080,
  open: true,
  publicPages: ['/home', '/about']
}

describe.each(SEARCH_PLACES)('given a %s file', variant => {
  const testProject = new TestProject(variant)

  beforeAll(() => testProject.setup())

  test.each(TEST_CASES)('%s', async (_title, cwd) => {
    await expect(
      loadFromFile('my-app', testProject.resolvePath(cwd))
    ).resolves.toEqual(EXPECTED)
  })

  afterAll(() => testProject.teardown())
})
