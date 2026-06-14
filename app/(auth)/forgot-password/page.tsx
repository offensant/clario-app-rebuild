'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import AuthCard from '@/components/AuthCard'
import FormInput from '@/components/FormInput'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [resendCountdown, setResendCountdown] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)

    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    setLoading(false)
    setSent(true)
    setResendCountdown(60)

    const interval = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  const handleResend = async () => {
    if (resendCountdown > 0) return
    setLoading(true)
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setLoading(false)
    setResendCountdown(60)
    const interval = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  return (
    <AnimatePresence mode="wait">
      {!sent ? (
        <AuthCard
          key="form"
          title="Forgot your password?"
          subtitle="Enter your email and we will send you a reset link."
        >
          <form onSubmit={handleSubmit}>
            <FormInput
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={setEmail}
              autoFocus
            />
            <motion.button
              type="submit"
              whileTap={{ scale: 0.97 }}
              disabled={loading || !email}
              style={{
                width: '100%',
                height: 46,
                background: '#F97316',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 600,
                cursor: loading || !email ? 'not-allowed' : 'pointer',
                opacity: loading || !email ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                marginBottom: 20,
              }}
            >
              {loading ? (
                <div style={{
                  width: 16, height: 16, borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#FFFFFF',
                  animation: 'spin 0.8s linear infinite',
                }} />
              ) : 'Send reset link'}
            </motion.button>
            <div style={{ textAlign: 'center' }}>
              <Link href="/login" style={{ fontSize: 14, color: '#6B7280', textDecoration: 'none' }}>
                Back to sign in
              </Link>
            </div>
          </form>
        </AuthCard>
      ) : (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ width: '100%', maxWidth: 420 }}
        >
          <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
              style={{ marginBottom: 20, display: 'flex', justifyContent: 'center' }}
            >
              <CheckCircle size={52} color="#22C55E" />
            </motion.div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0A0A0A', marginBottom: 8 }} className="dark:text-white">
              Check your inbox
            </h2>
            <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 8, lineHeight: 1.6 }}>
              We sent a reset link to <strong style={{ color: '#374151' }} className="dark:text-gray-200">{email}</strong>
            </p>
            <p style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 28 }}>
              Check your spam folder if you don&apos;t see it.
            </p>
            <button
              onClick={handleResend}
              disabled={resendCountdown > 0}
              style={{
                background: 'none',
                border: 'none',
                cursor: resendCountdown > 0 ? 'not-allowed' : 'pointer',
                fontSize: 14,
                color: resendCountdown > 0 ? '#9CA3AF' : '#F97316',
                fontWeight: 500,
                marginBottom: 16,
                display: 'block',
                width: '100%',
              }}
            >
              {resendCountdown > 0 ? `Resend email in ${resendCountdown}s` : 'Resend email'}
            </button>
            <Link href="/login" style={{ fontSize: 14, color: '#6B7280', textDecoration: 'none' }}>
              Back to sign in
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
