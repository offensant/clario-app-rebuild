'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import AxoMessage from '@/components/onboarding/AxoMessage'
import OnboardingButtons from '@/components/onboarding/OnboardingButtons'
import { useOnboarding } from '@/hooks/useOnboarding'

const LOGOS = {
  stripe: 'https://cdn.brandfetch.io/idxAg10C0L/w/400/h/400/theme/dark/icon.png',
  calendly: 'https://cdn.brandfetch.io/idZDIAGupB/w/400/h/400/theme/dark/icon.png',
  gmail: 'https://cdn.brandfetch.io/id_edFDMKS/w/400/h/400/theme/dark/icon.png',
  shopify: 'https://cdn.brandfetch.io/idmHMEKVEd/w/400/h/400/theme/dark/icon.png',
}

export default function ConnectPage() {
  const router = useRouter()
  const { data } = useOnboarding()
  const [showModal, setShowModal] = useState(false)
  const isAgency = data.business_type === 'agency'

  const integrations = isAgency
    ? [
        { key: 'stripe', name: 'Stripe', description: 'Revenue & payment data', logo: LOGOS.stripe },
        { key: 'calendly', name: 'Calendly', description: 'Call scheduling & pipeline', logo: LOGOS.calendly },
        { key: 'gmail', name: 'Gmail', description: 'Email activity tracking', logo: LOGOS.gmail },
      ]
    : [
        { key: 'shopify', name: 'Shopify', description: 'Store & product analytics', logo: LOGOS.shopify },
        { key: 'stripe', name: 'Stripe', description: 'Revenue & payments', logo: LOGOS.stripe },
        { key: 'gmail', name: 'Gmail', description: 'Email activity tracking', logo: LOGOS.gmail },
      ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 480 }}>
      <AxoMessage text="Connect a tool and I will work with your real data immediately. You can skip this and connect later." />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
        {integrations.map((integration) => (
          <div
            key={integration.key}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '16px 20px',
              borderRadius: 16,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <img src={integration.logo} alt={integration.name} width={40} height={40} style={{ borderRadius: 10 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#FFFFFF' }}>{integration.name}</div>
              <div style={{ fontSize: 13, color: '#9CA3AF' }}>{integration.description}</div>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowModal(true)}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#D1D5DB',
                borderRadius: 10,
                padding: '8px 16px',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Connect
            </motion.button>
          </div>
        ))}
      </div>

      <button
        onClick={() => router.push('/onboarding/recap')}
        style={{ background: 'none', border: 'none', color: '#52525B', fontSize: 13, marginTop: 20, cursor: 'pointer', textDecoration: 'underline' }}
      >
        Skip for now — I'll connect later
      </button>

      <div style={{ marginTop: 20, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <OnboardingButtons
          onContinue={() => router.push('/onboarding/recap')}
          onBack={() => router.push('/onboarding/goal')}
        />
      </div>

      {/* COMING SOON MODAL */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#141414', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 20, padding: 28, maxWidth: 360, textAlign: 'center',
              }}
            >
              <p style={{ fontSize: 15, color: '#D1D5DB', lineHeight: 1.6, marginBottom: 20 }}>
                This integration is being finalized. API connection coming very soon. We will notify you when it's ready.
              </p>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowModal(false)}
                style={{
                  width: '100%', height: 42, background: 'rgba(255,255,255,0.08)',
                  color: '#FFFFFF', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: 'pointer',
                }}
              >
                Got it
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
