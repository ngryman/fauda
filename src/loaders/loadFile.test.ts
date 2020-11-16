import { TestProject } from '../../test/utils/testProject'
import { loadFromFile, getDefaultSearchPlaces } from './loadFile'

const SEARCH_PLACES = getDefaultSearchPlaces('fauda')

const TEST_CASES: [string, string][] = [
  ['load in current directory', '.'],
  ['load in parent directory', 'upward']
]

const EXCEPTED = {
  cookingTime: 200,
  seasoning: ['Salt', 'Pepper', 'Tomato Sauce']
}

describe.each(SEARCH_PLACES)('given a %s file', variant => {
  const testProject = new TestProject(variant)

  beforeAll(() => testProject.setup())

  test.each(TEST_CASES)('%s', async (_title, cwd) => {
    await expect(
      loadFromFile(testProject.resolvePath(cwd), 'fauda')
    ).resolves.toEqual(EXCEPTED)
  })

  afterAll(() => testProject.teardown())
})
