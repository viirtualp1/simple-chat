import { ref, readonly, onScopeDispose } from 'vue'
import { createWsTransport } from './transport'
import { createConnectionManager } from './connectionManager'
import { createMessageBus } from './messageBus'
import { createProtocol } from './protocol'
import type { ConnectionStatus, IProtocol } from './types'

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080'

const transport = createWsTransport()
const connectionManager = createConnectionManager(transport, { url: WS_URL })
const messageBus = createMessageBus()
const protocol = createProtocol(connectionManager, messageBus)

export const wsClient: IProtocol = protocol

export function initWsClient() {
  wsClient.connect()
}

export function useWsConnectionStatus() {
  const status = ref<ConnectionStatus>(wsClient.getStatus())

  const unsubscribe = wsClient.onStatusChange((next) => {
    status.value = next
  })

  onScopeDispose(unsubscribe)

  return {
    status: readonly(status),
  }
}

export type { ConnectionStatus, IProtocol, MessageEnvelope } from './types'
