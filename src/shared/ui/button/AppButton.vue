<template>
  <UButton
    :label="label"
    :color="color"
    :variant="outline ? 'outline' : 'solid'"
    block
    class="justify-center rounded-full"
  >
    <template v-if="alwaysVisibleBadge" #trailing>
      <UBadge :color="badgeColor" size="sm" class="rounded-full">
        {{ badgeText }}
      </UBadge>
    </template>
  </UButton>
</template>

<script setup lang="ts">
import type { ButtonProps, BadgeProps } from '@nuxt/ui'

withDefaults(
  defineProps<{
    label?: string
    outline?: boolean
    color?: ButtonProps['color']
    badgeColor?: BadgeProps['color']
    badgeText?: string
    alwaysVisibleBadge?: boolean
  }>(),
  {
    color: 'primary',
  },
)
</script>
