const SocketIo = require('socket.io')

module.exports = server => {
  const io = SocketIo(server)

  /** New connection */
  io.on('connection', socket => {
    const from = socket.client.request.headers.referer

    console.info('- [Socket] New connection from %s', from)
  })
}