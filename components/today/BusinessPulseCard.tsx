'use client'
import CountUp from 'react-countup'
import SparklineChart from '@/components/SparklineChart'
import { getScoreColor, getScoreDotClass } from '@/components/ScoreColor'
import type { AxoScores } from '@/hooks/useScores'
import type { MetricsDay } from '@/hooks/useMetrics'

interface BusinessPulseCardProps {
  scores: AxoScores | null
  previousScores: AxoScores | null
  metrics: MetricsDay[]
}

function getPulseDescription(score: number): string {
  if (score >= 7) return 'Your business is showing strong momentum. Maintain current execution.'
  if (score >= 4) return 'Your business is stable but has clear vulnerabilities to address.'
  return 'Your business has structural risks that need immediate attention.'
}

export default function BusinessPulseCard({ scores, previousScores, metrics }: BusinessPulseCardProps) {
  if (!scores) {
    return (
      <div className="glass-card" style={{ padding: 24, height: 160 }}>
        <div className="skeleton" style={{ width: 140, height: 12, marginBottom: 12 }} />
        <div className="skeleton" style={{ width: 100, height: 48, marginBottom: 12 }} />
        <div className="skeleton" style={{ width: '60%', height: 14 }} />
      </div>
    )
  }

  const score = scores.business_pulse
  const previous = previousScores?.business_pulse
  const diff = previous !== undefined ? score - previous : null
  const color = getScoreColor(score)

  // Build sparkline data from MRR trend as a proxy for pulse trend
  const sparklineData = metrics.length > 0
    ? metrics.map(m => m.mrr)
    : [score, score, score]

  return (
    <div className="glass-card" style={{ padding: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: 200 }}>
        <div className="section-label">Business Pulse™</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 8 }}>
          <span style={{ fontSize: 48, fontWeight: 700, color, letterSpacing: '-1px' }}>
            <CountUp end={score} decimals={1} duration={0.8} />
          </span>
          <span style={{ fontSize: 24, color: '#9CA3AF', fontWeight: 500 }}>/10</span>
          {diff !== null && (
            <span
              className="badge"
              style={{
                marginLeft: 12,
                color: diff >= 0 ? '#22C55E' : '#EF4444',
              }}
            >
              {diff >= 0 ? '+' : ''}{diff.toFixed(1)} this week
            </span>
          )}
        </div>
        <p style={{ fontSize: 14, color: '#6B7280', marginTop: 10, fontStyle: 'italic', maxWidth: 420 }}>
          {getPulseDescription(score)}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
        <div style={{ width: 140, height: 60 }}>
          <SparklineChart data={sparklineData} color="#F97316" />
        </div>
        <div
          className={getScoreDotClass(score)}
          style={{ width: 8, height: 8, borderRadius: '50%', background: color }}
        />
      </div>
    </div>
  )
}
