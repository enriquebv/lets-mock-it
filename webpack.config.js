const webpackMerge = require('webpack-merge')

const configuracionGeneral = require('./build-config/webpack.general')
const configuracionDesarrollo = require('./build-config/webpack.desarrollo')
const configuracionProduccion = require('./build-config/webpack.produccion')

const entradas = {
  main: 'src/js/main.js',
  style: 'src/css/style.scss',
}

/** Las carpetas donde se guardan los archivos .js/.css */
const destino = {
  js: 'public/js',
  css: 'public/css'
}

module.exports = env => {
  const configuracionBase = configuracionGeneral(entradas, destino)
  
  if (env === undefined) {
    throw 'No se puede inciar webpack sin un entorno.'
  }

  if (env === 'production') {
    return webpackMerge(configuracionBase, configuracionProduccion)
  }

  if (env === 'development') {
    return webpackMerge(configuracionBase, configuracionDesarrollo)
  }
}