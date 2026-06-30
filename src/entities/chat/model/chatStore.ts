import { ref, computed, readonly } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import type { FormattedChatMessage, WSChatMessage } from './types'
import { ChatMessageType } from './types'

function formatMessage(text: string, type: ChatMessageType, is_read: boolean) {
  return {
    text,
    date: new Date().toISOString(),
    type,
    is_read,
  }
}

export const useChatsStore = defineStore('chats', () => {
  const chats = ref(new Map<string, FormattedChatMessage>())
  const selectedChat = ref<string>('')
  const lastNotification = ref<string | null>(null)

  const chatsList = computed(() => Array.from(chats.value.values()))

  function handleIncomingMessage(data: WSChatMessage) {
    const chat = chats.value.get(data.from)

    if (chat) {
      chat.messages.push(
        formatMessage(data.message, ChatMessageType.INPUT, selectedChat.value === chat.from),
      )
    } else {
      const newChat: FormattedChatMessage = {
        from: data.from,
        messages: [formatMessage(data.message, ChatMessageType.INPUT, false)],
      }

      chats.value.set(data.from, newChat)
    }
  }

  function handleNotification(text: string) {
    lastNotification.value = text
  }

  function setSelectedChat(from: string) {
    selectedChat.value = from
  }

  return {
    selectedChat: readonly(selectedChat),
    lastNotification: readonly(lastNotification),
    chats,
    chatsList,
    handleIncomingMessage,
    handleNotification,
    setSelectedChat,
  }
})

export const useChatsStoreRefs = () => storeToRefs(useChatsStore())
