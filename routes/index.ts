import { Express } from 'express'
import apis from './apis'
import chat from './chat'

module.exports = (app: Express) => {
  app.use('/chat', chat)
  app.use('/api', apis)
}
