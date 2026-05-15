import { ref, type Ref } from 'vue'

export type WebSocketStatus = 'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED'

export interface WebSocketReconnectOptions {
  maxRetries?: number
  delay?: number
}

export interface UseWebSocketOptions {
  immediate?: boolean
  protocols?: string | string[]

  autoReconnect?: boolean | WebSocketReconnectOptions

  onConnected?: (ws: WebSocket, event: Event) => void
  onDisconnected?: (ws: WebSocket, event: Event) => void
  onError?: (ws: WebSocket, event: Event) => void
  onMessage?: (ws: WebSocket, event: MessageEvent) => void
}

export interface UseWebSocketReturn<T = any> {
  status: Ref<WebSocketStatus>
  data: Ref<T | null>
  error: Ref<Event | null>
  ws: Ref<WebSocket | null>

  connect: () => void
  disconnect: () => void
  send: (data: T) => void
}

const wsUrl = process.env.VITE_WS_URL || 'ws://localhost:8080'

export function useWebSocket<T>(options: UseWebSocketOptions): UseWebSocketReturn<T> {
  const status = ref<WebSocketStatus>('CLOSED')
  const data = ref<T | null>(null)
  const error = ref<Event | null>(null)
  const ws = ref<WebSocket | null>(null)

  function initListeners() {
    if (!ws.value) return

    ws.value.addEventListener('open', (event) => {
      status.value = 'OPEN'
      error.value = null
      options.onConnected?.(ws.value!, event)
    })

    ws.value.addEventListener('close', (event) => {
      status.value = 'CLOSED'
      error.value = null
      options.onDisconnected?.(ws.value!, event)
    })

    ws.value.addEventListener('error', (event) => {
      error.value = event
      status.value = 'CLOSING'

      if (options.autoReconnect !== undefined) {
        let maxRetries: number
        let delay: number
        let retries = 0

        if (typeof options.autoReconnect === 'boolean') {
          maxRetries = 3
          delay = 1000
        } else {
          maxRetries = options.autoReconnect.maxRetries ?? 3
          delay = options.autoReconnect.delay ?? 1000
        }

        const interval = setInterval(() => {
          if (retries >= maxRetries) {
            clearInterval(interval)
            status.value = 'CLOSED'
            options.onDisconnected?.(ws.value!, event)
            return
          }

          connect()
          retries++
        }, delay)
      } else {
        status.value = 'CLOSED'
        ws.value = null
        options.onDisconnected?.(ws.value!, event)
      }
    })

    ws.value.addEventListener('message', (event) => {
      data.value = event.data as T
      options.onMessage?.(ws.value!, event)
    })
  }

  function connect() {
    ws.value = new WebSocket(wsUrl, options.protocols)
    status.value = 'CONNECTING'
    initListeners()
  }

  function disconnect() {
    if (!ws.value) {
      return
    }

    ws.value.close()
    ws.value = null
  }

  function send(payload: T) {
    if (!ws.value) {
      return
    }

    ws.value.send(JSON.stringify(payload))
  }

  if (options.immediate) {
    connect()
  }

  return {
    status,
    data,
    error,
    ws,

    connect,
    disconnect,
    send,
  }
}
