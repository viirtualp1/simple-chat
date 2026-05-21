<template>
  <q-page class="chat-page">
    <chat-window v-if="selectedChat" />
    <div v-else-if="isDesktop" class="chat-page__placeholder">
      <h5>Select a chat to start messaging</h5>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useChatsStoreRefs } from '@/entities/chat'
import { useChatLayout } from '@/shared/lib/useChatLayout'
import { ChatWindow } from '@/widgets/chat-window'

const { selectedChat } = useChatsStoreRefs()
const { isDesktop } = useChatLayout()
</script>

<style lang="scss" src="./ChatPage.scss"></style>
