<template>
  <div class="flex flex-col gap-0.5">
    <div
      v-if="filteredChats.length === 0"
      class="glass-bubble mx-1 mt-4 flex flex-col items-center gap-3 rounded-3xl p-6 text-center"
    >
      <div class="flex size-12 items-center justify-center rounded-full bg-primary-500/10 text-primary">
        <UIcon :name="emptyIcon" class="size-6" />
      </div>
      <p class="text-sm text-muted">{{ emptyMessage }}</p>
      <UButton
        v-if="filters.sort === SortFilterType.NEW"
        label="Go to all chats"
        color="primary"
        variant="soft"
        size="sm"
        class="rounded-full"
        @click="setRecentFilter"
      />
    </div>

    <ChatListItem
      v-for="chat in filteredChats"
      :key="chat.from"
      :chat="chat"
      @select:chat="onChatSelected"
    />
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

const emptyIcon = computed(() => {
  if (filters.value.search?.trim()) return 'i-lucide-search-x'
  if (filters.value.sort === SortFilterType.NEW) return 'i-lucide-bell-off'
  return 'i-lucide-message-circle'
})

function onChatSelected(from: string) {
  selectChat(from)
}

function setRecentFilter() {
  filters.value.sort = SortFilterType.RECENT
}
</script>
