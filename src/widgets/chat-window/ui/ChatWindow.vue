<template>
  <div v-if="chat" class="chat-window">
    <div class="chat-window__header">
      <q-btn
        v-if="isMobileLayout"
        round
        flat
        color="primary"
        icon="arrow_back"
        size="md"
        class="chat-window__back"
        aria-label="Back to contacts"
        @click="back"
      />

      <q-avatar color="primary" text-color="white" size="36px">
        {{ chat.from[0] }}
      </q-avatar>

      <span class="chat-window__title">{{ chat.from }}</span>
    </div>

    <div ref="chatContentRef" class="chat-window__content">
      <chat-message-bubble
        v-for="message in messages"
        :key="message.date + message.text"
        :message="message"
      />
    </div>

    <div class="chat-window__footer">
      <q-input
        v-model="text"
        label="Type a message"
        name="Message"
        outlined
        rounded
        autogrow
        :max-height="120"
        @keydown.enter.exact.prevent="handleSend"
      >
        <template v-slot:append>
          <q-btn
            round
            dense
            flat
            icon="send"
            color="primary"
            :disable="!text.trim()"
            @click="handleSend"
          />
        </template>
      </q-input>
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

<style lang="scss" src="./ChatWindow.scss"></style>
