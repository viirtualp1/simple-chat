<template>
  <q-list>
    <q-banner
      v-if="filteredChats.length === 0 && filters.sort === SortFilterType.NEW"
      dense
      inline-actions
      rounded
      class="bg-primary text-white"
    >
      There are no new chats

      <template v-slot:action>
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
import { ChatListItem } from '@/entities/chat'
import { SortFilterType, useFiltersStoreRefs } from '@/entities/chat-filter'
import { useChatsFilters } from '@/features/filter-chats'
import { useSelectChat } from '@/features/select-chat'

const { filters } = useFiltersStoreRefs()
const { filteredChats } = useChatsFilters()
const { selectChat } = useSelectChat()

function onChatSelected(from: string) {
  selectChat(from)
}

function setRecentFilter() {
  filters.value.sort = SortFilterType.RECENT
}
</script>
