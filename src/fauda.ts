import { merge, reduceRight } from 'lodash'
import { JsonObject } from 'type-fest'
import { loadArgs, loadEnv, loadFile } from './loaders'
import { normalize } from './normalizer'
import { FaudaOptions } from './types'
import { loadSchema } from './utils/loadSchema'

function normalizeOptions(options: Partial<FaudaOptions>): FaudaOptions {
  const defaultOptions: FaudaOptions = {
    args: process.argv,
    env: process.env,
    cwd: process.cwd()
  }

  return { ...defaultOptions, ...options }
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
  const safeConfig = await normalize<Configuration>(
    await loadFromAll(namespace, safeOptions),
    await loadSchema(schema),
    safeOptions.env
  )
  return safeConfig
}
