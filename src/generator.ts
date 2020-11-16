import { compile, compileFromFile, Options } from 'json-schema-to-typescript'
import { flow } from 'lodash'
import { JsonObject } from 'type-fest'

/**
 * Options of json-schema-to-typescript.
 * https://github.com/bcherny/json-schema-to-typescript#options
 */
const defaultOptions: Partial<Options> = {
  /** Strip the top banner for the generated file */
  bannerComment: ''
}

/**
 * Camel cases dotted names.
 */
function camelCaseNames(source: string): string {
  return source.replace(
    /(\w+)\.(\w+)/,
    (_, p1, p2) => `${p1}${p2[0].toUpperCase()}${p2.slice(1)}`
  )
}

/**
 * Renames the generated interface to `Configuration`.
 */
function renameInterface(source: string): string {
  return source.replace(/(export interface )(\w+)( {)/, '$1Configuration$3')
}

function removeAdditionalProperties(source: string): string {
  return source.replace(/\n\s*\[k: string\]: unknown;?/, '')
}

// function appendRequiredType(source: string): string {
//   return source + 'export type Settings = Required<PartialSettings>\n'
// }

function postProcess(source: string) {
  return flow(
    camelCaseNames,
    renameInterface,
    removeAdditionalProperties
    // appendRequiredType
  )(source)
}

/**
 * Generate types from a JSON schema object.
 */
export async function generateTypes(
  schema: JsonObject,
  options: Partial<Options> = {}
): Promise<string> {
  const mergedOptions = { ...defaultOptions, ...options }
  return await compile(schema, '', mergedOptions).then(postProcess)
}

/**
 * Generate types from a JSON schema file.
 */
export async function generateTypesFromFile(
  schemaPath: string,
  options: Partial<Options> = {}
): Promise<string> {
  const mergedOptions = { ...defaultOptions, ...options }
  return await compileFromFile(schemaPath, mergedOptions).then(postProcess)
}
