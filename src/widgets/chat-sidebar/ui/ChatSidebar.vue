<template>
  <div class="flex h-full flex-col overflow-hidden p-2">
    <ChatFilters />
    <div class="-mx-1 min-h-0 flex-1 overflow-y-auto">
      <ChatsList />
    </div>
  </div>
</template>

<script setup lang="ts">
import { provideRelativeTimeNow } from '@/entities/chat/lib/useRelativeTimeNow'
import { ChatFilters } from '@/features/filter-chats'
import ChatsList from './ChatsList.vue'

provideRelativeTimeNow()
</script>
