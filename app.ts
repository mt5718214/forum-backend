const express = require('express')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const cors = require('cors')
const app = express()
const http = require('http').createServer(app)
const port = process.env.PORT || 3000
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const passport = require('./config/passport')

// cors 的預設為全開放
app.use(cors({
  origin: ["http://localhost:8080", 'https://mt5718214.github.io'],
  credentials: true
}))

const io = require('socket.io')(http, {
  cors: {
    origin: ['http://localhost:8080', 'https://mt5718214.github.io'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true
  }
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(methodOverride('_method'))
// app.use('/upload', express.static(__dirname + '/upload'))

// 把 req.flash 放到 res.locals 裡面
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = req.user
  next()
})

http.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// websocket
import { ws } from './controllers/ws/chat'
ws(io)

// 引入 routes 並將 app 傳進去，讓 routes 可以用 app 這個物件來指定路由
require('./routes')(app)

module.exports = app