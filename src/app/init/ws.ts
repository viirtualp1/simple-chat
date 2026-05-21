import { initWsClient } from '@/shared/ws'
import { bindChatWsIntegration, useChatsStore } from '@/entities/chat'

export function setupWsIntegration() {
  const store = useChatsStore()

  initWsClient()

  return bindChatWsIntegration({
    onMessage: store.handleIncomingMessage,
    onNotification: store.handleNotification,
  })
}
