/** @type {import('next').NextConfig} */
module.exports = {

  reactStrictMode: true,

  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.(md|gop|xgo)$/,
      type: 'asset/source'
    })

    return config
  },
}
