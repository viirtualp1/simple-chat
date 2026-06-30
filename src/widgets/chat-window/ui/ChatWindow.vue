<template>
  <div v-if="chat" class="flex h-full flex-col">
    <header
      class="flex shrink-0 items-center gap-3 border-b border-white/40 px-3 py-2.5 sm:px-4 dark:border-white/10"
    >
      <UButton
        v-if="isMobileLayout"
        icon="i-lucide-arrow-left"
        color="neutral"
        variant="ghost"
        class="rounded-full"
        aria-label="Back to contacts"
        @click="back"
      />

      <ChatAvatar :name="chat.from" size="md" />

      <div class="min-w-0">
        <div class="truncate font-semibold text-highlighted">{{ chat.from }}</div>
        <div class="flex items-center gap-1.5 text-xs text-muted">
          <span class="pulse-dot size-1.5 rounded-full bg-green-500" />
          online
        </div>
      </div>
    </header>

    <div
      ref="chatContentRef"
      class="scroll-slim flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto px-3 py-4 sm:px-5"
    >
      <ChatMessageBubble
        v-for="message in messages"
        :key="message.date + message.text"
        :message="message"
      />
    </div>

    <div class="shrink-0 px-3 pt-2 pb-3 sm:px-4">
      <div class="glass-control flex items-end gap-2 rounded-[26px] p-1.5 pl-4">
        <UTextarea
          v-model="text"
          class="w-full flex-1"
          variant="none"
          :rows="1"
          :maxrows="5"
          autoresize
          placeholder="Message"
          :ui="{ base: 'bg-transparent resize-none py-2 text-[15px]' }"
          @keydown.enter.exact.prevent="handleSend"
        />
        <UButton
          icon="i-lucide-arrow-up"
          size="lg"
          square
          class="rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-md transition hover:from-primary-600 hover:to-primary-700 disabled:opacity-40"
          :disabled="!text.trim()"
          aria-label="Send message"
          @click="handleSend"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import {
  ChatAvatar,
  ChatMessageBubble,
  useChatsStore,
  useChatsStoreRefs,
} from '@/entities/chat'
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
