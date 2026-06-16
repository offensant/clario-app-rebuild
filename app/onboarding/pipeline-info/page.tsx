'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AxoMessage from '@/components/onboarding/AxoMessage'
import OnboardingInput from '@/components/onboarding/OnboardingInput'
import OnboardingButtons from '@/components/onboarding/OnboardingButtons'
import { useOnboarding } from '@/hooks/useOnboarding'

export default function PipelineInfoPage() {
  const router = useRouter()
  const { data, updateData, loaded } = useOnboarding()
  const isAgency = data.business_type === 'agency'

  const [field1, setField1] = useState('')
  const [field2, setField2] = useState('')

  useEffect(() => {
    if (!loaded) return
    if (isAgency) {
      if (data.active_pipeline) setField1(String(data.active_pipeline))
      if (data.clients_lost_60d) setField2(String(data.clients_lost_60d))
    } else {
      if (data.cac) setField1(String(data.cac))
      if (data.roas) setField2(String(data.roas))
    }
  }, [loaded, isAgency, data])

  const handleContinue = () => {
    if (!field1 || !field2) return
    if (isAgency) {
      updateData({ active_pipeline: parseInt(field1), clients_lost_60d: parseInt(field2) })
    } else {
      updateData({ cac: parseFloat(field1), roas: parseFloat(field2) })
    }
    router.push('/onboarding/goal')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 480 }}>
      <AxoMessage
        text={isAgency
          ? "Your pipeline tells me if you can absorb churn right now."
          : "Your acquisition cost tells me if your growth is profitable."}
      />
      {isAgency ? (
        <>
          <OnboardingInput label="Active prospects right now" value={field1} onChange={setField1} placeholder="0" type="number" autoFocus />
          <OnboardingInput label="Clients lost in the last 60 days" value={field2} onChange={setField2} placeholder="0" type="number" />
        </>
      ) : (
        <>
          <OnboardingInput label="Current CAC ($)" value={field1} onChange={setField1} placeholder="0" prefix="$" type="number" autoFocus />
          <OnboardingInput label="Current ROAS" value={field2} onChange={setField2} placeholder="0.0" type="number" />
        </>
      )}
      <OnboardingButtons
        onContinue={handleContinue}
        onBack={() => router.push('/onboarding/clients')}
        continueDisabled={!field1 || !field2}
      />
    </div>
  )
}
