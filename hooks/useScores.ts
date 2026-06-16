'use client'
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export interface AxoScores {
  id: string
  business_pulse: number
  revenue_stability: number
  client_dependency: string
  lead_leverage: number
  execution_score: number
  calculated_at: string
}

export function useScores(workspaceId: string | undefined) {
  const [scores, setScores] = useState<AxoScores | null>(null)
  const [previousScores, setPreviousScores] = useState<AxoScores | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchScores = useCallback(async () => {
    if (!workspaceId) return
    setLoading(true)

    const { data } = await supabase
      .from('axo_scores')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('calculated_at', { ascending: false })
      .limit(2)

    if (data && data.length > 0) {
      setScores(data[0])
      if (data.length > 1) setPreviousScores(data[1])
    }
    setLoading(false)
  }, [workspaceId])

  useEffect(() => { fetchScores() }, [fetchScores])

  return { scores, previousScores, loading, refetch: fetchScores }
}
