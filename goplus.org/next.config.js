/** @type {import('next').NextConfig} */
const path = require("path")
const CopyPlugin = require("copy-webpack-plugin")

module.exports = {
  reactStrictMode: true,

  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.(md|gop)$/,
      type: 'asset/source'
    })
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: path.join(process.cwd(), 'articles/**/*.{jpg,jpeg,png,gif,svg}'),
            to: path.join(process.cwd(), 'public'),
          },
        ],
      }),
    )
    return config
  },
}
