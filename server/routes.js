const render = new (require('./render'))()
const core = require('./core')
const mockIt = require('../lib/mock-it')
const getRenderData = core.renderData

module.exports = function (server) {

  /** Index */
  server.route('/').get((request, response) => {
    const page = {
      index: true,
      meta: {
        title: 'Let\'s MockIt',
        description: 'Let\'s MockIt.'
      },
      scripts: [
        './js/main.js'
      ]
    }

    render.page(server, response, 'index', getRenderData(request, page))
  })

  /** API */
  server.route('/*').all(mockIt.route)
}