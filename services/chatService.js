const { format } = require('fecha')
const db = require('../models')
const { QueryTypes } = require('sequelize');

const chatService = {
  async getMessage(data) {
    const { namespace } = data
    const messages = await db.sequelize.query(
      `SELECT Chat.UserId, Chat.message, Chat.namespace, Chat.createdAt, Users.image FROM Chat
       INNER JOIN Users
        ON Chat.UserId = Users.id
       WHERE namespace = :namespace
      `,
      {
        replacements: {
          namespace
        },
        type: QueryTypes.SELECT
      }
    )
    return messages
  },
  postMessage(data) {
    const { UserId, message } = data
    const createdAt = format(new Date(), 'YYYY-MM-DD HH:mm:ss')
    db.sequelize.query(
      `INSERT INTO Chat (
        UserId, message, namespace, createdAt, updatedAt
      ) VALUES (
        :UserId, :message, :namespace, :createdAt, :updatedAt
      )`,
      {
        replacements: {
          UserId,
          message,
          createdAt,
          updatedAt: createdAt,
          namespace: 'public'
        },
        type: QueryTypes.INSERT
      }
    )
  }
}

module.exports = chatService