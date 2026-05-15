import { ref, watch, computed, readonly } from 'vue'
import { z } from 'zod'
import { defineStore, storeToRefs } from 'pinia'
import { useWebSocket } from 'src/composables/useWebsocket'
import type { FormattedChatMessage, WSChatMessage } from 'src/types/chat'
import { ChatMessageType } from 'src/types/chat'

const WSChatMessageSchema = z.object({
  from: z.string(),
  message: z.string(),
})

const WSResponseSchema = z.object({
  message: WSChatMessageSchema.optional(),
  notification: z.any().optional(),
})

function formatMessage(text: string, type: ChatMessageType, is_read: boolean) {
  return {
    text,
    date: new Date().toISOString(),
    type,
    is_read,
  }
}

export const useChatsStore = defineStore('chats', () => {
  const { status, data } = useWebSocket({
    immediate: true,
  })

  const chats = ref(new Map<string, FormattedChatMessage>())
  const selectedChat = ref<string>('')

  const chatsList = computed(() => Array.from(chats.value.values()))

  const handleNewMessage = (data: WSChatMessage) => {
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

  function setSelectedChat(from: string) {
    selectedChat.value = from
  }

  watch(data, (newData) => {
    if (!newData) return

    try {
      const parsedData = JSON.parse(newData as string)
      const validatedData = WSResponseSchema.parse(parsedData)

      if (validatedData.message) {
        handleNewMessage(validatedData.message)
      } else if (validatedData.notification) {
        console.log('Notification received:', validatedData.notification)
      }
    } catch (err) {
      console.error('Failed to parse or validate WebSocket message:', err)
    }
  })

  return {
    selectedChat: readonly(selectedChat),
    status,
    data,
    chats,
    chatsList,
    setSelectedChat,
  }
})

export const useChatsStoreRefs = () => storeToRefs(useChatsStore())
