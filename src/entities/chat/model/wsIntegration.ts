import { z } from 'zod'
import { wsClient } from '@/shared/ws'
import type { WSChatMessage } from './types'

export const WSChatMessageSchema = z.object({
  from: z.string(),
  message: z.string(),
})

export function bindChatWsIntegration(handlers: {
  onMessage: (message: WSChatMessage) => void
  onNotification?: (text: string) => void
  onSystem?: (text: string) => void
}) {
  const unsubs = [
    wsClient.on('chat.message', (payload) => {
      const result = WSChatMessageSchema.safeParse(payload)
      if (result.success) {
        handlers.onMessage(result.data)
      }
    }),

    wsClient.on('notification', (payload) => {
      if (typeof payload === 'string') {
        handlers.onNotification?.(payload)
      }
    }),

    wsClient.on('system', (payload) => {
      if (
        typeof payload === 'object' &&
        payload !== null &&
        'text' in payload &&
        typeof payload.text === 'string'
      ) {
        handlers.onSystem?.(payload.text)
      }
    }),
  ]

  return () => unsubs.forEach((unsub) => unsub())
}
