import type { MessageEnvelope } from './types'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function normalizeMessage(raw: unknown): MessageEnvelope | null {
  if (!isRecord(raw)) return null

  if (typeof raw.type === 'string' && 'payload' in raw) {
    return {
      type: raw.type,
      ...(typeof raw.id === 'string' ? { id: raw.id } : {}),
      payload: raw.payload,
      timestamp: typeof raw.timestamp === 'number' ? raw.timestamp : Date.now(),
      ...(typeof raw.channel === 'string' ? { channel: raw.channel } : {}),
    }
  }

  if (isRecord(raw.message)) {
    return {
      type: 'chat.message',
      payload: raw.message,
      timestamp: typeof raw.message.timestamp === 'number' ? raw.message.timestamp : Date.now(),
    }
  }

  if (typeof raw.notification === 'string') {
    return {
      type: 'notification',
      payload: raw.notification,
      timestamp: Date.now(),
    }
  }

  if (raw.type === 'system' && typeof raw.text === 'string') {
    return {
      type: 'system',
      payload: { text: raw.text },
      timestamp: Date.now(),
    }
  }

  return null
}

export function serializeEnvelope(envelope: MessageEnvelope): string {
  return JSON.stringify({
    ...envelope,
    timestamp: envelope.timestamp ?? Date.now(),
  })
}

export function deserializeEnvelope(raw: string): MessageEnvelope | null {
  try {
    const parsed: unknown = JSON.parse(raw)
    return normalizeMessage(parsed)
  } catch {
    return null
  }
}
