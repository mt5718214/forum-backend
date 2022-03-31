let routes = require('./routes')
let apis = require('./apis')
let chat = require('./chat')

module.exports = (app) => {
  app.use('/chat', chat)
  app.use('/', routes)
  app.use('/api', apis)
}
