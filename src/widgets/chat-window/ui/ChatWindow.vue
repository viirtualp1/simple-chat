<template>
  <div v-if="chat" class="chat-window">
    <div class="chat-window__header">
      <q-btn
        round
        color="primary"
        icon="arrow_back"
        size="sm"
        class="chat-window__back"
        @click="back"
      />

      {{ chat.from }}
    </div>

    <div ref="chatContentRef" class="chat-window__content">
      <chat-message-bubble v-for="(message, idx) in messages" :key="idx" :message="message" />
    </div>

    <div class="chat-window__footer">
      <q-input
        v-model="text"
        label="Введите сообщение"
        name="Message"
        outlined
        rounded
        @keydown.enter="handleSend"
      >
        <template v-slot:prepend>
          <q-avatar color="primary" text-color="white"> Я </q-avatar>
        </template>

        <template v-slot:append>
          <q-btn round dense flat icon="send" @click="handleSend" />
        </template>
      </q-input>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { ChatMessageBubble, useChatsStore, useChatsStoreRefs } from '@/entities/chat'
import { useSendMessage } from '@/features/send-message'

const { setSelectedChat } = useChatsStore()
const { chats, selectedChat } = useChatsStoreRefs()

const chatContentRef = ref<HTMLDivElement>()

const chat = computed(() => {
  return chats.value.get(selectedChat.value)
})

const messages = computed(() => {
  return chat.value?.messages || []
})

const { text, sendMessage } = useSendMessage(chat)

function back() {
  setSelectedChat('')
}

function scrollToLastMessage() {
  if (!chatContentRef.value) return

  const el = chatContentRef.value

  nextTick(() => {
    requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
    })
  })
}

function handleSend() {
  sendMessage(scrollToLastMessage)
}
</script>

<style lang="scss" src="./ChatWindow.scss"></style>
