'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface ThemeToggleProps {
  forceDark?: boolean
}

export default function ThemeToggle({ forceDark = false }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  useEffect(() => setMounted(true), [])

  if (!mounted) return <div style={{ width: 36, height: 36 }} />

  const isDark = forceDark ? true : resolvedTheme === 'dark'

  return (
    <motion.button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      whileTap={{ scale: 0.92 }}
      style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: isDark ? '#9CA3AF' : '#6B7280',
      }}
      aria-label="Toggle theme"
    >
      {resolvedTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </motion.button>
  )
}
