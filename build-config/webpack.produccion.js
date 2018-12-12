const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

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
  }
}