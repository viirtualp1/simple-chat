<template>
  <Transition name="banner">
    <div v-if="visible" class="ws-connection-banner">
      <div
        class="glass-control flex items-center gap-3 rounded-full py-2 pr-2 pl-4 text-sm font-medium text-highlighted shadow-lg"
      >
        <span class="flex items-center gap-2">
          <span class="size-2 rounded-full" :class="dotClass" />
          {{ bannerText }}
        </span>

        <UButton
          v-if="status === 'failed'"
          label="Retry"
          color="neutral"
          variant="soft"
          size="xs"
          class="rounded-full"
          @click="retry"
        />
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { initWsClient, useWsConnectionStatus } from '@/shared/ws'

const { status } = useWsConnectionStatus()

const visible = computed(() => {
  return status.value !== 'connected' && status.value !== 'disconnected'
})

const dotClass = computed(() => {
  if (status.value === 'failed') {
    return 'bg-red-500'
  }

  if (status.value === 'offline') {
    return 'bg-neutral-400'
  }

  return 'pulse-dot bg-amber-500'
})

const bannerText = computed(() => {
  switch (status.value) {
    case 'connecting':
      return 'Connecting to chat server...'
    case 'reconnecting':
      return 'Connection lost. Reconnecting...'
    case 'offline':
      return 'You are offline. Waiting for network...'
    case 'failed':
      return 'Unable to connect to chat server.'
    default:
      return ''
  }
})

function retry() {
  initWsClient()
}
</script>

<style scoped>
.ws-connection-banner {
  position: fixed;
  top: 14px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 6000;
}

.banner-enter-active,
.banner-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.banner-enter-from,
.banner-leave-to {
  opacity: 0;
  transform: translate(-50%, -12px);
}
</style>
