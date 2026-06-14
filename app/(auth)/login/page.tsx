'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import AuthCard from '@/components/AuthCard'
import FormInput from '@/components/FormInput'
import Divider from '@/components/Divider'
import GoogleButton from '@/components/GoogleButton'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    setError('')
    setLoading(true)

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })

      if (authError) {
        setError('Invalid email or password. Please try again.')
        setLoading(false)
        return
      }

      if (data.user) {
        // Check if onboarding is complete
        const { data: onboardingData } = await supabase
          .from('onboarding_state')
          .select('is_complete')
          .eq('user_id', data.user.id)
          .single()

        if (onboardingData?.is_complete) {
          router.push('/dashboard')
        } else {
          router.push('/onboarding/welcome')
        }
      }
    } catch {
      setError('Something went wrong. Please try again.')
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
    <AuthCard title="Welcome back" subtitle="Sign in to your account">
      <form onSubmit={handleLogin}>
        <FormInput
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={setEmail}
          autoFocus
        />
        <FormInput
          label="Password"
          placeholder="••••••••"
          value={password}
          onChange={setPassword}
          showPasswordToggle
        />

        {/* FORGOT PASSWORD */}
        <div style={{ textAlign: 'right', marginTop: -8, marginBottom: 20 }}>
          <Link
            href="/forgot-password"
            style={{ fontSize: 13, color: '#6B7280', textDecoration: 'none' }}
          >
            Forgot password?
          </Link>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: 13, color: '#EF4444', marginBottom: 16, textAlign: 'center' }}
          >
            {error}
          </motion.p>
        )}

        {/* SIGN IN BUTTON */}
        <motion.button
          type="submit"
          whileTap={{ scale: 0.97 }}
          disabled={loading || !email || !password}
          style={{
            width: '100%',
            height: 46,
            background: '#F97316',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 600,
            cursor: loading || !email || !password ? 'not-allowed' : 'pointer',
            opacity: loading || !email || !password ? 0.7 : 1,
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
              Signing in...
            </>
          ) : 'Sign in'}
        </motion.button>

        <Divider />
        <GoogleButton onClick={handleGoogle} loading={googleLoading} />
      </form>

      {/* REGISTER LINK */}
      <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#6B7280' }}>
        Don&apos;t have an account?{' '}
        <Link href="/register" style={{ color: '#F97316', fontWeight: 500, textDecoration: 'none' }}>
          Register
        </Link>
      </p>
    </AuthCard>
  )
}
