<template>
  <div class="flex h-dvh flex-col items-center justify-center bg-primary p-4 text-center text-white">
    <div class="text-[30vh] leading-none font-bold">404</div>
    <div class="text-4xl font-medium opacity-40">Oops. Nothing here...</div>
    <UButton
      to="/"
      label="Go Home"
      color="neutral"
      variant="solid"
      size="lg"
      class="mt-12 bg-white text-primary hover:bg-white/90"
    />
  </div>
</template>

<script setup lang="ts"></script>
