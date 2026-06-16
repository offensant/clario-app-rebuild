export function getScoreColor(score: number): string {
  if (score >= 7) return '#22C55E'
  if (score >= 4) return '#F97316'
  return '#EF4444'
}

export function getScoreDotClass(score: number): string {
  return score < 4 ? 'pulse-dot' : ''
}
