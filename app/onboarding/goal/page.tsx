'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AxoMessage from '@/components/onboarding/AxoMessage'
import OnboardingInput from '@/components/onboarding/OnboardingInput'
import OnboardingButtons from '@/components/onboarding/OnboardingButtons'
import { useOnboarding } from '@/hooks/useOnboarding'

export default function GoalPage() {
  const router = useRouter()
  const { data, updateData, loaded } = useOnboarding()
  const [value, setValue] = useState('')
  const isAgency = data.business_type === 'agency'

  useEffect(() => {
    if (loaded && data.goal_90d) setValue(String(data.goal_90d))
  }, [loaded, data.goal_90d])

  const handleContinue = () => {
    const num = parseFloat(value)
    if (!value || isNaN(num) || num <= 0) return
    updateData({ goal_90d: num })
    router.push('/onboarding/connect')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 480 }}>
      <AxoMessage text="Where do you want to be in 90 days? I will track everything relative to this target." />
      <OnboardingInput
        label={isAgency ? "Target MRR in 90 days" : "Target monthly revenue in 90 days"}
        value={value}
        onChange={setValue}
        placeholder="0"
        prefix="$"
        type="number"
        autoFocus
      />
      <p style={{ fontSize: 13, color: '#52525B', marginTop: -8, marginBottom: 16, maxWidth: 420, width: '100%' }}>
        Axo will measure every action against this goal.
      </p>
      <OnboardingButtons
        onContinue={handleContinue}
        onBack={() => router.push('/onboarding/pipeline-info')}
        continueDisabled={!value || parseFloat(value) <= 0}
      />
    </div>
  )
}
