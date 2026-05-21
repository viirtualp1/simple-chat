<template>
  <q-layout view="hHh lpR fFf" class="main-layout">
    <q-page-container class="main-layout__container">
      <div class="main-layout__body">
        <aside
          v-if="showSidebar"
          class="main-layout__sidebar"
          :class="{ 'main-layout__sidebar--full': isMobileLayout }"
        >
          <chat-sidebar />
        </aside>

        <main
          v-if="showChat"
          class="main-layout__chat"
          :class="{ 'main-layout__chat--full': isMobileLayout }"
        >
          <router-view />
        </main>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useChatsStoreRefs } from '@/entities/chat'
import { useChatLayout } from '@/shared/lib/useChatLayout'
import { ChatSidebar } from '@/widgets/chat-sidebar'

const { selectedChat } = useChatsStoreRefs()
const { isDesktop, isMobileLayout } = useChatLayout()

const showSidebar = computed(() => isDesktop.value || !selectedChat.value)

const showChat = computed(() => isDesktop.value || Boolean(selectedChat.value))
</script>

<style lang="scss" src="./MainLayout.scss"></style>
