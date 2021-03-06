const { readFileSync, writeFile } = require('fs')
const path = require('path')

const mocksFile = path.resolve(__dirname, '../storage/mocks.json')
const mocks = getSavedMocks()

function getSavedMocks() {
  const start = Date.now()
  const json = readFileSync(mocksFile, 'utf8')

  if (json.length === 0) {
    console.info('Wihout mocks to load.')
    return []
  }

  const parsed = JSON.parse(json || '[]')
  const sizeInKB = Number((json.length / 1024).toFixed(2))
  const mocksCount = parsed.length
  const elapsed = Date.now() - start

  console.info('Loaded %d mocks (%dKB) loaded in %dms', mocksCount, sizeInKB, elapsed)

  return parsed
}

function createMock(mock, callback) {
  const existingMocks = mocks.filter(single =>
    single.method === mock.method &&
    single.endpoint === mock.endpoint
  )

  if (existingMocks.length > 0) {
    const socketIo = require('../server/socket-io')

    existingMocks.forEach(existingMock => {
      changeStatus({ id: existingMock.id, status: false })
        .then(() =>
          socketIo.emitToAll('mock-status-changed', { id: existingMock.id, status: false })
        )
    })
  }

  mocks.push(mock)
  updateMocksFile()
}

function getMock(method, endpoint) {
  return mocks
    .filter(mock => mock.method === method)
    .filter(mock => mock.endpoint === endpoint)[0]
}

function getActiveMock(method, endpoint) {
  return mocks
    .filter(mock => mock.active === true)
    .filter(mock => mock.method === method)
    .filter(mock => mock.endpoint === endpoint)[0]
}

function getMocks() {
  return mocks
}

function updateMock(mock, callback) {
  const original = mocks.filter(single => single.id === mock.id)[0]
  const position = mocks.indexOf(original)

  if (position === -1 && callback) {
    return callback({ message: 'mock-dont-exist' })
  }

  mocks[position] = mock

  if (callback) {
    callback({ message: 'mock-updated', id: mock.id })
  }

  updateMocksFile()
}

function updateMocksFile() {
  writeFile(mocksFile, JSON.stringify(mocks, null, 2), 'utf8', done => console.info('Updated mocks.json'))
}

function route(request, response) {
  const endpoint = request.url.substr(1, request.url.length)
  const method = request.method.toLowerCase()
  const mock = getActiveMock(method, endpoint)
  const exists = mock !== undefined

  if (!exists) {
    response.status(404).send({ error: 'Mock don\'t exists' })
  }

  if (exists) {
    if (mock.format === 'json') {
      response.set('Content-Type', 'application/json')
    }

    response.status(mock.status).send(mock.response)
  }
}

function changeStatus(data) {
  const mock = mocks.filter(mock => mock.id === data.id)[0]
  const position = mocks.indexOf(mock)

  mock.active = data.status
  mocks[position] = mock

  updateMocksFile()

  return new Promise((resolve, reject) => {
    mocks.splice(position, mock)
    resolve(data)
  })
}

function remove(id) {
  const mock = mocks.filter(mock => mock.id === id)[0]
  const position = mocks.indexOf(mock)

  return new Promise((resolve, reject) => {
    mocks.splice(position, 1)
    resolve(id)
    updateMocksFile()
  })
}

module.exports = {
  createMock,
  updateMock,
  changeStatus,
  remove,
  getMocks,
  getMock,
  route
}