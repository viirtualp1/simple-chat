<template>
  <q-item clickable :active="isChatSelected" active-class="bg-blue-1" @click="setChat">
    <q-item-section avatar>
      <q-avatar color="primary" text-color="white"> {{ chat.from[0] }} </q-avatar>
    </q-item-section>

    <q-item-section class="chat-list-item__author">
      <q-item-label>
        {{ chat.from }}
      </q-item-label>
      <q-item-label v-if="lastMessage" caption lines="2">
        {{ lastMessage.text }}
      </q-item-label>
    </q-item-section>

    <q-item-section v-if="lastMessage" side>
      <q-item-label caption class="chat-list-item__date">{{ lastMessage.date }}</q-item-label>
      <q-badge v-if="unreadMessagesCount > 0" color="red" rounded>
        {{ unreadMessagesCount }}
      </q-badge>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { formatDistance, parseISO } from 'date-fns'
import { useChatsStoreRefs } from '../model/chatStore'
import type { FormattedChatMessage } from '../model/types'
import { ChatMessageType } from '../model/types'

const props = defineProps<{ chat: FormattedChatMessage }>()

const emit = defineEmits<{
  (e: 'select:chat', chatId: string): void
}>()

const { selectedChat } = useChatsStoreRefs()

const now = ref(new Date())

let intervalId: ReturnType<typeof setInterval>

const lastMessage = computed(() => {
  const messages = props.chat.messages
  if (messages.length === 0) return null

  const message = messages[messages.length - 1]
  if (!message) return null

  resetDate()

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

const isChatSelected = computed(() => {
  return props.chat.from === selectedChat.value
})

function resetDate() {
  now.value = new Date()
}

function setChat() {
  emit('select:chat', props.chat.from)
}

onMounted(() => {
  intervalId = setInterval(resetDate, 60000)
})

onUnmounted(() => {
  clearInterval(intervalId)
})
</script>

<style lang="scss" src="./ChatListItem.scss"></style>
