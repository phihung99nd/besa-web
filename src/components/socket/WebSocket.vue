<template>
  <web-socket-listener/>
</template>
<script>
import storage from "@/plugins/storage.js";
import WebSocketListener from '@/components/socket/WebSocketListener'

export default {
  components: {WebSocketListener},
  data() {
    return {
      webSocket: null,
      lockReconnect: false,
      maxReconnect: 6,  // Maximum number of reconnections, -1: unlimited
      reconnectTime: 0, // Number of reconnection attempts
      heartbeat: {
        interval: 30 * 1000, // heartbeat interval
        timeout: 10 * 1000, // timeout
        pingTimeoutObj: null,
        pongTimeoutObj: null,
        pingMessage: JSON.stringify({type: 'ping'}) // Heartbeat request
      }
    }
  },
  computed: {
    token() {
      return storage.getItem("buyer_accessToken");
    }
  },
  created() {
    this.initWebSocket()
  },
  destroyed: function () {
    if (this.webSocket) {
      this.webSocket.close()
    }
    this.clearTimeoutObj(this.heartbeat)
  },
  methods: {
    initWebSocket() {
      if (this.token) {
        let url = process.env.VUE_APP_WS;
        let host = window.location.host;
        let wsUri = `${url}/ws?access_token=${this.token}`
        this.webSocket = new WebSocket(wsUri)
        this.webSocket.onopen = this.onOpen
        this.webSocket.onerror = this.onError
        this.webSocket.onmessage = this.onMessage
        this.webSocket.onclose = this.onClose
      }
    },
    reconnect() {
      if (!this.token) {
        return
      }
      if (this.lockReconnect || (this.maxReconnect !== -1 && this.reconnectTime > this.maxReconnect)) {
        return
      }
      this.lockReconnect = true
      setTimeout(() => {
        this.reconnectTime++
        this.initWebSocket()
        this.lockReconnect = false
      }, 5000)
    },
    clearTimeoutObj: function (heartbeat) {
      heartbeat.pingTimeoutObj && clearTimeout(heartbeat.pingTimeoutObj)
      heartbeat.pongTimeoutObj && clearTimeout(heartbeat.pongTimeoutObj)
    },
    startHeartbeat() {
      const webSocket = this.webSocket
      const heartbeat = this.heartbeat
      this.clearTimeoutObj(heartbeat)
      heartbeat.pingTimeoutObj = setTimeout(() => {
        if (webSocket.readyState === 1) {
          webSocket.send(heartbeat.pingMessage)
          heartbeat.pongTimeoutObj = setTimeout(() => {
            webSocket.close()
          }, heartbeat.timeout)
        } else {
          this.reconnect()
        }
      }, heartbeat.interval)
    },
    onOpen() {
      console.log('WebSocket connection success')
      this.startHeartbeat()
      this.reconnectTime = 0
    },
    onError(e) {
      console.log(`WebSocket connection error：${e.code} ${e.reason} ${e.wasClean}`)
      this.reconnect()
    },
    onClose(e) {
      console.log(`WebSocket connection closed：${e.code} ${e.reason} ${e.wasClean}`)
      this.reconnect()
    },
    onMessage(msgEvent) {
      this.startHeartbeat()
      let event;
      let data;
      const text = msgEvent.data
      try {
        data = JSON.parse(text)
        event = data.type
        if (event === 'pong') {
          return
        }
      } catch (e) {
        event = 'plaintext'
        data = text
      }
      this.$emit(event, data)
      this.$bus.$emit(event, data);
    },
    send(msg) {
      this.webSocket.send(msg)
    }
  }
}

</script>
