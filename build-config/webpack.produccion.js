const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')

const minificacionCSS = {}
const minificacionJS = {
  parallel: true,
  terserOptions: {
    output: {
      comments: false
    }
  }
}

module.exports = {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin(minificacionJS),
      new OptimizeCSSAssetsPlugin(minificacionCSS)
    ]
  },
  plugins: [
    new ProgressBarPlugin({
      format: '\x1b[32mProcesando archivos estaticos:\x1b[0m :bar',
      clear: true,
      complete: '■',
      incomplete: '.'
    })
  ],
  stats: {
    assets: false,
    cached: false,
    cachedAssets: false,
    children: false,
    chunks: false,
    errors: true,
    errorDetails: true,
    hash: false,
    modules: false,
    performance: false,
    warnings: false,
    entrypoints: false,
    timings: false
  }
}