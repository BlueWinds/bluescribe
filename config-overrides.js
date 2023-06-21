module.exports = {
  webpack: function webpack(config, env) {
    const webpack = require('webpack')
    config.resolve.fallback = {
      buffer: require.resolve('buffer'),
      stream: require.resolve('stream-browserify'),
    }

    config.plugins.push(
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
    )

    return config
  },
  jest: function jest(config) {
    config.testMatch = ['<rootDir>/src/**/__tests__/**/*.js', '<rootDir>/src/**/*.{spec,test}.js']

    config.transformIgnorePatterns = []
    config.watchPathIgnorePatterns = ['cache.json']

    // console.log(config)
    // process.exit()
    return config
  },
}
