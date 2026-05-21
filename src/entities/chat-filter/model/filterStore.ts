import { ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { SortFilterType, type Filter } from './types'

export const useFiltersStore = defineStore('filters', () => {
  const filters = ref<Filter>({
    search: '',
    sort: SortFilterType.RECENT,
  })

  return {
    filters,
  }
})

export const useFiltersStoreRefs = () => storeToRefs(useFiltersStore())
