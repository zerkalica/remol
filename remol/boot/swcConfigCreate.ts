import path from 'path'
import url from 'url'
// import type { BundleInput } from '@swc/core/spack'

export function remolBootSwcConfigCreate(metaUrl: string) {
  const projectRoot = url.fileURLToPath(new URL('.', metaUrl))
  return {
    entry: {
      web: path.join(projectRoot, 'browser.tsx'),
    },
    output: {
      name:
        require(projectRoot + '/package.json')
          .name.replace('@', '')
          .replace(/\//g, '_') + '.js',
      path: path.join(projectRoot, '-', '-public'),
    },
    sourceMap: true,
    options: {
      jsc: {
        target: 'es2018',
        parser: {
          syntax: 'typescript',
          tsx: true,
          decorators: true,
          dynamicImport: true,
        },
      },
    },
    module: {},
  }
}
