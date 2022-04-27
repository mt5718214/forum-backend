'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Users', 'enableMailNotification', {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Users', 'enableMailNotification')
  }
}