let io = null

function init(server) {
  const { Server } = require('socket.io')
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  })

  io.on('connection', (socket) => {
    try {
      const token = socket.handshake?.auth?.token
      if (token) {
        const jwt = require('jsonwebtoken')
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        // attach basic payload to socket for potential room joins/permission checks
        socket.user = payload
      }
    } catch (err) {
      // verification failure shouldn't block connection, but log
      console.log('Socket auth error', err.message)
    }

    console.log('Socket connected', socket.id)

    socket.on('disconnect', () => {
      console.log('Socket disconnected', socket.id)
    })
  })

  return io
}

function getIo() {
  if (!io) throw new Error('Socket.io not initialized')
  return io
}

module.exports = { init, getIo }
