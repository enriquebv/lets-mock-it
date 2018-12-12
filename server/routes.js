const render = new (require('./render'))()
const core = require('./core')
const getRenderData = core.renderData

module.exports = function (server) {

  /** Index */
  server.route('/').get((request, response) => {
      const data = getRenderData(request, {
        index: true,
        meta: {
          title: 'MockIt',
          description: 'Let\'s MockIt.'
        },
        scripts: [
          './js/vendor.js',
          './js/main.js'
        ]
      })

      render.page(server, response, 'index', data)
    })

  /** API */
  server.route('/api/ajax/*').get((request, response) => {
      response.status(200).end('test')
    })
}