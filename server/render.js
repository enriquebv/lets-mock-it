class Render {
  constructor() { }

  /** Output Helpers **/
  // Get HTML of the /global.ejs file
  getGlobalHtml(server, data) {
    return new Promise((resolve, reject) => {
      server.render('global', data, (err, html) => {
        if (err) reject(err)
        else resolve(html)
      })
    })
  }

  // Get a specific .ejs file and set it as a content in global.ejs
  getContent(server, template, data) {
    return new Promise((resolve, reject) => {
      server.render(template, data, (err, html) => {
        if (err) reject(err)
        else resolve(html)
      })
    })
  }

  // Returns to the client the parsed HTML
  getOutput(server, res, contentTemplate, contentData, globalData, is404) {
    const validateGlobalData = this.validateData(globalData)

    if (validateGlobalData.itsValid) {
      this.getContent(server, contentTemplate, contentData)
        .catch(error => {
          const log = {
            type: 'output-getOutput-getContent',
            error: "Can't get content.",
            message: error,
            time: Date.now()
          }

          console.error(error)
        })
        .then(content => globalData.content = content)
        .then(() => this.getGlobalHtml(server, globalData))
        .catch(error => {
          const log = {
            type: 'output-getContent-getGlobalHtml',
            error: "Can't get global html.",
            message: error,
            time: Date.now()
          }

          console.error(error)
        })
        .then(html => {
          (!is404)
            ? res.end(html)
            : res.status(404).end(html)
        })
    } else {
      const log = {
        type: 'output-getOutput',
        error: `Error trying to parse ${contentTemplate}, globalData it\'s invalid:\n${validateGlobalData.error}`,
        time: Date.now()
      }

      console.error(log)

      res.status(500).end('Internal server error.')
    }
  }

  // Check empty or invalid data in globalData object
  validateData(data) {
    let itsValid = true
    let errors = []

    if (data.meta.title === undefined || data.meta.title.length === 0) {
      errors.push(` - meta.title it's undefined or empty.`)
      itsValid = false
    }

    if (data.meta.description === undefined || data.meta.description.length === 0) {
      errors.push(` - meta.description it's undefined or empty.`)
      itsValid = false
    }

    return { itsValid, error: errors.join('\n') }
  }

  /** Pages **/
  // Build Editor page
  page(server, res, template, data) {
    const contentData = Object.assign({}, {
      logged: data.logged
    })

    this.getOutput(server, res, template, contentData, data)
  }
}

module.exports = Render