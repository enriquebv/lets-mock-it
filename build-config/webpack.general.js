const path = require('path')
const fs = require('fs')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = (entradas, destino, env) => {
  if (typeof entradas !== 'object' || Array.isArray(entradas)) {
    throw '[WEBPACK] La propiedad entradas no es valida, debe ser un objeto.'
  }

  const entry = {}
  const output = {}
  const module = { rules: [] }
  const plugins = []

  output.path = path.resolve(__dirname, '..', destino.js)
  output.filename = '[name].js'

  for (const nombre in entradas) {
    const contenido = entradas[nombre]

    if (typeof contenido === 'string') {
      entry[nombre] = path.join(__dirname, '../', contenido)
    }

    if (Array.isArray(contenido)) {
      if (contenido.some(uri => typeof uri !== 'string')) {
        throw '[WEBPACK] El contenido de un array en una entrada solo puede contener archivos, no nuevos array/objetos.'
      }

      entry[nombre] = contenido.map(uri => path.join(__dirname, '../', uri))
    }
  }

  const configuracionBabel = {
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env']
      }
    }
  }

  const configuracionSCSS = {
    test: /\.scss$/,
    use: [
      MiniCssExtractPlugin.loader,
      'css-loader?-url',
      'sass-loader'
    ]
  }

  const configuracionVue = {
    test: /\.vue$/,
    loader: 'vue-loader'
  }

  const configuracionRaw = {
    test: /\.html$/,
    loader: 'raw-loader'
  }

  module.rules.push(configuracionBabel)
  module.rules.push(configuracionSCSS)
  module.rules.push(configuracionVue)
  module.rules.push(configuracionRaw)

  const pluginMiniCSS = new MiniCssExtractPlugin({
    filename: `../../${destino.css}/[name].css`,
    chunkFilename: '[id].css'
  })

  const pluginVue = new VueLoaderPlugin()

  const pluginAfterEmit = {
    apply: compiler => {
      compiler.hooks.afterEmit.tap('AfterEmitPlugin', compilation => {
        const scriptPath = path.resolve(__dirname, './webpack.after-emit.js')
        const scriptExist = fs.existsSync(scriptPath)

        if (scriptExist) {
          require(scriptPath)(compilation)
        }
      })
    }
  }

  plugins.push(pluginMiniCSS)
  plugins.push(pluginVue)
  plugins.push(pluginAfterEmit)

  const resolve = {
    alias: {
      vue: (env === 'production') ? 'vue/dist/vue.min.js' : 'vue/dist/vue.js'
    }
  }

  const optimization = {
    splitChunks: {
      cacheGroups: {
        default: false,
        commons: {
          // test: /[\\/]node_modules[\\/]|[\\/]vendor[\\/]/,
          name: 'vendor',
          chunks: 'all',
          minChunks: 2
        }
      }
    }
  }

  return { entry, output, resolve, module, plugins, optimization }
}