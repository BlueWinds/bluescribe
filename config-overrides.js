const webpack = require('webpack')

module.exports = function override(config, env) {
  config.resolve.fallback = {
    buffer: require.resolve('buffer'),
    stream: require.resolve('stream-browserify'),
  }

  config.plugins.push(new webpack.ProvidePlugin({
    Buffer: ['buffer', 'Buffer'],
  }))

  return config
}
