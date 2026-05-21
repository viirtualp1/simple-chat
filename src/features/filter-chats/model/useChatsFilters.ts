import { computed } from 'vue'
import { useChatsStoreRefs, ChatMessageType } from '@/entities/chat'
import { SortFilterType, useFiltersStoreRefs } from '@/entities/chat-filter'

export function useChatsFilters() {
  const { chatsList } = useChatsStoreRefs()
  const { filters } = useFiltersStoreRefs()

  const searchTerm = computed(() => filters.value.search?.toLowerCase() || '')
  const sortType = computed(() => filters.value.sort)

  const filteredChats = computed(() => {
    if (chatsList.value.length === 0) return []

    const filtered = chatsList.value.filter((chat) => {
      if (searchTerm.value && !chat.from.toLowerCase().includes(searchTerm.value)) {
        return false
      }

      if (sortType.value === SortFilterType.NEW) {
        return chat.messages.some(
          (message) => !message.is_read && message.type !== ChatMessageType.OUTPUT,
        )
      }

      return true
    })

    return filtered.sort((a, b) => {
      const aLastMessage = a.messages[a.messages.length - 1]
      const bLastMessage = b.messages[b.messages.length - 1]

      if (!aLastMessage && !bLastMessage) return 0
      if (!aLastMessage) return 1
      if (!bLastMessage) return -1

      return new Date(bLastMessage.date).getTime() - new Date(aLastMessage.date).getTime()
    })
  })

  return {
    filteredChats,
  }
}
