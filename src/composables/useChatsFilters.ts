import { computed } from 'vue'
import { useChatsStoreRefs } from 'stores/chats'
import { SortFilterType, useFiltersStoreRefs } from 'stores/filters'
import { ChatMessageType } from 'src/types/chat'

export function useChatsFilters() {
  const { chatsList } = useChatsStoreRefs()
  const { filters } = useFiltersStoreRefs()

  const searchTerm = computed(() => filters.value.search?.toLowerCase() || '')
  const sortType = computed(() => filters.value.sort)

  const filteredChats = computed(() => {
    const chats = chatsList.value

    if (chats.length === 0) return []

    const filtered = chats.filter((chat) => {
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
