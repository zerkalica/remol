import child_process from 'child_process'
// @ts-ignore
import CircularDependencyPlugin from 'circular-dependency-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import { IncomingMessage, ServerResponse } from 'http'
import path from 'path'
import serveStatic from 'serve-static'
// @ts-ignore
import { TscWatchClient } from 'tsc-watch/client'
import { promisify } from 'util'
import webpack from 'webpack'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import webpackDevMiddleware from 'webpack-dev-middleware'

import { remolServerMdlCombine, RemolServerMiddleware } from '../server/mdlCombine'
import { RemolBootBuildAssetPlugin } from './AssetPlugin'
import { RemolBootBuildTemplate } from './Template'

export class RemolBootBuild {
  protected isDevOverrided = false

  isDev() {
    if (this.isDevOverrided) return this.isDevOverrided

    return process.env.NODE_ENV === 'development'
  }

  noWatch() {
    return process.env.WP_NO_WATCH === '1'
  }

  analyzer() {
    return process.env.WP_ANALYZER === '1'
  }

  projectRoot() {
    return process.cwd()
  }

  pkgName() {
    return require(path.join(this.projectRoot(), 'package.json')).name.replace(/[\/]/g, '_').replace(/@/g, '')
  }

  distRoot() {
    return path.join(this.projectRoot(), '-')
  }

  publicUrl() {
    return '/'
  }

  protected versionCached: string | undefined = undefined

  getVersion() {
    return child_process.execSync('git rev-parse --short HEAD').toString().trim()
  }

  version() {
    return this.versionCached ?? (this.versionCached = this.getVersion())
  }

  publicDir() {
    return path.join(this.distRoot(), '-public')
  }

  protected browserEntry() {
    return path.join(this.distRoot(), 'browser')
  }

  manifestName() {
    return 'manifest.json'
  }

  protected manifestPath() {
    return path.join(this.publicDir(), this.manifestName())
  }

  protected wpc(): webpack.Configuration {
    const isDev = this.isDev()
    const outDir = this.publicDir()
    const browserEntry = this.browserEntry()
    const pkgName = this.pkgName()

    return {
      name: path.basename(browserEntry),
      entry: {
        [pkgName]: browserEntry,
      },
      // optimization: {
      //   splitChunks: {
      //     filename: isDev ? `${pkgName}-[id].js` : `${pkgName}-[id]-[contenthash].js`,
      //     chunks: 'all',
      //   },
      // },
      devtool: 'source-map',
      mode: isDev ? 'development' : 'production',
      stats: 'normal',
      performance: {
        maxAssetSize: 400000,
        maxEntrypointSize: 400000,
        assetFilter(name: string) {
          return name.endsWith('.js')
        },
      },
      watchOptions: {
        aggregateTimeout: 500,
      },
      module: {
        rules: this.rules().filter((rule): rule is NonNullable<typeof rule> => Boolean(rule)),
      },
      plugins: this.plugins().filter((plug): plug is NonNullable<typeof plug> => Boolean(plug)),
      output: {
        filename: isDev ? `[name].js` : `[name]-[contenthash].js`,
        path: outDir,
        publicPath: this.publicUrl(),
      },
    }
  }

  protected rules(): readonly (webpack.RuleSetRule | undefined)[] {
    return [this.ruleTs(), this.ruleSourceMap()]
  }

  protected ruleSourceMap(): webpack.RuleSetRule | undefined {
    return {
      test: /\.js$/,
      exclude: /mol_wire_lib/,
      enforce: 'pre',
      use: ['source-map-loader'],
    }
  }

  protected ruleTs(): webpack.RuleSetRule | undefined {
    return undefined
    // return {
    //   test: /\.tsx?$/,
    //   exclude: /(node_modules|bower_components|-)/,
    //   use: {
    //     loader: 'swc-loader',
    //     options: {
    //       jsc: {
    //         target: 'es2018',
    //         parser: {
    //           syntax: 'typescript',
    //           tsx: true,
    //           decorators: true,
    //           dynamicImport: true,
    //         },
    //       },
    //     },
    //   },
    // }
  }

  protected plugins(): readonly (webpack.WebpackPluginInstance | undefined)[] {
    return [
      this.plugClean(),
      this.plugCircular(),
      this.plugRemolAsset(),
      this.plugIgnore(),
      this.plugAnalyzer(),
      // new webpack.WatchIgnorePlugin([/\.js$/, /\.d\.ts$/]),
      this.plugProgress(),
      this.plugCopyWebpack(),
    ]
  }

  protected plugClean(): CleanWebpackPlugin | undefined {
    return new CleanWebpackPlugin()
  }

