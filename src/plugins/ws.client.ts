import { initWsClient } from '@/shared/ws'
import { bindChatWsIntegration, useChatsStore } from '@/entities/chat'

export default defineNuxtPlugin(() => {
  const store = useChatsStore()

  initWsClient()

  const unbind = bindChatWsIntegration({
    onMessage: store.handleIncomingMessage,
    onNotification: store.handleNotification,
  })

  window.addEventListener('beforeunload', unbind)
})
