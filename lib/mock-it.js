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
  const mockExist = getMock(mock.method, mock.endpoint)

  if (mockExist !== undefined) {
    callback({ message: 'mock-exists' })
    return false
  }

  mocks.push(mock)
  writeFile(mocksFile, JSON.stringify(mocks), 'utf8', done => {
    console.info('Saved a mock.')
  })
}

function getMock(method, endpoint) {
  return mocks
    .filter(mock => mock.method === method)
    .filter(mock => mock.endpoint === endpoint)[0]
}

function getMocks() {
  return mocks
}

function route(request, response) {
  const endpoint = request.url.substr(1, request.url.length)
  const method = request.method.toLowerCase()
  const mock = getMock(method, endpoint)
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

module.exports = {
  createMock,
  getMocks,
  getMock,
  route
}