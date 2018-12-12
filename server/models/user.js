const Sequelize = require('sequelize')
const db = require('../db')
const config = require('../core').getConfig()

const User = db.define('user', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  login: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  pass: {
    type: Sequelize.STRING,
    allowNull: false
  },
  admin: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  registered: {
    type: Sequelize.BIGINT,
    allowNull: false
  },
  rocket: {
    type: Sequelize.STRING
  },
  guest: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  zvisor: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  zroot: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
}, config.model)

User.sync()
  .catch(error => console.error(' - Models.User: 🛑', error))
  .then(result => console.info(' - Models.User: 👌'))

module.exports = User