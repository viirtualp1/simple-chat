const GRADIENTS: ReadonlyArray<readonly [string, string]> = [
  ['#FF8A65', '#FF7043'],
  ['#7C4DFF', '#2979FF'],
  ['#26C6DA', '#00ACC1'],
  ['#66BB6A', '#2E7D32'],
  ['#EC407A', '#AB47BC'],
  ['#FFA726', '#FB8C00'],
  ['#42A5F5', '#1E88E5'],
  ['#26A69A', '#00897B'],
]

export function getAvatarGradient(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  }

  const pair = GRADIENTS[hash % GRADIENTS.length]!
  return `linear-gradient(135deg, ${pair[0]}, ${pair[1]})`
}
