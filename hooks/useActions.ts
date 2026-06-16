'use client'
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export interface AxoAction {
  id: string
  action_text: string
  priority_score: number
  status: string
  created_at: string
}

export function useActions(workspaceId: string | undefined) {
  const [currentAction, setCurrentAction] = useState<AxoAction | null>(null)
  const [loading, setLoading] = useState(true)
  const [noMoreActions, setNoMoreActions] = useState(false)

  const fetchNextAction = useCallback(async () => {
    if (!workspaceId) return
    setLoading(true)

    const { data } = await supabase
      .from('axo_actions')
      .select('*')
      .eq('workspace_id', workspaceId)
      .eq('status', 'pending')
      .order('priority_score', { ascending: false })
      .limit(1)

    if (data && data.length > 0) {
      setCurrentAction(data[0])
      setNoMoreActions(false)
    } else {
      setCurrentAction(null)
      setNoMoreActions(true)
    }
    setLoading(false)
  }, [workspaceId])

  const markDone = async () => {
    if (!currentAction) return
    await supabase.from('axo_actions').update({ status: 'done' }).eq('id', currentAction.id)
    await fetchNextAction()
  }

  const markSkipped = async () => {
    if (!currentAction) return
    await supabase.from('axo_actions').update({ status: 'dismissed' }).eq('id', currentAction.id)
    await fetchNextAction()
  }

  useEffect(() => { fetchNextAction() }, [fetchNextAction])

  return { currentAction, loading, noMoreActions, markDone, markSkipped, refetch: fetchNextAction }
}
