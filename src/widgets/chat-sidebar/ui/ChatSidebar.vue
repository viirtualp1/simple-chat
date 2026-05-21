<template>
  <div class="chat-sidebar">
    <chat-filters />
    <chats-list />
  </div>
</template>

<script setup lang="ts">
import { ChatFilters } from '@/features/filter-chats'
import ChatsList from './ChatsList.vue'
</script>

<style lang="scss" src="./ChatSidebar.scss"></style>
