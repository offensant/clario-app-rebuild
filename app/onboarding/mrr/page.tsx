'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AxoMessage from '@/components/onboarding/AxoMessage'
import OnboardingInput from '@/components/onboarding/OnboardingInput'
import OnboardingButtons from '@/components/onboarding/OnboardingButtons'
import { useOnboarding } from '@/hooks/useOnboarding'

export default function MrrPage() {
  const router = useRouter()
  const { data, updateData, loaded } = useOnboarding()
  const [value, setValue] = useState('')

  useEffect(() => {
    if (loaded && data.mrr) setValue(String(data.mrr))
  }, [loaded, data.mrr])

  const isAgency = data.business_type === 'agency'

  const handleContinue = () => {
    const num = parseFloat(value)
    if (!value || isNaN(num) || num <= 0) return
    updateData({ mrr: num })
    router.push('/onboarding/clients')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 480 }}>
      <AxoMessage
        text={isAgency
          ? "Your MRR is my baseline. Everything I tell you will be relative to this number."
          : "Your monthly revenue is my baseline. Everything I tell you will be relative to this number."}
      />
      <OnboardingInput
        label={isAgency ? "Current Monthly Recurring Revenue" : "Current Monthly Revenue"}
        value={value}
        onChange={setValue}
        placeholder="0"
        prefix="$"
        type="number"
        autoFocus
      />
      <OnboardingButtons
        onContinue={handleContinue}
        onBack={() => router.push('/onboarding/business-name')}
        continueDisabled={!value || parseFloat(value) <= 0}
      />
    </div>
  )
}
