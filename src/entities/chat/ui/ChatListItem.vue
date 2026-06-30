<template>
  <button
    type="button"
    class="flex min-h-17 w-full items-center gap-3 rounded-3xl px-3.5 py-2.5 text-left transition-colors hover:bg-muted"
    :class="{ 'bg-primary-50 dark:bg-primary-950': isChatSelected }"
    @click="setChat"
  >
    <UAvatar :text="chat.from[0]" :ui="{ root: 'bg-primary', fallback: 'text-white' }" />

    <span class="min-w-0 flex-1">
      <span class="truncate font-medium text-highlighted">{{ chat.from }}</span>
      <span v-if="lastMessage" class="truncate text-sm text-muted">
        {{ lastMessage.text }}
      </span>
    </span>

    <span v-if="lastMessage" class="flex min-w-13 shrink-0 flex-col items-end gap-2 pl-2">
      <span class="text-[11px] whitespace-nowrap text-muted">{{ lastMessage.date }}</span>
      <UBadge v-if="unreadMessagesCount > 0" color="error" size="sm" class="rounded-full">
        {{ unreadMessagesCount }}
      </UBadge>
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatDistance, parseISO } from 'date-fns'
import { useRelativeTimeNow } from '../lib/useRelativeTimeNow'
import { useChatsStoreRefs } from '~/entities/chat'
import type { FormattedChatMessage } from '../model/types'
import { ChatMessageType } from '../model/types'

const props = defineProps<{ chat: FormattedChatMessage }>()

const emit = defineEmits<{
  (e: 'select:chat', chatId: string): void
}>()

const { selectedChat } = useChatsStoreRefs()
const now = useRelativeTimeNow()

const lastMessage = computed(() => {
  const messages = props.chat.messages
  if (messages.length === 0) {
    return null
  }

  const message = messages[messages.length - 1]
  if (!message) {
    return null
  }

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
