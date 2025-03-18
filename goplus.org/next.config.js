/** @type {import('next').NextConfig} */
const path = require("path")

const getCopyPlugin = () => {
  if (!process.env.COPY_ASSETS) {
    return null
  }
  const CopyPlugin = require("copy-webpack-plugin")
  return new CopyPlugin({
    patterns: [
      {
        from: path.join(process.cwd(), 'articles/**/*.{jpg,jpeg,png,gif,svg}'),
        to: path.join(process.cwd(), 'public'),
      },
    ],
  })
}

module.exports = {
  reactStrictMode: true,

  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.(md|gop)$/,
      type: 'asset/source'
    })
    
    // Conditionally require plugin to prevent AbortSignal type conflicts in widget builds
    const copyPlugin = getCopyPlugin()
    if (copyPlugin) {
      config.plugins.push(copyPlugin)
    }
    
    return config
  },
}
