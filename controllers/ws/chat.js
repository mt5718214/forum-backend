const ChatService = require('../../services/chatService')

const onlineUsers = new Map()

module.exports = (io) => {
  /*監聽 連線狀態*/
  io.on('connection', async function (socket) {
    console.log('user connected...')

    // 使用者進入聊天室
    socket.on('joinRoom', async (newUser) => {
      if (!onlineUsers.has(newUser.id)) {
        onlineUsers.set(newUser.id, newUser)
      }
      // 發送事件給自己
      socket.emit('newUser', { newUser, onlineUsers: [...onlineUsers.values()] })
      // 發送事件給自己以外的使用者
      socket.broadcast.emit('newUser', { newUser, onlineUsers: [...onlineUsers.values()] })
    })

    // 使用者離開
    socket.on('leave', (userId) => {
      socket.broadcast.emit('leave', onlineUsers.get(userId))
      if (onlineUsers.has(userId)) {
        onlineUsers.delete(userId)
      }
      console.log('disconnected~~~')
    })

    // 收到使用者發送的訊息, 然後轉發給其他使用者和使用者自己
    socket.on('send message', (data) => {
      ChatService.postMessage(data)
      socket.broadcast.emit('msg', data)
      socket.emit('msg', data)
    })

    // 使用者進入頻道會發送事件請求歷史訊息
    socket.on('get history', async (data) => {
      const { namespace } = data
      const messages = await ChatService.getMessage({ namespace })
      socket.emit('history', messages)
    })
  })
}