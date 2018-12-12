const Sequelize = require('sequelize')
const db = require('../db')
const config = require('../core').getConfig()

const Task = db.define('task', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT
  },
  project: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  creator: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  end: {
    type: Sequelize.BIGINT
  },
  order: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  progress: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'todo'
  },
  bug: {
    type: Sequelize.STRING,
    defaultValue: 'none'
  },
  fk_parent: {
    type: Sequelize.INTEGER
  }
}, config.model)

Task.sync()
  .catch(error => console.error(' - Models.Task: 🛑', error))
  .then(result => console.info(' - Models.Task: 👌'))

module.exports = Task