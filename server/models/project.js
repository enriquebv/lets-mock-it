const Sequelize = require('sequelize')
const db = require('../db')
const config = require('../core').getConfig()

const Project = db.define('project', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  boss: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  guard: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, config.model)

Project.sync()
  .catch(error => console.error(' - Models.Project: 🛑', error))
  .then(result => console.info(' - Models.Project: 👌'))

module.exports = Project