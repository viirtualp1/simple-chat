import { v4 as uuidv4 } from 'uuid'
import { deserializeEnvelope, serializeEnvelope } from './normalizeMessage'
import type {
  ConnectionManagerOptions,
  IConnectionManager,
  IMessageBus,
  IProtocol,
  MessageEnvelope,
  MessageMiddleware,
} from './types'

export function createProtocol(
  connectionManager: IConnectionManager,
  messageBus: IMessageBus,
  options: Pick<ConnectionManagerOptions, 'requestTimeoutMs'> = {},
): IProtocol {
  const { requestTimeoutMs = 5_000 } = options

  const pending = new Map<string, (payload: unknown) => void>()
  const middlewares: MessageMiddleware[] = []

  function runMiddlewares(envelope: MessageEnvelope, index = 0) {
    const middleware = middlewares[index]

    if (!middleware) {
      messageBus.emit(envelope.type, envelope.payload)
      return
    }

    middleware(envelope, (nextEnvelope) => runMiddlewares(nextEnvelope, index + 1))
  }

  connectionManager.onMessage((raw) => {
    const envelope = deserializeEnvelope(raw)
    if (!envelope) {
      return
    }

    if (envelope.id && pending.has(envelope.id)) {
      pending.get(envelope.id)?.(envelope.payload)
      pending.delete(envelope.id)
    }

    runMiddlewares(envelope)
  })

  return {
    connect: () => connectionManager.connect(),
    disconnect: () => connectionManager.disconnect(),

    send(type: string, payload: unknown, channel?: string) {
      connectionManager.send(
        serializeEnvelope({
          type,
          payload,
          ...(channel ? { channel } : {}),
          timestamp: Date.now(),
        }),
      )
    },

    request<T = unknown>(type: string, payload: unknown, channel?: string) {
      return new Promise<T>((resolve, reject) => {
        const id = uuidv4()

        const timeout = setTimeout(() => {
          pending.delete(id)
          reject(new Error(`Request timeout: ${type}`))
        }, requestTimeoutMs)

        pending.set(id, (responsePayload) => {
          clearTimeout(timeout)
          resolve(responsePayload as T)
        })

        connectionManager.send(
          serializeEnvelope({
            id,
            type,
            payload,
            ...(channel ? { channel } : {}),
            timestamp: Date.now(),
          }),
        )
      })
    },

    on: messageBus.on.bind(messageBus),
    onStatusChange: connectionManager.onStatusChange.bind(connectionManager),
    getStatus: connectionManager.getStatus.bind(connectionManager),
  }
}
