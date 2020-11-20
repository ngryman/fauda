import Ajv from 'ajv'
import { chain, flow } from 'lodash'
import { JsonObject } from 'type-fest'
import { expandVars } from './expandVars'

function createError(errors: Ajv.ErrorObject[]): Error {
  const message = chain(errors)
    .map(err => `${err.dataPath} ${err.message}`)
    .join('\n')
    .value()
  return new Error(`validate: Validation failed\n${message}`)
}

/**
 * @see https://github.com/ajv-validator/ajv
 */
export function validate<Configuration>(
  input: JsonObject,
  schema: JsonObject,
  env: NodeJS.ProcessEnv
): Configuration {
  const ajv = new Ajv({
    allErrors: true,
    async: true,
    coerceTypes: 'array',
    removeAdditional: true,
    useDefaults: true
  })

  const output = { ...input }

  const isValid = flow(
    _ => expandVars(_, env),
    _ => ajv.validate(_, output)
  )(schema)

  if (!isValid) {
    throw ajv.errors
      ? createError(ajv.errors)
      : new Error('validate: Unknown error')
  }

  return (output as unknown) as Configuration
}
