<template>
  <div class="flex flex-col gap-0.5">
    <UAlert
      v-if="filteredChats.length === 0"
      :title="emptyMessage"
      :color="filters.sort === SortFilterType.NEW ? 'primary' : 'neutral'"
      variant="subtle"
      class="rounded-3xl"
      :actions="emptyActions"
    />

    <template v-for="(chat, idx) in filteredChats" :key="chat.from">
      <ChatListItem :chat="chat" @select:chat="onChatSelected" />
      <USeparator v-if="idx !== filteredChats.length - 1" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ChatListItem } from '@/entities/chat'
import { SortFilterType, useFiltersStoreRefs } from '@/entities/chat-filter'
import { useChatsFilters } from '@/features/filter-chats'
import { useSelectChat } from '@/features/select-chat'

const { filters } = useFiltersStoreRefs()
const { filteredChats } = useChatsFilters()
const { selectChat } = useSelectChat()

const emptyMessage = computed(() => {
  if (filters.value.search?.trim()) {
    return 'No chats match your search'
  }

  if (filters.value.sort === SortFilterType.NEW) {
    return 'There are no new chats'
  }

  return 'No chats yet'
})

const emptyActions = computed(() =>
  filters.value.sort === SortFilterType.NEW
    ? [{ label: 'Go to all chats', color: 'primary' as const, onClick: setRecentFilter }]
    : undefined,
)

function onChatSelected(from: string) {
  selectChat(from)
}

function setRecentFilter() {
  filters.value.sort = SortFilterType.RECENT
}
</script>
