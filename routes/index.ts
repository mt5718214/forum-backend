import { Express } from 'express'
import apis from './apis'
let chat = require('./chat')

module.exports = (app: Express) => {
  app.use('/chat', chat)
  app.use('/api', apis)
}
