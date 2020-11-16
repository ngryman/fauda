import Ajv from 'ajv'
import { chain } from 'lodash'
import { JsonObject } from 'type-fest'

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
  schema: JsonObject
): Configuration {
  const ajv = new Ajv({
    allErrors: true,
    async: true,
    coerceTypes: 'array',
    removeAdditional: true,
    useDefaults: true
  })

  const output = { ...input }
  const isValid = ajv.validate(schema, output)

  if (!isValid) {
    throw ajv.errors
      ? createError(ajv.errors)
      : new Error('validate: Unknown error')
  }

  return (output as unknown) as Configuration
}
