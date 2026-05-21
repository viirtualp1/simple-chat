import type { IMessageBus } from './types'

export function createMessageBus(): IMessageBus {
  const subscribers = new Map<string, Set<(payload: unknown) => void>>()

  return {
    on(type, handler) {
      if (!subscribers.has(type)) {
        subscribers.set(type, new Set())
      }

      subscribers.get(type)!.add(handler)
      return () => subscribers.get(type)?.delete(handler)
    },

    emit(type, payload) {
      subscribers.get(type)?.forEach((handler) => handler(payload))
    },
  }
}
