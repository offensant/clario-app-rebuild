'use client'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import AxoAvatar from '@/components/onboarding/AxoAvatar'

export default function WelcomePage() {
  const router = useRouter()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: 480 }}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
        <AxoAvatar size={64} />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        style={{ fontSize: 48, fontWeight: 700, color: '#FFFFFF', marginTop: 24, letterSpacing: '-1px' }}
      >
        Meet Axo.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        style={{ fontSize: 20, color: '#9CA3AF', marginTop: 8 }}
      >
        Your strategic AI cofounder.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(249,115,22,0.15)',
          borderRadius: 16,
          padding: '18px 22px',
          marginTop: 28,
          fontSize: 15,
          color: '#9CA3AF',
          lineHeight: 1.6,
        }}
      >
        Before I can help you, I need to learn about your business. 10 questions. 3 minutes. Then I will tell you exactly where you are and what to do next.
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.8 }}
        style={{ marginTop: 32, width: '100%', maxWidth: 320 }}
      >
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push('/onboarding/business-type')}
          style={{
            width: '100%',
            height: 48,
            background: '#F97316',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Let's go
        </motion.button>
        <p style={{ fontSize: 11, color: '#52525B', marginTop: 12 }}>
          No credit card required.
        </p>
      </motion.div>
    </div>
  )
}
