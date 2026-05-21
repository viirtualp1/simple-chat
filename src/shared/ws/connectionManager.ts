import { getBackoffDelay } from './lib/backoff'
import type {
  ConnectionManagerOptions,
  ConnectionStatus,
  IConnectionManager,
  ITransport,
} from './types'

const PING_MESSAGE = JSON.stringify({ type: 'ping', payload: null, timestamp: Date.now() })

export function createConnectionManager(
  transport: ITransport,
  options: ConnectionManagerOptions,
): IConnectionManager {
  const {
    url,
    maxReconnectAttempts = 10,
    maxBackoffMs = 30_000,
    heartbeatIntervalMs = 15_000,
    heartbeatTimeoutMs = 5_000,
    onStatusChange,
  } = options

  let status: ConnectionStatus = 'disconnected'
  let reconnectAttempt = 0
  let intentionallyClosed = false
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null
  let heartbeatTimer: ReturnType<typeof setInterval> | null = null
  let heartbeatTimeoutTimer: ReturnType<typeof setTimeout> | null = null
  const messageQueue: string[] = []
  const messageHandlers = new Set<(data: string) => void>()
  const statusHandlers = new Set<(status: ConnectionStatus) => void>()

  function setStatus(next: ConnectionStatus) {
    if (status === next) return
    status = next
    statusHandlers.forEach((handler) => handler(next))
    onStatusChange?.(next)
  }

  function clearReconnectTimer() {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
      reconnectTimer = null
    }
  }

  function clearHeartbeatTimeout() {
    if (heartbeatTimeoutTimer) {
      clearTimeout(heartbeatTimeoutTimer)
      heartbeatTimeoutTimer = null
    }
  }

  function stopHeartbeat() {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer)
      heartbeatTimer = null
    }
    clearHeartbeatTimeout()
  }

  function getHeartbeatInterval() {
    return document.hidden ? heartbeatIntervalMs * 2 : heartbeatIntervalMs
  }

  function sendPing() {
    transport.send(PING_MESSAGE)
    clearHeartbeatTimeout()
    heartbeatTimeoutTimer = setTimeout(() => {
      transport.disconnect()
    }, heartbeatTimeoutMs)
  }

  function startHeartbeat() {
    stopHeartbeat()
    sendPing()
    heartbeatTimer = setInterval(sendPing, getHeartbeatInterval())
  }

  function drainQueue() {
    while (messageQueue.length > 0 && status === 'connected') {
      const message = messageQueue.shift()
      if (message) transport.send(message)
    }
  }

  function scheduleReconnect() {
    if (intentionallyClosed || !navigator.onLine) return

    if (reconnectAttempt >= maxReconnectAttempts) {
      setStatus('failed')
      return
    }

    setStatus('reconnecting')
    clearReconnectTimer()

    reconnectTimer = setTimeout(
      () => {
        reconnectAttempt += 1
        setStatus('connecting')
        transport.connect(url)
      },
      getBackoffDelay(reconnectAttempt, maxBackoffMs),
    )
  }

  function handleIncoming(raw: string) {
    try {
      const parsed = JSON.parse(raw) as { type?: string }
      if (parsed.type === 'pong') {
        clearHeartbeatTimeout()
        return
      }
    } catch {
      // non-json messages are forwarded as-is
    }

    messageHandlers.forEach((handler) => handler(raw))
  }

  function handleOnline() {
    if (intentionallyClosed) return
    reconnectAttempt = 0
    clearReconnectTimer()
    setStatus('connecting')
    transport.connect(url)
  }

  function handleOffline() {
    clearReconnectTimer()
    stopHeartbeat()
    transport.disconnect()
    setStatus('offline')
  }

  function handleVisibilityChange() {
    if (document.hidden || status !== 'connected') return
    startHeartbeat()
    sendPing()
  }

  transport.onMessage(handleIncoming)

  transport.onOpen(() => {
    reconnectAttempt = 0
    clearReconnectTimer()
    setStatus('connected')
    drainQueue()
    startHeartbeat()
  })

  transport.onClose(() => {
    stopHeartbeat()
    if (intentionallyClosed) {
      setStatus('disconnected')
      return
    }
    scheduleReconnect()
  })

  transport.onError(() => {
    if (status === 'connected') {
      transport.disconnect()
    }
  })

  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
  document.addEventListener('visibilitychange', handleVisibilityChange)

  return {
    connect() {
      intentionallyClosed = false
      reconnectAttempt = 0

      if (!navigator.onLine) {
        setStatus('offline')
        return
      }

      setStatus('connecting')
      transport.connect(url)
    },

    disconnect() {
      intentionallyClosed = true
      clearReconnectTimer()
      stopHeartbeat()
      messageQueue.length = 0
      transport.disconnect()
      setStatus('disconnected')
    },

    send(data) {
      if (status === 'connected') {
        transport.send(data)
        return
      }

      messageQueue.push(data)
    },

    onMessage(cb) {
      messageHandlers.add(cb)
      return () => messageHandlers.delete(cb)
    },

    onStatusChange(cb) {
      statusHandlers.add(cb)
      cb(status)
      return () => statusHandlers.delete(cb)
    },

    getStatus() {
      return status
    },
  }
}
