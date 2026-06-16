'use client'
import CountUp from 'react-countup'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { motion } from 'framer-motion'
import SparklineChart from '@/components/SparklineChart'
import type { MetricsDay } from '@/hooks/useMetrics'

interface CoreSnapshotProps {
  metrics: MetricsDay[]
  isAgency: boolean
  loading: boolean
}

interface SnapshotItem {
  label: string
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
  trend: number
  sparkline: number[]
}

export default function CoreSnapshot({ metrics, isAgency, loading }: CoreSnapshotProps) {
  if (loading || metrics.length === 0) {
    return (
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto' }} className="no-scrollbar">
        {[1,2,3,4,5].map(i => (
          <div key={i} className="glass-card" style={{ padding: 16, minWidth: 160, flexShrink: 0 }}>
            <div className="skeleton" style={{ width: 80, height: 11, marginBottom: 8 }} />
            <div className="skeleton" style={{ width: 60, height: 24, marginBottom: 8 }} />
            <div className="skeleton" style={{ width: '100%', height: 40 }} />
          </div>
        ))}
      </div>
    )
  }

  const latest = metrics[metrics.length - 1]
  const previous = metrics.length > 1 ? metrics[metrics.length - 2] : latest

  const calcTrend = (current: number, prev: number) => {
    if (prev === 0) return 0
    return ((current - prev) / prev) * 100
  }

  // Cash runway: simple mock calc — mrr / (mrr * 0.1) days proxy, just for display
  const cashRunway = latest.mrr > 0 ? Math.round((latest.mrr / Math.max(latest.mrr * 0.05, 1)) * 30) : 0

  const items: SnapshotItem[] = isAgency
    ? [
        { label: 'Revenue (30d)', value: latest.mrr, prefix: '$', trend: calcTrend(latest.mrr, previous.mrr), sparkline: metrics.map(m => m.mrr) },
        { label: 'Active Clients', value: latest.active_clients, trend: calcTrend(latest.active_clients, previous.active_clients), sparkline: metrics.map(m => m.active_clients) },
        { label: 'Calls Booked', value: latest.active_pipeline, trend: calcTrend(latest.active_pipeline, previous.active_pipeline), sparkline: metrics.map(m => m.active_pipeline) },
        { label: 'Conversion', value: latest.conversion_rate * 100, suffix: '%', decimals: 1, trend: calcTrend(latest.conversion_rate, previous.conversion_rate), sparkline: metrics.map(m => m.conversion_rate * 100) },
        { label: 'Cash Runway', value: cashRunway, suffix: 'd', trend: 0, sparkline: metrics.map((_, i) => cashRunway - i) },
      ]
    : [
        { label: 'Revenue (30d)', value: latest.mrr, prefix: '$', trend: calcTrend(latest.mrr, previous.mrr), sparkline: metrics.map(m => m.mrr) },
        { label: 'ROAS', value: latest.roas, decimals: 1, trend: calcTrend(latest.roas, previous.roas), sparkline: metrics.map(m => m.roas) },
        { label: 'CAC', value: latest.cac, prefix: '$', trend: calcTrend(latest.cac, previous.cac), sparkline: metrics.map(m => m.cac) },
        { label: 'AOV', value: latest.ltv || 0, prefix: '$', trend: 0, sparkline: metrics.map(m => m.ltv || 0) },
        { label: 'Repeat Rate', value: latest.repeat_purchase_rate, suffix: '%', decimals: 1, trend: calcTrend(latest.repeat_purchase_rate, previous.repeat_purchase_rate), sparkline: metrics.map(m => m.repeat_purchase_rate) },
      ]

  return (
    <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4 }} className="no-scrollbar">
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: i * 0.05 }}
          whileHover={{ scale: 1.005 }}
          className="glass-card"
          style={{ padding: 16, minWidth: 160, flexShrink: 0 }}
        >
          <div style={{ fontSize: 12, color: '#9CA3AF' }}>{item.label}</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#0A0A0A', marginTop: 4 }} className="dark:text-white">
            {item.prefix}<CountUp end={item.value} duration={0.8} decimals={item.decimals || 0} separator="," />{item.suffix}
          </div>
          {item.trend !== 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
              {item.trend > 0 ? <TrendingUp size={12} color="#22C55E" /> : <TrendingDown size={12} color="#EF4444" />}
              <span style={{ fontSize: 12, color: item.trend > 0 ? '#22C55E' : '#EF4444', fontWeight: 500 }}>
                {Math.abs(item.trend).toFixed(1)}%
              </span>
            </div>
          )}
          <div style={{ height: 40, marginTop: 8 }}>
            <SparklineChart data={item.sparkline} color="#F97316" height={40} />
          </div>
        </motion.div>
      ))}
    </div>
  )
}