  protected plugIgnore(): webpack.IgnorePlugin | undefined {
    return new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/tsbuildinfo$/,
    })
  }

  protected plugCircular(): webpack.WebpackPluginInstance | undefined {
    return new CircularDependencyPlugin({
      failOnError: true,
    })
  }

  protected reloadSegment() {
    return '__reload'
  }

  protected reloadUrl() {
    return this.publicUrl() + this.reloadSegment()
  }

  protected template(): RemolBootBuildTemplate | undefined {
    const template = new RemolBootBuildTemplate()
    template.publicUrl = this.publicUrl.bind(this)
    template.pkgName = this.pkgName.bind(this)
    template.version = this.version.bind(this)
    if (this.isDev()) {
      template.devJs = () => [
        {
          body: `new EventSource(window.origin + '${this.reloadUrl()}').onmessage = e => {
        const res = JSON.parse(e.data)
        console.log('recv', res.t)
        if (res.t === 'success') window.location.reload()
        if (res.t === 'success:ts') document.body.innerHTML = '<h1>Bundle js...</h1>'
        if (res.t === 'started') document.body.innerHTML = '<h1>Compile ts...</h1>'
        if (res.t === 'error') document.body.innerHTML = '<h1>Error</h1><pre>' + res.error + '</pre>'
      }
      `,
        },
      ]
    }

    return template
  }

  protected plugRemolAsset(): RemolBootBuildAssetPlugin | undefined {
    const plug = new RemolBootBuildAssetPlugin()

    plug.template = this.template.bind(this)
    plug.meta = () => ({ version: this.version() })
    plug.filename = this.manifestName.bind(this)

    return plug
  }

  protected plugAnalyzer() {
    return this.analyzer() ? new BundleAnalyzerPlugin() : undefined
  }

  protected plugProgress(): webpack.ProgressPlugin | undefined {
    return new webpack.ProgressPlugin()
  }

  protected plugCopyWebpack(): webpack.WebpackPluginInstance | undefined {
    return new CopyWebpackPlugin({
      patterns: [
        {
          noErrorOnMissing: true,
          from: '**/*.{png,jpg,svg,gif,woff2}',
          to: this.isDev() ? '[name][ext]' : '[name]-[contenthash][ext]',
          globOptions: {
            ignore: ['**/-', '**/node_modules'],
          },
        },
      ],
    })
  }

  protected log(obj: Object | string) {
    console.log(obj)
  }

  protected compilerCached: { compiler: webpack.Compiler; run(): Promise<webpack.Stats | undefined> } | undefined = undefined

  protected compiler() {
    if (this.compilerCached) return this.compilerCached
    const outDir = this.publicDir()
    const browserEntry = this.browserEntry()
    const pkgName = this.pkgName()
    const version = this.version()

    const compiler = webpack(this.wpc())
    const run = promisify(compiler.run.bind(compiler))
    this.log({ browserEntry, outDir, pkgName, version })

    return (this.compilerCached = { compiler, run })
  }

  run() {
    return this.compiler().run()
  }

  async bundle() {
    const stats = await this.run()

    if (!stats) throw new Error('No stats')
    this.log(stats.toString({ colors: true }))

    return RemolBootBuildAssetPlugin.info(stats.compilation)
  }

  tests() {
    const p = child_process.spawnSync('jest', ['--passWithNoTests'], {
      stdio: 'inherit',
    })
    if (p.status) throw p.error ?? new Error(`Jest returns ${p.status}${p.stderr ? `: ${p.stderr}` : ''}`)
  }

  protected client: ServerResponse | undefined = undefined

  middleware() {
    this.isDevOverrided = true
    this.watch()

    return remolServerMdlCombine(this.mdlReload.bind(this), this.mdlStatic.bind(this, serveStatic(this.publicDir())))
  }

  mdlStatic(orig: any, req: IncomingMessage, res: ServerResponse, next: (err?: any) => any) {
    // req.url = `${this.publicUrl()}${req.url?.substring(1)}`
    orig(req, res, next)
  }

  mdlReload(req: IncomingMessage, res: ServerResponse, next: (err?: any) => any) {
    if (req.url !== this.reloadUrl()) return next()

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache',
    })
    this.client = res

    req.on('close', () => {
      this.client = undefined
    })
  }

  manifestFromResponse(
    res: ServerResponse & {
      locals?: {
        webpack?: { devMiddleware?: { stats: webpack.Stats; outputFileSystem: webpack.Compiler['outputFileSystem'] } }
      }
    }
  ) {
    const compilation = res.locals?.webpack?.devMiddleware?.stats.compilation
    if (!compilation) {
      throw new Error('manifestFromResponse: compilation not found in res.locals.webpack.devMiddleware.stats.compilation')
    }

    return {
      isDev: true,
      version: this.version(),
      ...RemolBootBuildAssetPlugin.info(compilation),
    }
  }

  clientSend(t?: string, e?: Error) {
    console.log('message', t + '...')
    const data = `data: ${JSON.stringify({ t, error: e?.stack })}\n\n`

    this.client?.write(data)
  }

  protected running = undefined as undefined | Promise<webpack.Stats | undefined>

  tsStarted() {
    this.clientSend('started')
  }

  async tsSuccess() {
    try {
      this.clientSend('success:ts')
      if (this.running) await this.running
      this.running = this.run()

      const r = await this.running
      // r?.compilation.finish()

      this.clientSend('success')
      this.tests()
      this.running = undefined
    } catch (error) {
      this.running = undefined
      this.clientSend('error', error as Error)
      console.error(error)
    }
  }

  tsError(e?: Error) {
    this.clientSend('error', e ?? new Error('Ts compile error, check console'))
  }

  protected watch() {
    const tswc = new TscWatchClient()

    tswc.on('started', this.tsStarted.bind(this))
    tswc.on('success', this.tsSuccess.bind(this))
    tswc.on('compile_errors', this.tsError.bind(this))
    tswc.start('--noClear', '--build', '.')
  }
}
