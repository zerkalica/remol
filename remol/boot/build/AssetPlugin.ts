import { promises as fsReal } from 'fs'
import path from 'path'
import { callbackify, promisify } from 'util'
import webpack from 'webpack'

import { RemolBootBuildTemplate } from './Template'

export class RemolBootBuildAssetPlugin {
  constructor(
    protected opts: {
      meta?: Record<string, any>
      pretty?: boolean
      filename?: string
    } = {}
  ) {}

  template() {
    return new RemolBootBuildTemplate()
  }

  static info(compilation: webpack.Compilation) {
    const files = {} as Record<string, string>
    const entries = {} as Record<string, string>

    for (const [k, v] of compilation.assetsInfo) {
      if (v.sourceFilename) files[v.sourceFilename] = k
    }

    compilation.entrypoints.forEach((p, k) => {
      entries[k] = Array.from(p.getEntrypointChunk().files)?.[0]
    })

    return {
      files,
      entries,
    }
  }

  apply(compiler: webpack.Compiler) {
    compiler.hooks.emit.tapAsync({ name: 'AcmeAcmeBuildAssetPlugin' }, callbackify(this.emit.bind(this)))
  }

  async emit(compilation: webpack.Compilation) {
    const out = RemolBootBuildAssetPlugin.info(compilation)

    const fs = compilation.compiler.outputFileSystem as typeof compilation.compiler.outputFileSystem & {
      mkdirp?(p: string, cb: (err?: unknown) => void): void
    }

    const mkdir = fs.mkdirp ? promisify(fs.mkdirp.bind(fs)) : (path: string) => fsReal.mkdir(path, { recursive: true })
    const writeFile = promisify(fs.writeFile.bind(fs))
    const stat = promisify(fs.stat.bind(fs))
    const join = fs.join ?? path.join

    const outDir = compilation.outputOptions.path

    if (!outDir) throw new Error('No outputOptions.path in webpack compilation')

    const manifestFile = join(outDir, this.opts.filename ?? 'manifest.json')
    const manifest = { ...out, ...this.opts.meta }
    await mkdir(outDir)
    await writeFile(manifestFile, JSON.stringify(manifest, null, this.opts.pretty ? '  ' : ''))

    const t = this.template()

    if (t) {
      const state = Object.keys(manifest.files).length ? { __files: manifest.files } : undefined
      const htmlFile = join(outDir, t.fileName() ?? 'index.html')

      const prevBodyJs = t.bodyJs.bind(t)
      t.bodyJs = () => [...prevBodyJs(), ...Object.values(manifest.entries).map(src => ({ src: this.publicUrl() + src }))]

      await writeFile(htmlFile, t.render(state))
    }
  }
}
