'use client'
import { motion } from 'framer-motion'
import { AlertTriangle, TrendingDown, TrendingUp, Info } from 'lucide-react'
import type { AxoScores } from '@/hooks/useScores'
import type { MetricsDay } from '@/hooks/useMetrics'

interface InsightsProps {
  scores: AxoScores | null
  metrics: MetricsDay[]
  isAgency: boolean
}

interface Insight {
  icon: any
  iconColor: string
  title: string
  description: string
}

export default function Insights({ scores, metrics, isAgency }: InsightsProps) {
  if (!scores || metrics.length === 0) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
        {[1,2,3].map(i => (
          <div key={i} className="glass-card" style={{ padding: 16 }}>
            <div className="skeleton" style={{ width: 24, height: 24, borderRadius: '50%', marginBottom: 12 }} />
            <div className="skeleton" style={{ width: '70%', height: 14, marginBottom: 6 }} />
            <div className="skeleton" style={{ width: '100%', height: 13 }} />
          </div>
        ))}
      </div>
    )
  }

  const latest = metrics[metrics.length - 1]
  const previous = metrics.length > 1 ? metrics[metrics.length - 2] : latest

  const insights: Insight[] = []

  if (isAgency) {
    const pipelineChange = previous.active_pipeline > 0
      ? ((latest.active_pipeline - previous.active_pipeline) / previous.active_pipeline) * 100
      : 0

    insights.push({
      icon: pipelineChange < 0 ? AlertTriangle : TrendingUp,
      iconColor: pipelineChange < 0 ? '#F97316' : '#22C55E',
      title: pipelineChange < 0 ? 'Pipeline velocity declining' : 'Pipeline gaining momentum',
      description: pipelineChange < 0
        ? `Active prospects dropped ${Math.abs(pipelineChange).toFixed(0)}% recently. Review your acquisition channels.`
        : `Active prospects grew ${pipelineChange.toFixed(0)}% recently. Keep the momentum going.`,
    })

    const topClientPct = (latest.top_client_share * 100)
    insights.push({
      icon: topClientPct > 40 ? TrendingDown : Info,
      iconColor: topClientPct > 40 ? '#EF4444' : '#6B7280',
      title: topClientPct > 40 ? 'Client dependency risk' : 'Client base diversified',
      description: topClientPct > 40
        ? `${topClientPct.toFixed(0)}% of revenue comes from your top client. Diversification is recommended.`
        : `Your top client represents ${topClientPct.toFixed(0)}% of revenue — a healthy distribution.`,
    })

    insights.push({
      icon: scores.execution_score >= 6 ? TrendingUp : Info,
      iconColor: scores.execution_score >= 6 ? '#22C55E' : '#6B7280',
      title: scores.execution_score >= 6 ? 'Strong execution pace' : 'Execution opportunity',
      description: scores.execution_score >= 6
        ? 'You are completing recommended actions consistently. This compounds over time.'
        : 'Completing more daily actions will compound into faster growth.',
    })
  } else {
    const roasChange = previous.roas > 0
      ? ((latest.roas - previous.roas) / previous.roas) * 100
      : 0

    insights.push({
      icon: latest.roas < 2 ? AlertTriangle : (roasChange > 0 ? TrendingUp : Info),
      iconColor: latest.roas < 2 ? '#EF4444' : (roasChange > 0 ? '#22C55E' : '#6B7280'),
      title: latest.roas < 2 ? 'ROAS below healthy threshold' : 'ROAS improving',
      description: latest.roas < 2
        ? `Your ROAS is at ${latest.roas.toFixed(1)}. Consider pausing underperforming ad sets.`
        : `Your cost per acquisition is trending favorably. Consider increasing spend by 10-15%.`,
    })

    insights.push({
      icon: latest.repeat_purchase_rate < 20 ? TrendingDown : TrendingUp,
      iconColor: latest.repeat_purchase_rate < 20 ? '#F97316' : '#22C55E',
      title: latest.repeat_purchase_rate < 20 ? 'Low retention signal' : 'Retention building',
      description: latest.repeat_purchase_rate < 20
        ? `Only ${latest.repeat_purchase_rate.toFixed(0)}% of customers return. A post-purchase flow could help.`
        : `${latest.repeat_purchase_rate.toFixed(0)}% repeat rate shows your retention engine is working.`,
    })

    insights.push({
      icon: scores.execution_score >= 6 ? TrendingUp : Info,
      iconColor: scores.execution_score >= 6 ? '#22C55E' : '#6B7280',
      title: scores.execution_score >= 6 ? 'Strong execution pace' : 'Execution opportunity',
      description: scores.execution_score >= 6
        ? 'You are completing recommended actions consistently. This compounds over time.'
        : 'Completing more daily actions will compound into faster growth.',
    })
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
      {insights.map((insight, i) => {
        const Icon = insight.icon
        return (
          <motion.div
            key={insight.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.1 }}
            whileHover={{ scale: 1.005 }}
            className="glass-card"
            style={{ padding: 16 }}
          >
            <Icon size={20} color={insight.iconColor} style={{ marginBottom: 10 }} />
            <div style={{ fontSize: 14, fontWeight: 600, color: '#0A0A0A', marginBottom: 4 }} className="dark:text-white">
              {insight.title}
            </div>
            <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.5 }}>
              {insight.description}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
