<template>
  <div>
    <UInput
      v-model="search"
      icon="i-lucide-search"
      placeholder="Search"
      class="w-full"
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

    <div class="my-3 grid grid-cols-2 gap-2">
      <AppButton
        label="Recent"
        :outline="filters.sort !== SortFilterType.RECENT"
        @click="selectFilter(SortFilterType.RECENT)"
      />
      <AppButton
        label="New"
        :outline="filters.sort !== SortFilterType.NEW"
        @click="selectFilter(SortFilterType.NEW)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { AppButton } from '@/shared/ui/button'
import { SortFilterType, useFiltersStoreRefs } from '@/entities/chat-filter'

const { filters } = useFiltersStoreRefs()

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
