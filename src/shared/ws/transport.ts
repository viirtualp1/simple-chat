import type { ITransport } from './types'

const WS_CONNECTING = 0
const WS_OPEN = 1

export function createWsTransport(): ITransport {
  let ws: WebSocket | null = null

  const messageHandlers = new Set<(data: string) => void>()
  const openHandlers = new Set<() => void>()
  const closeHandlers = new Set<(event?: CloseEvent) => void>()
  const errorHandlers = new Set<(error: Event) => void>()

  function attachHandlers(socket: WebSocket) {
    socket.addEventListener('message', (event) => {
      messageHandlers.forEach((handler) => handler(String(event.data)))
    })

    socket.addEventListener('open', () => {
      openHandlers.forEach((handler) => handler())
    })

    socket.addEventListener('close', (event) => {
      closeHandlers.forEach((handler) => handler(event))
    })

    socket.addEventListener('error', (event) => {
      errorHandlers.forEach((handler) => handler(event))
    })
  }

  return {
    connect(url) {
      ws?.close()
      ws = new WebSocket(url)
      attachHandlers(ws)
    },

    disconnect() {
      ws?.close()
      ws = null
    },

    send(data) {
      if (!ws || ws.readyState !== WS_OPEN) return
      ws.send(data)
    },

    onMessage(cb) {
      messageHandlers.add(cb)
      return () => messageHandlers.delete(cb)
    },

    onOpen(cb) {
      openHandlers.add(cb)
      return () => openHandlers.delete(cb)
    },

    onClose(cb) {
      closeHandlers.add(cb)
      return () => closeHandlers.delete(cb)
    },

    onError(cb) {
      errorHandlers.add(cb)
      return () => errorHandlers.delete(cb)
    },

    getReadyState() {
      return ws?.readyState ?? WS_CONNECTING
    },
  }
}
