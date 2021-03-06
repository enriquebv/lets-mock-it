'use strict'

const port = process.env.PORT || 81
const express = require('express')
const app = express()
const path = require('path')
const routes = require('./server/routes')
const socketIo = require('./server/socket-io')

/** EJS Template Engine */
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, './views'))

/** Static dir */
app.use(express.static('public'))

const http = app.listen(port, done => console.log('App running in http://localhost:%d', port))

/** Routes */
routes(app)

/** Socket.io */
socketIo.startServer(http)