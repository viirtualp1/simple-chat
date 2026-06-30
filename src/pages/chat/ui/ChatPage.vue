<template>
  <div class="relative flex h-full flex-col">
    <ChatWindow v-if="selectedChat" />
    <div v-else-if="isDesktop" class="flex flex-1 items-center justify-center">
      <h5 class="text-lg font-medium text-muted">Select a chat to start messaging</h5>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChatsStoreRefs } from '@/entities/chat'
import { useChatLayout } from '@/shared/lib/useChatLayout'
import { ChatWindow } from '@/widgets/chat-window'

const { selectedChat } = useChatsStoreRefs()
const { isDesktop } = useChatLayout()
</script>
