import { merge, reduceRight } from 'lodash'
import { loadFromArgs, loadFromEnv, loadFromFile } from './loaders'
import { normalize } from './normalizer'
import { FaudaOptions } from './types'

function normalizeOptions(options: Partial<FaudaOptions>): FaudaOptions {
  const defaultOptions: FaudaOptions = {
    args: process.argv,
    env: process.env,
    cwd: process.cwd(),
    namespace: '',
    schema: ''
  }

  return { ...defaultOptions, ...options }
}

async function loadFromAll({
  args,
  cwd,
  env,
  namespace
}: FaudaOptions): Promise<{}> {
  const resolvedSettings = await Promise.all([
    loadFromEnv(env, namespace),
    loadFromArgs(args),
    loadFromFile(cwd, namespace)
  ])
  const mergedSettings = reduceRight(resolvedSettings, merge, {})
  return mergedSettings
}

/**
 * Loads settings, in order of precedence, from environment, command line
 * arguments, and configuration files.
 */
export async function load<Settings>(
  options: Partial<FaudaOptions> = {}
): Promise<Settings> {
  const safeOptions = normalizeOptions(options)
  const resolvedSettings = await loadFromAll(safeOptions)
  const safeSettings = normalize<Settings>(resolvedSettings, safeOptions)
  return safeSettings
}
