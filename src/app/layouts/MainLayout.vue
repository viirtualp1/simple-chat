<template>
  <q-layout class="main-layout row">
    <div v-if="isShowSidebar" class="col col-md-3">
      <chat-sidebar />
    </div>

    <q-page-container v-if="isShowContainer" class="col">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBreakpoints } from '@vueuse/core'
import { useChatsStoreRefs } from '@/entities/chat'
import { ChatSidebar } from '@/widgets/chat-sidebar'

const { selectedChat } = useChatsStoreRefs()

const { greater } = useBreakpoints({
  tablet: 640,
  laptop: 1024,
  desktop: 1280,
})

const isShowSidebar = computed(() => {
  if (greater('laptop').value) {
    return true
  }

  return !selectedChat.value
})

const isShowContainer = computed(() => {
  return greater('laptop').value || selectedChat.value
})
</script>
