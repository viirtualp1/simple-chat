<template>
  <div class="flex h-dvh w-full justify-center sm:p-4 lg:p-6">
    <div
      class="glass-shell relative flex h-full w-full max-w-6xl overflow-hidden sm:rounded-[28px]"
    >
      <aside
        v-if="showSidebar"
        class="h-full shrink-0 overflow-hidden border-white/40 dark:border-white/10"
        :class="
          isMobileLayout
            ? 'absolute inset-0 z-10 w-full'
            : 'w-[360px] border-r'
        "
      >
        <ChatSidebar />
      </aside>

      <main
        v-if="showChat"
        class="h-full min-w-0 flex-1 overflow-hidden"
        :class="{ 'absolute inset-0 z-20 w-full': isMobileLayout }"
      >
        <slot />
      </main>
    </div>
  </div>
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
