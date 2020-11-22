import path from 'path'
import { promises as fs } from 'fs'
import { snakeCase } from 'lodash'

const TEMPLATES_ROOT = path.join(__dirname, '../../test/fixtures/templates')

export class TestProject {
  public readonly rootDir: string

  constructor(public readonly variant: string = 'package.json') {
    this.rootDir = path.join(TEMPLATES_ROOT, snakeCase(variant))
  }

  async setup(): Promise<void> {
    const { rootDir, variant } = this
    const variantDir = path.dirname(variant)
    const ext = path.extname(variant) || '.json'
    const templateName =
      'template' + (variant === 'package.json' ? '_package' : '')

    try {
      await fs.mkdir(rootDir)
      await fs.mkdir(path.join(rootDir, 'upward'))
      if (variantDir !== '.') await fs.mkdir(path.join(rootDir, variantDir))
      await fs.copyFile(
        path.join(TEMPLATES_ROOT, `${templateName}${ext}`),
        path.join(rootDir, variant)
      )
    } catch (e) {}
  }

  async teardown(): Promise<void> {
    const { rootDir } = this
    await fs.rmdir(path.join(rootDir), { recursive: true })
  }

  resolvePath(filepath: string): string {
    return path.join(this.rootDir, filepath)
  }
}
