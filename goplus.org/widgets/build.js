const { resolve, join } = require('path')
const { copySync, readFileSync, outputFileSync, readdirSync } = require('fs-extra')
const { loadEnvConfig } = require('@next/env')
const { runCompiler } = require('next/dist/build/compiler')
const getBaseWebpackConfig = require('next/dist/build/webpack-config')
const { PHASE_PRODUCTION_BUILD } = require('next/dist/shared/lib/constants')
const loadConfig = require('next/dist/server/config')
const { trace, flushAllTraces, setGlobal } = require('next/dist/trace')
const { default: NextMiniCssExtractPlugin } = require('next/dist/build/webpack/plugins/mini-css-extract-plugin')
const { minify } = require('next/dist/compiled/terser')

const dir = resolve('.')
const widgetsSrcPath = resolve('widgets')
const widgetEntriesPath = join(widgetsSrcPath, 'entries')
const outputPath = resolve('.next')
const publicPath = resolve('public')
// const finalOutputPath = resolve('out')

// 所有需要对外的 widget 组件，对应 /widgets/ 下的内容
const widgets = readdirSync(widgetEntriesPath).map(removeSuffix)

class WidgetsManifestPlugin {

  constructor(assetPrefix) {
    this.assetPrefix = assetPrefix.endsWith('/') ? assetPrefix : (assetPrefix + '/')
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tap('WidgetsManifest', async compilation => {
      const assetsByChunkName = compilation.getStats().toJson().assetsByChunkName
      const loaderJs = readFileSync(join(widgetsSrcPath, 'loader.js'), { encoding: 'utf8' })
      const simplifiedManifest = Object.keys(assetsByChunkName).reduce((o, name) => {
        o[name] = assetsByChunkName[name].map(
          path => this.assetPrefix + '_next/' + path
        )
        return o
      }, {})
      const loaderJsWithManifest = loaderJs.replace(/\bMANIFEST\b/g, JSON.stringify(simplifiedManifest))
      // TODO: may not be executed cuz async minify (we call `process.exit()` in the end of `function main`)
      const loaderJsCompressed = (await minify(loaderJsWithManifest, { toplevel: true })).code
      outputFileSync(join(publicPath, 'widgets/loader.js'), loaderJsCompressed)
    })
  }
}

/** remove suffix in filePath */
function removeSuffix(filePath) {
  return filePath.replace(/\.\w+$/, '')
}

// // 导出 widgets 内容的构建结果（从 .next/ 到 out/）
// function exportFiles() {
//   copySync(
//     join(outputPath, 'static'),
//     join(finalOutputPath, '_next', 'static'),
//     { errorOnExist: true }
//   )
// }

async function main() {

  loadEnvConfig(dir, false)

  const nextConfig = await loadConfig.default(PHASE_PRODUCTION_BUILD, dir, null/** TODO */)

  setGlobal('phase', PHASE_PRODUCTION_BUILD)
  setGlobal('distDir', resolve(nextConfig.distDir))

  const runWebpackSpan = trace('run-webpack')

  const webpackConfig = await getBaseWebpackConfig.default(resolve('.'), {
    buildId: 'widgets',
    reactProductionProfiling: false,
    isServer: false,
    config: nextConfig,
    target: nextConfig.target,
    pagesDir: resolve('./pages'),
    entrypoints: {},
    rewrites: {
      fallback: [],
      afterFiles: [],
      beforeFiles: []
    },
    runWebpackSpan
  })

  webpackConfig.entry = widgets.reduce(
    (entries, name) => ({
      ...entries,
      [name]: [
        join(widgetsSrcPath, 'polyfill'),
        join(widgetEntriesPath, name)
      ]
    }),
    {}
  )

  console.log('entries:', webpackConfig.entry)

  webpackConfig.module.rules = webpackConfig.module.rules.map(rule => {
    if (!rule.oneOf) return rule
    const oneOf = rule.oneOf.filter(r => {
      const isErrorLoader = (r.use || {}).loader === 'error-loader'
      return !isErrorLoader
    }).map(r => {
      if (r.test && r.test.toString() === '/(?<!\\.module)\\.(scss|sass)$/') {
        return { ...r, issuer: undefined }
      }
      return r
    })
    return { ...rule, oneOf }
  })

  webpackConfig.output = {
    path: outputPath,
    filename: 'static/widgets/[name].[contenthash].js'
  }

  webpackConfig.plugins = webpackConfig.plugins.filter(
    p => p.constructor.name !== 'NextMiniCssExtractPlugin'
  ).concat(
    new NextMiniCssExtractPlugin({
      filename: 'static/widgets/[name].[contenthash].css'
    }),
    new WidgetsManifestPlugin(nextConfig.assetPrefix)
  )

  webpackConfig.optimization.splitChunks = false
  webpackConfig.optimization.runtimeChunk = false

  // Uncomment thes lines to improve build speed when do local development
  // webpackConfig.optimization.minimize = false
  // webpackConfig.devtool = false

  const result = await runCompiler(webpackConfig, { runWebpackSpan })
  if (result.errors && result.errors.length > 0) {
    result.errors.forEach(err => {
      console.error("Error:")
      console.error("moduleName:", err.moduleName)
      console.error("moduleIdentifier:", err.moduleIdentifier)
      console.error("message:", err.message)
    })
    process.exit(1)
  }
  if (result.warnings && result.warnings.length > 0) {
    result.warnings.forEach(warning => {
      console.warn("Warning:")
      console.warn('loc:', warning.loc)
      console.warn('message:', warning.message)
    })
  }
  await flushAllTraces()
  // exportFiles()
  console.log('done')
  process.exit(0)
}

main()
