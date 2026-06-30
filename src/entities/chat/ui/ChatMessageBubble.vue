<template>
  <div class="msg-in flex" :class="isSent ? 'justify-end' : 'justify-start'">
    <div
      class="max-w-[78%] rounded-2xl px-3.5 py-2 shadow-sm sm:max-w-[68%]"
      :class="
        isSent
          ? 'rounded-br-md bg-gradient-to-br from-primary-500 to-primary-600 text-white'
          : 'glass-bubble rounded-bl-md text-default'
      "
    >
      <p class="text-[15px] leading-relaxed break-words whitespace-pre-wrap">
        {{ message.text }}
      </p>
      <span
        class="mt-0.5 block text-right text-[10px] tabular-nums"
        :class="isSent ? 'text-white/70' : 'text-muted'"
      >
        {{ parsedTime }}
      </span>
    </div>
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

const parsedTime = computed(() => format(parseISO(props.message.date), 'HH:mm'))
</script>
