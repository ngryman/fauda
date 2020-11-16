import Ajv from 'ajv'
import { chain } from 'lodash'

function createError(errors: Ajv.ErrorObject[]): Error {
  const message = chain(errors)
    .map(err => `${err.dataPath} ${err.message}`)
    .join('\n')
    .value()
  return new Error(message)
}

/**
 * @see https://github.com/ajv-validator/ajv
 */
export function validate<Configuration>(
  input: any,
  schema: any
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
    throw createError(ajv.errors!)
  }

  return output
}
