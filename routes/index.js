let apis = require('./apis')
let chat = require('./chat')

module.exports = (app) => {
  app.use('/chat', chat)
  app.use('/api', apis)
}
