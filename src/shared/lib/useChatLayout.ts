import { computed } from 'vue'
import { useBreakpoints } from '@vueuse/core'

const BREAKPOINTS = {
  tablet: 640,
  laptop: 1024,
  desktop: 1280,
} as const

export function useChatLayout() {
  const { greater } = useBreakpoints(BREAKPOINTS)

  const isDesktop = computed(() => greater('laptop').value)
  const isMobileLayout = computed(() => !isDesktop.value)

  return {
    isDesktop,
    isMobileLayout,
  }
}
