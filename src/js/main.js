import Vue from 'vue'
import VueTippy from 'vue-tippy'
import md5 from 'md5'
import SocketIo from 'socket.io-client'
import Toasted from 'vue-toasted'

// Components
import mockListed from '../components/mock-listed.vue'

Vue.use(VueTippy)
Vue.use(Toasted, {
  singleton: true
})

new Vue({
  el: '#lets-mock-it',
  components: {
    mockListed
  },
  data: {
    currentUpdating: '',
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
    mocksList: {},
  },
  methods: {
    loadMock(id) {
      const mock = this.mocksList.filter(mock => mock.id === id)[0]

      if (mock.channel === 'ajax') {
        this.currentUpdating = mock.id
        this.ajax.format = mock.format
        this.ajax.response = mock.response
        this.method = mock.method
        this.endpoint = mock.endpoint
      }
    },
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
      const updating = this.currentUpdating.length !== 0
      const original = (updating)
        ? this.mocksList.filter(mock => mock.id === this.currentUpdating)[0]
        : false

      const mock = {
        endpoint: this.endpoint,
        channel: this.creatingChannel,
        status: this.status,
        response: this.ajax.response,
        format: this.ajax.format,
        method: this.method,
        active: true
      }

      if (!updating && !original) {
        mock.id = md5(Date.now() + '-ajax')
        mock.date = Date.now()

        this.saveMock(mock)
      }

      if (updating && original) {
        mock.id = original.id
        mock.date = original.date || Date.now()

        this.updateMock(mock)
      }
    },
    changeMockStatus(data) {
      this.socket.emit('change-mock-status', data)
    },
    updateMockStatus(data) {
      const mock = this.mocksList.filter(mock => mock.id === data.id)[0]
      const position = this.mocksList.indexOf(mock)

      mock.active = data.status
      this.mocksList[position] = mock
    },
    updateMockRemoved(data) {
      const mock = this.mocksList.filter(mock => mock.id === data.id)[0]
      const position = this.mocksList.indexOf(mock)

      mock.active = data.status
      this.mocksList[position] = mock
    },
    removeMock(id) {
      this.socket.emit('remove-mock', id)
    },
    updateMock(mock) {
      this.socket.emit('update-mock', mock, response => {
        if (response.message === 'mock-updated') {
          console.info('Actualizado mock', response.id)
        }
      })
    },
    updateMockRemoved(id) {
      const mock = this.mocksList.filter(mock => mock.list === id)[0]
      const position = this.mocksList.indexOf(mock)

      this.mocksList.splice(position, 1)
    },
    saveMock(mock) {
      this.socket.emit('create-mock', mock)
      this.mocksList.push(mock)
      this.cleanMockObject()
    },
    resetAjaxPanel() {
      this.currentUpdating = ''
      this.cleanMockObject()
    },
    cleanMockObject() {
      this.endpoint = ''
      this.status = 200
      this.method = 'get'

      // ajax specific
      this.ajax.response = ''
      this.ajax.format = 'raw'
      this.ajax.method = 'get'
    },
    showServerError(error) {
      switch (error) {
        case 'mock-exists':
          alert('El mock ya existe.')
          break
      }
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
      return this.mocksList.filter(mock => mock.channel === this.creatingChannel)
    },
    currentAction() {
      return (this.currentUpdating.length === 0)
        ? 'Create'
        : 'Update'
    }
  },
  mounted() {
    /** Socket.io */
    const socket = this.socket = new SocketIo()

    socket.on('mocks-list', data => this.mocksList = data)
    socket.on('server-message-error', this.showServerError)
    socket.on('mock-status-changed', this.updateMockStatus)
    socket.on('mock-removed', this.updateMockRemoved)
  }
})