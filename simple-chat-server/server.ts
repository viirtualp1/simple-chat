import type { RawData } from 'ws'
import { WebSocketServer, WebSocket } from 'ws'

interface MessageEnvelope {
  type: string
  id?: string
  payload?: unknown
  timestamp?: number
  channel?: string
}

const wss = new WebSocketServer({ port: 8080 })

console.log('WebSocket server started on ws://localhost:8080')

function sendEnvelope(ws: WebSocket, envelope: MessageEnvelope) {
  ws.send(
    JSON.stringify({
      ...envelope,
      timestamp: envelope.timestamp ?? Date.now(),
    }),
  )
}

function parseEnvelope(raw: RawData): MessageEnvelope | null {
  try {
    const parsed = JSON.parse(raw.toString()) as MessageEnvelope
    if (typeof parsed.type !== 'string') return null
    return parsed
  } catch {
    return null
  }
}

function broadcast(envelope: MessageEnvelope, exclude?: WebSocket) {
  wss.clients.forEach((client) => {
    if (client === exclude) return
    if (client.readyState === WebSocket.OPEN) {
      sendEnvelope(client, envelope)
    }
  })
}

wss.on('connection', (ws: WebSocket) => {
  console.log('🟢 New client connected!')

  sendEnvelope(ws, {
    type: 'system',
    payload: { text: 'Successfully connected to the test chat' },
  })

  ws.on('message', (message: RawData) => {
    const envelope = parseEnvelope(message)
    if (!envelope) return

    console.log('✉️ Received:', envelope)

    if (envelope.type === 'ping') {
      sendEnvelope(ws, {
        type: 'pong',
        ...(envelope.id ? { id: envelope.id } : {}),
        payload: null,
      })
      return
    }

    if (envelope.type === 'chat.message') {
      broadcast(envelope, ws)
      return
    }

    broadcast(envelope, ws)
  })

  ws.on('close', () => {
    console.log('🔴 Client disconnected')
  })

  ws.on('error', (error: Error) => {
    console.error('⚠️ WebSocket error:', error.message)
  })

  const intervalId = setInterval(() => {
    if (ws.readyState !== WebSocket.OPEN) {
      clearInterval(intervalId)
      return
    }

    const isNotification = Math.random() < 0.5
    const randomNames = ['Nikita', 'John', 'Jane', 'Alice', 'Bob']
    const randomName = randomNames[Math.floor(Math.random() * randomNames.length)] ?? 'Guest'
    const randomMessages = ['Hello', 'Hi', 'Hey', 'How are you?', 'Nice to meet you']
    const randomMessage =
      randomMessages[Math.floor(Math.random() * randomMessages.length)] ?? 'Hello'

    if (isNotification) {
      sendEnvelope(ws, {
        type: 'notification',
        payload: 'New message',
      })
    } else {
      sendEnvelope(ws, {
        type: 'chat.message',
        payload: {
          from: randomName,
          message: randomMessage,
        },
      })
    }
  }, 3000)
})
