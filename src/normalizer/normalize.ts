import { flow } from 'lodash'
import { JsonObject } from 'type-fest'
import { expandVars } from './expandVars'
import { validate } from './validate'

export function normalize<Configuration>(
  config: JsonObject,
  schema: JsonObject,
  env: NodeJS.ProcessEnv
): Configuration {
  return flow(
    _ => expandVars(_, env),
    _ => validate<Configuration>(_, schema)
  )(config)
}
