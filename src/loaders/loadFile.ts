import { cosmiconfig, Options as CosmiconfigOptions } from 'cosmiconfig'
import loadTs from '@endemolshinegroup/cosmiconfig-typescript-loader'

/**
 * @internal
 */
export function getDefaultSearchPlaces(namespace: string) {
  return [
    'package.json',
    `.${namespace}rc`,
    `${namespace}.config.js`,
    `${namespace}.config.json`,
    `${namespace}.config.ts`,
    `${namespace}.config.yaml`,
    `${namespace}.config.yml`,
    `.config/${namespace}rc`,
    `.config/${namespace}.config.js`,
    `.config/${namespace}.config.json`,
    `.config/${namespace}.config.ts`,
    `.config/${namespace}.config.yaml`,
    `.config/${namespace}.config.yml`
  ]
}

/**
 * Loads configuration from a file.
 *
 * @see https://github.com/davidtheclark/cosmiconfig
 */
export async function loadFromFile(
  cwd: string,
  namespace: string
): Promise<{}> {
  const options: CosmiconfigOptions = {
    loaders: { '.ts': loadTs },
    packageProp: `config.${namespace}`,
    searchPlaces: getDefaultSearchPlaces(namespace)
  }

  const explorer = cosmiconfig(namespace, options)
  const res = await explorer.search(cwd)

  return res?.config || {}
}