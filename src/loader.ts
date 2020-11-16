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
  const resolvedConfig = await Promise.all([
    loadFromEnv(env, namespace),
    loadFromArgs(args),
    loadFromFile(cwd, namespace)
  ])
  const mergedConfig = reduceRight(resolvedConfig, merge, {})
  return mergedConfig
}

/**
 * Loads configuration, from environment variables, command-line arguments,
 * and configuration files.
 */
export async function load<Configuration>(
  options: Partial<FaudaOptions> = {}
): Promise<Configuration> {
  const safeOptions = normalizeOptions(options)
  const resolvedConfig = await loadFromAll(safeOptions)
  const safeConfig = normalize<Configuration>(resolvedConfig, safeOptions)
  return safeConfig
}
