<template>
  <div class="relative flex h-full flex-col">
    <ChatWindow v-if="selectedChat" />

    <div
      v-else-if="isDesktop"
      class="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center"
    >
      <div class="glass-control flex size-20 items-center justify-center rounded-full">
        <UIcon name="i-lucide-messages-square" class="size-9 text-primary" />
      </div>
      <div>
        <h2 class="text-lg font-semibold text-highlighted">Your messages</h2>
        <p class="mt-1 text-sm text-muted">Select a chat to start messaging</p>
      </div>
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
