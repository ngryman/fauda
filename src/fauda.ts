import { promises as fs } from 'fs'
import { isObject, merge, reduceRight } from 'lodash'
import { JsonObject } from 'type-fest'
import { loadArgs, loadEnv, loadFile } from './loaders'
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
    loadEnv(namespace, env),
    loadArgs(args),
    loadFile(namespace, cwd)
  ])
  const mergedConfig = reduceRight(resolvedConfig, merge, {})
  return mergedConfig
}

export async function fauda<Configuration>(
  namespace: string,
  schema: string | JsonObject,
  options: Partial<FaudaOptions> = {}
): Promise<Configuration> {
  const safeOptions = normalizeOptions(options)
  const safeConfig = normalize<Configuration>(
    await loadFromAll(namespace, safeOptions),
    await loadSchema(schema),
    safeOptions.env
  )
  return safeConfig
}
