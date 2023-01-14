import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express()
const http = require('http').createServer(app)
const port = process.env.PORT || 3000
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

import passport from './config/passport'

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
app.use(passport.initialize())
app.use(passport.session())
// app.use('/upload', express.static(__dirname + '/upload'))

http.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// websocket
import { ws } from './controllers/ws/chat'
ws(io)

// 引入 routes 並將 app 傳進去，讓 routes 可以用 app 這個物件來指定路由
require('./routes')(app)

module.exports = app