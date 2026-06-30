import { ref, type Ref } from 'vue'
import { wsClient } from '@/shared/ws'
import { ChatMessageType, type FormattedChatMessage } from '@/entities/chat'

export function useSendMessage(chat: Ref<FormattedChatMessage | undefined>) {
  const text = ref('')

  function sendMessage(onSent?: () => void) {
    const trimmed = text.value.trim()
    if (!trimmed || !chat.value) {
      return
    }

    chat.value.messages.push({
      text: trimmed,
      type: ChatMessageType.OUTPUT,
      date: new Date().toISOString(),
      is_read: false,
    })

    wsClient.send('chat.message', {
      to: chat.value.from,
      message: trimmed,
    })

    text.value = ''
    onSent?.()
  }

  return { text, sendMessage }
}
