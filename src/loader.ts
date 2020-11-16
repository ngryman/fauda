import { promises as fs } from 'fs'
import { isObject, merge, reduceRight } from 'lodash'
import { JsonObject } from 'type-fest'
import { loadFromArgs, loadFromEnv, loadFromFile } from './loaders'
import { normalize } from './normalizer'
import { FaudaOptions } from './types'

function normalizeOptions(options: Partial<FaudaOptions>): FaudaOptions {
  const defaultOptions: FaudaOptions = {
    args: process.argv,
    env: process.env,
    cwd: process.cwd()
  }

  return { ...defaultOptions, ...options }
}

async function loadSchema(schema: string | JsonObject): Promise<JsonObject> {
  try {
    return isObject(schema)
      ? schema
      : JSON.parse(await fs.readFile(schema, 'utf8'))
  } catch (err) {
    throw new Error('load: Error loading schema\n' + err.message)
  }
}

async function loadFromAll(
  namespace: string,
  { args, cwd, env }: FaudaOptions
): Promise<JsonObject> {
  const resolvedConfig = await Promise.all([
    loadFromEnv(namespace, env),
    loadFromArgs(args),
    loadFromFile(namespace, cwd)
  ])
  const mergedConfig = reduceRight(resolvedConfig, merge, {})
  return mergedConfig
}

/**
 * Loads configuration, from environment variables, command-line arguments,
 * and configuration files.
 */
export async function load<Configuration>(
  namespace: string,
  schema: string | JsonObject,
  options: Partial<FaudaOptions> = {}
): Promise<Configuration> {
  const safeOptions = normalizeOptions(options)
  const resolvedSchema = await loadSchema(schema)
  const resolvedConfig = await loadFromAll(namespace, safeOptions)
  const safeConfig = normalize<Configuration>(
    resolvedConfig,
    resolvedSchema,
    safeOptions.env
  )
  return safeConfig
}
