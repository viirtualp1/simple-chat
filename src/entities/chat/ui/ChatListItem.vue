<template>
  <button
    type="button"
    class="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-all duration-150 hover:bg-white/50 dark:hover:bg-white/5"
    :class="{ 'bg-white/65 shadow-sm dark:bg-white/10': isChatSelected }"
    @click="setChat"
  >
    <ChatAvatar :name="chat.from" size="lg" />

    <div class="min-w-0 flex-1">
      <div class="flex items-center justify-between gap-2">
        <span class="truncate font-semibold text-highlighted">{{ chat.from }}</span>
        <span v-if="lastMessage" class="shrink-0 text-[11px] text-muted">
          {{ lastMessage.date }}
        </span>
      </div>

      <div class="mt-0.5 flex items-center justify-between gap-2">
        <span class="truncate text-sm text-muted">
          {{ lastMessage ? lastMessage.text : 'No messages yet' }}
        </span>
        <UBadge
          v-if="unreadMessagesCount > 0"
          color="primary"
          size="sm"
          class="shrink-0 rounded-full"
        >
          {{ unreadMessagesCount }}
        </UBadge>
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatDistance, parseISO } from 'date-fns'
import { useRelativeTimeNow } from '../lib/useRelativeTimeNow'
import { useChatsStoreRefs } from '../model/chatStore'
import type { FormattedChatMessage } from '../model/types'
import { ChatMessageType } from '../model/types'
import ChatAvatar from './ChatAvatar.vue'

const props = defineProps<{ chat: FormattedChatMessage }>()

const emit = defineEmits<{
  (e: 'select:chat', chatId: string): void
}>()

const { selectedChat } = useChatsStoreRefs()
const now = useRelativeTimeNow()

const lastMessage = computed(() => {
  const messages = props.chat.messages
  if (messages.length === 0) return null

  const message = messages[messages.length - 1]
  if (!message) return null

  return {
    text: message.text,
    date: formatDistance(parseISO(message.date), now.value, { addSuffix: true }),
  }
})

const unreadMessagesCount = computed(() => {
  return props.chat.messages.filter(
    (message) => !message.is_read && message.type !== ChatMessageType.OUTPUT,
  ).length
})

const isChatSelected = computed(() => props.chat.from === selectedChat.value)

function setChat() {
  emit('select:chat', props.chat.from)
}
</script>
