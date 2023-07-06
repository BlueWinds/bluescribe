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

    config.devServer = { host: 'local-ipv4' }

    // If `TAURI_PLATFORM_TYPE` is present in the environment, we're building for Tauri.
    //  Our entry point should be `index-tauri.js` instead of `index.js`
    if (process.env.TAURI_PLATFORM_TYPE) {
      config.entry = config.entry.replace('index.js', 'index-tauri.js')
    }

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
