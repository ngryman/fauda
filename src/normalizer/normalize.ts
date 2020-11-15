import { flow } from 'lodash'
import { expandVars } from './expandVars'
import { validate } from './validate'

type Options = {
  env: NodeJS.ProcessEnv
  schema: any
}

const defaultOptions: Options = {
  env: process.env,
  schema: {}
}

export function normalize<Settings>(
  settings: {},
  options: Partial<Options> = {}
): Settings {
  const { env, schema } = { ...defaultOptions, ...options }
  return flow(
    _ => expandVars(_, env),
    _ => validate<Settings>(_, schema)
  )(settings)
}
