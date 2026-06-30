<template>
  <div class="flex h-full flex-col">
    <header class="flex items-center justify-between gap-2 px-4 pt-4 pb-2">
      <h1 class="text-xl font-bold tracking-tight text-highlighted">Messages</h1>
      <UButton
        :icon="isDark ? 'i-lucide-sun' : 'i-lucide-moon'"
        color="neutral"
        variant="ghost"
        size="sm"
        class="rounded-full"
        aria-label="Toggle theme"
        @click="toggleTheme"
      />
    </header>

    <div class="px-3 pb-2">
      <ChatFilters />
    </div>

    <div class="scroll-slim min-h-0 flex-1 overflow-y-auto px-2 pb-3">
      <ChatsList />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { provideRelativeTimeNow } from '@/entities/chat/lib/useRelativeTimeNow'
import { ChatFilters } from '@/features/filter-chats'
import ChatsList from './ChatsList.vue'

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

function toggleTheme() {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}

provideRelativeTimeNow()
</script>
