<template>
  <div
    class="flex shrink-0 select-none items-center justify-center rounded-full font-semibold text-white shadow-sm ring-1 ring-white/30"
    :class="sizeClass"
    :style="{ background: gradient }"
  >
    {{ initial }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getAvatarGradient } from '@/shared/lib/avatarColor'

const props = withDefaults(
  defineProps<{
    name: string
    size?: 'sm' | 'md' | 'lg'
  }>(),
  {
    size: 'md',
  },
)

const SIZE_CLASS: Record<NonNullable<typeof props.size>, string> = {
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-12 text-base',
}

const initial = computed(() => props.name.charAt(0).toUpperCase())
const gradient = computed(() => getAvatarGradient(props.name))
const sizeClass = computed(() => SIZE_CLASS[props.size])
</script>
