import { promises as fs } from 'fs'
import { isObject } from 'lodash'
import { JsonObject } from 'type-fest'

export async function loadSchema(
  schema: string | JsonObject
): Promise<JsonObject> {
  try {
    return isObject(schema)
      ? schema
      : JSON.parse(await fs.readFile(schema, 'utf8'))
  } catch (err) {
    throw new Error('load: Error loading schema\n' + err.message)
  }
}
