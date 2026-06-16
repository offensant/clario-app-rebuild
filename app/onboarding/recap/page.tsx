'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import AxoMessage from '@/components/onboarding/AxoMessage'
import { useOnboarding } from '@/hooks/useOnboarding'
import { supabase } from '@/lib/supabase'

export default function RecapPage() {
  const router = useRouter()
  const { data, clearData } = useOnboarding()
  const [loading, setLoading] = useState(false)
  const isAgency = data.business_type === 'agency'

  // Calculate critical signals count
  const calculateSignals = () => {
    let signals = 0
    if (isAgency) {
      if ((data.top_client_share || 0) > 40) signals++
      if ((data.active_pipeline || 0) <= (data.clients_lost_60d || 0)) signals++
      if ((data.active_pipeline || 0) === 0) signals++
    } else {
      if ((data.roas || 0) < 2) signals++
      if ((data.repeat_purchase_rate || 0) < 20) signals++
      if ((data.cac || 0) > 50) signals++
    }
    return signals
  }

  const signalsCount = calculateSignals()

  const rows = isAgency
    ? [
        { label: 'Business type', value: 'Agency' },
        { label: 'Business name', value: data.business_name || '—' },
        { label: 'MRR', value: `$${data.mrr?.toLocaleString() || 0}` },
        { label: 'Active clients', value: String(data.active_clients || 0) },
        { label: 'Top client share', value: `${data.top_client_share || 0}%` },
        { label: 'Active pipeline', value: `${data.active_pipeline || 0} prospects` },
        { label: 'Clients lost (60d)', value: String(data.clients_lost_60d || 0) },
        { label: 'Goal (90 days)', value: `$${data.goal_90d?.toLocaleString() || 0}` },
      ]
    : [
        { label: 'Business type', value: 'Ecommerce' },
        { label: 'Business name', value: data.business_name || '—' },
        { label: 'Monthly revenue', value: `$${data.mrr?.toLocaleString() || 0}` },
        { label: 'Active customers', value: String(data.active_customers || 0) },
        { label: 'Repeat purchase rate', value: `${data.repeat_purchase_rate || 0}%` },
        { label: 'CAC', value: `$${data.cac || 0}` },
        { label: 'ROAS', value: String(data.roas || 0) },
        { label: 'Goal (90 days)', value: `$${data.goal_90d?.toLocaleString() || 0}` },
      ]

  const handleLaunch = async () => {
    setLoading(true)

    const { data: userData } = await supabase.auth.getUser()
    const userId = userData.user?.id
    if (!userId) { setLoading(false); return }

    const { data: memberRow } = await supabase
      .from('workspace_members')
      .select('workspace_id')
      .eq('user_id', userId)
      .single()

    const workspaceId = memberRow?.workspace_id
    if (!workspaceId) { setLoading(false); return }

    // Save business profile
    await supabase.from('business_profiles').upsert({
      workspace_id: workspaceId,
      business_type: data.business_type,
      mrr: data.mrr || 0,
      active_clients: isAgency ? (data.active_clients || 0) : (data.active_customers || 0),
      goal_90d: data.goal_90d || 0,
    })

    // Save first metrics_daily entry
    await supabase.from('metrics_daily').insert({
      workspace_id: workspaceId,
      date: new Date().toISOString().split('T')[0],
      mrr: data.mrr || 0,
      active_clients: isAgency ? (data.active_clients || 0) : (data.active_customers || 0),
      clients_lost_60d: data.clients_lost_60d || 0,
      active_pipeline: data.active_pipeline || 0,
      top_client_share: isAgency ? (data.top_client_share || 0) / 100 : 0,
      roas: data.roas || 0,
      cac: data.cac || 0,
      repeat_purchase_rate: data.repeat_purchase_rate || 0,
    })

    // Update workspace name
    await supabase.from('workspaces').update({ name: data.business_name }).eq('id', workspaceId)

    // Mock initial scores
    const clientDependency = isAgency
      ? ((data.top_client_share || 0) > 45 ? 'CRITICAL' : (data.top_client_share || 0) > 20 ? 'MODERATE' : 'HEALTHY')
      : ((data.cac || 0) > 60 ? 'CRITICAL' : (data.cac || 0) > 30 ? 'MODERATE' : 'HEALTHY')

    await supabase.from('axo_scores').insert({
      workspace_id: workspaceId,
      business_pulse: 6.2,
      revenue_stability: 5.8,
      client_dependency: clientDependency,
      lead_leverage: 4.1,
      execution_score: 5.5,
      calculated_at: new Date().toISOString(),
    })

    // Mock initial action
    const actionText = isAgency
      ? 'Call your top 3 prospects today. Your pipeline needs to move.'
      : 'Review your top performing ad set and increase its budget by 20% today.'

    await supabase.from('axo_actions').insert({
      workspace_id: workspaceId,
      action_text: actionText,
      priority_score: 8.5,
      status: 'pending',
    })

    // Mark onboarding complete
    await supabase.from('onboarding_state').update({
      is_complete: true,
      current_step: 'complete',
    }).eq('workspace_id', workspaceId)

    clearData()
    router.push('/onboarding/complete')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 520 }}>
      <AxoMessage text="Here is what I know about your business." />

      <div style={{
        width: '100%',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(249,115,22,0.15)',
        borderRadius: 20,
        padding: 28,
        backdropFilter: 'blur(20px)',
      }}>
        {rows.map((row, i) => (
          <motion.div
            key={row.label}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px 0',
              borderBottom: i < rows.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
            }}
          >
            <span style={{ fontSize: 14, color: '#9CA3AF' }}>{row.label}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#FFFFFF' }}>{row.value}</span>
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: rows.length * 0.08 + 0.2 }}
        style={{ fontSize: 16, fontWeight: 600, color: '#F97316', marginTop: 20, textAlign: 'center' }}
      >
        I already see {signalsCount} critical signal{signalsCount !== 1 ? 's' : ''}. Let's get started.
      </motion.p>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleLaunch}
        disabled={loading}
        style={{
          width: '100%', maxWidth: 420, height: 48, background: '#F97316',
          color: '#FFFFFF', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
          marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}
      >
        {loading ? (
          <>
            <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#FFFFFF', animation: 'spin 0.8s linear infinite' }} />
            Axo is analyzing your business...
          </>
        ) : 'Launch Clario'}
      </motion.button>
    </div>
  )
}
