'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import AuthCard from '@/components/AuthCard'
import FormInput from '@/components/FormInput'
import PasswordStrength from '@/components/PasswordStrength'
import Divider from '@/components/Divider'
import GoogleButton from '@/components/GoogleButton'

export default function RegisterPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!fullName || fullName.trim().length < 2) newErrors.fullName = 'Name must be at least 2 characters'
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Please enter a valid email'
    if (!password || password.length < 8) newErrors.password = 'Password must be at least 8 characters'
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    if (!agreed) newErrors.agreed = 'You must agree to the Terms of Service'
    return newErrors
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors({})
    setLoading(true)

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      })

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          setErrors({ email: 'An account with this email already exists' })
        } else {
          setErrors({ general: signUpError.message })
        }
        setLoading(false)
        return
      }

      if (data.user) {
        // Insert user profile
        await supabase.from('users').upsert({
          id: data.user.id,
          email,
          full_name: fullName,
          avatar_url: null,
        })

        // Create workspace
        const slug = fullName.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).substr(2, 5)
        const { data: workspace } = await supabase
          .from('workspaces')
          .insert({ name: fullName + "'s Workspace", slug })
          .select()
          .single()

        if (workspace) {
          // Add as owner
          await supabase.from('workspace_members').insert({
            workspace_id: workspace.id,
            user_id: data.user.id,
            role: 'owner',
          })

          // Create onboarding state
          await supabase.from('onboarding_state').insert({
            workspace_id: workspace.id,
            user_id: data.user.id,
            current_step: 'welcome',
            is_complete: false,
          })
        }

        router.push('/onboarding/welcome')
      }
    } catch {
      setErrors({ general: 'Something went wrong. Please try again.' })
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })
  }

  return (
    <AuthCard title="Create your account" subtitle="Start understanding your business.">
      <form onSubmit={handleRegister}>
        <FormInput
          label="Full name"
          placeholder="Thomas Mercier"
          value={fullName}
          onChange={setFullName}
          error={errors.fullName}
          autoFocus
        />
        <FormInput
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={setEmail}
          error={errors.email}
        />
        <div>
          <FormInput
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={setPassword}
            showPasswordToggle
            error={errors.password}
          />
          <PasswordStrength password={password} />
        </div>
        <FormInput
          label="Confirm password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={setConfirmPassword}
          showPasswordToggle
          error={errors.confirmPassword}
        />

        {/* TERMS CHECKBOX */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
            <div
              onClick={() => setAgreed(!agreed)}
              role="checkbox"
              aria-checked={agreed}
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setAgreed(!agreed) } }}
              style={{
                width: 18,
                height: 18,
                borderRadius: 5,
                border: agreed ? 'none' : '2px solid rgba(0,0,0,0.2)',
                background: agreed ? '#F97316' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: 1,
                transition: 'all 150ms ease',
                cursor: 'pointer',
              }}
            >
              {agreed && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <span style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.5 }}>
              I agree to the{' '}
              <Link href="/terms" style={{ color: '#F97316', textDecoration: 'none' }}>Terms of Service</Link>
              {' '}and{' '}
              <Link href="/privacy" style={{ color: '#F97316', textDecoration: 'none' }}>Privacy Policy</Link>
            </span>
          </label>
          {errors.agreed && (
            <p style={{ fontSize: 12, color: '#EF4444', marginTop: 4 }}>{errors.agreed}</p>
          )}
        </div>

        {errors.general && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: 13, color: '#EF4444', marginBottom: 16, textAlign: 'center' }}
          >
            {errors.general}
          </motion.p>
        )}

        <motion.button
          type="submit"
          whileTap={{ scale: 0.97 }}
          disabled={loading}
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
            <>
              <div style={{
                width: 16, height: 16, borderRadius: '50%',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: '#FFFFFF',
                animation: 'spin 0.8s linear infinite',
              }} />
              Creating account...
            </>
          ) : 'Create account'}
        </motion.button>

        <Divider />
        <GoogleButton onClick={handleGoogle} loading={googleLoading} />
      </form>

      <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#6B7280' }}>
        Already have an account?{' '}
        <Link href="/login" style={{ color: '#F97316', fontWeight: 500, textDecoration: 'none' }}>
          Sign in
        </Link>
      </p>
    </AuthCard>
  )
}
