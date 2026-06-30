<template>
  <div
    v-if="visible"
    class="ws-connection-banner flex items-center justify-between gap-3 px-4 py-2 text-sm"
    :class="bannerClass"
  >
    <span>{{ bannerText }}</span>

    <UButton
      v-if="status === 'failed'"
      label="Retry"
      color="neutral"
      variant="ghost"
      size="sm"
      @click="retry"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { initWsClient, useWsConnectionStatus } from '@/shared/ws'

const { status } = useWsConnectionStatus()

const visible = computed(() => {
  return status.value !== 'connected' && status.value !== 'disconnected'
})

const bannerClass = computed(() => {
  if (status.value === 'failed') return 'bg-error text-white'
  if (status.value === 'offline') return 'bg-neutral-800 text-white'
  return 'bg-warning text-black'
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
  top: 0;
  left: 0;
  right: 0;
  z-index: 6000;
}
</style>
