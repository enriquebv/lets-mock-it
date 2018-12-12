const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const minificacionCSS = {}
const minificacionJS = {
  parallel: true,
  uglifyOptions: {
    output: {
      comments: false,
      beautify: false
    }
  }
}

module.exports = {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [
      new UglifyJsPlugin(minificacionJS),
      new OptimizeCSSAssetsPlugin(minificacionCSS)
    ]
  }
}