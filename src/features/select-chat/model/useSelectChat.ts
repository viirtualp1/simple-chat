import { useChatsStore, useChatsStoreRefs } from '@/entities/chat'

export function useSelectChat() {
  const { setSelectedChat } = useChatsStore()
  const { chats } = useChatsStoreRefs()

  function selectChat(from: string) {
    setSelectedChat(from)

    const chat = chats.value.get(from)
    if (!chat) return

    chat.messages = chat.messages.map((message) => ({
      ...message,
      is_read: true,
    }))
  }

  return { selectChat }
}
