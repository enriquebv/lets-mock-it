import Vue from 'vue'
import Particles from 'particlesjs'
import VueTippy from 'vue-tippy'
import SocketIo from 'socket.io-client'
import jsonBeautify from 'json-beautify'

Vue.use(VueTippy)

new Vue({
  el: '#lets-mock-it',
  data: {
    socket: {},
    channels: [
      { id: 'ajax', name: 'AJAX', active: true, description: 'Create an endpoint to make AJAX requests, and get some data.' },
      { id: 'ws', name: 'Websocket', active: true, description: 'Create a websocket to connect and receive some data in intervals, or when send a command.' },
      { id: 'socket-io', name: 'Socket.io', active: false, description: 'Comming soon...' },
      { id: 'sse', name: 'Server Sent Events', active: false, description: 'Comming soon...' },
      { id: 'graphql', name: 'GraphQL', active: false, description: 'Comming soon...' }
    ],
    creatingChannel: '',
    showingPannel: false,
    ajax: {
      status: 200,
      content: ''
    }
  },
  methods: {
    selectChannel(channel) {
      const element = this.$el.querySelector(`.channels .${channel.id}`)
      element.classList.add('active')
      this.creatingChannel = channel.id
      this.showPannel()
    },
    showPannel() {
      this.showingPannel = true
    }
  },
  computed: {
    currentChannel() {
      return this.channels.filter(channel => channel.id === this.creatingChannel)[0]
    },
    currentUrl() {
      return window.location.href
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
    this.socket = new SocketIo()
  }
})