'use strict'
module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define('Chat', {
    UserId: DataTypes.INTEGER,
    message: DataTypes.STRING,
    namespace: DataTypes.STRING
  }, {})
  Chat.associate = function (models) {
    Chat.belongsTo(models.User)
  }
  return Chat
}