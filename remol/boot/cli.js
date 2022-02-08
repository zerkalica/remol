require('./polyfill')
const esbuild = require('esbuild')

module.exports = class builder {
  async static build() {
    try {
      await esbuild.build({
        entryPoints: ['./bundle.tsx'],
        outfile: '-/bundle.js',
        bundle: true,
        minify: true,
        sourcemap: true,
      })
    } catch (error) {
      console.error(error)
      process.exit(1)
    }
  }
}

