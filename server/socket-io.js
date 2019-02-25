const SocketIo = require('socket.io')
const mockIt = require('../lib/mock-it')

const clients = []

function startServer(http) {
  const io = SocketIo(http)

  /** New connection */
  io.on('connection', socket => {
    const from = socket.client.request.headers.referer

    clients.push(socket)

    /** Send all mocks on connection */
    socket.emit('mocks-list', mockIt.getMocks())

    /** Create a new mock */
    socket.on('create-mock', (mock, callback) => mockIt.createMock(mock, callback))

    /** Update an existing mock */
    socket.on('update-mock', (mock, callback) => mockIt.updateMock(mock, callback))

    /** Change mock status */
    socket.on('change-mock-status', data =>
      mockIt.changeStatus(data).then(data => socket.emit('mock-status-changed', data))
    )

    socket.on('remove-mock', id => mockIt.remove(id).then(data => socket.emit('mock-removed', id)))
  })
}

function emitToAll(event, data) {
  clients.forEach(socket => socket.emit(event, data))
}

module.exports = {
  startServer,
  emitToAll,
  clients
}