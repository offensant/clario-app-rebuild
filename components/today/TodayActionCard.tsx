'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Check, SkipForward, X, CheckCircle } from 'lucide-react'
import confetti from 'canvas-confetti'
import type { AxoAction } from '@/hooks/useActions'

interface TodayActionCardProps {
  action: AxoAction | null
  loading: boolean
  noMoreActions: boolean
  onDone: () => Promise<void>
  onSkip: () => Promise<void>
}

const CHECKLIST_ITEMS = [
  'Review their activity',
  'Prepare key talking points',
  'Take action',
  'Log outcome',
]

export default function TodayActionCard({ action, loading, noMoreActions, onDone, onSkip }: TodayActionCardProps) {
  const [focusMode, setFocusMode] = useState(false)
  const [checked, setChecked] = useState<boolean[]>(CHECKLIST_ITEMS.map(() => false))
  const [showSuccess, setShowSuccess] = useState(false)
  const [processing, setProcessing] = useState(false)

  if (loading) {
    return (
      <div className="glass-card" style={{ padding: 24, borderLeft: '3px solid #F97316' }}>
        <div className="skeleton" style={{ width: 180, height: 11, marginBottom: 12 }} />
        <div className="skeleton" style={{ width: '70%', height: 24, marginBottom: 8 }} />
        <div className="skeleton" style={{ width: '90%', height: 14, marginBottom: 16 }} />
        <div style={{ display: 'flex', gap: 8 }}>
          <div className="skeleton" style={{ width: 80, height: 28, borderRadius: 999 }} />
          <div className="skeleton" style={{ width: 100, height: 28, borderRadius: 999 }} />
          <div className="skeleton" style={{ width: 70, height: 28, borderRadius: 999 }} />
        </div>
      </div>
    )
  }

  if (noMoreActions || !action) {
    return (
      <div className="glass-card" style={{ padding: 32, textAlign: 'center' }}>
        <CheckCircle size={32} color="#22C55E" style={{ margin: '0 auto 12px' }} />
        <p style={{ fontSize: 15, fontWeight: 600, color: '#0A0A0A' }} className="dark:text-white">
          All actions completed today.
        </p>
        <p style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4 }}>
          Axo is preparing tomorrow's priorities.
        </p>
      </div>
    )
  }

  const toggleCheck = (index: number) => {
    setChecked(prev => prev.map((c, i) => i === index ? !c : c))
  }

  const handleDone = async () => {
    setProcessing(true)
    setShowSuccess(true)
    setTimeout(async () => {
      await onDone()
      setShowSuccess(false)
      setProcessing(false)
      setChecked(CHECKLIST_ITEMS.map(() => false))
    }, 600)
  }

  const handleSkip = async () => {
    setProcessing(true)
    await onSkip()
    setProcessing(false)
  }

  const handleMarkDone = async () => {
    confetti({
      particleCount: 100,
      spread: 70,
      colors: ['#F97316', '#FF9A4D', '#FFB870'],
      origin: { y: 0.6 },
    })
    setProcessing(true)
    setTimeout(async () => {
      setFocusMode(false)
      await onDone()
      setProcessing(false)
      setChecked(CHECKLIST_ITEMS.map(() => false))
    }, 400)
  }

  // Mock impact / risk / time based on action priority
  const impactLabel = action.priority_score >= 8 ? 'HIGH' : action.priority_score >= 5 ? 'MEDIUM' : 'LOW'
  const riskLabel = action.priority_score >= 8 ? 'HIGH' : action.priority_score >= 5 ? 'MEDIUM' : 'LOW'
  const timeLabel = '15-30 min'

  return (
    <>
      <div className="glass-card" style={{ padding: 24, borderLeft: '3px solid #F97316', position: 'relative' }}>
        <div className="section-label">Today's Highest Leverage Action</div>
        <h3 style={{ fontSize: 22, fontWeight: 700, color: '#0A0A0A', marginTop: 8 }} className="dark:text-white">
          {action.action_text}
        </h3>
        <p style={{ fontSize: 14, color: '#6B7280', marginTop: 6, lineHeight: 1.5 }}>
          Axo identified this as your highest leverage action based on current business signals.
        </p>

        {/* PILLS */}
        <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
          <span className="badge">IMPACT: {impactLabel}</span>
          <span className="badge">RISK IF IGNORED: {riskLabel}</span>
          <span className="badge">TIME: {timeLabel}</span>
        </div>

        {/* BUTTONS */}
        <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setFocusMode(true)}
            disabled={processing}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: '#F97316', color: '#FFFFFF', border: 'none',
              borderRadius: 12, padding: '10px 24px', fontSize: 15, fontWeight: 600,
              cursor: 'pointer', opacity: processing ? 0.6 : 1,
            }}
          >
            <Play size={16} fill="#FFFFFF" /> Start
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleDone}
            disabled={processing}
            className="btn-secondary"
            style={{ padding: '10px 24px', cursor: processing ? 'not-allowed' : 'pointer', opacity: processing ? 0.6 : 1 }}
          >
            <Check size={16} /> Done
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSkip}
            disabled={processing}
            className="btn-ghost"
            style={{ padding: '10px 24px', cursor: processing ? 'not-allowed' : 'pointer', opacity: processing ? 0.6 : 1 }}
          >
            <SkipForward size={16} /> Skip
          </motion.button>
        </div>

        {/* SUCCESS FLASH */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              style={{
                position: 'absolute', top: 16, right: 16,
                background: 'rgba(34,197,94,0.12)', borderRadius: '50%',
                width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Check size={20} color="#22C55E" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FOCUS MODE OVERLAY */}
      <AnimatePresence>
        {focusMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 100,
              background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              style={{ width: '100%', maxWidth: 480, textAlign: 'center', position: 'relative' }}
            >
              <button
                onClick={() => setFocusMode(false)}
                style={{
                  position: 'absolute', top: -48, right: 0, background: 'none', border: 'none',
                  color: '#9CA3AF', cursor: 'pointer', display: 'flex',
                }}
              >
                <X size={24} />
              </button>

              <div style={{ fontSize: 11, color: '#F97316', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
                Focus Mode
              </div>
              <h2 style={{ fontSize: 32, fontWeight: 700, color: '#FFFFFF', marginBottom: 12, lineHeight: 1.3 }}>
                {action.action_text}
              </h2>
              <p style={{ fontSize: 16, color: '#9CA3AF', marginBottom: 32, lineHeight: 1.6 }}>
                Work through this checklist to complete the action with focus.
              </p>

              <div style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16, padding: 8, backdropFilter: 'blur(20px)',
              }}>
                {CHECKLIST_ITEMS.map((item, i) => (
                  <div
                    key={item}
                    onClick={() => toggleCheck(i)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                      cursor: 'pointer', borderBottom: i < CHECKLIST_ITEMS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    }}
                  >
                    <motion.div
                      whileTap={{ scale: 0.9 }}
                      animate={{ scale: checked[i] ? [1, 1.15, 1] : 1 }}
                      style={{
                        width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                        border: checked[i] ? 'none' : '2px solid rgba(255,255,255,0.2)',
                        background: checked[i] ? '#F97316' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      {checked[i] && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                    </motion.div>
                    <span style={{
                      fontSize: 15, color: checked[i] ? '#52525B' : '#FFFFFF',
                      textDecoration: checked[i] ? 'line-through' : 'none',
                      transition: 'color 150ms ease',
                    }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleMarkDone}
                disabled={processing}
                style={{
                  width: '100%', height: 48, background: '#F97316', color: '#FFFFFF',
                  border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600,
                  cursor: 'pointer', marginTop: 24, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: 8, opacity: processing ? 0.7 : 1,
                }}
              >
                <CheckCircle size={18} /> Mark Done
              </motion.button>

              <button
                onClick={() => setFocusMode(false)}
                style={{
                  background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)',
                  fontSize: 14, marginTop: 12, cursor: 'pointer',
                }}
              >
                Exit Focus
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
