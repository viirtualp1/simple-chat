<template>
  <div class="flex flex-col" :class="isSent ? 'items-end' : 'items-start'">
    <div
      class="max-w-[85%] rounded-3xl px-4 py-2.5 text-sm leading-relaxed break-words whitespace-pre-wrap"
      :class="isSent ? 'bg-primary text-white' : 'bg-elevated text-default'"
    >
      {{ message.text }}
    </div>
    <span class="mt-1 text-[11px] opacity-70">{{ parsedDate }}</span>
  </div>
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
