<template>
  <q-chat-message
    class="chat-message-bubble"
    :bg-color="isSent ? 'primary' : 'grey-3'"
    :text-color="isSent ? 'white' : 'black'"
    :sent="isSent"
    :stamp="parsedDate"
    :text="[message.text]"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { format, parseISO } from 'date-fns'
import { ChatMessageType, type ChatMessage } from '../model/types'

const props = defineProps<{
  message: ChatMessage
}>()

const isSent = computed(() => props.message.type === ChatMessageType.OUTPUT)

const parsedDate = computed(() => format(parseISO(props.message.date), 'dd.MM.yyyy HH:mm'))
</script>

<style lang="scss" src="./ChatMessageBubble.scss"></style>
