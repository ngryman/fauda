import { compile, compileFromFile, Options } from 'json-schema-to-typescript'
import { flow } from 'lodash'
import { JsonObject } from 'type-fest'

/**
 * Options of json-schema-to-typescript.
 * https://github.com/bcherny/json-schema-to-typescript#options
 */
const defaultOptions: Partial<Options> = {
  bannerComment: ''
}

function camelCaseNames(source: string): string {
  return source.replace(
    /(\w+)\.(\w+)/,
    (_, p1, p2) => `${p1}${p2[0].toUpperCase()}${p2.slice(1)}`
  )
}

function renameInterface(source: string): string {
  return source.replace(/(export interface )(\w+)( {)/, '$1Configuration$3')
}

function removeAdditionalProperties(source: string): string {
  return source.replace(/\n\s*\[k: string\]: unknown;?/, '')
}

function postProcess(source: string) {
  return flow(
    camelCaseNames,
    renameInterface,
    removeAdditionalProperties
  )(source)
}

export async function generateTypes(
  schema: JsonObject,
  options: Partial<Options> = {}
): Promise<string> {
  const mergedOptions = { ...defaultOptions, ...options }
  return await compile(schema, '', mergedOptions).then(postProcess)
}

export async function generateTypesFromFile(
  schemaPath: string,
  options: Partial<Options> = {}
): Promise<string> {
  const mergedOptions = { ...defaultOptions, ...options }
  return await compileFromFile(schemaPath, mergedOptions).then(postProcess)
}
