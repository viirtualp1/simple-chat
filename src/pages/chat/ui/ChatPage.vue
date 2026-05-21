<template>
  <q-page class="chat-page" :class="{ 'is-centered': !selectedChat }">
    <chat-window v-if="selectedChat" />
    <h5 v-else>Select a chat to start messaging</h5>
  </q-page>
</template>

<script setup lang="ts">
import { useChatsStoreRefs } from '@/entities/chat'
import { ChatWindow } from '@/widgets/chat-window'

const { selectedChat } = useChatsStoreRefs()
</script>

<style lang="scss" src="./ChatPage.scss"></style>
