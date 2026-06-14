'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle, AlertTriangle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import AuthCard from '@/components/AuthCard'
import FormInput from '@/components/FormInput'
import PasswordStrength from '@/components/PasswordStrength'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [tokenError, setTokenError] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}
    if (password.length < 8) newErrors.password = 'Password must be at least 8 characters'
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }
    setErrors({})
    setLoading(true)

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      if (error.message.includes('expired') || error.message.includes('invalid')) {
        setTokenError(true)
      } else {
        setErrors({ general: error.message })
      }
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (tokenError) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: 420 }}>
        <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
          <AlertTriangle size={48} color="#F97316" style={{ margin: '0 auto 20px' }} />
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0A0A0A', marginBottom: 8 }} className="dark:text-white">
            Link expired
          </h2>
          <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 24, lineHeight: 1.6 }}>
            This reset link has expired or is invalid. Request a new one to continue.
          </p>
          <Link href="/forgot-password">
            <motion.button
              whileTap={{ scale: 0.97 }}
              style={{
                width: '100%',
                height: 46,
                background: 'transparent',
                border: '1px solid rgba(0,0,0,0.12)',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 500,
                color: '#374151',
                cursor: 'pointer',
              }}
              className="dark:border-white/10 dark:text-gray-300"
            >
              Request a new link
            </motion.button>
          </Link>
        </div>
      </motion.div>
    )
  }

  if (success) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: 420 }}>
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
            Password updated
          </h2>
          <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 28, lineHeight: 1.6 }}>
            Your password has been successfully updated.
          </p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/login')}
            style={{
              width: '100%',
              height: 46,
              background: '#F97316',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Sign in
          </motion.button>
        </div>
      </motion.div>
    )
  }

  return (
    <AuthCard title="Set a new password" subtitle="Choose a strong password for your account.">
      <form onSubmit={handleSubmit}>
        <div>
          <FormInput
            label="New password"
            placeholder="••••••••"
            value={password}
            onChange={setPassword}
            showPasswordToggle
            error={errors.password}
            autoFocus
          />
          <PasswordStrength password={password} />
        </div>
        <FormInput
          label="Confirm new password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={setConfirmPassword}
          showPasswordToggle
          error={errors.confirmPassword}
        />
        {errors.general && (
          <p style={{ fontSize: 13, color: '#EF4444', marginBottom: 16, textAlign: 'center' }}>{errors.general}</p>
        )}
        <motion.button
          type="submit"
          whileTap={{ scale: 0.97 }}
          disabled={loading || !password || !confirmPassword}
          style={{
            width: '100%',
            height: 46,
            background: '#F97316',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          {loading ? (
            <div style={{
              width: 16, height: 16, borderRadius: '50%',
              border: '2px solid rgba(255,255,255,0.3)',
              borderTopColor: '#FFFFFF',
              animation: 'spin 0.8s linear infinite',
            }} />
          ) : 'Reset password'}
        </motion.button>
      </form>
    </AuthCard>
  )
}
