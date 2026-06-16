'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import AxoAvatar from '@/components/onboarding/AxoAvatar'

const LINES = [
  'Analyzing your revenue...',
  'Calculating your scores...',
  'Detecting critical signals...',
  'Preparing your action plan...',
]

export default function CompletePage() {
  const router = useRouter()
  const [lineIndex, setLineIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const lineInterval = setInterval(() => {
      setLineIndex((prev) => (prev < LINES.length - 1 ? prev + 1 : prev))
    }, 800)

    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 100 / 32, 100))
    }, 100)

    const redirectTimeout = setTimeout(() => {
      router.push('/dashboard')
    }, 3700)

    return () => {
      clearInterval(lineInterval)
      clearInterval(progressInterval)
      clearTimeout(redirectTimeout)
    }
  }, [router])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: 480 }}>
      <AxoAvatar size={64} />

      <div style={{ marginTop: 32, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AnimatePresence mode="wait">
          <motion.p
            key={lineIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            style={{
              fontSize: 16,
              color: lineIndex === LINES.length - 1 ? '#FFFFFF' : '#9CA3AF',
              fontWeight: lineIndex === LINES.length - 1 ? 600 : 400,
            }}
          >
            {LINES[lineIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      <div style={{ width: '100%', maxWidth: 480, height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 999, marginTop: 32, overflow: 'hidden' }}>
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1, ease: 'linear' }}
          style={{ height: '100%', background: '#F97316', boxShadow: '0 0 12px rgba(249,115,22,0.5)' }}
        />
      </div>
    </div>
  )
}
