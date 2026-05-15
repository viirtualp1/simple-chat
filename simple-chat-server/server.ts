import type { RawData } from 'ws'
import { WebSocketServer, WebSocket } from 'ws'

const wss = new WebSocketServer({ port: 8080 })

console.log('WebSocket server started on ws://localhost:8080')

wss.on('connection', (ws: WebSocket) => {
  console.log('🟢 New client connected!')

  ws.send(
    JSON.stringify({
      type: 'system',
      text: 'Successfully connected to the test chat',
    }),
  )

  ws.on('message', (message: RawData) => {
    const parsedMessage = message.toString()
    console.log('✉️ Received:', parsedMessage)

    wss.clients.forEach((client: WebSocket) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(parsedMessage)
      }
    })
  })

  setInterval(() => {
    ws.send(JSON.stringify({ type: 'message', data: { from: 'Nikita', message: 'Hello' } }))
  }, 3000)

  ws.on('close', () => {
    console.log('🔴 Client disconnected')
  })

  ws.on('error', (error: Error) => {
    console.error('⚠️ WebSocket error:', error.message)
  })
})
