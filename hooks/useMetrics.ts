'use client'
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export interface MetricsDay {
  date: string
  mrr: number
  active_clients: number
  clients_lost_30d: number
  clients_lost_60d: number
  active_pipeline: number
  top_client_share: number
  roas: number
  cac: number
  ltv: number
  repeat_purchase_rate: number
  conversion_rate: number
}

export function useMetrics(workspaceId: string | undefined) {
  const [metrics, setMetrics] = useState<MetricsDay[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMetrics = useCallback(async () => {
    if (!workspaceId) return
    setLoading(true)

    const { data } = await supabase
      .from('metrics_daily')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('date', { ascending: true })
      .limit(30)

    if (data) setMetrics(data)
    setLoading(false)
  }, [workspaceId])

  useEffect(() => { fetchMetrics() }, [fetchMetrics])

  return { metrics, loading, refetch: fetchMetrics }
}
