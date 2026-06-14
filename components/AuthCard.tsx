'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface AuthCardProps {
  title: string
  subtitle: string
  children: ReactNode
}

export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{ width: '100%', maxWidth: 420 }}
    >
      {/* TITLE ABOVE CARD */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <h1
          style={{
            fontSize: 26,
            fontWeight: 700,
            color: '#0A0A0A',
            letterSpacing: '-0.3px',
            marginBottom: 6,
          }}
          className="dark:text-white"
        >
          {title}
        </h1>
        <p style={{ fontSize: 15, color: '#6B7280' }}>{subtitle}</p>
      </div>

      {/* GLASS CARD */}
      <div className="glass-card" style={{ padding: 32 }}>
        {children}
      </div>
    </motion.div>
  )
}
