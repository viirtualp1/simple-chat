<template>
  <q-btn
    class="app-button"
    unelevated
    rounded
    color="primary"
    :outline="outline"
  >
    {{ label }}

    <q-badge v-if="alwaysVisibleBadge" :color="badgeColor" rounded>
      {{ badgeText }}
    </q-badge>
  </q-btn>
</template>

<script setup lang="ts">
defineProps<{
  label?: string
  outline?: boolean
  badgeColor?: string
  badgeText?: string
  alwaysVisibleBadge?: boolean
}>()
</script>

<style lang="scss" src="./AppButton.scss"></style>
