'use client'
import { motion } from 'framer-motion'
import { useWorkspace } from '@/context/WorkspaceContext'
import { useScores } from '@/hooks/useScores'
import { useActions } from '@/hooks/useActions'
import { useMetrics } from '@/hooks/useMetrics'
import BusinessPulseCard from '@/components/today/BusinessPulseCard'
import TodayActionCard from '@/components/today/TodayActionCard'
import CoreSnapshot from '@/components/today/CoreSnapshot'
import Insights from '@/components/today/Insights'

export default function TodayPage() {
  const { workspace, businessProfile, loading: workspaceLoading } = useWorkspace()
  const isAgency = businessProfile?.business_type !== 'ecommerce'

  const { scores, previousScores, loading: scoresLoading } = useScores(workspace?.id)
  const { currentAction, loading: actionsLoading, noMoreActions, markDone, markSkipped } = useActions(workspace?.id)
  const { metrics, loading: metricsLoading } = useMetrics(workspace?.id)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1200 }}>
      <BusinessPulseCard scores={scores} previousScores={previousScores} metrics={metrics} />

      <TodayActionCard
        action={currentAction}
        loading={actionsLoading}
        noMoreActions={noMoreActions}
        onDone={markDone}
        onSkip={markSkipped}
      />

      <div>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 12 }} className="dark:text-gray-300">
          Core Snapshot
        </h3>
        <CoreSnapshot metrics={metrics} isAgency={isAgency} loading={metricsLoading} />
      </div>

      <div>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 12 }} className="dark:text-gray-300">
          Insights
        </h3>
        <Insights scores={scores} metrics={metrics} isAgency={isAgency} />
      </div>
    </div>
  )
}
