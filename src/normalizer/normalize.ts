import { flow } from 'lodash'
import { JsonObject } from 'type-fest'
import { loadSchema } from '../utils/loadSchema'
import { expandVars } from './expandVars'
import { validate } from './validate'

export async function normalize<Configuration>(
  config: JsonObject,
  schema: string | JsonObject,
  env: NodeJS.ProcessEnv = process.env
): Promise<Configuration> {
  const loadedSchema = await loadSchema(schema)
  return flow(
    _ => expandVars(_, env),
    _ => validate<Configuration>(_, loadedSchema, env)
  )(config)
}
