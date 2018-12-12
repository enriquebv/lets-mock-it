const yaml = require('js-yaml')
const fs = require('fs')
const path = require('path')
const config = getConfig()

/**
 * Read a Yaml file
 * @param {string} path 
 */
function readYaml(path) {
  try {
    return yaml.safeLoad(fs.readFileSync(path, 'utf8'));
  } catch (e) {
    return e
  }
}

function getConfig() {
  return readYaml(path.resolve(__dirname, '../config.yaml'))
}

/**
 * Return a correct global data object.
 * @param {object} object Global data.
 */
function renderData(req, object) {
  let deafult = {
    index: false,
    type: 'page',
    onlyLogged: false,
    logged: req.logged,
    meta: {
      title: '',
      description: '',
    },
    css: [],
    scripts: []
  }

  return Object.assign(deafult, object)
}

module.exports = {
  readYaml,
  getConfig,
  renderData
}