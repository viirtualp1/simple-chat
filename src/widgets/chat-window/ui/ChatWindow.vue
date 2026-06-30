<template>
  <div v-if="chat" class="flex h-full flex-col bg-default">
    <div class="flex shrink-0 items-center gap-3 border-b border-default bg-default px-4 py-3">
      <UButton
        v-if="isMobileLayout"
        icon="i-lucide-arrow-left"
        color="primary"
        variant="ghost"
        size="md"
        aria-label="Back to contacts"
        @click="back"
      />

      <UAvatar
        :text="chat.from[0]"
        size="md"
        :ui="{ root: 'bg-primary', fallback: 'text-white' }"
      />

      <span class="truncate text-lg font-semibold">{{ chat.from }}</span>
    </div>

    <div ref="chatContentRef" class="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-4">
      <ChatMessageBubble
        v-for="message in messages"
        :key="message.date + message.text"
        :message="message"
      />
    </div>

    <div class="shrink-0 border-t border-default bg-default px-4 py-3">
      <div class="flex items-end gap-2">
        <UTextarea
          v-model="text"
          class="w-full flex-1"
          :rows="1"
          :maxrows="5"
          autoresize
          placeholder="Type a message"
          @keydown.enter.exact.prevent="handleSend"
        />
        <UButton
          icon="i-lucide-send"
          color="primary"
          variant="solid"
          size="lg"
          square
          :disabled="!text.trim()"
          @click="handleSend"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { ChatMessageBubble, useChatsStore, useChatsStoreRefs } from '@/entities/chat'
import { useSendMessage } from '@/features/send-message'
import { useChatLayout } from '@/shared/lib/useChatLayout'

const { setSelectedChat } = useChatsStore()
const { chats, selectedChat } = useChatsStoreRefs()
const { isMobileLayout } = useChatLayout()

const chatContentRef = ref<HTMLDivElement>()

const chat = computed(() => chats.value.get(selectedChat.value))

const messages = computed(() => chat.value?.messages ?? [])

const { text, sendMessage } = useSendMessage(chat)

function back() {
  setSelectedChat('')
}

function scrollToLastMessage(behavior: ScrollBehavior = 'smooth') {
  if (!chatContentRef.value) return

  const el = chatContentRef.value

  nextTick(() => {
    requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight, behavior })
    })
  })
}

function handleSend() {
  sendMessage(() => scrollToLastMessage())
}

watch(
  () => messages.value.length,
  (length, prevLength) => {
    if (length > (prevLength ?? 0)) {
      scrollToLastMessage(length === 1 ? 'instant' : 'smooth')
    }
  },
)

watch(selectedChat, () => {
  scrollToLastMessage('instant')
})
</script>
