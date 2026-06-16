'use client'

import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import ThemeToggle from '@/components/ThemeToggle'

const stepOrder = [
  '/onboarding/welcome',
  '/onboarding/business-type',
  '/onboarding/business-name',
  '/onboarding/mrr',
  '/onboarding/clients',
  '/onboarding/pipeline-info',
  '/onboarding/goal',
  '/onboarding/connect',
  '/onboarding/recap',
  '/onboarding/complete',
]

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const currentIndex = stepOrder.indexOf(pathname)
  const progress = currentIndex >= 0 ? (currentIndex / (stepOrder.length - 1)) * 100 : 0

  return (
    <div style={{
      minHeight: '100vh',
      background: '#080808',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* AMBIENT ORANGE GLOW */}
      <div style={{
        position: 'fixed',
        top: '15%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 600,
        height: 600,
        background: 'radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* PROGRESS BAR */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        background: 'rgba(255,255,255,0.06)',
        zIndex: 50,
      }}>
        <motion.div
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{
            height: '100%',
            background: '#F97316',
            boxShadow: '0 0 12px rgba(249,115,22,0.5)',
          }}
        />
      </div>

      {/* LOGO TOP LEFT — WHITE VERSION */}
      <div style={{ position: 'fixed', top: 0, left: 0, padding: '20px 24px', zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M14 2L24 8V20L14 26L4 20V8L14 2Z" stroke="#F97316" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M14 8L19 11V17L14 20L9 17V11L14 8Z" fill="#F97316" fillOpacity="0.15" stroke="#F97316" strokeWidth="1.5" strokeLinejoin="round"/>
            <circle cx="14" cy="14" r="2" fill="#F97316"/>
          </svg>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 20, fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.3px' }}>
            Clario
          </span>
        </div>
      </div>

      {/* THEME TOGGLE TOP RIGHT — DARK VARIANT FORCED VISUALLY */}
      <div style={{ position: 'fixed', top: 0, right: 0, padding: '20px 24px', zIndex: 50 }}>
        <ThemeToggle forceDark />
      </div>

      {/* CONTENT */}
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '90px 24px 40px',
        position: 'relative',
        zIndex: 1,
      }}>
        {children}
      </div>
    </div>
  )
}
