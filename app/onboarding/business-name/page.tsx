'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AxoMessage from '@/components/onboarding/AxoMessage'
import OnboardingInput from '@/components/onboarding/OnboardingInput'
import OnboardingButtons from '@/components/onboarding/OnboardingButtons'
import { useOnboarding } from '@/hooks/useOnboarding'

export default function BusinessNamePage() {
  const router = useRouter()
  const { data, updateData, loaded } = useOnboarding()
  const [name, setName] = useState('')

  useEffect(() => {
    if (loaded && data.business_name) setName(data.business_name)
  }, [loaded, data.business_name])

  const handleContinue = () => {
    if (!name.trim()) return
    updateData({ business_name: name.trim() })
    router.push('/onboarding/mrr')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 480 }}>
      <AxoMessage text="What is the name of your business?" />
      <OnboardingInput label="Business name" value={name} onChange={setName} placeholder="Novaflow Agency" autoFocus />
      <OnboardingButtons
        onContinue={handleContinue}
        onBack={() => router.push('/onboarding/business-type')}
        continueDisabled={!name.trim()}
      />
    </div>
  )
}
