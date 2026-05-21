<template>
  <q-banner
    v-if="visible"
    dense
    inline-actions
    rounded
    :class="bannerClass"
    class="ws-connection-banner"
  >
    {{ bannerText }}

    <template v-if="status === 'failed'" v-slot:action>
      <q-btn flat color="white" label="Retry" @click="retry" />
    </template>
  </q-banner>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { initWsClient, useWsConnectionStatus } from '@/shared/ws'

const { status } = useWsConnectionStatus()

const visible = computed(() => {
  return status.value !== 'connected' && status.value !== 'disconnected'
})

const bannerClass = computed(() => {
  if (status.value === 'failed') return 'bg-negative text-white'
  if (status.value === 'offline') return 'bg-grey-8 text-white'
  return 'bg-warning text-dark'
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

<style lang="scss">
.ws-connection-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 6000;
}
</style>
