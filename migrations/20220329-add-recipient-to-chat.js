'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Chat', 'recipient', {
      type: Sequelize.INTEGER,
      defaultValue: false
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Chat', 'recipient')
  }
}