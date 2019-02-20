import Vue from 'vue'
import Particles from 'particlesjs'
import VueTippy from 'vue-tippy'
import SocketIo from 'socket.io-client'

Vue.use(VueTippy)

new Vue({
  el: '#lets-mock-it',
  data: {
    socket: {},
    channels: [
      { id: 'ajax', name: 'AJAX', active: true, description: 'Create an endpoint to make AJAX requests, and get some data.' },
      { id: 'ws', name: 'Websocket', active: false, description: 'Create a websocket to connect and receive some data in intervals, or when send a command.' },
      { id: 'socket-io', name: 'Socket.io', active: false, description: 'Comming soon...' },
      { id: 'sse', name: 'Server Sent Events', active: false, description: 'Comming soon...' },
      { id: 'graphql', name: 'GraphQL', active: false, description: 'Comming soon...' }
    ],
    creatingChannel: '',
    showingPannel: false,
    ajax: {
      response: '',
      format: 'raw'
    },
    method: 'get',
    endpoint: '',
    status: 200,
    mocksList: {}
  },
  methods: {
    loadCode(code) {
      console.info(code)
    },
    selectChannel(channel) {
      const element = this.$el.querySelector(`.channels .${channel.id}`)
      element.classList.add('active')
      this.creatingChannel = channel.id
      this.showPannel()
    },
    showPannel() {
      this.showingPannel = true
      this.$nextTick().then(() => {
        this.$refs.endpoint.querySelector('input').focus()
      })
    },
    createMock() {
      switch (this.creatingChannel) {
        case 'ajax':
          this.createAjaxMock()
          break
      }
    },
    setResponse() {
      switch (this.creatingChannel) {
        case 'ajax':
          this.ajax.response = this.$refs.response.value
          break
      }
    },
    createAjaxMock() {
      const mock = {
        endpoint: this.endpoint,
        channel: this.creatingChannel,
        status: this.status,
        response: this.ajax.response,
        format: this.ajax.format,
        method: this.method
      }

      this.saveMock(mock)
    },
    addMock(mock) {
      this.mocksList.push(mock)
    },
    saveMock(mock) {
      this.socket.emit('create-mock', mock, response => {
        if (response.message === 'mock-exists') {
          alert('Este endpoint ya existe.')
          return false
        }

        this.addMock(mock)
        this.cleanMockObject()
      })
    },
    cleanMockObject() {
      this.endpoint = ''
      this.status = 200

      /** ajax specific */
      this.ajax.response = ''
      this.ajax.format = 'raw'
      this.ajax.method = 'get'
    },
    loadMock(mock) {
      console.info(mock)
    },
    openEndpoint(endpoint) {
      window.open(`${this.currentUrl}${endpoint}`, '_blank')
    }
  },
  computed: {
    currentChannel() {
      return this.channels.filter(channel => channel.id === this.creatingChannel)[0]
    },
    currentUrl() {
      return window.location.href
    },
    channelMocks() {
      return this.mocksList.filter(mock => mock.endpint = this.creatingChannel)
    }
  },
  mounted() {
    /** Particles Background */
    Particles.init({
      selector: '.particle-bg',
      color: '#2980b9',
      connectParticles: true,
      sizeVariations: 3
    })

    /** Socket.io */
    const socket = this.socket = new SocketIo()

    socket.on('mocks-list', data => this.mocksList = data)
    socket.on('server-message-error', error => {
      switch (error) {
        case 'mock-exists':
          alert('El mock ya existe.')
          break
      }
    })
  }
})