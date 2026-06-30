import { inject, onMounted, onUnmounted, provide, ref, type Ref } from 'vue'

const RelativeTimeKey = Symbol('relativeTimeNow')

export function provideRelativeTimeNow() {
  const now = ref(new Date())

  provide(RelativeTimeKey, now)

  onMounted(() => {
    const intervalId = setInterval(() => {
      now.value = new Date()
    }, 60_000)

    onUnmounted(() => clearInterval(intervalId))
  })

  return now
}

export function useRelativeTimeNow() {
  const injected = inject<Ref<Date> | null>(RelativeTimeKey, null)
  if (injected) return injected

  const now = ref(new Date())

  onMounted(() => {
    const intervalId = setInterval(() => {
      now.value = new Date()
    }, 60_000)

    onUnmounted(() => clearInterval(intervalId))
  })

  return now
}
