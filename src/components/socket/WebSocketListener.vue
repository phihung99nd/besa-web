<script>

export default {
  name: 'WebSocketListener',
  data () {
    return {
      handlers: [
        {
          type: 'ORDER',
          handle: (message) => {
            this.notify(message);
          }
        },
        {
          type: 'BOOKING',
          handle: (message) => {
            this.notify(message);
          }
        },
        {
          type: 'PROMOTION',
          handle: (message) => {
            this.notify(message);
          }
        },
        {
          type: 'OTHER',
          handle: (message) => {
            this.notify(message);
          }
        },
      ]
    }
  },
  created () {
    // Register to listen for events
    this.handlers.forEach((handler) => {
      this.$bus.$on(handler.type, handler.handle)
    })
  },
  destroyed () {
    // Cancel listening events
    this.handlers.forEach((handler) => {
      this.$bus.$off(handler.type, handler.handle)
    })
  },
  methods: {
    notify(message) {
      console.log("receive message " + message)
    }
  },
  render () {
    return null
  }
}
</script>
