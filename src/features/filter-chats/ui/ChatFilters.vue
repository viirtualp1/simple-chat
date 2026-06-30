<template>
  <div class="space-y-2.5">
    <UInput
      v-model="search"
      icon="i-lucide-search"
      placeholder="Search"
      size="lg"
      variant="none"
      class="w-full"
      :ui="{ root: 'glass-control rounded-full w-full', base: 'rounded-full bg-transparent' }"
    >
      <template v-if="search" #trailing>
        <UButton
          icon="i-lucide-x"
          color="neutral"
          variant="link"
          size="sm"
          aria-label="Clear search"
          @click="search = ''"
        />
      </template>
    </UInput>

    <div class="glass-control flex gap-1 rounded-full p-1">
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        class="flex-1 rounded-full px-3 py-1.5 text-sm font-medium transition-colors"
        :class="
          filters.sort === option.value
            ? 'bg-white text-primary shadow-sm dark:bg-white/15 dark:text-white'
            : 'text-muted hover:text-default'
        "
        @click="selectFilter(option.value)"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { SortFilterType, useFiltersStoreRefs } from '@/entities/chat-filter'

const { filters } = useFiltersStoreRefs()

const options = [
  { value: SortFilterType.RECENT, label: 'Recent' },
  { value: SortFilterType.NEW, label: 'New' },
] as const

const search = computed({
  get: () => filters.value.search ?? '',
  set: (value: string) => {
    filters.value.search = value
  },
})

function selectFilter(type: SortFilterType) {
  filters.value.sort = type
}
</script>
