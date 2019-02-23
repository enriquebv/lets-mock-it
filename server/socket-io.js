const SocketIo = require('socket.io')
const mockIt = require('../lib/mock-it')

module.exports = server => {
  const io = SocketIo(server)

  /** New connection */
  io.on('connection', socket => {
    const from = socket.client.request.headers.referer

    /** Send all mocks on connection */
    socket.emit('mocks-list', mockIt.getMocks())

    /** Create a new mock */
    socket.on('create-mock', (mock, callback) => mockIt.createMock(mock, callback))
  })
}