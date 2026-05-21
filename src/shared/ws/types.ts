export type ConnectionStatus =
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'reconnecting'
  | 'failed'
  | 'offline'

export interface MessageEnvelope<T = unknown> {
  type: string
  id?: string
  payload: T
  timestamp?: number
  channel?: string
}

export interface ConnectionManagerOptions {
  url: string
  maxReconnectAttempts?: number
  maxBackoffMs?: number
  heartbeatIntervalMs?: number
  heartbeatTimeoutMs?: number
  requestTimeoutMs?: number
  onStatusChange?: (status: ConnectionStatus) => void
}

export interface ITransport {
  connect: (url: string) => void
  disconnect: () => void
  send: (data: string) => void
  onMessage: (cb: (data: string) => void) => () => void
  onOpen: (cb: () => void) => () => void
  onClose: (cb: (event?: CloseEvent) => void) => () => void
  onError: (cb: (error: Event) => void) => () => void
  getReadyState: () => number
}

export interface IConnectionManager {
  connect: () => void
  disconnect: () => void
  send: (data: string) => void
  onMessage: (cb: (data: string) => void) => () => void
  onStatusChange: (cb: (status: ConnectionStatus) => void) => () => void
  getStatus: () => ConnectionStatus
}

export interface IMessageBus {
  on: (type: string, handler: (payload: unknown) => void) => () => void
  emit: (type: string, payload: unknown) => void
}

export interface IProtocol {
  send: (type: string, payload: unknown, channel?: string) => void
  request: <T = unknown>(type: string, payload: unknown, channel?: string) => Promise<T>
  on: (type: string, handler: (payload: unknown) => void) => () => void
  onStatusChange: (cb: (status: ConnectionStatus) => void) => () => void
  getStatus: () => ConnectionStatus
  connect: () => void
  disconnect: () => void
}

export type MessageMiddleware = (
  envelope: MessageEnvelope,
  next: (envelope: MessageEnvelope) => void,
) => void
