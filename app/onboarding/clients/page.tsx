'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AxoMessage from '@/components/onboarding/AxoMessage'
import OnboardingInput from '@/components/onboarding/OnboardingInput'
import OnboardingButtons from '@/components/onboarding/OnboardingButtons'
import { useOnboarding } from '@/hooks/useOnboarding'

export default function ClientsPage() {
  const router = useRouter()
  const { data, updateData, loaded } = useOnboarding()
  const isAgency = data.business_type === 'agency'

  const [field1, setField1] = useState('')
  const [field2, setField2] = useState('')

  useEffect(() => {
    if (!loaded) return
    if (isAgency) {
      if (data.active_clients) setField1(String(data.active_clients))
      if (data.top_client_share) setField2(String(data.top_client_share))
    } else {
      if (data.active_customers) setField1(String(data.active_customers))
      if (data.repeat_purchase_rate) setField2(String(data.repeat_purchase_rate))
    }
  }, [loaded, isAgency, data])

  const handleContinue = () => {
    if (!field1 || !field2) return
    if (isAgency) {
      updateData({ active_clients: parseInt(field1), top_client_share: parseFloat(field2) })
    } else {
      updateData({ active_customers: parseInt(field1), repeat_purchase_rate: parseFloat(field2) })
    }
    router.push('/onboarding/pipeline-info')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 480 }}>
      <AxoMessage
        text={isAgency
          ? "Your client base tells me your biggest structural risk immediately."
          : "Your customer retention tells me if your growth is real or just ad spend."}
      />
      <OnboardingInput
        label={isAgency ? "Number of active clients" : "Monthly active customers"}
        value={field1}
        onChange={setField1}
        placeholder="0"
        type="number"
        autoFocus
      />
      <OnboardingInput
        label={isAgency ? "Revenue from your top client (%)" : "Repeat purchase rate (%)"}
        value={field2}
        onChange={setField2}
        placeholder="0"
        type="number"
        suffix="%"
      />
      <OnboardingButtons
        onContinue={handleContinue}
        onBack={() => router.push('/onboarding/mrr')}
        continueDisabled={!field1 || !field2}
      />
    </div>
  )
}
