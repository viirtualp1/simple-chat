<template>
  <ws-connection-banner />
  <router-view />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { setupWsIntegration } from '@/app/init/ws'
import WsConnectionBanner from '@/shared/ws/ui/WsConnectionBanner.vue'

let unbindWs: (() => void) | undefined

onMounted(() => {
  unbindWs = setupWsIntegration()
})

onUnmounted(() => {
  unbindWs?.()
})
</script>
