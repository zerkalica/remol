import path from 'path'
import url from 'url'
import { remolBootInfoTsConfig } from './info/tsConfig.js'

import type { Config } from '@jest/types'

export function jestConfig(metaUrl: string, { tsConfigJson = 'tsconfig.json', outDir = '-' } = {}) {
  const pkgDir = url.fileURLToPath(new URL('.', metaUrl))
  const t = remolBootInfoTsConfig(path.join(pkgDir, tsConfigJson))
  const roots = t.projectReferences?.map(ref => path.join(ref.path, outDir)) ?? []
  roots.push(path.join(pkgDir, outDir))
  const config: Config.InitialOptions = {
    roots,
  }

  return config
}
