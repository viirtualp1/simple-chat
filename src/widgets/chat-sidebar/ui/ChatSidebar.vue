<template>
  <div class="chat-sidebar">
    <chat-filters />
    <div class="chat-sidebar__list">
      <chats-list />
    </div>
  </div>
</template>

<script setup lang="ts">
import { provideRelativeTimeNow } from '@/entities/chat/lib/useRelativeTimeNow'
import { ChatFilters } from '@/features/filter-chats'
import ChatsList from './ChatsList.vue'

provideRelativeTimeNow()
</script>

<style lang="scss" src="./ChatSidebar.scss"></style>
