import child_process from 'child_process'
// @ts-ignore
import CircularDependencyPlugin from 'circular-dependency-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import { ServerResponse } from 'http'
import path from 'path'
// @ts-ignore
import TscWatchClient from 'tsc-watch/client'
import { promisify } from 'util'
import webpack from 'webpack'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import webpackDevMiddleware from 'webpack-dev-middleware'

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
    return require(path.join(this.projectRoot(), 'package.json')).name.replace(/[\/]/g, '-').replace(/@/g, '')
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
      module: {
        rules: this.rules().filter((rule): rule is NonNullable<typeof rule> => Boolean(rule)),
      },
      plugins: this.plugins().filter((plug): plug is NonNullable<typeof plug> => Boolean(plug)),
      output: {
        filename: isDev ? `[name].js` : `[name]-[contenthash].js`,
        path: outDir,
      },
    }
  }

  protected rules(): readonly (webpack.RuleSetRule | undefined)[] {
    return [this.ruleSourceMap()]
  }

  protected ruleSourceMap(): webpack.RuleSetRule | undefined {
    return {
      test: /\.js$/,
      exclude: /mol_wire_lib/,
      enforce: 'pre',
      use: ['source-map-loader'],
    }
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

  protected template(): RemolBootBuildTemplate | undefined {
    const template = new RemolBootBuildTemplate()
    template.publicUrl = this.publicUrl.bind(this)
    template.pkgName = this.pkgName.bind(this)
    template.version = this.version.bind(this)

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

  protected compiler() {
    const outDir = this.publicDir()
    const browserEntry = this.browserEntry()
    const pkgName = this.pkgName()
    const version = this.version()

    const compiler = webpack(this.wpc())
    const run = promisify(compiler.run.bind(compiler))
    this.log({ browserEntry, outDir, pkgName, version })

    return { compiler, run }
  }

  async bundle() {
    const stats = await this.compiler().run()

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

  middleware() {
    this.isDevOverrided = true
    const { compiler } = this.compiler()

    const mdl = webpackDevMiddleware(compiler, {
      serverSideRender: true,
    })

    const close = promisify(mdl.close.bind(mdl))
    const invalidate = promisify((cb: (err: any, result?: webpack.Stats | webpack.MultiStats) => void) =>
      mdl.invalidate(arg => cb(null, arg))
    )

    // close()

    if (this.noWatch()) this.tests()
    else this.watch(invalidate)

    return mdl
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

  protected watch(invalidate: () => Promise<undefined | webpack.Stats | webpack.MultiStats>) {
    const tswc = new TscWatchClient()
    tswc.on('started', () => {
      console.log('Compilation started')
    })

    tswc.on('success', async () => {
      try {
        this.tests()
        // await invalidate()
      } catch (e) {
        console.error(e)
      }
    })
    tswc.on('compile_errors', invalidate)
    tswc.start('--noClear', '--build', '.')
  }
}
