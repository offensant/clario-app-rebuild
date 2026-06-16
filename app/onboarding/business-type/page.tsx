'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Briefcase, ShoppingBag, Lock } from 'lucide-react'
import AxoMessage from '@/components/onboarding/AxoMessage'
import OnboardingButtons from '@/components/onboarding/OnboardingButtons'
import { useOnboarding } from '@/hooks/useOnboarding'

export default function BusinessTypePage() {
  const router = useRouter()
  const { data, updateData, loaded } = useOnboarding()
  const [selected, setSelected] = useState<'agency' | 'ecommerce' | null>(null)

  // Prepopulate if returning to this screen
  if (loaded && data.business_type && selected === null) {
    setSelected(data.business_type)
  }

  const handleContinue = () => {
    if (!selected) return
    updateData({ business_type: selected })
    router.push('/onboarding/business-name')
  }

  const CardOption = ({ type, icon: Icon, title, description }: { type: 'agency' | 'ecommerce'; icon: any; title: string; description: string }) => {
    const isSelected = selected === type
    return (
      <motion.div
        onClick={() => setSelected(type)}
        whileHover={{ scale: isSelected ? 1.02 : 1.015 }}
        animate={{ scale: isSelected ? 1.02 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{
          flex: 1,
          maxWidth: 320,
          padding: 28,
          borderRadius: 20,
          cursor: 'pointer',
          background: isSelected ? 'rgba(249,115,22,0.08)' : 'rgba(255,255,255,0.02)',
          border: isSelected ? '2px solid #F97316' : '1px solid rgba(255,255,255,0.08)',
          boxShadow: isSelected ? '0 0 24px rgba(249,115,22,0.15)' : 'none',
          transition: 'background 150ms ease, border-color 150ms ease',
        }}
      >
        <Icon size={36} color="#F97316" strokeWidth={1.75} />
        <h3 style={{ fontSize: 20, fontWeight: 700, color: '#FFFFFF', marginTop: 14 }}>{title}</h3>
        <p style={{ fontSize: 14, color: '#9CA3AF', marginTop: 8, lineHeight: 1.5 }}>{description}</p>
      </motion.div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 720 }}>
      <AxoMessage text="What kind of business are you running? This determines everything about how I analyze your data." />

      <div style={{ display: 'flex', gap: 16, width: '100%', flexWrap: 'wrap', justifyContent: 'center' }}>
        <CardOption type="agency" icon={Briefcase} title="Agency" description="You sell services and expertise to clients." />
        <CardOption type="ecommerce" icon={ShoppingBag} title="Ecommerce" description="You sell products online at scale." />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 20, color: '#52525B' }}>
        <Lock size={13} />
        <span style={{ fontSize: 12 }}>This cannot be changed after setup.</span>
      </div>

      <div style={{ marginTop: 28, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <OnboardingButtons
          onContinue={handleContinue}
          onBack={() => router.push('/onboarding/welcome')}
          continueDisabled={!selected}
        />
      </div>
    </div>
  )
}
