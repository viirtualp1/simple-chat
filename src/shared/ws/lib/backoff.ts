export function getBackoffDelay(
  attempt: number,
  maxBackoffMs = 30_000,
  jitterRatio = 0.3,
): number {
  const base = Math.min(1000 * 2 ** attempt, maxBackoffMs)
  const jitter = Math.random() * base * jitterRatio
  return base + jitter
}
