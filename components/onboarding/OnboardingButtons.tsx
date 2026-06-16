'use client'
import { motion } from 'framer-motion'

interface OnboardingButtonsProps {
  onContinue: () => void
  onBack?: () => void
  continueText?: string
  continueDisabled?: boolean
  loading?: boolean
}

export default function OnboardingButtons({ onContinue, onBack, continueText = 'Continue', continueDisabled = false, loading = false }: OnboardingButtonsProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 420, marginTop: 8 }}>
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onContinue}
        disabled={continueDisabled || loading}
        style={{
          width: '100%',
          height: 48,
          background: '#F97316',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: 12,
          fontSize: 15,
          fontWeight: 600,
          cursor: continueDisabled || loading ? 'not-allowed' : 'pointer',
          opacity: continueDisabled || loading ? 0.4 : 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        {loading ? (
          <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#FFFFFF', animation: 'spin 0.8s linear infinite' }} />
        ) : continueText}
      </motion.button>
      {onBack && (
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onBack}
          style={{
            width: '100%',
            height: 44,
            background: 'transparent',
            color: 'rgba(255,255,255,0.5)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Back
        </motion.button>
      )}
    </div>
  )
}
