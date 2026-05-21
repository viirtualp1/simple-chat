<template>
  <div class="chat-filters">
    <q-input
      v-model="filters.search"
      dense
      outlined
      rounded
      label="Search"
      clearable
      debounce="100"
    >
      <template v-slot:append>
        <q-icon name="search" />
      </template>
    </q-input>

    <div class="chat-filters__sort">
      <app-button
        label="Recent"
        :outline="filters.sort !== SortFilterType.RECENT"
        @click="selectFilter(SortFilterType.RECENT)"
      />
      <app-button
        label="New"
        :outline="filters.sort !== SortFilterType.NEW"
        @click="selectFilter(SortFilterType.NEW)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { AppButton } from '@/shared/ui/button'
import { SortFilterType, useFiltersStoreRefs } from '@/entities/chat-filter'

const { filters } = useFiltersStoreRefs()

function selectFilter(type: SortFilterType) {
  filters.value.sort = type
}
</script>

<style lang="scss" src="./ChatFilters.scss"></style>
