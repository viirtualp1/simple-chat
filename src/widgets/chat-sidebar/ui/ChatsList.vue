<template>
  <q-list>
    <q-banner
      v-if="filteredChats.length === 0"
      dense
      inline-actions
      class="chats-list__banner"
      :class="filters.sort === SortFilterType.NEW ? 'bg-primary text-white' : 'bg-grey-3'"
    >
      {{ emptyMessage }}

      <template v-if="filters.sort === SortFilterType.NEW" v-slot:action>
        <q-btn flat color="white" rounded label="Go to all chats" @click="setRecentFilter" />
      </template>
    </q-banner>

    <template v-for="(chat, idx) in filteredChats" :key="chat.from">
      <chat-list-item :chat="chat" @select:chat="onChatSelected" />
      <q-separator v-if="idx !== filteredChats.length - 1" spaced />
    </template>
  </q-list>
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

function onChatSelected(from: string) {
  selectChat(from)
}

function setRecentFilter() {
  filters.value.sort = SortFilterType.RECENT
}
</script>

<style lang="scss" src="./ChatsList.scss"></style>
