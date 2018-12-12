const Sequelize = require('sequelize')
const db = require('../db')
const config = require('../core').getConfig()

const TaskUser = db.define('TaskUser', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fk_user: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  fk_tarea: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  role: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, config.model)

TaskUser.sync()
  .catch(error => console.error(' - Models.TaskUser: 🛑', error))
  .then(result => console.info(' - Models.TaskUser: 👌'))

module.exports = TaskUser