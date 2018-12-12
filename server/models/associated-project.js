const Sequelize = require('sequelize')
const db = require('../db')
const config = require('../core').getConfig()

const AssociatedProject = db.define('AssociatedProject', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  project: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  user: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, config.model)

AssociatedProject.sync()
  .catch(error => console.error(' - Models.AssociatedProject: 🛑', error))
  .then(result => console.info(' - Models.AssociatedProject: 👌'))

module.exports = AssociatedProject