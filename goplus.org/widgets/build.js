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
const publicDirPath = resolve('public')

/** Webpack plugin to generate manifest (as `loader.js`) for widgets */
class WidgetsManifestPlugin {

  constructor(publicPath) {
    this.publicPath = publicPath.endsWith('/') ? publicPath : (publicPath + '/')
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tap('WidgetsManifest', async compilation => {
      const assetsByChunkName = compilation.getStats().toJson().assetsByChunkName
      const loaderJs = readFileSync(join(widgetsSrcPath, 'loader.js'), { encoding: 'utf8' })
      const simplifiedManifest = Object.keys(assetsByChunkName).reduce((o, name) => {
        o[name] = assetsByChunkName[name].map(
          path => this.publicPath + path
        )
        return o
      }, {})
      const loaderJsWithManifest = loaderJs.replace(/\bMANIFEST\b/g, JSON.stringify(simplifiedManifest))
      // TODO: may not be executed cuz async minify (we call `process.exit()` in the end of `function main`)
      const loaderJsCompressed = (await minify(loaderJsWithManifest, { toplevel: false })).code
      outputFileSync(join(publicDirPath, 'widgets/loader.js'), loaderJsCompressed)
    })
  }
}

/** remove suffix in filePath */
function removeSuffix(filePath) {
  return filePath.replace(/\.\w+$/, '')
}

async function main() {

  const widgets = readdirSync(widgetEntriesPath).map(removeSuffix)
  console.log('widgets:', widgets)

  loadEnvConfig(dir, false)

  const nextConfig = await loadConfig.default(PHASE_PRODUCTION_BUILD, dir, null)

  // The URL of the deployment. Example: `my-site-7q03y4pi5.vercel.app`.
  // https://vercel.com/docs/concepts/projects/environment-variables#system-environment-variables
  const NEXT_PUBLIC_VERCEL_URL = process.env.NEXT_PUBLIC_VERCEL_URL
  nextConfig.assetPrefix = NEXT_PUBLIC_VERCEL_URL ? ('https://' + NEXT_PUBLIC_VERCEL_URL) : ''
  console.log('assetPrefix:', nextConfig.assetPrefix)

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

  const publicPath = `${nextConfig.assetPrefix || ''}/_next/`

  webpackConfig.output = {
    path: outputPath,
    filename: 'static/widgets/[name].[contenthash].js',
    publicPath
  }

  webpackConfig.plugins = webpackConfig.plugins.filter(
    p => p.constructor.name !== 'NextMiniCssExtractPlugin'
  ).concat(
    new NextMiniCssExtractPlugin({
      filename: 'static/widgets/[name].[contenthash].css'
    }),
    new WidgetsManifestPlugin(publicPath)
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
  console.log('done')
  process.exit(0)
}

main()
